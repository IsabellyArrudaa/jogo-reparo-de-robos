let fila;                // Fila de robôs
let selectedRobo = null; // Robô selecionado
let generateInterval;    // Intervalo de chegada de robôs
let isRunning = false;   // Estado do jogo
let startTime;           // Hora que o jogo começou
let tempoDecorrido = 0;  // Tempo total
const MAX_ROBOS = 5;     // Limite máximo de robôs

function setup() {
  const canvas = createCanvas(800, 600);
  canvas.parent('canvas-container');

  fila = new FilaRobos(MAX_ROBOS);
  iniciarJogo();

  const inputBox = document.getElementById('input-box');
  inputBox.value = '';
  inputBox.disabled = true;  // Desabilita até selecionar robô

  // Captura ENTER no input HTML para verificar código
  inputBox.addEventListener('keydown', function(e) {
    if (!selectedRobo || !isRunning) {
      e.preventDefault();
      return;
    }
    if (e.key === 'Enter') {
      verificarCodigo();
      inputBox.value = '';
    }
  });
}

function draw() {
  background(240);

  if (!isRunning) return;

  tempoDecorrido = floor((millis() - startTime) / 1000);

  desenharFila();

  fill(0);
  textSize(16);
  text(`Tempo: ${tempoDecorrido}s`, 650, 30);

  if (fila.size === 0 && isRunning) {
    victory();
  }
}

function iniciarJogo() {
  isRunning = true;
  startTime = millis();
  generateInterval = setInterval(() => {
    if (!fila.enqueue(criarRoboAleatorio())) {
      gameOver();
    }
  }, 5000);
}

function pararJogo() {
  clearInterval(generateInterval);
  isRunning = false;
}

function resetarJogo() {
  pararJogo();
  fila = new FilaRobos(MAX_ROBOS);
  selectedRobo = null;
  tempoDecorrido = 0;
  atualizarPainel(); // limpa painel
  iniciarJogo();
  loop();
}

function mousePressed() {
  let i = floor(mouseY / 50);
  let ptr = fila.head;
  let idx = 0;
  while (ptr) {
    if (idx === i) {
      selectedRobo = ptr.data;
      atualizarPainel();
      break;
    }
    ptr = ptr.next;
    idx++;
  }
}

// Atualiza o painel lateral e input HTML
function atualizarPainel() {
  const detalhes = document.getElementById('detalhes-robo');
  const inputBox = document.getElementById('input-box');

  if (!selectedRobo) {
    detalhes.textContent = 'Selecione um robô à esquerda';
    inputBox.value = '';
    inputBox.disabled = true;
  } else {
    let texto = `Robô: #${selectedRobo.id}
Modelo: ${selectedRobo.modelo}
Prioridade: ${selectedRobo.prioridade}`;

    const top = selectedRobo.componentes.peek();
    if (top) {
      texto += `
Componente: ${top.nome}
Código: ${top.codigo}
Tempo estimado: ${top.tempoEstimado}s`;
      inputBox.disabled = false;
      inputBox.focus();
    } else {
      texto += '\nSem componentes pendentes!';
      inputBox.value = '';
      inputBox.disabled = true;
    }

    detalhes.textContent = texto;
  }
}

// Verifica código digitado no input
function verificarCodigo() {
  const inputBox = document.getElementById('input-box');
  if (!selectedRobo) return;
  const top = selectedRobo.componentes.peek();
  if (!top) return;

  if (inputBox.value.trim() === top.codigo) {
    selectedRobo.componentes.pop();

    if (selectedRobo.componentes.isEmpty()) {
      removerRobo(selectedRobo);
      selectedRobo = null;
    }
  }
  inputBox.value = '';
  atualizarPainel();
}

function removerRobo(robo) {
  if (fila.head.data === robo) {
    fila.dequeue();
  } else {
    let prev = fila.head;
    while (prev.next && prev.next.data !== robo) {
      prev = prev.next;
    }
    if (prev.next) {
      prev.next = prev.next.next;
      fila.size--;
      if (!prev.next) fila.tail = prev;
    }
  }
}

function gameOver() {
  pararJogo();
  noLoop();
  alert('Game Over! Muitos robôs acumulados!');
}

function victory() {
  pararJogo();
  noLoop();
  alert(`Parabéns! Todos os robôs foram consertados em ${tempoDecorrido} segundos!`);
}

function desenharFila() {
  let ptr = fila.head;
  let y = 0;
  while (ptr) {
    fill(ptr.data.prioridade === 'emergência' ? 'red' :
         ptr.data.prioridade === 'padrão'     ? 'yellow' :
                                                'green');
    rect(0, y, 200, 50);
    fill(0);
    text(`#${ptr.data.id} ${ptr.data.modelo}`, 10, y + 30);
    ptr = ptr.next;
    y += 50;
  }
}
