<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro - Lingo</title>
    <link rel="stylesheet" href="{{ asset('css/auth.css') }}">
</head>
<body>

<div class="auth-container">
    <!-- Logo grande -->
    <img src="{{ asset('Imagenes/logo.png') }}" alt="Logo Lingo" class="logo-login">

    <!-- Formulario de registro -->
    <form method="POST" action="{{ route('register') }}" class="auth-form">
        @csrf
        <h1>Crear Cuenta</h1>

        <label for="name">Nombre</label>
        <input type="text" name="name" id="name" required placeholder="Tu nombre">

        <label for="email">Correo</label>
        <input type="email" name="email" id="email" required placeholder="tu@correo.com">

        <label for="password">Contraseña</label>
        <input type="password" name="password" id="password" required placeholder="********">

        <label for="password_confirmation">Confirmar Contraseña</label>
        <input type="password" name="password_confirmation" id="password_confirmation" required placeholder="********">

        <button type="submit" class="btn-auth">Registrarse</button>

        <p>¿Ya tienes cuenta? <a href="{{ route('login') }}">Inicia sesión aquí</a></p>
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
