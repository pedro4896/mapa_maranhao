const tooltip = document.getElementById('tooltip');
const areas = document.getElementsByTagName('area');

for (const area of areas) {
  area.addEventListener('mouseenter', () => {
    const title = area.getAttribute('title');
    area.setAttribute('data-title', title); // salva o título original
    area.removeAttribute('title');          // remove o tooltip nativo
    tooltip.innerText = title;
    tooltip.style.opacity = 1;
  });

  area.addEventListener('mouseleave', () => {
    tooltip.style.opacity = 0;
    const title = area.getAttribute('data-title');
    if (title) {
      area.setAttribute('title', title); // restaura o tooltip nativo
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