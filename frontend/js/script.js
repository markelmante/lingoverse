document.addEventListener('DOMContentLoaded', () => {
    const tablero = document.querySelector('.tablero');
    const teclado = document.querySelector('.teclado');
    const mensaje = document.getElementById('mensaje');

    const maxIntentos = 5;
    const N = 5;
    const secreta = "LINGO"; // luego se obtiene del backend
    let filaActual = 0;
    let columnaActual = 0;
    let jugando = true;

    // Generar tablero dinámicamente
    for (let i = 0; i < maxIntentos; i++) {
        const fila = document.createElement('div');
        fila.classList.add('fila');
        for (let j = 0; j < N; j++) {
            const celda = document.createElement('div');
            celda.classList.add('celda');
            celda.id = `celda-${i}-${j}`;
            fila.appendChild(celda);
        }
        tablero.appendChild(fila);
    }

    // Generar teclado QWERTY
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

    function agregarLetra(letra) {
        if (columnaActual < N) {
            const celda = document.getElementById(`celda-${filaActual}-${columnaActual}`);
            celda.textContent = letra;
            columnaActual++;
        }
        if (columnaActual === N) {
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

        // Cambiar color de celdas
        const secretaArray = secreta.split("");
        fila.forEach((letra, i) => {
            const celda = document.getElementById(`celda-${filaActual}-${i}`);
            if (letra === secretaArray[i]) celda.style.backgroundColor = "green";
            else if (secretaArray.includes(letra)) celda.style.backgroundColor = "orange";
            else celda.style.backgroundColor = "red";
        });

        // Comprobar fin de juego
        if (fila.join("") === secreta) {
            mensaje.textContent = "¡Has ganado!";
            jugando = false;
        } else if (filaActual === maxIntentos - 1) {
            mensaje.textContent = `¡Has perdido! La palabra era ${secreta}`;
            jugando = false;
        } else {
            filaActual++;
            columnaActual = 0;
        }
    }

    // Menú hamburguesa
    const hamburguesa = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.nav-menu');
    hamburguesa.addEventListener('click', () => {
        menu.classList.toggle('active');
    });
});
