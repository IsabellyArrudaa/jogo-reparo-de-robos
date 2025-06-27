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
  let ranking = JSON.parse(localStorage.getItem('rankingRobos') || '[]');
  ranking.forEach(item => {
    const min = String(Math.floor(item.tempo / 60)).padStart(2, '0');
    const seg = String(item.tempo % 60).padStart(2, '0');
    const li = document.createElement('li');
    li.textContent = `${item.nome} - ${item.robos || 0} robôs - ${item.componentes || 0} componentes - ${min}:${seg}`;
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
