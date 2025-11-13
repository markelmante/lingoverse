🧩 LINGOverse: El Desafío de Palabras🌍 Introducción al ProyectoLINGOverse es una aplicación web multijugador inspirada en Wordle, desarrollada como parte de la evaluación del módulo DWES / SSII. El objetivo es ofrecer una plataforma persistente para gestionar partidas y rankings de jugadores.La aplicación utiliza una arquitectura de microservicios con contenedores Docker, lo que garantiza un entorno de desarrollo reproducible y portátil (Stack LEMA).🛠️ Tecnologías UtilizadasCategoríaTecnologíaUsoBackend (Servidor)Laravel 10/11API RESTful, Lógica de juego, Autenticación y ORM.Frontend (Cliente)Vue.js + ViteInterfaz de usuario dinámica y experiencia de juego.Base de DatosMySQL 8.0Persistencia de datos de usuarios y rankings.ContenerizaciónDocker ComposeGestión de servicios, aislamiento y red interna.Servidor WebApache 2.4Servidor HTTP principal para el acceso web.🚀 Guía de Despliegue (Pasos Detallados)Una vez descargado el proyecto de GitHub, asegúrate de colocar la terminal en la carpeta principal del proyecto (donde se encuentra el archivo docker-compose.yml).1. Preparación de ContenedoresEjecuta los siguientes comandos en la carpeta raíz del proyecto:PasoComandoDescripción1.docker compose buildConstruye las imágenes de Docker (si se han realizado cambios en los Dockerfiles).2.docker compose up -dLevanta todos los servicios (web, db, node, phpmyadmin) en segundo plano.3.docker psComprueba que todos los contenedores estén en marcha y en estado Up.2. Configuración de la Aplicación y Base de Datos (Dentro del Contenedor Web)Accede al contenedor web (PHP-Apache) para instalar dependencias y configurar Laravel.4. Acceder al contenedor webdocker compose exec web bash
5. Instalar dependencias de Laravelcomposer install
6. Generar clave de aplicación (fallará sin .env)php artisan key:generate
Este comando fallará porque el archivo .env no existe aún.7. Crear el archivo .envSal del contenedor (exit) y crea el archivo src/.env con el siguiente contenido (asegúrate de que las credenciales coincidan con docker-compose.yml):# src/.env
APP_NAME=Lingo
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

# ======================
# BASE DE DATOS
# ======================
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=lingo_db
DB_USERNAME=markel
DB_PASSWORD=daw3

# ======================
# CONFIGURACIONES VARIAS
# ======================
LOG_CHANNEL=stack
LOG_LEVEL=debug
BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

# ======================
# FRONTEND (Vite)
# ======================
VITE_APP_URL=http://localhost:5173
Vuelve a entrar al contenedor web: docker compose exec web bash8. Volver a generar la clave de aplicaciónphp artisan key:generate
9. Aplicar las migraciones de base de datosphp artisan migrate
10. Dar permisos a las carpetas (Permisos)chmod -R 777 storage bootstrap/cache
Finalmente, sal del contenedor: exit3. Configuración DNS y Apache (Acceso por lingo.local)Para poder acceder a la aplicación desde el dominio lingo.local, se requiere configurar el Virtual Host de Apache y el archivo hosts del sistema operativo.3.1 Configuración de Apache (Dentro del contenedor web)Edita el archivo de configuración de Apache (se asume que es /etc/apache2/sites-available/lingo.conf en tu contenedor) para añadir las líneas ServerName y ServerAlias.Contenido del VirtualHost Final:<VirtualHost *:80>
# La carpeta 'public' de Laravel es la raíz de la aplicación
DocumentRoot /var/www/html/public
ServerName lingo.local
ServerAlias www.lingo.local

<Directory /var/www/html/public>
AllowOverride All
Require all granted
</Directory>

ErrorLog ${APACHE_LOG_DIR}/error.log
CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
Comandos de activación (Dentro del contenedor web):# Activa el módulo rewrite (necesario para las rutas de Laravel)
a2enmod rewrite

# Activa el sitio lingo.conf y desactiva el sitio por defecto
a2ensite lingo.conf
a2dissite 000-default.conf

# Reinicia Apache para aplicar cambios
service apache2 reload
3.2 Configuración del Archivo HOSTS (En el Sistema Operativo Host)Abre el Bloc de Notas (o editor de texto) como Administrador.Abre el archivo: C:\Windows\System32\drivers\etc\hostsAñade la siguiente línea al final del archivo:127.0.0.1 lingo.local
Ahora puedes acceder a la aplicación en tu navegador: http://lingo.local⚙️ Estructura de Red DockerTodos los contenedores están interconectados a través de la red lingo_network.ContenedorFunciónPuerto de Accesolingo-apache (web)Servidor Web y PHP80lingo-mysql (db)Base de Datos MySQL(Interno a 3306)lingo-node-vite (node)Desarrollo Frontend (Vite)5173lingo-phpmyadminInterfaz Gráfica de BD8080
