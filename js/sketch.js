let fila;                // Fila de robôs
let selectedRobo = null; // Robô selecionado
let generateInterval;    // Intervalo de chegada de robôs
let isRunning = false;   // Estado do jogo
let startTime;           // Hora que o jogo começou
let tempoDecorrido = 0;  // Tempo total
const MAX_ROBOS = 15;     // Limite máximo de robôs
let robosConsertados = 0;
let componentesConsertados = 0;

// Gera um robô aleatório com pilha de componentes
let nextRoboId = 1;
function criarRoboAleatorio() {
  const modelos = ['Rod', 'BB-8', 'Wall-E', 'Baymax'];
  const prioridades = ['emergência', 'padrão', 'baixo risco'];
  const componentesPossiveis = [
    { nome: 'Sensor Óptico', tempo: 3 },
    { nome: 'Placa Mãe', tempo: 5 },
    { nome: 'Servo Motor', tempo: 2 },
    { nome: 'Bateria', tempo: 4 },
    { nome: 'Processador', tempo: 3 },
    { nome: 'Braço Mecânico', tempo: 2 }
  ];

  // Sorteia prioridade primeiro
  const prioridade = prioridades[Math.floor(Math.random() * prioridades.length)];

  // Define quantidade de componentes conforme prioridade
  let qtdComponentes;
  if (prioridade === 'emergência') {
    qtdComponentes = Math.floor(Math.random() * 2) + 3; // 3 ou 4
  } else if (prioridade === 'padrão') {
    qtdComponentes = 2;
  } else {
    qtdComponentes = 1;
  }

  const pilha = new PilhaComponentes();
  for (let i = 0; i < qtdComponentes; i++) {
    const comp = componentesPossiveis[Math.floor(Math.random() * componentesPossiveis.length)];
    const codigo = Math.random().toString(36).substring(2, 6).toUpperCase();
    pilha.push({
      nome: comp.nome,
      codigo: codigo,
      tempoEstimado: comp.tempo
    });
  }

  return new Robo(
    nextRoboId++,
    modelos[Math.floor(Math.random() * modelos.length)],
    prioridade,
    pilha
  );
}

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

  atualizarTimerTopo(); // Atualiza o timer no topo
  desenharFila();
  

  if (fila.size === 0 && isRunning) {
    victory();
  }
}

function iniciarJogo() {
  isRunning = true;
  startTime = millis();
  robosConsertados = 0;
  componentesConsertados = 0;
  fila.enqueue(criarRoboAleatorio());
  generateInterval = setInterval(() => {
    if (!fila.enqueue(criarRoboAleatorio())) {
      gameOver();
    }
  }, 5000);
  const btnPause = document.getElementById('btn-pause');
  if (btnPause) btnPause.textContent = 'Pausar';
}

function pauseGame() {
  clearInterval(generateInterval);
  isRunning = false;
  noLoop();
  document.getElementById('btn-pause').style.display = 'none';
  document.getElementById('btn-continue').style.display = '';
}

function continuarJogo() {
  isRunning = true;
  // Ajusta o startTime para não contar o tempo pausado
  startTime = millis() - tempoDecorrido * 1000;
  generateInterval = setInterval(() => {
    if (!fila.enqueue(criarRoboAleatorio())) {
      gameOver();
    }
  }, 5000);
  loop();
  document.getElementById('btn-pause').style.display = '';
  document.getElementById('btn-continue').style.display = 'none';
}

function resetGame() {
  pauseGame();
  fila = new FilaRobos(MAX_ROBOS);
  selectedRobo = null;
  tempoDecorrido = 0;
  robosConsertados = 0;
  componentesConsertados = 0;
  atualizarPainel();
  iniciarJogo();
  loop();

  // Garante que o botão "Pausar" aparece e "Continuar" some
  document.getElementById('btn-pause').style.display = '';
  document.getElementById('btn-continue').style.display = 'none';
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

    // Listar todos os componentes pendentes
    let ptr = selectedRobo.componentes.top;
    let idx = 1;
    if (ptr) {
      texto += `\nComponentes pendentes:`;
      while (ptr) {
        texto += `\n${idx}. ${ptr.data.nome} | Código: ${ptr.data.codigo} | Tempo: ${ptr.data.tempoEstimado}s`;
        ptr = ptr.next;
        idx++;
      }
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
    componentesConsertados++; // Conta componente

    if (selectedRobo.componentes.isEmpty()) {
      removerRobo(selectedRobo);
      robosConsertados++; // Conta robô
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
  pauseGame();
  noLoop();

  // Pergunta nome do jogador ao perder
  const nome = prompt('Game Over! Muitos robôs acumulados!\nSeu tempo: ' + tempoDecorrido + ' segundos.\nDigite seu nome para o ranking:');
  if (nome) {
    salvarRanking(nome, tempoDecorrido);
  }
  alert('Game Over! Muitos robôs acumulados!');
}

function victory() {
  pauseGame();
  noLoop();

  // Pergunta nome do jogador
  const nome = prompt('Parabéns! Todos os robôs foram consertados em ' + tempoDecorrido + ' segundos!\nDigite seu nome para o ranking:');
  if (nome) {
    salvarRanking(nome, tempoDecorrido);
  }
  alert(`Parabéns! Todos os robôs foram consertados em ${tempoDecorrido} segundos!`);
}

function salvarRanking(nome, tempo) {
  let ranking = JSON.parse(localStorage.getItem('rankingRobos') || '[]');
  ranking.push({
    nome,
    tempo,
    robos: robosConsertados,
    componentes: componentesConsertados
  });
  // Ordena: mais robôs, depois mais componentes, depois menor tempo
  ranking.sort((a, b) => {
    if (b.robos !== a.robos) return b.robos - a.robos;
    if (b.componentes !== a.componentes) return b.componentes - a.componentes;
    return a.tempo - b.tempo;
  });
  localStorage.setItem('rankingRobos', JSON.stringify(ranking));
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

function atualizarTimerTopo() {
  const timerSpan = document.getElementById('timer');
  const min = String(Math.floor(tempoDecorrido / 60)).padStart(2, '0');
  const seg = String(tempoDecorrido % 60).padStart(2, '0');
  timerSpan.textContent = `Tempo: ${min}:${seg}`;
}

window.pauseGame = pauseGame;
window.resetGame = resetGame;
