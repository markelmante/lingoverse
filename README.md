# 🚀 Guía de Despliegue

Coloca la terminal en la carpeta raíz del proyecto (donde se encuentra `docker-compose.yml`).

---

## 1️⃣ Levantar los Contenedores

```bash
# (opcional) reconstruir imágenes si cambiaste Dockerfiles
docker compose build

# levantar servicios en segundo plano
docker compose up -d

# comprobar contenedores en marcha
docker ps
```

> Asegúrate de que los servicios `web` y `db` estén en estado *Up*.  
> Si MySQL tarda en arrancar, repite los pasos de migración más adelante.

---

## 2️⃣ Crear el Archivo `.env`

Crea el archivo `src/.env` antes de instalar dependencias o generar la clave de aplicación:

```env
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
```

---

## 3️⃣ Instalar Dependencias de Laravel y Configurar la Aplicación

```bash
# entrar al contenedor web (PHP + Apache)
docker compose exec web bash

# instalar dependencias PHP
composer install

# generar clave de aplicación
php artisan key:generate

# aplicar migraciones
php artisan migrate

# dar permisos a las carpetas necesarias
chmod -R 775 storage bootstrap/cache

# recargar Apache
service apache2 reload

# salir del contenedor
exit
```

---

## 4️⃣ Configurar el Frontend (Vite / Node)

```bash
# entrar al contenedor node
docker compose exec node bash

# instalar dependencias
npm install

# entorno de desarrollo con hot reload
npm run dev

# o compilación para producción
npm run build

# salir del contenedor
exit
```

Accede al frontend en:  
**http://localhost:5173**

---

## 5️⃣ phpMyAdmin (Opcional)

Si tu `docker-compose.yml` incluye phpMyAdmin, estará disponible en:  
**http://localhost:8080**

Usa las credenciales definidas en `.env`:

```
DB_USERNAME=markel
DB_PASSWORD=daw3
```

---

## 6️⃣ Configuración de Apache y DNS Local (`lingo.local`)

### 🧩 Configuración de Apache (Dentro del Contenedor `web`)

Edita el archivo `/etc/apache2/sites-available/lingo.conf` con el siguiente contenido:

```apache
<VirtualHost *:80>
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
```

Ejecuta estos comandos dentro del contenedor web:

```bash
a2enmod rewrite
a2ensite lingo.conf
a2dissite 000-default.conf
service apache2 reload
```

---

### 💻 Configuración del Archivo `hosts` (en el Sistema Operativo Host)

Edita el archivo:

```
C:\Windows\System32\drivers\etc\hosts
```

Y añade al final:

```
127.0.0.1 lingo.local
```

Ahora podrás acceder a la aplicación en:  
**http://lingo.local**

---

## ⚙️ Estructura de Red Docker

| Contenedor | Función | Puerto de Acceso |
|-------------|----------|------------------|
| **lingo-apache (web)** | Servidor Web y PHP | 80 |
| **lingo-mysql (db)** | Base de Datos MySQL | Interno a 3306 |
| **lingo-node-vite (node)** | Desarrollo Frontend (Vite) | 5173 |
| **lingo-phpmyadmin** | Interfaz de Base de Datos | 8080 |

---

## ✅ Resumen Rápido

```bash
docker compose build
docker compose up -d

# crear src/.env

docker compose exec web bash
composer install
php artisan key:generate
php artisan migrate
chmod -R 775 storage bootstrap/cache
exit

docker compose exec node bash
npm install
npm run dev
exit
```

Accede a la app en:  
**http://localhost** o **http://lingo.local**
