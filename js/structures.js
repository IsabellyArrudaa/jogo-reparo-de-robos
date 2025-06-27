// Nó genérico para listas encadeadas
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

// Nó para pilha de componentes
class StackNode {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

// Pilha de componentes defeituosos
class PilhaComponentes {
  constructor() {
    this.top = null;
    this.size = 0;
  }

  push(componente) {
    const node = new StackNode(componente);
    node.next = this.top;
    this.top = node;
    this.size++;
  }

  pop() {
    if (this.top == null) return null;
    const popped = this.top.data;
    this.top = this.top.next;
    this.size--;
    return popped;
  }

  peek() {
    return this.top ? this.top.data : null;
  }

  isEmpty() {
    return this.top == null;
  }
}

// Classe Robô
class Robo {
  constructor(id, modelo, prioridade, componentes) {
    this.id = id;
    this.modelo = modelo;
    this.prioridade = prioridade; // emergência, padrão, baixo risco
    this.componentes = componentes; // Pilha de componentes
    this.estado = 'pendente'; // ou 'consertado'
  }
}

// Nó para lista encadeada de robôs
class RoboNode {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

// Lista encadeada (fila) de robôs
class FilaRobos {
  constructor(maxSize) {
    this.head = null;
    this.tail = null;
    this.size = 0;
    this.maxSize = maxSize || 5;
  }

  enqueue(robo) {
    if (this.size >= this.maxSize) return false;
    const node = new RoboNode(robo);
    if (!this.tail) {
      this.head = this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.size++;
    return true;
  }

  dequeue() {
    if (!this.head) return null;
    const removed = this.head.data;
    this.head = this.head.next;
    if (!this.head) this.tail = null;
    this.size--;
    return removed;
  }

  // Busca robô por ID
  findById(id) {
    let ptr = this.head;
    while (ptr) {
      if (ptr.data.id === id) return ptr.data;
      ptr = ptr.next;
    }
    return null;
  }

  // Remove robô por referência
  remove(robo) {
    if (!this.head) return false;
    if (this.head.data === robo) {
      this.dequeue();
      return true;
    }
    let prev = this.head;
    while (prev.next && prev.next.data !== robo) {
      prev = prev.next;
    }
    if (prev.next) {
      if (prev.next === this.tail) this.tail = prev;
      prev.next = prev.next.next;
      this.size--;
      return true;
    }
    return false;
  }
}