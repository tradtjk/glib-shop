# Golib Shop

Премиальная E-Commerce платформа для магазина одежды Golib Shop.

## Стек

| Слой | Технологии |
|------|------------|
| Frontend | Next.js 15+, TypeScript, Tailwind CSS 4, Framer Motion, next-intl |
| Backend | Laravel 12, PHP 8.4, JWT |
| БД | MySQL 8 |
| Storage | Cloudflare R2 |
| Уведомления | Telegram Bot API |

## Деплой на бесплатный сервер

Пошаговая инструкция (Vercel / Render + бесплатный Redis): **[docs/DEPLOY.md](docs/DEPLOY.md)**

Кратко: залейте проект на GitHub → подключите к [vercel.com](https://vercel.com) → Root Directory: `frontend` → добавьте Upstash Redis в Storage.

## Быстрый старт

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

### Backend (Docker)

1. Запустите Docker Desktop.
2. В корне проекта:

```bash
# Первый запуск — установка Laravel (если папка backend пуста)
docker run --rm -v "%cd%:/app" -w /app composer:latest create-project laravel/laravel backend

# Скопируйте API-код из backend-setup/ в backend/ (см. backend/README.md)
docker compose up -d
cd backend && docker exec golib-api composer install
docker exec golib-api php artisan migrate --seed
```

API: [http://localhost:8000/api](http://localhost:8000/api)

### Backend (локально PHP 8.4)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
php artisan migrate --seed
php artisan serve
```

## Структура

```
golibshop/
├── frontend/          # Next.js витрина + личный кабинет
├── backend/           # Laravel API + админ (Filament — позже)
├── backend-setup/     # Миграции, модели, контроллеры для копирования
└── docker-compose.yml
```

## Языки

- Витрина: русский (ru), таджикский (tj)
- Админка: русский

## Переменные окружения

См. `frontend/.env.example` и `backend-setup/.env.example`.

## Дизайн

- Основной: `#000000`
- Фон: `#FFFFFF`
- Акцент: `#00A531`
- Дополнительный: `#F5F5F5`

## Соответствие ТЗ

Подробная дорожная карта и статус модулей: [docs/ROADMAP.md](docs/ROADMAP.md)
