# Деплой Golib Shop на бесплатный сервер

Рекомендуемый вариант — **Vercel** (бесплатно, идеально для Next.js).  
Альтернатива — **Render.com** (бесплатный тариф с «засыпанием» после 15 мин простоя).

## Что будет работать после деплоя

| Функция | Статус |
|---------|--------|
| Витрина, каталог, корзина, избранное | ✅ (данные в браузере) |
| Оформление заказа, API `/api/orders` | ✅ с Redis (см. ниже) |
| Вход по телефону `/api/auth` | ✅ с Redis |
| Админка `/admin` | ✅ |

> **Важно:** на serverless без Redis заказы и пользователи **не сохраняются** между перезапусками.  
> Подключите бесплатный **Upstash Redis** (10 000 команд/день бесплатно).

---

## Вариант 1: Vercel (рекомендуется)

### Шаг 1. GitHub-репозиторий

```powershell
cd C:\Users\MUOSIR\Desktop\golibshop
git add .
git commit -m "Prepare Golib Shop for deployment"
```

Создайте репозиторий на [github.com/new](https://github.com/new) и выполните:

```powershell
git remote add origin https://github.com/ВАШ_ЛОГИН/golibshop.git
git branch -M main
git push -u origin main
```

### Шаг 2. Vercel

1. Откройте [vercel.com](https://vercel.com) → **Sign Up** (через GitHub).
2. **Add New Project** → выберите репозиторий `golibshop`.
3. **Root Directory** → `frontend` → **Edit** → укажите `frontend`.
4. **Framework Preset** — Next.js (определится автоматически).
5. **Environment Variables**:
   - `NEXT_PUBLIC_SITE_URL` = `https://ваш-проект.vercel.app`
6. Нажмите **Deploy**.

### Шаг 3. Redis для заказов (бесплатно)

1. В проекте Vercel: **Storage** → **Create Database** → **Upstash Redis** → **Free**.
2. Подключите к проекту — переменные `UPSTASH_REDIS_REST_URL` и `UPSTASH_REDIS_REST_TOKEN` добавятся сами.
3. **Redeploy** проект (Deployments → ⋯ → Redeploy).

### Шаг 4. Проверка

- Сайт: `https://ваш-проект.vercel.app/ru`
- Админка: `https://ваш-проект.vercel.app/admin`
- API: `https://ваш-проект.vercel.app/api/orders`

### Деплой из терминала (без GitHub)

```powershell
cd C:\Users\MUOSIR\Desktop\golibshop\frontend
vercel login
vercel
```

Следуйте подсказкам. Root directory уже `frontend`.

---

## Вариант 2: Render.com

1. [render.com](https://render.com) → Sign Up.
2. **New** → **Blueprint** → подключите GitHub-репозиторий.
3. Render подхватит `render.yaml` из корня проекта.
4. В **Environment** добавьте:
   - `NEXT_PUBLIC_SITE_URL` = URL сервиса Render
   - `UPSTASH_REDIS_REST_URL` и `UPSTASH_REDIS_REST_TOKEN` (с [upstash.com](https://upstash.com))
5. **Create**.

Минус бесплатного тарифа: сервер «засыпает» после 15 мин без посетителей, первый запрос ~30–60 сек.

---

## Переменные окружения

| Переменная | Обязательно | Описание |
|------------|-------------|----------|
| `NEXT_PUBLIC_SITE_URL` | Да (прод) | URL сайта для SEO и ссылок |
| `UPSTASH_REDIS_REST_URL` | Для заказов | Redis (бесплатный Upstash) |
| `UPSTASH_REDIS_REST_TOKEN` | Для заказов | Токен Redis |
| `NEXT_PUBLIC_API_URL` | Нет | По умолчанию `/api` на том же домене |
| `NEXT_PUBLIC_GA_ID` | Нет | Google Analytics |

---

## Свой домен (опционально)

**Vercel:** Project → Settings → Domains → добавьте домен и настройте DNS (CNAME).

**Render:** Settings → Custom Domains.

---

## Laravel backend (позже)

Сейчас API встроен в Next.js (`frontend/src/app/api/`).  
Для полноценного Laravel + MySQL нужен платный VPS или Railway/Render с MySQL.  
Инструкция по Laravel — в `backend-setup/README.md`.
