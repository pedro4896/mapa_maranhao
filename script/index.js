const datalist = document.getElementById('lista-municipios'); // referencia do datalist acessando o elemento html que tem oo id, e vai guardar a referencia dele na datalist
const input = document.getElementById('input-municipio'); // referencia do input, ele pega o que o usuario digitar e guarda na variavel input
const botaoLimpar = document.getElementById('btn-limpar'); // referenci do botão, ele acessa o elemento como id, e guarda a referenccia na variavel

async function alimentaDados() { ///o asyn define uma função assincrona chamada alimenta dados
    try { //inicia um bloco de tratamento de erro, o que esta dentro será tentado, e se der erro o controle vai para o catch
      const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados/21/municipios'); // faz a requisição a API do IBGE que retorna os municipios com codigo 21, ou seja, maranhao
      const municipios = await response.json(); // transforma a requisão em JSON, uma lista de objetos de municípios, usa o await poois o json é uma operação asincroca, e ai ele armazena o resultado (array) na variavel municipios


      municipios.forEach(mun => {
        const codigo = mun.id; // armazena codigo do municipio
        const nome = mun.nome; // armazena nome do municipio

        // Alimentação da datalist
        const option = document.createElement('option'); // cria dinamicamente o elemento option
        option.value = nome; // seta o nome do municipio no atributo value, oq o usuario verá e poderá selecionar
        option.setAttribute('data-id', codigo); // cria o atributo do codigo e seta o codigo do municipio nele, permite identificar o municipio selecionado deppis, mesmo que o nome seja igual a outro
        datalist.appendChild(option); // adiciona o elemento option no datalist

        //atribuição de atributo nome ao path do svg correspondente ao municipio
        const elemento = document.getElementById(`mun_${codigo}`); //retorna o elemento que tem o id correponde ao codigo no svg
        if (elemento) { // verifica se o elemento existe
          elemento.setAttribute('data-nome', nome); // atribui o nome ao elemento
        }
      });
    } catch (error) { // retorna erro
      console.error("Erro ao buscar municípios do IBGE:", error); // imprime no console a mensagem de erro
    }
}

window.addEventListener("DOMContentLoaded", alimentaDados); // executa a funçao alimentaDados ao carregar o html da pagina

// Evento de seleção digitada
input.addEventListener('input', () => {
  // Remove a classe destaque de todos os elementos que estejam com ela no momento
  document.querySelectorAll('.destaque').forEach(el => el.classList.remove('destaque'));

  const nomeSelecionado = input.value; // retorna oque o usuario digitou
  const option = Array.from(datalist.options).find(opt => opt.value === nomeSelecionado); // procura dentro das opções do datalist aquela que tem o mesmo valor digitado pelo usuário

  if (option) { // veriica se encontrou uma opção correspondente
    const id = option.getAttribute('data-id'); //pega o valor do codigo da opção encontrada
    const elemento = document.getElementById(`mun_${id}`); // procura um elemento que possui o codigo correspondente
    if (elemento) { // veriifica se o elemento existe
      elemento.classList.add('destaque'); // adiciona a classe CSS ao elemento encontrado
    }
  }
});

// evento de click no botão de limpar
botaoLimpar.addEventListener('click', () => {
  input.value = ''; // limpar o campo de pesquisa
  document.querySelectorAll('.destaque').forEach(el => el.classList.remove('destaque')); // Remove a classe destaque de todos os elementos que estejam com ela no momento
});

//executa uma ação imediatamente antes da página ser descarregada (ou seja, ao recarregar, fechar ou navegar para outro link)
window.addEventListener("beforeunload", () => {
  // Limpa o valor do input e os destaques ao recarregar a página
  document.querySelectorAll('.destaque').forEach(el => el.classList.remove('destaque'));
  document.getElementById('input-municipio').value = '';
});

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

// Seleciona todos os elementos do DOM que têm a classe "clickable-municipality"
document.querySelectorAll('.clickable-municipality').forEach(path => {
  // Para cada elemento, adiciona um evento de clique.
    path.addEventListener('click', function() {
        const nomeOriginal = this.getAttribute('data-nome'); // Pega o valor do atributo data-nome do elemento clicado 
        const nomeNormalizado = normalizarNome(nomeOriginal); // Passa esse nome para uma função normalizarNome()
        // Redireciona o usuário para a página correspondente ao município clicado, usando o nome normalizado no caminho da URL
        window.location.href = `./municipios/${nomeNormalizado}.html`;
    });
    
    const tooltip = document.getElementById('tooltip'); // Obtém a div com id="tooltip"
    path.addEventListener('mouseenter', () => {
      const title = path.getAttribute('data-nome'); // pega o nome do município
      path.setAttribute('data-title', title); // salva esse valor em outro atributo (backup)
      path.removeAttribute('title');          // remove o título nativo do navegador
      tooltip.innerText = title; // define o texto da tooltip personalizada
      tooltip.style.opacity = 1; // exibe a tooltip personalizada
    });

    // quando o mouse sai da area do municipio
    path.addEventListener('mouseleave', () => {
      tooltip.style.opacity = 0; // esconde a tooltip personalizada
    });


  // Atualiza a posição do tooltip com base no mouse, em qualquer lugar da tela
  document.addEventListener('mousemove', (e) => {
    if (tooltip.style.opacity === "1") { // Verifica se a tooltip está visível (ou seja, foi ativada no mouseenter)
      tooltip.style.left = e.pageX + 15 + 'px'; // adiciona 15px na coordenada X do mouse
      tooltip.style.top = e.pageY + 15 + 'px'; // adiciona 15px na coordenada Y do mouse
    }
  });
});