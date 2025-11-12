<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a Lingo</title>
    <link rel="stylesheet" href="{{ asset('css/index.css') }}">
</head>

<body class="body-flex-col">
    <header>
        <div class="encabezado">
            <img src="{{ asset('Imagenes/logo.png') }}" alt="Logo Lingo" class="logo">
        </div>
    </header>

    <main>
        <div class="welcome-content">
            <h1>¡Bienvenido a <span style="color: var(--color-footer-nav);">Lingo</span>!</h1>
            <p>El juego de palabras más divertido para desafiar tu mente.</p>

            <div class="auth-buttons">
                @auth
                    <a href="{{ url('/lingo') }}" class="btn-reiniciar">Ir al juego</a>
                @else
                    <a href="{{ route('login') }}" class="btn-reiniciar">Iniciar sesión</a>
                    <a href="{{ route('register') }}" class="btn-reiniciar">Registrarse</a>
                @endauth
            </div>
        </div>
    </main>

    <footer>
        <div class="footer-content">
            <div class="emojis">
                <img src="{{ asset('Imagenes/discord.png') }}" alt="discord">
                <img src="{{ asset('Imagenes/x.png') }}" alt="x">
                <img src="{{ asset('Imagenes/instagram.png') }}" alt="instagram">
            </div>
            <p>© 2025 Lingo. Todos los derechos reservados.</p>
        </div>
        F
    </footer>
</body>

</html>