async function adicionarDataNome() {
    try {
      const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados/21/municipios');
      const municipios = await response.json();

      municipios.forEach(mun => {
        const codigo = mun.id;
        const nome = mun.nome;
        const elemento = document.getElementById(`mun_${codigo}`);
        if (elemento) {
          elemento.setAttribute('data-nome', nome);
        }
      });
    } catch (error) {
      console.error("Erro ao buscar municípios do IBGE:", error);
    }
}

window.addEventListener("DOMContentLoaded", adicionarDataNome);

// Função para normalizar o nome da cidade
function normalizarNome(nome) {
    return nome
        .normalize("NFD")                    // Separa acentos das letras
        .replace(/[\u0300-\u036f]/g, "")    // Remove acentos
        .toLowerCase()                      // Converte para minúsculas
        .replace(/\s+/g, '-')               // Substitui espaços por hífens
        .replace(/[^a-z0-9\-]/g, '')        // Remove caracteres especiais
        .replace(/\-+/g, '-');              // Remove múltiplos hífens
}
  
document.querySelectorAll('.clickable-municipality').forEach(path => {
    path.addEventListener('click', function() {
        const nomeOriginal = this.getAttribute('data-nome');
        const nomeNormalizado = normalizarNome(nomeOriginal);
        console.log(nomeNormalizado);
        window.location.href = `./municipios/${nomeNormalizado}.html`;
    });    
});

const tooltip = document.getElementById('tooltip');
const paths = document.getElementsByClassName('clickable-municipality')

for (const path of paths) {
  path.addEventListener('mouseenter', () => {
    const title = path.getAttribute('data-nome');
    path.setAttribute('data-title', title); // salva o título original
    path.removeAttribute('title');          // remove o tooltip nativo
    tooltip.innerText = title;
    tooltip.style.opacity = 1;
  });

  path.addEventListener('mouseleave', () => {
    tooltip.style.opacity = 0;
    const title = path.getAttribute('data-nome');
    if (title) {
      path.setAttribute('title', title); // restaura o tooltip nativo
    }
  });
}

// Atualiza a posição do tooltip com base no mouse, em qualquer lugar da tela
document.addEventListener('mousemove', (e) => {
  if (tooltip.style.opacity === "1") {
    tooltip.style.left = e.pageX + 15 + 'px';
    tooltip.style.top = e.pageY + 15 + 'px';
  }
});