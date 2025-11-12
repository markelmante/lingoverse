<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Lingo</title>
    <link rel="stylesheet" href="{{ asset('css/auth.css') }}">
</head>
<body>

<div class="auth-container">
    <!-- Logo grande -->
    <img src="{{ asset('Imagenes/logo.png') }}" alt="Logo Lingo" class="logo-login">

    <!-- Formulario de login -->
    <form method="POST" action="{{ route('login') }}" class="auth-form">
        @csrf
        <h1>Iniciar Sesión</h1>

        <label for="email">Correo</label>
        <input type="email" name="email" id="email" required placeholder="tu@correo.com">

        <label for="password">Contraseña</label>
        <input type="password" name="password" id="password" required placeholder="********">

        <button type="submit" class="btn-auth">Iniciar sesión</button>

        <p>¿No tienes cuenta? <a href="{{ route('register') }}">Regístrate aquí</a></p>
    </form>
</div>

<!-- Footer -->
<footer class="auth-footer">
    <div class="emojis">
        <img src="{{ asset('Imagenes/discord.png') }}" alt="discord">
        <img src="{{ asset('Imagenes/x.png') }}" alt="x">
        <img src="{{ asset('Imagenes/instagram.png') }}" alt="instagram">
    </div>
    <p>© 2025 Lingo. Todos los derechos reservados.</p>
</footer>

</body>
</html>
