document.addEventListener('DOMContentLoaded', () => {
    const tablero = document.querySelector('.tablero');
    const teclado = document.querySelector('.teclado');
    const mensaje = document.getElementById('mensaje');
    const botonReiniciar = document.getElementById('btn-reiniciar');
    const instrucciones = document.querySelector('.instrucciones'); 
    const btnEmpezar = document.getElementById('btn-empezar'); 
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
    let temporizadorIniciado = false;
    let bloqueandoEntrada = false;

    // Inicialización del contador global (elemento creado dinámicamente)
    const contadorGlobal = document.createElement('p');
    contadorGlobal.id = 'contador-global';
    contadorGlobal.classList.add('contador-global');
    // Aseguramos que 'tablero' no sea null antes de insertar
    if (tablero) {
        tablero.parentNode.insertBefore(contadorGlobal, tablero);
    }


    botonReiniciar.addEventListener('click', iniciarJuego);

    btnEmpezar.addEventListener('click', () => {
        instrucciones.style.display = 'none';
        btnEmpezar.style.display = 'none';
        iniciarJuego();
    });

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
        bloqueandoEntrada = false;
        clearInterval(timerInterval);
        temporizadorIniciado = false;

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

        const filasTeclado = [
            ["Q","W","E","R","T","Y","U","I","O","P"],
            ["A","S","D","F","G","H","J","K","L","Ñ"],
            ["Z","X","C","V","B","N","M","←"]
        ];

        filasTeclado.forEach(filaLetras => {
            const fila = document.createElement('div');
            fila.classList.add('fila-teclado');
            filaLetras.forEach(letra => {
                const boton = document.createElement('button');
                boton.textContent = letra;
                boton.addEventListener('click', () => {
                    if (!jugando || bloqueandoEntrada) return;
                    if (letra === "←") borrarLetra();
                    else agregarLetra(letra);
                });
                fila.appendChild(boton);
            });
            teclado.appendChild(fila);
        });
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
            if (!celda.textContent) celda.style.backgroundColor = "gray";
        }
        if (filaActual === maxIntentos - 1) {
            finalizarJuego(false);
        } else {
            filaActual++;
            columnaActual = 0;
            temporizadorIniciado = false;
        }
    }

    function agregarLetra(letra) {
        if (!temporizadorIniciado) {
            iniciarTemporizador();
            temporizadorIniciado = true;
        }
        if (columnaActual < N) {
            const celda = document.getElementById(`celda-${filaActual}-${columnaActual}`);
            celda.textContent = letra;
            columnaActual++;
        }
        if (columnaActual === N) {
            clearInterval(timerInterval);
            temporizadorIniciado = false;
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
        bloqueandoEntrada = true;
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
            setTimeout(() => {
                celda.classList.add('flip');
                setTimeout(() => {
                    celda.style.backgroundColor = resultado[i];
                    celda.classList.remove('flip');
                    // Solo desbloqueamos la entrada después de que todas las animaciones han terminado
                    if (i === N - 1) bloqueandoEntrada = false; 
                }, 300);
            }, i * 300);
        }

        setTimeout(() => {
            if (fila.join("") === secreta) {
                finalizarJuego(true);
            } else if (filaActual === maxIntentos - 1) {
                finalizarJuego(false);
            } else {
                filaActual++;
                columnaActual = 0;
                temporizadorIniciado = false;
            }
        }, N * 300 + 50);
    }

    function finalizarJuego(ganado) {
        jugando = false;
        clearInterval(totalInterval); // Detener el contador de tiempo total
        botonReiniciar.style.display = "inline-block";

        let intentosUsados = filaActual + 1;
        // La fórmula del score puede necesitar un ajuste basado en la dificultad real.
        let score = Math.max(1, Math.floor((maxIntentos - intentosUsados + 1) * (30 * maxIntentos - tiempoTotal)));

        if (ganado) {
            mensaje.textContent = `¡Has ganado! Has acertado en ${tiempoTotal} segundos y ${intentosUsados} intentos. Score: ${score}`;
        } else {
            mensaje.textContent = `¡Has perdido! La palabra era ${secreta}. Score: ${score}`;
        }

        guardarRanking(intentosUsados, tiempoTotal, score);
    }

    function guardarRanking(intentos, tiempo, score) {
        fetch('/ranking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Este selector ahora funciona porque la metaetiqueta está en el HTML
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({
                score: score,
                intentos: intentos,
                tiempo: tiempo
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) console.log('Ranking guardado:', data.ranking);
        })
        .catch(err => console.error('Error guardando ranking:', err));
    }

    // --- LÓGICA DEL MODAL RANKING CORREGIDA ---
    // 🟢 Seleccionar los elementos del modal estático
    const modalRanking = document.getElementById('modal-ranking');
    const listaRanking = document.getElementById('lista-ranking');
    const cerrarRanking = document.getElementById('cerrar-ranking');
    const botonRanking = document.getElementById('btn-ranking');

    // Manejador para cerrar el modal
    if (cerrarRanking) {
        cerrarRanking.addEventListener('click', () => modalRanking.style.display = 'none');
    }

    // Abrir ranking al hacer click
    if (botonRanking) {
        botonRanking.addEventListener('click', (e) => {
            e.preventDefault();
            // Mostrar menú antes de la petición para feedback rápido
            const menu = document.querySelector('.nav-menu');
            if (menu) menu.classList.remove('active');
            
            fetch('/ranking', { headers: { 'Accept': 'application/json' } })
            .then(res => {
                if (!res.ok) throw new Error('Error al cargar los datos del ranking');
                return res.json();
            })
            .then(data => {
                listaRanking.innerHTML = ''; // Limpiar la lista anterior
                // Asegúrate de que 'data' sea un array (asumiendo que tu backend devuelve un array de rankings)
                if (Array.isArray(data)) {
                     data.forEach((r, index) => {
                        const li = document.createElement('li');
                        // Intenta acceder al nombre del usuario de forma segura
                        const userName = r.user && r.user.name ? r.user.name : 'Usuario Desconocido';
                        li.textContent = `${index + 1}. ${userName} - Score: ${r.score} - Intentos: ${r.intentos} - Tiempo: ${r.tiempo}s`;
                        listaRanking.appendChild(li);
                    });
                } else {
                    listaRanking.innerHTML = '<li>Error: Formato de datos no válido.</li>';
                }
               
                modalRanking.style.display = 'flex'; // 🟢 MOSTRAR EL MODAL
            })
            .catch(err => {
                console.error('Error al cargar ranking:', err);
                listaRanking.innerHTML = '<li>Error al cargar el ranking. Por favor, inténtelo de nuevo.</li>';
                modalRanking.style.display = 'flex'; // Mostrar modal con el error
            });
        });
    }

    const hamburguesa = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.nav-menu');
    hamburguesa.addEventListener('click', () => menu.classList.toggle('active'));

    // Cerrar modal al hacer click fuera del contenido
    window.addEventListener('click', (e) => {
        if (e.target === modalRanking) modalRanking.style.display = 'none';
    });
});