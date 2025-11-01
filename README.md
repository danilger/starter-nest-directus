# 🚀 Chemical Project

Fullstack приложение с NestJS backend, React frontend, Directus CMS и PostgreSQL.

## 📁 Структура проекта

```
chemical/
├── .env                      ← ЕДИНСТВЕННЫЙ .env файл!
├── .env_example              ← Шаблон
├── docker-compose.yml        ← Production (все в Docker)
├── docker-compose.dev.yml    ← Dev (БД + Directus в Docker)
├── nginx/                    ← Reverse proxy
├── server/                   ← Backend (NestJS + TypeORM)
├── frontend/                 ← Frontend (React + Vite)
├── directus/                 ← Directus CMS данные
└── postgres_data/            ← PostgreSQL данные (НЕ коммитить!)
```

---

## ⚡ Быстрый старт

### 🏭 Production (все в Docker)

```bash
# 1. Создайте .env
cp .env_example .env

# 2. Отредактируйте .env
# - JWT_SECRET = DIRECTUS_SECRET (ОБЯЗАТЕЛЬНО одинаковые!)
# - Измените пароли
# - Укажите ваш IP/домен

# 3. Запустите
docker-compose up -d --build

# 4. Доступ
# Frontend:  http://localhost/
# Backend:   http://localhost/api/
# Swagger:   http://localhost/api/docs
# Directus:  http://localhost/cms/
```

### 🛠️ Development (с hot reload)

```bash
# 1. Создайте .env (DB_HOST автоматически переключится на DB_HOST_DEV при NODE_ENV=development)
cp .env_example .env

# 2. Запустите БД и Directus в Docker
docker-compose -f docker-compose.dev.yml up -d

# 3. Backend (терминал 1)
cd server
npm install
npm run start:dev
# → http://localhost:3000/docs

# 4. Frontend (терминал 2)
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## 🔑 Критически важные переменные

### .env файл (ОДИН на весь проект!)

```env
# ============================================
# ОБЯЗАТЕЛЬНО ОДИНАКОВЫЕ!
# ============================================
JWT_SECRET=минимум_32_символа_измените_в_продакшене
DIRECTUS_SECRET=минимум_32_символа_измените_в_продакшене

# ============================================
# База данных (автоматическое переключение через NODE_ENV)
# ============================================
DB_HOST=postgres          # Для production (NODE_ENV=production)
DB_HOST_DEV=localhost     # Для dev режима (NODE_ENV=development)
DB_PORT=5432
DB_NAME=app_db
DB_USER=postgres
DB_PASSWORD=postgres      # ← СМЕНИТЕ!

# ============================================
# Backend
# ============================================
BACKEND_PORT=3000
PORT=3000

# ============================================
# Directus
# ============================================
DIRECTUS_PORT=8055
DIRECTUS_KEY=superkey     # ← СМЕНИТЕ!
PUBLIC_URL=http://localhost:8055/cms
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin1234  # ← СМЕНИТЕ!

WEBSOCKETS_ENABLED=true
CORS_ENABLED=true
CORS_ORIGIN=http://localhost,http://localhost:3000,http://localhost:5173

# Cookie настройки
REFRESH_TOKEN_COOKIE_SECURE=false
REFRESH_TOKEN_COOKIE_SAME_SITE=lax
REFRESH_TOKEN_DOMAIN=localhost

SESSION_COOKIE_SECURE=false
SESSION_COOKIE_SAME_SITE=lax
SESSION_COOKIE_DOMAIN=localhost

# ============================================
# Frontend
# ============================================
VITE_API_URL=http://localhost/api                # Production
VITE_API_URL_DEV=http://localhost:3000           # Dev
VITE_DIRECTUS_URL=http://localhost/cms           # Production
VITE_DIRECTUS_URL_DEV=http://localhost:8055      # Dev

# ============================================
# Nginx
# ============================================
NGINX_PORT=80
NGINX_SSL_PORT=443
```

### Генерация безопасного ключа

```powershell
# PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})

# Linux/Mac
openssl rand -base64 32
```

---

## 🔧 Полезные команды

### Production

```bash
# Запуск
docker-compose up -d --build

# Статус
docker-compose ps

# Логи
docker-compose logs -f
docker-compose logs -f backend

# Перезапуск сервиса
docker-compose restart backend

# Остановка
docker-compose down

# Остановка + удаление БД (ОСТОРОЖНО!)
docker-compose down -v

# Пересборка контейнера
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

### Development

```bash
# Запуск БД + Directus
docker-compose -f docker-compose.dev.yml up -d

# Остановка
docker-compose -f docker-compose.dev.yml down

# Backend
cd server
npm run start:dev        # с hot reload
npm run start:debug      # с debugger

# Frontend
cd frontend
npm run dev              # dev сервер
npm run build            # production сборка
```

### База данных

```bash
# Подключение к БД
docker-compose exec postgres psql -U postgres -d app_db

# Список баз
docker-compose exec postgres psql -U postgres -c "\l"
```

### Миграции (из папки server/)

```bash
# Создать пустую миграцию
npm run migration:create

# Автогенерация из entities
npm run migration:generate

# Выполнить миграции
npm run migration:run

# Показать статус
npm run migration:show
```

