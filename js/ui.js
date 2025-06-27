// js/ui.js

function hideAllTelas() {
  document.querySelectorAll('.tela')
    .forEach(el => el.classList.add('oculto'));
}

function showTelaInicial() {
  hideAllTelas();
  document.getElementById('tela-inicial')
    .classList.remove('oculto');
}

function openRanking() {
  hideAllTelas();
  document.getElementById('tela-ranking')
    .classList.remove('oculto');
  renderRanking();
}

function openComoJogarModal() {
  document.getElementById('modal-como-jogar')
    .classList.remove('oculto');
}

function closeComoJogarModal() {
  document.getElementById('modal-como-jogar')
    .classList.add('oculto');
}

function renderRanking() {
  const lista = document.getElementById('lista-ranking');
  lista.innerHTML = '';
  const exemplo = [
    { nome: 'Alice', robos: 12, tempo: '02:34' },
    { nome: 'Bruno', robos: 10, tempo: '03:10' },
    { nome: 'Carla', robos: 8,  tempo: '04:05' }
  ];
  exemplo.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.nome} — ${item.robos} robôs — ${item.tempo}`;
    lista.appendChild(li);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-jogar')
    .addEventListener('click', () => {
      window.location.href = 'game.html';
    });

  document.getElementById('btn-como-jogar')
    .addEventListener('click', openComoJogarModal);

  document.getElementById('btn-ranking')
    .addEventListener('click', openRanking);

  document.getElementById('btn-fechar-modal')
    .addEventListener('click', closeComoJogarModal);

  document.querySelectorAll('.btn-voltar').forEach(btn =>
    btn.addEventListener('click', showTelaInicial)
  );
});
