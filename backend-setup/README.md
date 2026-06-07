# Golib Shop — Backend API

После установки Laravel скопируйте содержимое `backend-setup/app`, `database`, `routes` в папку `backend/`.

## Установка

```bash
# 1. Создать Laravel (Docker)
docker run --rm -v "%cd%/../:/app" -w /app composer:latest create-project laravel/laravel backend

# 2. Скопировать файлы из backend-setup
# Windows PowerShell:
Copy-Item -Recurse -Force backend-setup\app\* backend\app\
Copy-Item -Recurse -Force backend-setup\database\* backend\database\
Copy-Item -Force backend-setup\routes\api.php backend\routes\api.php

# 3. Зависимости
cd backend
composer require tymon/jwt-auth phpoffice/phpspreadsheet
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
php artisan jwt:secret

# 4. .env
cp .env.example .env
# Настроить DB_*, TELEGRAM_BOT_TOKEN, R2_*

php artisan migrate --seed
php artisan serve
```

## API Endpoints

| Method | Path | Описание |
|--------|------|----------|
| GET | `/api/products` | Каталог с фильтрами |
| GET | `/api/products/{slug}` | Товар |
| GET | `/api/products/new` | Новинки |
| GET | `/api/products/popular` | Популярные |
| POST | `/api/orders` | Создать заказ (гость или с Bearer token) |
| POST | `/api/auth/login` | Вход по телефону + пароль |
| POST | `/api/auth/register` | Регистрация по телефону |
| GET | `/api/orders` | История (auth) |
| POST | `/api/favorites/sync` | Синхронизация избранного |

## Telegram

Заказы отправляются в Telegram с кнопками статусов. Настройте в `.env`:

```
TELEGRAM_BOT_TOKEN=
TELEGRAM_ADMIN_CHAT_ID=
TELEGRAM_MANAGER_CHAT_IDS=
```

## Админ-панель

Следующий этап: Filament PHP для Dashboard, товаров, заказов, CRM, акций.