---

## 🌐 Доступ к сервисам

### Production (Docker)

| Сервис | URL | Логин |
|--------|-----|-------|
| Frontend | http://localhost/ | - |
| Backend API | http://localhost/api/ | - |
| Swagger | http://localhost/api/docs | - |
| Directus | http://localhost/cms/ | admin@example.com / admin1234 |

### Dev (локально)

| Сервис | URL | Порт |
|--------|-----|------|
| Frontend | http://localhost:5173 | Vite dev |
| Backend | http://localhost:3000 | NestJS dev |
| Swagger | http://localhost:3000/docs | - |
| Directus | http://localhost:8055 | Docker |
| PostgreSQL | localhost:5432 | Docker |

---

## 🐛 Решение проблем

### Контейнер не запускается

```bash
# Просмотр логов
docker-compose logs backend

# Пересборка без кэша
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Ошибка подключения к БД

**Dev режим:**
- В `.env` должно быть: `DB_HOST_DEV=localhost` (переключение автоматическое через `NODE_ENV`)
- Убедитесь PostgreSQL запущен: `docker-compose -f docker-compose.dev.yml ps`

**Production:**
- В `.env` должно быть: `DB_HOST=postgres` (используется при `NODE_ENV=production`)
- Проверьте логи: `docker-compose logs postgres`

### Frontend показывает старую версию

```bash
# Удалить volume и пересобрать
docker-compose down
docker volume rm chemical_frontend-dist
docker-compose build --no-cache frontend
docker-compose up -d
```

### Миграции не находят БД

В `server/database/data-source.ts` автоматическое переключение уже настроено:
```typescript
host: process.env.NODE_ENV === 'production' 
  ? process.env.DB_HOST        // postgres в Docker
  : process.env.DB_HOST_DEV    // localhost для dev
```

Убедитесь, что в `.env` указаны обе переменные:
- `DB_HOST=postgres`
- `DB_HOST_DEV=localhost`

### Directus unhealthy

```bash
# Проверьте логи
docker-compose logs directus --tail=50

# Перезапуск
docker-compose restart directus

# Проверка healthcheck
docker-compose exec directus nc -z 0.0.0.0 8055
```

---

## 🔐 Чек-лист перед продакшеном

- [ ] `JWT_SECRET` = `DIRECTUS_SECRET` (одинаковые, минимум 32 символа)
- [ ] `DIRECTUS_KEY` изменен
- [ ] `DB_PASSWORD` изменен
- [ ] `ADMIN_PASSWORD` изменен
- [ ] `DB_HOST=postgres` и `DB_HOST_DEV=localhost` в `.env` (переключение автоматическое!)
- [ ] `PUBLIC_URL` указывает на ваш домен
- [ ] `CORS_ORIGIN` включает ваш домен
- [ ] `VITE_API_URL` и `VITE_DIRECTUS_URL` указывают на ваш домен
- [ ] SSL сертификаты настроены (для HTTPS)
- [ ] `*_COOKIE_SECURE=true` (для HTTPS)
- [ ] Файл `.env` НЕ закоммичен в git

---

## ❌ НЕ делайте

- ❌ НЕ создавайте `server/.env`, `frontend/.env`, `directus/.env`
- ❌ НЕ коммитьте `.env` в git
- ❌ НЕ используйте разные `JWT_SECRET` и `DIRECTUS_SECRET`
- ❌ НЕ меняйте вручную `DB_HOST` в `.env` между режимами (это происходит автоматически!)

## ✅ Делайте

- ✅ Один `.env` в корне проекта
- ✅ `JWT_SECRET` = `DIRECTUS_SECRET`
- ✅ В `.env` держите: `DB_HOST=postgres` и `DB_HOST_DEV=localhost`
- ✅ Переключение между dev/prod происходит автоматически через `NODE_ENV`
- ✅ `docker-compose.yml` для production (устанавливает `NODE_ENV=production`)
- ✅ `docker-compose.dev.yml` для разработки (локально `NODE_ENV=development`)
- ✅ Копируйте `.env_example` → `.env` для новых окружений

---

## 🏗️ Технологии

- **Backend**: NestJS, TypeORM, PostgreSQL, Swagger
- **Frontend**: React, Vite, TypeScript
- **CMS**: Directus (headless CMS)
- **Proxy**: Nginx
- **Контейнеризация**: Docker, Docker Compose

---

## 📊 Сравнение режимов

| | Dev | Production |
|---|-----|------------|
| **Backend** | Локально (npm) | Docker |
| **Frontend** | Локально (npm) | Docker |
| **PostgreSQL** | Docker, порт 5432 | Docker, внутренняя сеть |
| **Directus** | Docker, порт 8055 | Docker, внутренняя сеть |
| **Nginx** | Не используется | Docker, порты 80/443 |
| **NODE_ENV** | development | production |
| **DB_HOST** | DB_HOST_DEV (localhost) | DB_HOST (postgres) |
| **Hot Reload** | ✅ Да | ❌ Нет |

---

**⚠️ Файл `.env` в `.gitignore` и не попадет в git!**
