<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lingo</title>
    <link rel="stylesheet" href="{{ asset('css/index.css') }}">
</head>

<body>
    <header>
        <div class="encabezado">
            <img src="{{ asset('Imagenes/logo.png') }}" alt="Logo Lingo" class="logo">

            <div class="iconos-derecha">
                <img src="{{ asset('Imagenes/cuenta.png') }}" alt="Cuenta" class="cuenta">
                <form method="POST" action="{{ route('logout') }}" class="logout-form">
                    @csrf
                    <button type="submit" class="btn-logout" title="Cerrar sesión">
                        <img src="{{ asset('Imagenes/cerrarsesion.png') }}" alt="Cerrar sesión" class="icono-logout">
                    </button>
                </form>
            </div>
        </div>

        <div class="menu-container">
            <div class="menu-toggle">&#9776;</div>
        </div>

        <nav class="nav-menu">
            <ul>
                <li><a href="#"><img src="{{ asset('Imagenes/inicio.png') }}" alt=""> Inicio</a></li>
                <li><a href="#"><img src="{{ asset('Imagenes/jugar.png') }}" alt=""> Jugar</a></li>
                <li><a href="#"><img src="{{ asset('Imagenes/estadisticas.png') }}" alt=""> Estadísticas</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <div class="tablero"></div>
        <div class="teclado"></div>
        <p id="mensaje" class="mensaje"></p>
        <button id="btn-reiniciar" class="btn-reiniciar">Volver a jugar</button>
    </main>

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