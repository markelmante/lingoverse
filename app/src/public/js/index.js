
document.addEventListener('DOMContentLoaded', () => {
    // ====================================
    // CONFIGURACIÓN Y VARIABLES GLOBALES
    // ====================================

    const API_BASE_URL = 'http://185.60.43.155:3000/api/'; 
    const TIEMPO_LIMITE_SEGUNDOS = 30; 
    
    // Traigo los elementos HTML que necesito
    const tablero = document.querySelector('.tablero');
    const teclado = document.querySelector('.teclado');
    const mensaje = document.getElementById('mensaje');
    const botonReiniciar = document.getElementById('btn-reiniciar');
    const instrucciones = document.querySelector('.instrucciones');
    const btnEmpezar = document.getElementById('btn-empezar');
    const maxIntentos = 5;
    const N = 5; // Siempre 5 letras

    let secreta = "";
    let filaActual = 0;
    let columnaActual = 0;
    let jugando = true;
    let timerInterval = null;
    let tiempoRestante = TIEMPO_LIMITE_SEGUNDOS;
    let tiempoTotal = 0; // Contador de segundos totales jugados
    let totalInterval = null;
    let bloqueandoEntrada = false; // Bandera para evitar escribir durante la animación
    const estadoTeclado = {}; 

    // ✅ Mapa de colores para las celdas y el teclado
    const colorMap = {
        'green': '#008000 ',  // Correcta (Verde)
        'orange': '#ff8000', // Cerca (Naranja)
        'red': '#FF0000',    // Incorrecta (¡ROJO!)
        'gray': '#F0F0F0',   // Cuando pierdo la ronda
        'default': 'var(--color-boton)' // Color inicial del botón
    };

    // Inicialización del contador global
    const contadorGlobal = document.createElement('p');
    contadorGlobal.id = 'contador-global';
    contadorGlobal.classList.add('contador-global');
    if (tablero) {
        // Pongo el contador encima del tablero
        tablero.parentNode.insertBefore(contadorGlobal, tablero);
    }
    contadorGlobal.style.display = 'none'; // Se oculta al principio

    // ====================================
    // GESTIÓN DEL JUEGO
    // ====================================

    botonReiniciar.addEventListener('click', iniciarJuego);

    btnEmpezar.addEventListener('click', () => {
        // Oculto las instrucciones al empezar
        instrucciones.style.display = 'none';
        btnEmpezar.style.display = 'none';
        iniciarJuego();
    });

    async function iniciarJuego() {
        // Reseteo todos los contadores
        tiempoTotal = 0;
        clearInterval(totalInterval);
        totalInterval = setInterval(() => tiempoTotal++, 1000); // Esto cuenta el tiempo total
        tablero.innerHTML = "";
        teclado.innerHTML = "";
        mensaje.textContent = "";
        botonReiniciar.style.display = "none";
        filaActual = 0;
        columnaActual = 0;
        jugando = true;
        bloqueandoEntrada = false;
        clearInterval(timerInterval);
        Object.keys(estadoTeclado).forEach(key => delete estadoTeclado[key]); 

        try {
            // Pido la palabra secreta a la API
            const response = await fetch(API_BASE_URL + "word/1"); 
            const data = await response.json();
            secreta = data.word.toUpperCase();
            console.log("Palabra secreta:", secreta);
        } catch (error) {
            console.error("Error al obtener la palabra:", error);
            mensaje.textContent = "Error al conectar con el servidor. Inténtalo de nuevo.";
            jugando = false;
            return;
        }

        // Creación del tablero (las 5 filas de 5 celdas)
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

        // Creación del teclado virtual
        const filasTeclado = [
            ["Q","W","E","R","T","Y","U","I","O","P"],
            ["A","S","D","F","G","H","J","K","L","Ñ"],
            ["ENTER","Z","X","C","V","B","N","M","←"]
        ];

        teclado.innerHTML = ''; 

        filasTeclado.forEach(filaLetras => {
            const fila = document.createElement('div');
            fila.classList.add('fila-teclado');
            filaLetras.forEach(letra => {
                const boton = document.createElement('button');
                boton.textContent = letra;
                boton.dataset.key = letra; 
                
                // Pongo los eventos a los botones especiales (ENTER y BORRAR)
                if (letra === "ENTER") {
                     boton.addEventListener('click', () => {
                         if (!jugando || bloqueandoEntrada) return;
                         if (columnaActual === N) manejarIntento();
                     });
                     boton.style.flexGrow = 1.5; // Lo hago más ancho
                } 
                else if (letra === "←") {
                    boton.addEventListener('click', () => {
                        if (!jugando || bloqueandoEntrada) return;
                        borrarLetra();
                    });
                    boton.style.flexGrow = 1.5; // Lo hago más ancho
                } 
                else {
                    boton.addEventListener('click', () => {
                        if (!jugando || bloqueandoEntrada) return;
                        agregarLetra(letra);
                    });
                    estadoTeclado[letra] = 'default';
                }
                
                fila.appendChild(boton);
            });
            teclado.appendChild(fila);
        });
        
        // Uso el teclado del ordenador para escribir
        document.addEventListener('keyup', manejarTecladoFisico);

        iniciarTemporizador(); 
    }
    
    function manejarTecladoFisico(e) {
        if (!jugando || bloqueandoEntrada) return;
        
        const key = e.key.toUpperCase();

        // Solo dejo pasar letras y los botones especiales
        if (key.length === 1 && 'QWERTYUIOPASDFGHJKLÑZXCVBNM'.includes(key)) {
            agregarLetra(key);
        } else if (key === 'BACKSPACE' || key === 'DELETE') {
            borrarLetra();
        } else if (key === 'ENTER') {
            if (columnaActual === N) manejarIntento();
        }
    }

    // ====================================
    // GESTIÓN DEL TIEMPO Y RONDA
    // ====================================

    function iniciarTemporizador() {
        clearInterval(timerInterval);
        tiempoRestante = TIEMPO_LIMITE_SEGUNDOS;
        contadorGlobal.style.display = 'block';
        actualizarContador();

        timerInterval = setInterval(() => {
            tiempoRestante--;
            actualizarContador();
            if (tiempoRestante <= 0) {
                clearInterval(timerInterval);
                // Si el tiempo se acaba, salto la ronda con color 'gray'
                saltarRonda("⏳ ¡Tiempo agotado! Pierdes la ronda.", true, 'gray'); 
            }
        }, 1000);
    }

    function actualizarContador() {
        contadorGlobal.textContent = `⏳ Tiempo restante: ${tiempoRestante}s`;
    }

    /**
     * Esto salta la ronda si el tiempo se acaba o la palabra no existe.
     */
    function saltarRonda(mensajePerdida, esTiempoAgotado = false, estadoPerdida) {
        mensaje.textContent = mensajePerdida;
        bloqueandoEntrada = true;
        document.removeEventListener('keyup', manejarTecladoFisico); 
        
        let celdasAColorear = [];
        for (let j = 0; j < N; j++) {
            const celda = document.getElementById(`celda-${filaActual}-${j}`);
            if (celda.textContent || esTiempoAgotado) {
                celdasAColorear.push(celda);
            }
        }

        // Animación de celdas en estado 'gray'
        celdasAColorear.forEach((celda, index) => {
             if (esTiempoAgotado) {
                 celda.textContent = ''; // Borro la letra si fue por tiempo
             }
             setTimeout(() => {
                 celda.classList.add('flip'); // Empieza el giro
                 // Pongo el color de la celda a mitad del giro
                 setTimeout(() => {
                     celda.style.backgroundColor = colorMap[estadoPerdida]; 
                     celda.style.color = 'white'; 
                     celda.style.borderColor = 'transparent'; 
                     celda.classList.remove('flip');
                     
                     if (index === celdasAColorear.length - 1) {
                         // Cuando termina la última celda, avanzo a la siguiente fila
                         bloqueandoEntrada = false;
                         filaActual++;
                         columnaActual = 0;
                         
                         if (filaActual >= maxIntentos) {
                             finalizarJuego(false); // Pierde si se acaban los intentos
                         } else {
                             document.addEventListener('keyup', manejarTecladoFisico);
                             iniciarTemporizador();
                         }
                     }
                 }, 300); // El color se aplica a los 0.3 segundos
             }, index * 300);
        });
        
        // Manejo el caso especial donde la fila estaba vacía (solo por tiempo agotado)
        if (celdasAColorear.length === 0 && (esTiempoAgotado || !mensajePerdida.includes("Palabra no existe"))) {
            bloqueandoEntrada = false;
            filaActual++;
            columnaActual = 0;
            if (filaActual >= maxIntentos) {
                finalizarJuego(false);
            } else {
                document.addEventListener('keyup', manejarTecladoFisico); 
                iniciarTemporizador();
            }
        }
    }


    // ====================================
    // GESTIÓN DE ENTRADA Y VALIDACIÓN
    // ====================================

    function agregarLetra(letra) {
        if (columnaActual < N) {
            const celda = document.getElementById(`celda-${filaActual}-${columnaActual}`);
            celda.textContent = letra;
            // Pongo el color base de la celda al escribir
            celda.style.backgroundColor = '#FFFFFF';
            celda.style.color = '#000000';
            celda.style.borderColor = 'black';
            columnaActual++;
        }
    }

    function borrarLetra() {
        if (columnaActual > 0) {
            columnaActual--;
            const celda = document.getElementById(`celda-${filaActual}-${columnaActual}`);
            celda.textContent = '';
            // Quito la letra y reseteo el color
            celda.style.backgroundColor = '#FFFFFF';
            celda.style.borderColor = 'black'; 
        }
    }

    async function manejarIntento() {
        if (!jugando || bloqueandoEntrada) return;
        
        bloqueandoEntrada = true; // Bloqueo la entrada para que no se pueda escribir
        clearInterval(timerInterval); // Paro el temporizador de la ronda
        
        const filaPalabra = [];
        for (let j = 0; j < N; j++) {
            filaPalabra.push(document.getElementById(`celda-${filaActual}-${j}`).textContent.toUpperCase());
        }
        const intento = filaPalabra.join("");

        if (intento.length !== N) {
             bloqueandoEntrada = false;
             iniciarTemporizador(); // Si no está completa, reanudo el tiempo
             return;
        }
        
        document.removeEventListener('keyup', manejarTecladoFisico); // Quitar el teclado para no escribir durante la API

        const esValida = await validarPalabraConAPI(intento); // Llamo a la función de la API

        if (!esValida) {
            // Si la API dice que no existe, pierdo la ronda
            saltarRonda("⚠️ ¡Palabra no existe en el diccionario! Pierdes la ronda.", false, 'gray');
            return;
        }

        // Si es válida, proceso para ver si hay verdes, naranjas o rojos
        procesarPistas(filaPalabra);
    }

    async function validarPalabraConAPI(palabra) {
        try {
            const url = `${API_BASE_URL}check/${palabra.toLowerCase()}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                console.warn(`API de validación respondió con estado ${response.status}`);
                return false; 
            }

            const data = await response.json();
            return data.exists;

        } catch (error) {
            console.error('Error al validar la palabra:', error);
            return false;
        }
    }
    
    /**
     * Esto calcula y pinta las pistas (verde, naranja, rojo).
     */
    function procesarPistas(fila) {
        const intento = fila.join("");
        const secretaArray = secreta.split("");
        // Empiezo asumiendo que todas son 'red'
        const resultado = Array(N).fill("red"); 
        const letrasRestantes = {};

        // 1. Busco y marco los 'green' (coincidencia perfecta)
        for (let i = 0; i < N; i++) {
            if (fila[i] === secretaArray[i]) {
                resultado[i] = "green";
                secretaArray[i] = null; // Marco la letra secreta como usada
            } else {
                const letra = secretaArray[i];
                if (letra) letrasRestantes[letra] = (letrasRestantes[letra] || 0) + 1; // Cuento las que sobran
            }
        }

        // 2. Busco y marco los 'orange' (letra correcta pero mal sitio)
        for (let i = 0; i < N; i++) {
            const letra = fila[i];
            if (resultado[i] !== "green" && letrasRestantes[letra] > 0) { 
                resultado[i] = "orange";
                letrasRestantes[letra]--;
            }
        }

        // Animación de volteo (flip) de las celdas
        for (let i = 0; i < N; i++) {
            const letra = fila[i];
            const estado = resultado[i];
            const celda = document.getElementById(`celda-${filaActual}-${i}`);
            
            actualizarEstadoTeclado(letra, estado); // Guardo el mejor estado de la letra

            setTimeout(() => {
                celda.classList.add('flip'); // Empieza el giro
                // Pongo el color a mitad del giro para que se vea bien
                setTimeout(() => {
                    celda.style.backgroundColor = colorMap[estado];
                    celda.style.color = 'white'; 
                    celda.style.borderColor = 'transparent'; 
                    celda.classList.remove('flip');
                    if (i === N - 1) bloqueandoEntrada = false; // Desbloqueo al final
                }, 300); // El color se aplica a los 0.3 segundos
            }, i * 300);
        }

        actualizarTeclado(); // Pinta el teclado con los colores actualizados
        
        // Lógica de avance/fin del juego (después de que termina la animación de la última celda)
        setTimeout(() => {
            if (intento === secreta) {
                finalizarJuego(true); // Gana
            } else if (filaActual === maxIntentos - 1) {
                finalizarJuego(false); // Pierde por intentos
            } else {
                filaActual++;
                columnaActual = 0;
                document.addEventListener('keyup', manejarTecladoFisico); // Vuelvo a activar el teclado
                iniciarTemporizador(); // Empiezo el temporizador de la nueva ronda
            }
        }, N * 300 + 50); // Espero a que termine la animación
    }
    
    /**
     * Guardo el color de la letra en el teclado (siempre gana el mejor color).
     */
    function actualizarEstadoTeclado(letra, nuevoEstado) {
        const estadoActual = estadoTeclado[letra];

        if (nuevoEstado === 'green') {
            estadoTeclado[letra] = 'green';
        } else if (nuevoEstado === 'orange' && estadoActual !== 'green') {
            estadoTeclado[letra] = 'orange';
        } else if (nuevoEstado === 'red' && estadoActual === 'default') {
            estadoTeclado[letra] = 'red';
        }
    }
    
    /**
     * Pinta el teclado virtual con los colores que he guardado.
     */
    function actualizarTeclado() {
        const botones = teclado.querySelectorAll('button[data-key]');
        
        botones.forEach(boton => {
            const key = boton.dataset.key;
            const estado = estadoTeclado[key]; // 'green', 'orange', 'red', o 'default'

            if (estado && estado !== 'default') {
                // Pongo el color que toca
                boton.style.backgroundColor = colorMap[estado];
                boton.style.color = 'white';
            } else if (estado === 'default') {
                // Reseteo al color por defecto si no ha pasado nada
                boton.style.backgroundColor = colorMap['default'];
                boton.style.color = 'white'; 
            }
        });
    }

    // ====================================
    // FINALIZACIÓN Y RANKING
    // ====================================

    function finalizarJuego(ganado) {
        jugando = false;
        clearInterval(totalInterval); // Paro el contador total
        clearInterval(timerInterval); // Paro el contador de ronda
        contadorGlobal.style.display = 'none';
        botonReiniciar.style.display = "inline-block";
        document.removeEventListener('keyup', manejarTecladoFisico); 

        let intentosUsados = filaActual + (ganado ? 1 : 0);
        let score = 0;

        // Calculo la puntuación
        if (ganado) {
            // La puntuación es: (Intentos restantes + 1) * (Tiempo total máximo - Tiempo total real)
            score = Math.max(1, Math.floor((maxIntentos - intentosUsados + 1) * (TIEMPO_LIMITE_SEGUNDOS * maxIntentos - tiempoTotal)));
            mensaje.textContent = `¡Has ganado! Has acertado en ${tiempoTotal} segundos y ${intentosUsados} intentos. Puntuación: ${score}`;
        } else {
            score = 0; 
            mensaje.textContent = `¡Has perdido! La palabra era ${secreta}. Puntuación: ${score}`;
        }

        guardarRanking(intentosUsados, tiempoTotal, score);
    }

    function guardarRanking(intentos, tiempo, score) {
        // Envio los datos al servidor para que los guarde en el ranking
        fetch('/ranking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Esto es por seguridad (para Laravel)
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
            if (data.success) console.log('Ranking guardado.');
        })
        .catch(err => console.error('Error guardando ranking:', err));
    }

    // ====================================
    // LÓGICA DEL MODAL RANKING
    // ====================================
    
    const modalRanking = document.getElementById('modal-ranking');
    const listaRanking = document.getElementById('lista-ranking');
    const cerrarRanking = document.getElementById('cerrar-ranking');
    // Busco el botón de ranking en el header o en el menú (uno de los dos debe existir)
    const botonRankingHeader = document.getElementById('btn-ranking-header') || document.getElementById('btn-ranking'); 
    const botonRankingMenu = document.getElementById('btn-ranking-menu'); 

    const cargarRanking = (e) => {
        if (e) e.preventDefault(); 
        
        // Pido la lista de ranking al servidor
        fetch('/ranking', { headers: { 'Accept': 'application/json' } })
        .then(res => {
            if (!res.ok) throw new Error('Error al cargar los datos del ranking');
            return res.json();
        })
        .then(data => {
            listaRanking.innerHTML = '';
            // Pinto los resultados en la lista
            if (Array.isArray(data)) {
                data.forEach((r, index) => {
                    const li = document.createElement('li');
                    const userName = r.user && r.user.name ? r.user.name : 'Usuario Desconocido'; 
                    li.textContent = `${index + 1}. ${userName} - Puntuación: ${r.score} - Intentos: ${r.intentos} - Tiempo: ${r.tiempo}s`;
                    listaRanking.appendChild(li);
                });
            } else {
                listaRanking.innerHTML = '<li>Error: Formato de datos de ranking no válido.</li>';
            }
            
            modalRanking.style.display = 'flex'; // Muestro la ventana modal
        })
        .catch(err => {
            console.error('Error al cargar ranking:', err);
            listaRanking.innerHTML = '<li>Error al cargar el ranking. Por favor, inténtelo de nuevo.</li>';
            modalRanking.style.display = 'flex'; 
        });
    };

    // Pongo el evento de click a los botones de ranking
    if (botonRankingHeader) {
        botonRankingHeader.addEventListener('click', cargarRanking);
    }
    if (botonRankingMenu) {
        botonRankingMenu.addEventListener('click', cargarRanking);
    }

    // Eventos para cerrar la ventana modal
    if (cerrarRanking) {
        cerrarRanking.addEventListener('click', () => modalRanking.style.display = 'none');
    }

    // Cerrar la ventana si hago click fuera
    window.addEventListener('click', (e) => {
        if (e.target === modalRanking) modalRanking.style.display = 'none';
    });
});