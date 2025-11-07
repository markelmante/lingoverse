document.addEventListener('DOMContentLoaded', async () => {
    const tablero = document.querySelector('.tablero');
    const teclado = document.querySelector('.teclado');
    const mensaje = document.getElementById('mensaje');
    const botonReiniciar = document.getElementById('btn-reiniciar');
    const maxIntentos = 5;
    const N = 5;
    let secreta = "";
    let filaActual = 0;
    let columnaActual = 0;
    let jugando = true;
    let timerInterval = null;
    let tiempoRestante = 30;
    let tiempoTotal = 0;
    let totalInterval = null;

    // Crear contador global arriba del tablero
    const contadorGlobal = document.createElement('p');
    contadorGlobal.id = 'contador-global';
    contadorGlobal.classList.add('contador-global');
    tablero.parentNode.insertBefore(contadorGlobal, tablero);

    botonReiniciar.addEventListener('click', iniciarJuego);

    async function iniciarJuego() {
        tiempoTotal = 0;
        clearInterval(totalInterval);
        totalInterval = setInterval(() => tiempoTotal++, 1000);
        tablero.innerHTML = "";
        teclado.innerHTML = "";
        mensaje.textContent = "";
        botonReiniciar.style.display = "none";
        filaActual = 0;
        columnaActual = 0;
        jugando = true;
        clearInterval(timerInterval);

        try {
            const response = await fetch("http://185.60.43.155:3000/api/word/1");
            const data = await response.json();
            secreta = data.word.toUpperCase();
            console.log("Palabra secreta:", secreta);
        } catch (error) {
            console.error("Error al obtener la palabra:", error);
            alert("No se pudo obtener la palabra del servidor.");
            return;
        }

        // Crear tablero
        for (let i = 0; i < maxIntentos; i++) {
            const fila = document.createElement('div');
            fila.classList.add('fila');
            fila.id = `fila-${i}`;

            for (let j = 0; j < N; j++) {
                const celda = document.createElement('div');
                celda.classList.add('celda');
                celda.id = `celda-${i}-${j}`;
                fila.appendChild(celda);
            }
            tablero.appendChild(fila);
        }

        // Crear teclado
        const filasTeclado = [
            ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
            ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
            ["Z", "X", "C", "V", "B", "N", "M", "←"]
        ];

        filasTeclado.forEach(filaLetras => {
            const fila = document.createElement('div');
            fila.classList.add('fila-teclado');
            filaLetras.forEach(letra => {
                const boton = document.createElement('button');
                boton.textContent = letra;
                boton.addEventListener('click', () => {
                    if (!jugando) return;
                    if (letra === "←") borrarLetra();
                    else agregarLetra(letra);
                });
                fila.appendChild(boton);
            });
            teclado.appendChild(fila);
        });

        iniciarTemporizador();
    }

    function iniciarTemporizador() {
        clearInterval(timerInterval);
        tiempoRestante = 30;
        actualizarContador();

        timerInterval = setInterval(() => {
            tiempoRestante--;
            actualizarContador();

            if (tiempoRestante <= 0) {
                clearInterval(timerInterval);
                marcarFilaNula();
            }
        }, 1000);
    }

    function actualizarContador() {
        contadorGlobal.textContent = `Tiempo restante por fila: ${tiempoRestante}s`;
    }

    function marcarFilaNula() {
        for (let j = 0; j < N; j++) {
            const celda = document.getElementById(`celda-${filaActual}-${j}`);
            if (!celda.textContent) {
                celda.style.backgroundColor = "gray";
            }
        }

        if (filaActual === maxIntentos - 1) {
            mensaje.textContent = `¡Tiempo agotado! La palabra era ${secreta}`;
            jugando = false;
            botonReiniciar.style.display = "inline-block";
        } else {
            filaActual++;
            columnaActual = 0;
            iniciarTemporizador();
        }
    }

    function agregarLetra(letra) {
        if (columnaActual < N) {
            const celda = document.getElementById(`celda-${filaActual}-${columnaActual}`);
            celda.textContent = letra;
            columnaActual++;
        }
        if (columnaActual === N) {
            clearInterval(timerInterval);
            validarFila();
        }
    }

    function borrarLetra() {
        if (columnaActual > 0) {
            columnaActual--;
            const celda = document.getElementById(`celda-${filaActual}-${columnaActual}`);
            celda.textContent = '';
        }
    }

    function validarFila() {
        const fila = [];
        for (let j = 0; j < N; j++) {
            fila.push(document.getElementById(`celda-${filaActual}-${j}`).textContent.toUpperCase());
        }

        const secretaArray = secreta.split("");
        const resultado = Array(N).fill("red");
        const letrasRestantes = {};

        for (let i = 0; i < N; i++) {
            if (fila[i] === secretaArray[i]) {
                resultado[i] = "green";
                secretaArray[i] = null;
            } else {
                const letra = secretaArray[i];
                if (letra) letrasRestantes[letra] = (letrasRestantes[letra] || 0) + 1;
            }
        }

        for (let i = 0; i < N; i++) {
            const letra = fila[i];
            if (resultado[i] === "red" && letrasRestantes[letra] > 0) {
                resultado[i] = "orange";
                letrasRestantes[letra]--;
            }
        }

        for (let i = 0; i < N; i++) {
            const celda = document.getElementById(`celda-${filaActual}-${i}`);
            celda.style.backgroundColor = resultado[i];
        }

        if (fila.join("") === secreta) {
            mensaje.textContent = `¡Has ganado! Has acertado en ${tiempoTotal} segundos.`;
            jugando = false;
            botonReiniciar.style.display = "inline-block";
        } else if (filaActual === maxIntentos - 1) {
            mensaje.textContent = `¡Has perdido! La palabra era ${secreta}`;
            jugando = false;
            botonReiniciar.style.display = "inline-block";
        } else {
            filaActual++;
            columnaActual = 0;
            iniciarTemporizador();
        }
    }

    // Menú hamburguesa
    const hamburguesa = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.nav-menu');
    hamburguesa.addEventListener('click', () => menu.classList.toggle('active'));

    iniciarJuego();
});
