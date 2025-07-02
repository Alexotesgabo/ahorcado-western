const letrasContainer = document.getElementById('letras');
const abecedarioContainer = document.getElementById('abecedario');
const partes = document.querySelectorAll('.parte');
const resultado = document.getElementById('resultado');
const mensajeResultado = document.getElementById('mensajeResultado');
const gifResultado = document.getElementById('gifResultado');

const musicaJuego = document.getElementById('musicaJuego');
const musicaVictoria = document.getElementById('musicaVictoria');
const musicaDerrota = document.getElementById('musicaDerrota');

let palabra = '';
let letrasAdivinadas = [];
let errores = 0;
let maxErrores = partes.length;

function iniciarJuego() {
  console.log("Iniciando juego...");

  // Reiniciar música
  musicaVictoria.pause();
  musicaDerrota.pause();
  musicaJuego.currentTime = 0;
  musicaJuego.volume = 0.5;
  musicaJuego.play();

  // Seleccionar palabra
  palabra = window.palabras[Math.floor(Math.random() * window.palabras.length)].toUpperCase();
  letrasAdivinadas = Array(palabra.length).fill(false);
  errores = 0;

  letrasContainer.innerHTML = '';
  abecedarioContainer.innerHTML = '';
  resultado.style.display = 'none';

  partes.forEach(parte => parte.style.opacity = 0);

  // Mostrar líneas por cada letra
  for (let letra of palabra) {
    const span = document.createElement('span');
    span.textContent = letra === ' ' ? ' ' : '_';
    span.classList.add('letra');
    letrasContainer.appendChild(span);
  }

  // Abecedario en 3 filas (tipo español)
  const filas = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L','Ñ'],
    ['Z','X','C','V','B','N','M']
  ];

  filas.forEach(fila => {
    const filaDiv = document.createElement('div');
    filaDiv.classList.add('fila-abecedario');

    fila.forEach(letra => {
      const boton = document.createElement('button');
      boton.textContent = letra;
      boton.addEventListener('click', () => manejarLetra(letra, boton));
      filaDiv.appendChild(boton);
    });

    abecedarioContainer.appendChild(filaDiv);
  });
}

function manejarLetra(letra, boton) {
  boton.disabled = true;
  let acierto = false;

  const spans = letrasContainer.querySelectorAll('.letra');
  palabra.split('').forEach((char, idx) => {
    if (char === letra) {
      spans[idx].textContent = letra;
      letrasAdivinadas[idx] = true;
      acierto = true;
    }
  });

  if (!acierto) {
    mostrarParte(errores);
    errores++;
  }

  verificarEstado();
}

function mostrarParte(index) {
  if (partes[index]) {
    partes[index].style.opacity = 1;
  }
}

function verificarEstado() {
  const palabraCompleta = letrasAdivinadas.every((estado, idx) => {
    return palabra[idx] === ' ' || estado;
  });

  if (palabraCompleta) {
    mostrarResultado(true);
  } else if (errores >= maxErrores) {
    mostrarResultado(false);
  }
}

function mostrarResultado(victoria) {
  resultado.style.display = 'flex';
  mensajeResultado.textContent = victoria ? '¡Ganaste, vaquero!' : 'Game Over...';

  // Estilo del GIF según resultado
  if (victoria) {
    gifResultado.src = 'victoria.gif';
    gifResultado.style.width = '400px';
    gifResultado.style.maxWidth = '90vw';
  } else {
    gifResultado.src = 'derrota.gif';
    gifResultado.style.width = '400px';
    gifResultado.style.maxWidth = '95vw';
  }

  // Detener música del juego
  musicaJuego.pause();

  // Reproducir resultado
  if (victoria) {
    musicaVictoria.currentTime = 0;
    musicaVictoria.volume = 0.6;
    musicaVictoria.play();
  } else {
    musicaDerrota.currentTime = 0;
    musicaDerrota.volume = 0.6;
    musicaDerrota.play();
  }

  // Desactivar todos los botones restantes
  const botones = abecedarioContainer.querySelectorAll('button');
  botones.forEach(btn => btn.disabled = true);
}

function reiniciarJuego() {
  iniciarJuego();
}

window.addEventListener('load', () => {
  // Intenta reproducir música de fondo automáticamente
  const musica = document.getElementById('musicaJuego');
  musica.volume = 0.4;
  musica.play().catch(() => {
    console.warn("Autoplay bloqueado. Reproducirá tras primer clic.");
    document.body.addEventListener('click', () => {
      musica.play();
    }, { once: true });
  });

  iniciarJuego();
});
