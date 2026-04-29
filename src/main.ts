import "./style.css";

const ROWS = 8;
const COLS = 10;

let sala: number[][] = [];

function inicializarSala(): void {
  sala = [];
  for (let i = 0; i < ROWS; i++) {
    const fila: number[] = [];
    for (let j = 0; j < COLS; j++) {
      fila.push(0);
    }
    sala.push(fila);
  }
  console.log("Sistema: Sala inicializada (8x10).");
}

function actualizarInterfaz(): void {
  const container = document.getElementById("grid-container");
  const stats = document.getElementById("stats");

  console.log("\n--- MAPA DE LA SALA ---");
  let cabecera = "    ";
  for (let c = 0; c < COLS; c++) cabecera += `${c} `;
  console.log(cabecera);

  let libres = 0;
  let ocupados = 0;

  if (container) container.innerHTML = "";

  for (let i = 0; i < ROWS; i++) {
    let filaTexto = `F${i}: `;
    for (let j = 0; j < COLS; j++) {
      const estado = sala[i][j];
      const simbolo = estado === 0 ? "L" : "X";
      filaTexto += `${simbolo} `;

      if (estado === 0) libres++;
      else ocupados++;

      if (container) {
        const btn = document.createElement("button");
        btn.className = `h-10 w-full rounded-sm font-bold text-xs transition-all ${
          estado === 0
            ? "bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
            : "cursor-not-allowed bg-red-600 text-white"
        }`;
        btn.innerText = simbolo;
        btn.onclick = () => reservarAsiento(i, j);
        container.appendChild(btn);
      }
    }
    console.log(filaTexto);
  }

  console.log(`Reporte: ${libres} Libres, ${ocupados} Ocupados.`);
  if (stats) {
    stats.innerHTML = `
      <p>Disponibles (L): <span class="font-bold text-emerald-400">${libres}</span></p>
      <p>Ocupados (X): <span class="font-bold text-red-400">${ocupados}</span></p>
    `;
  }
}

function reservarAsiento(f: number, c: number): void {
  const log = document.getElementById("log-msg");

  if (f < 0 || f >= ROWS || c < 0 || c >= COLS) {
    const msg = `Error: Coordenadas invalidas F${f}-C${c}.`;
    console.log(msg);
    if (log) log.innerText = msg;
    return;
  }

  if (sala[f][c] === 1) {
    const msg = `Error: El asiento F${f}-C${c} ya esta ocupado.`;
    console.log(msg);
    if (log) log.innerText = msg;
    return;
  }

  sala[f][c] = 1;
  const exitoMsg = `Exito: Asiento F${f}-C${c} reservado correctamente.`;
  console.log(exitoMsg);
  if (log) log.innerText = exitoMsg;

  actualizarInterfaz();
}

function buscarPareja(): void {
  const log = document.getElementById("log-msg");

  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS - 1; j++) {
      if (sala[i][j] === 0 && sala[i][j + 1] === 0) {
        const hallazgo = `Sugerencia: Pareja libre en fila ${i}, columnas ${j} y ${j + 1}.`;
        console.log(hallazgo);
        if (log) log.innerText = hallazgo;
        return;
      }
    }
  }

  const fallo = "No se encontraron dos asientos contiguos disponibles.";
  console.log(fallo);
  if (log) log.innerText = fallo;
}

function resetSala(): void {
  if (confirm("Estas seguro de vaciar toda la sala?")) {
    inicializarSala();
    actualizarInterfaz();
  }
}

declare global {
  interface Window {
    buscarPareja: () => void;
    resetSala: () => void;
  }
}

window.buscarPareja = buscarPareja;
window.resetSala = resetSala;

inicializarSala();
actualizarInterfaz();

export {};
