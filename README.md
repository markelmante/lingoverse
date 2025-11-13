🧩 LINGOverse: El Desafío de Palabras

🌍 Introducción al Proyecto

LINGOverse es una aplicación web inspirada en el popular juego Wordle, desarrollada como parte de la evaluación del módulo DWES / SSII. El objetivo es ofrecer una plataforma multijugador y persistente para gestionar partidas y rankings de jugadores.

La aplicación está construida utilizando una arquitectura de microservicios con contenedores Docker, lo que garantiza un entorno de desarrollo reproducible y portátil (Stack LEMA).

🛠️ Tecnologías Utilizadas

Categoría

Tecnología

Uso

Backend (Servidor)

Laravel 10/11

API RESTful, Lógica de juego, Autenticación y ORM.

Frontend (Cliente)

Vue.js + Vite

Interfaz de usuario dinámica y experiencia de juego.

Base de Datos

MySQL 8.0

Persistencia de datos de usuarios y rankings.

Contenerización

Docker Compose

Gestión de servicios, aislamiento y red interna.

Servidor Web

Apache 2.4

Servidor HTTP principal para el acceso web.

🚀 Guía de Despliegue (Levantar el Entorno)

Para poner en marcha la aplicación, es necesario tener instalado Docker Desktop (con WSL2 en Windows) y Git.

1. Clonar el Repositorio y Estructura

Clona el proyecto y asegúrate de tener la siguiente estructura de carpetas:

.
├── src/                  # Contiene la aplicación Laravel completa (Backend + Frontend)
├── docker/               # Contiene los Dockerfiles personalizados (ej. para PHP-Apache)
└── docker-compose.yml    # Define todos los servicios (web, db, node, phpmyadmin)


2. Configuración de Variables de Entorno

Antes de iniciar, copia el archivo de variables de entorno de ejemplo en la carpeta src y configúralo.

# Navega a la carpeta de la aplicación
cd src
# Copia el archivo de ejemplo
cp .env.example .env


Asegúrate de que las credenciales de la base de datos en src/.env coincidan con las definidas en docker-compose.yml:

# src/.env
DB_CONNECTION=mysql
DB_HOST=db             # Nombre del contenedor MySQL
DB_PORT=3306
DB_DATABASE=lingo_db   # Coincide con MYSQL_DATABASE en docker-compose
DB_USERNAME=markel     # Coincide con MYSQL_USER en docker-compose
DB_PASSWORD=daw3       # Coincide con MYSQL_PASSWORD en docker-compose


3. Ejecución de Contenedores

Levanta todos los servicios utilizando Docker Compose:

# Ejecuta en la carpeta raíz del proyecto (donde está docker-compose.yml)
docker compose up -d


4. Instalación de Dependencias y Preparación de la BD

Una vez que los contenedores están activos, debes instalar las dependencias de Composer (Laravel) y Node (Frontend) y preparar la base de datos.

# 1. Accede al contenedor PHP (web)
docker exec -it lingo-apache bash

# 2. Instala las dependencias de PHP (Laravel)
composer install

# 3. Genera la clave de aplicación
php artisan key:generate

# 4. Ejecuta las migraciones y seeders (para cargar el diccionario y usuarios iniciales)
php artisan migrate --seed

# 5. Sal del contenedor
exit


Nota de Frontend: Las dependencias de Node (npm install) se deben instalar una única vez manualmente dentro del contenedor node o en el host antes de la primera ejecución, ya que el docker-compose solo ejecuta npm run dev.

5. Acceso a la Aplicación

La aplicación es accesible de dos formas:

Aplicación Principal: Accede a través del dominio configurado en el archivo hosts del sistema:
➡️ http://lingo.local

Gestor de Base de Datos: Accede a phpMyAdmin para gestionar lingo_db:
➡️ http://localhost:8080

⚙️ Estructura de Red Docker

Todos los contenedores están interconectados a través de la red lingo_network.

Contenedor

Función

Puerto de Acceso

lingo-apache (web)

Servidor Web y PHP

80

lingo-mysql (db)

Base de Datos MySQL

(Interno a 3306)

lingo-node-vite (node)

Desarrollo Frontend (Vite)

5173

lingo-phpmyadmin

Interfaz Gráfica de BD

8080
