<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lingo</title>
    <link rel="stylesheet" href="{{ asset('css/index.css') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>

{{-- CRÍTICO: Se añade la clase para activar el Flexbox y el Sticky Footer --}}
<body class="body-flex-col"> 
    <header>
        <div class="encabezado">
            <img src="{{ asset('Imagenes/logo.png') }}" alt="Logo Lingo" class="logo">

            <div class="iconos-derecha">
                <a href="{{ route('profile.edit') }}" title="Ir a Configuración de Perfil" class="btn-header-wrapper">
                    <img src="{{ asset('Imagenes/cuenta.png') }}" alt="Cuenta" class="cuenta">
                </a>

                <button type="button" id="btn-ranking-header" class="btn-ranking-header" title="Ver Ranking">
                    <img src="{{ asset('Imagenes/estadisticas.png') }}" alt="Ranking" class="icono-ranking">
                </button>

                <form method="POST" action="{{ route('logout') }}" class="logout-form">
                    @csrf
                    <button type="submit" class="btn-logout" title="Cerrar sesión">
                        <img src="{{ asset('Imagenes/cerrarsesion.png') }}" alt="Cerrar sesión" class="icono-logout">
                    </button>
                </form>
            </div>
        </div>
    </header>

    <main>
        <div class="instrucciones" id="instrucciones">
            <h2>¡Bienvenido a Lingo!</h2>
            <p>Tu objetivo es adivinar la palabra secreta en un máximo de 5 intentos. Cada palabra que escribas debe
                tener el mismo número de letras que la palabra oculta.</p>
            <p>Después de cada intento, recibirás pistas para ayudarte:</p>
            <ul>
                <li>🟩 La letra está en el lugar correcto.</li>
                <li>🟧 La letra está en la palabra pero en otra posición.</li>
                <li>🟥 La letra no está en la palabra.</li>
            </ul>
            <p>Si introduces una palabra que no existe o se acaba el tiempo, pierdes la ronda y la fila se pondrá **gris**.</p>
            <p>Tendrás un tiempo límite para escribir cada palabra, así que ¡piensa rápido y diviértete!</p>
            <p>¿Listo para demostrar tu habilidad con las palabras? ¡Comencemos!</p>
            <button id="btn-empezar" class="btn-empezar">Empezar juego</button>
        </div>

        <div class="tablero"></div>
        <div class="teclado"></div>
        <p id="mensaje" class="mensaje"></p>
        <button id="btn-reiniciar" class="btn-reiniciar">Volver a jugar</button>
    </main>

    <div id="modal-ranking" class="modal-ranking">
        <div class="modal-content">
            <span id="cerrar-ranking" class="cerrar-ranking">&times;</span>
            <h3>Top 10 Rankings</h3>
            <ul id="lista-ranking"></ul>
        </div>
    </div>

    <script src="{{ asset('js/index.js') }}"></script>

    <footer>
        <div class="footer-content">
            <div class="emojis">
                <img src="{{ asset('Imagenes/discord.png') }}" alt="discord">
                <img src="{{ asset('Imagenes/x.png') }}" alt="x">
                <img src="{{ asset('Imagenes/instagram.png') }}" alt="instagram">
            </div>
            <p>© 2025 Lingo. Todos los derechos reservados.</p>
        </div>
    </footer>
</body>

</html>