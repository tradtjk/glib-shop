# Golib Shop — дорожная карта

## Готово (MVP витрина)

- Next.js 15 + TypeScript + Tailwind + Framer Motion + next-intl (RU/TJ)
- Главная: hero со слайдером и видео, категории, новинки, популярное, reels, отзывы, блок магазина
- Каталог: поиск, фильтры (категория, цена, размер, цвет, наличие), сортировка, пагинация
- Карточка товара: галерея, видео, zoom-hover, WOW-метрики, подбор размера, QR, похожие
- Корзина с промокодом `GOLIB10`, сохранение в localStorage (Zustand persist)
- Оформление заказа + экран подтверждения
- Личный кабинет: вход/регистрация, профиль, заказы, избранное, адреса, настройки
- SEO: sitemap, robots.txt, OG metadata, Schema.org
- Аналитика: Google Analytics + Meta Pixel (через env)
- Backend-setup: миграции MySQL, модели, API routes, TelegramService

## Следующий этап

1. **Laravel 12 API** — развернуть `backend/`, скопировать `backend-setup/`, JWT, подключить R2
2. **Интеграция frontend ↔ API** — заменить mock-data на `lib/api.ts`
3. **Telegram Bot** — webhook статусов заказа (кнопки из ТЗ)
4. **Админ-панель (RU)** — Filament или custom: dashboard, товары, заказы, клиенты, акции
5. **CRM** — сегменты клиентов (новый / постоянный / VIP)
6. **Рассылки** — Telegram, SMS, Email, Push
7. **Безопасность** — rate limit, CSRF, bot protection, audit log, backups

## Запуск

```bash
cd frontend && npm install && npm run dev
docker compose up -d   # MySQL + API (после установки Laravel в backend/)
```
