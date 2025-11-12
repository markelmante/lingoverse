<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Lingo') }}</title>

    {{-- Tu CSS personalizado debe cargarse antes de cualquier posible sobrescritura --}}
    <link rel="stylesheet" href="{{ asset('css/index.css') }}"> 

    @vite(['resources/css/app.css', 'resources/js/app.js']) 
</head>

{{-- CLAVE: body-flex-col para el Sticky Footer (sin estilo en línea) --}}
<body class="body-flex-col"> 
    
    <header>
        <div class="encabezado">
            <img src="{{ asset('Imagenes/logo.png') }}" alt="Logo Lingo" class="logo">
            <div class="iconos-derecha">
                <a href="{{ route('profile.edit') }}" title="Ir a Configuración de Perfil" class="btn-header-wrapper">
                    <img src="{{ asset('Imagenes/cuenta.png') }}" alt="Cuenta" class="cuenta">
                </a>
                <button type="button" id="btn-ranking" class="btn-ranking-header" title="Ver Ranking">
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

    {{-- CLAVE: MAIN tiene flex: 1 para crecer y empujar el footer --}}
    <main class="page-content py-4">
        {{ $slot }}
        
        {{-- Botón Volver al Juego (Aparece en las vistas que usan esta plantilla, como Perfil) --}}
        @if(Request::routeIs('profile.edit')) 
            <div class="flex justify-center mt-6">
                <a href="{{ url('/') }}" class="btn-volver-juego">
                    Volver al Juego
                </a>
            </div>
        @endif
        
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
    </footer>
</body>
</html>