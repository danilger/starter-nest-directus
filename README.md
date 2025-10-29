# 🚀 Chemical Project

Fullstack приложение с NestJS backend, React frontend, Directus CMS и PostgreSQL.

> 💡 **Нужна краткая инструкция?** См. [QUICKSTART.md](QUICKSTART.md)

## 📁 Структура проекта

```
D:\projects\chemical\
├── .env                      ← ЕДИНСТВЕННЫЙ .env файл для ВСЕГО проекта!
├── .env_example              ← Шаблон с примерами переменных
├── README.md                 ← Главная документация (этот файл)
├── QUICKSTART.md             ← Краткая инструкция по запуску
├── docker-compose.yml        ← Production конфигурация
├── docker-compose.dev.yml    ← Dev конфигурация (только БД + Directus)
├── nginx/                    ← Настройки Nginx
├── server/                   ← Backend (NestJS)
│   └── README_DEV.md         ← Инструкция по разработке backend
├── frontend/                 ← Frontend (React + Vite)
├── directus/                 ← Directus CMS данные
└── postgres_data/            ← Данные PostgreSQL (не коммитить!)
```

---

## ⚡ Быстрый старт

### 🔧 Production режим (все в Docker)

#### 1. Создайте файл `.env`

```bash
cp .env_example .env
```

#### 2. **ОБЯЗАТЕЛЬНО!** Отредактируйте `.env`

⚠️ **КРИТИЧЕСКИ ВАЖНО:**

```env
# Эти значения ДОЛЖНЫ быть ОДИНАКОВЫМИ!
JWT_SECRET=ваш_секретный_ключ_минимум_32_символа
DIRECTUS_SECRET=ваш_секретный_ключ_минимум_32_символа

# Для Docker режима:
DB_HOST=postgres

# Измените на свой IP:
PUBLIC_URL=http://192.168.0.33/cms
VITE_API_URL=http://192.168.0.33/api
VITE_DIRECTUS_URL=http://192.168.0.33/cms
CORS_ORIGIN=http://localhost,http://127.0.0.1,http://192.168.0.33
```

#### 3. Запустите проект

```bash
docker-compose up -d --build
```

#### 4. Доступ к сервисам

- **Frontend**: http://192.168.0.33/
- **Backend API**: http://192.168.0.33/api/
- **Swagger API**: http://192.168.0.33/api/docs
- **Directus CMS**: http://192.168.0.33/cms/
  - Email: `admin@example.com`
  - Password: `admin1234`

---

### 🛠️ Dev режим (локальная разработка)

#### 1. Настройте `.env` для dev

```env
# В .env измените:
DB_HOST=localhost     # ← для доступа к БД снаружи Docker
NODE_ENV=development
```

#### 2. Запустите БД и Directus в Docker

```bash
# Используем dev конфигурацию (порты проброшены наружу)
docker-compose -f docker-compose.dev.yml up -d
```

Это запустит:
- ✅ PostgreSQL → доступна на `localhost:5432`
- ✅ Directus → доступен на `localhost:8055`

#### 3. Запустите Backend локально

```bash
cd server
npm install
npm run start:dev
```

**Доступ:**
- API: http://localhost:3000
- Swagger: http://localhost:3000/docs
- Подключается к БД: `localhost:5432`
- Подключается к Directus: `localhost:8055`

#### 4. Запустите Frontend локально

```bash
cd frontend
npm install
npm run dev
```

**Доступ:**
- UI: http://localhost:5173
- Подключается к API: `localhost:3000`

---

## 📝 Переменные окружения

### 🎯 **ГЛАВНОЕ ПРАВИЛО**

**Один `.env` файл в корне проекта!**

```
D:\projects\chemical\.env  ← ЕДИНСТВЕННЫЙ .env файл
```

### 🔑 **Критически важные переменные**

#### JWT токены (ОБЯЗАТЕЛЬНО ОДИНАКОВЫЕ!)

```env
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_long
DIRECTUS_SECRET=your_super_secret_jwt_key_min_32_chars_long
```

⚠️ **Если разные - аутентификация НЕ работает!**

#### Генерация безопасного ключа:

```bash
# PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})

# Linux/Mac
openssl rand -base64 32
```

### 📋 **Полный список переменных**

#### База данных (PostgreSQL)
```env
DB_HOST=postgres      # Docker: postgres, Dev: localhost
DB_PORT=5432
DB_NAME=app_db
DB_USER=postgres
DB_PASSWORD=postgres  # ← СМЕНИТЕ В ПРОДАКШЕНЕ!
```

#### Backend (NestJS)
```env
NODE_ENV=production   # или development
PORT=3000
BACKEND_PORT=3000
JWT_SECRET=...        # ← Должен совпадать с DIRECTUS_SECRET!
```

#### Directus CMS
```env
DIRECTUS_PORT=8055
DIRECTUS_KEY=...          # ← СМЕНИТЕ В ПРОДАКШЕНЕ!
DIRECTUS_SECRET=...       # ← Должен совпадать с JWT_SECRET!
PUBLIC_URL=http://192.168.0.33/cms
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=...        # ← СМЕНИТЕ В ПРОДАКШЕНЕ!

# WebSockets, CORS, Cookie настройки
WEBSOCKETS_ENABLED=true
CORS_ENABLED=true
CORS_ORIGIN=http://localhost,http://127.0.0.1,http://192.168.0.33
REFRESH_TOKEN_COOKIE_NAME=refresh_token
REFRESH_TOKEN_COOKIE_SECURE=false      # true для HTTPS
REFRESH_TOKEN_COOKIE_SAME_SITE=lax
REFRESH_TOKEN_DOMAIN=.192.168.0.33
SESSION_COOKIE_SECURE=false
SESSION_COOKIE_SAME_SITE=lax
SESSION_COOKIE_DOMAIN=.192.168.0.33
EXTENSIONS_PATH=/directus/extensions
EXTENSIONS_AUTO_RELOAD=true
```

#### Frontend (React + Vite)
```env
VITE_API_URL=http://192.168.0.33/api
VITE_DIRECTUS_URL=http://192.168.0.33/cms
```

#### Nginx
```env
NGINX_PORT=80
NGINX_SSL_PORT=443
```

---

## 🔄 Как работают переменные

### В Docker (production)

```yaml
# docker-compose.yml
services:
  backend:
    env_file:
      - .env  # ← читает из корня проекта
  
  directus:
    env_file:
      - .env  # ← тот же файл
    environment:
      DB_HOST: postgres  # ← переопределяем для Docker сети
```

### В разработке (dev)

```typescript
// server/src/app.module.ts
ConfigModule.forRoot({
  envFilePath: '../.env',  // ← читает из корня проекта
  isGlobal: true,
})
```

---

## 🔧 Полезные команды

### Production (Docker)

```bash
# Запуск всех сервисов
docker-compose up -d --build

# Просмотр статуса
docker-compose ps

# Просмотр логов
docker-compose logs -f
docker-compose logs -f backend

# Перезапуск сервиса
docker-compose restart backend

# Остановка всех контейнеров
docker-compose down

# Остановка с удалением БД (ОСТОРОЖНО!)
docker-compose down -v
```

### Dev режим

```bash
# 1. Запуск БД и Directus
docker-compose -f docker-compose.dev.yml up -d

# 2. Backend (в отдельном терминале)
cd server
npm run start:dev

# 3. Frontend (в отдельном терминале)
cd frontend
npm run dev

# Остановка dev окружения
docker-compose -f docker-compose.dev.yml down
```

### Работа с БД

```bash
# Подключение к БД
docker-compose exec postgres psql -U postgres -d app_db

# Список баз данных
docker-compose exec postgres psql -U postgres -c "\l"

# Выполнение миграций (из папки server)
npm run migration:run
```

---

## 🌐 Доступ к сервисам

### Production режим (Docker)

| Сервис | URL | Пояснение |
|--------|-----|-----------|
| Frontend | http://192.168.0.33/ | React приложение |
| Backend API | http://192.168.0.33/api/ | REST API |
| Swagger | http://192.168.0.33/api/docs | Документация API |
| Directus | http://192.168.0.33/cms/ | Админ панель CMS |

### Dev режим (локально)

| Сервис | URL | Пояснение |
|--------|-----|-----------|
| Frontend | http://localhost:5173 | Vite dev server |
| Backend | http://localhost:3000 | NestJS dev server |
| Swagger | http://localhost:3000/docs | Документация API |
| Directus | http://localhost:8055 | Через Docker |
| PostgreSQL | localhost:5432 | Через Docker |

---

## 🚫 ЧТО НЕ НУЖНО ДЕЛАТЬ

❌ НЕ создавайте `server/.env`  
❌ НЕ создавайте `frontend/.env`  
❌ НЕ создавайте `directus/.env`  
❌ НЕ коммитьте `.env` в git (уже в `.gitignore`)  
❌ НЕ используйте разные значения для `JWT_SECRET` и `DIRECTUS_SECRET`

## ✅ Что нужно делать

✅ Используйте ОДИН `.env` в корне проекта  
✅ Копируйте `.env_example` → `.env` для новых окружений  
✅ Меняйте `DB_HOST` между `postgres` (Docker) и `localhost` (dev)  
✅ `JWT_SECRET` = `DIRECTUS_SECRET` (одинаковые!)  
✅ Используйте `docker-compose.yml` для production  
✅ Используйте `docker-compose.dev.yml` для разработки

---

## 🔐 Безопасность

### Перед продакшеном обязательно измените:

1. ✅ `JWT_SECRET` и `DIRECTUS_SECRET` (минимум 32 символа, одинаковые!)
2. ✅ `DIRECTUS_KEY` (другой уникальный ключ)
3. ✅ `DB_PASSWORD` (сильный пароль)
4. ✅ `ADMIN_PASSWORD` (сильный пароль)
5. ✅ `PUBLIC_URL` (ваш реальный домен)
6. ✅ `CORS_ORIGIN` (добавьте ваш домен)
7. ✅ `*_COOKIE_DOMAIN` (ваш домен)
8. ✅ `*_COOKIE_SECURE=true` (для HTTPS)

### Настройка SSL/HTTPS

Для production с HTTPS обновите `nginx.conf` и добавьте SSL сертификаты.

---

## 🐛 Решение проблем

### Контейнер не запускается

```bash
# Просмотр логов
docker-compose logs directus

# Пересборка без кэша
docker-compose build --no-cache backend

# Полная пересборка
docker-compose down
docker-compose up -d --build
```

### Проблемы с БД в dev режиме

```bash
# Проверьте что postgres запущен
docker-compose -f docker-compose.dev.yml ps

# Проверьте подключение
docker-compose -f docker-compose.dev.yml exec postgres psql -U postgres -d app_db -c "SELECT 1"

# Убедитесь в .env:
# DB_HOST=localhost
```

### Directus unhealthy

```bash
# Проверьте логи
docker-compose logs directus --tail=50

# Перезапустите с увеличенным временем
docker-compose up -d directus

# Проверьте healthcheck вручную
docker-compose exec directus nc -z localhost 8055
```

### Swagger не открывается

**Dev режим:**
- ✅ Правильно: `http://localhost:3000/docs`
- ❌ Неправильно: `http://localhost:3000/api/docs`

**Production режим:**
- ✅ Правильно: `http://192.168.0.33/api/docs` (через Nginx)
- ❌ Неправильно: `http://192.168.0.33:3000/docs` (порт не проброшен)

---

## 📚 Дополнительная документация

### Backend миграции

```bash
cd server

# Создать миграцию
npm run migration:create

# Сгенерировать миграцию из entities
npm run migration:generate

# Выполнить миграции
npm run migration:run

# Показать статус миграций
npm run migration:show
```

---

## 🏗️ Технологии

- **Backend**: NestJS, TypeORM, PostgreSQL, Swagger
- **Frontend**: React, Vite, TypeScript
- **CMS**: Directus (headless CMS)
- **Proxy**: Nginx
- **Контейнеризация**: Docker, Docker Compose

---

## 📖 Детальные инструкции

### 🔑 Настройка JWT токенов

**КРИТИЧЕСКИ ВАЖНО:** `JWT_SECRET` и `DIRECTUS_SECRET` должны быть **ОДИНАКОВЫМИ**!

```env
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_long_change_this
DIRECTUS_SECRET=your_super_secret_jwt_key_min_32_chars_long_change_this
```

Это необходимо для корректной работы аутентификации между backend и Directus.

### 🌐 Настройка для вашего сервера

Замените `192.168.0.33` на IP/домен вашего сервера во всех переменных:

```env
PUBLIC_URL=http://ВАШ_IP/cms
CORS_ORIGIN=http://localhost,http://localhost:5173,http://127.0.0.1,http://ВАШ_IP
REFRESH_TOKEN_DOMAIN=.ВАШ_IP
SESSION_COOKIE_DOMAIN=.ВАШ_IP
VITE_API_URL=http://ВАШ_IP/api
VITE_DIRECTUS_URL=http://ВАШ_IP/cms
CONTENT_SECURITY_POLICY_DIRECTIVES__FRAME_SRC="'self' http://ВАШ_IP"
```

### 🔄 Переключение между dev и production

#### Для dev режима:

1. В `.env` установите:
   ```env
   DB_HOST=localhost
   NODE_ENV=development
   ```

2. Запустите:
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   cd server && npm run start:dev
   cd frontend && npm run dev
   ```

#### Для production:

1. В `.env` установите:
   ```env
   DB_HOST=postgres
   NODE_ENV=production
   ```

2. Запустите:
   ```bash
   docker-compose up -d --build
   ```

### 📂 Структура .env файлов

```
✅ .env (корень)              - ЕДИНСТВЕННЫЙ рабочий файл
✅ .env_example (корень)      - Шаблон для копирования
❌ server/.env                - НЕ создавать!
❌ frontend/.env              - НЕ создавать!
❌ directus/.env              - НЕ создавать!
```

### 🎯 Как работает загрузка переменных

**В Docker:**
```yaml
services:
  backend:
    env_file: - .env           # читает из корня
    environment:
      DB_HOST: postgres        # переопределяет для Docker сети
```

**В Dev (локально):**
```typescript
// server/src/app.module.ts
ConfigModule.forRoot({
  envFilePath: '../.env',      // читает из корня проекта
  isGlobal: true,
})
```

---

## 🔍 Диагностика

### Проверка статуса контейнеров

```bash
# Production
docker-compose ps

# Dev
docker-compose -f docker-compose.dev.yml ps
```

### Проверка переменных окружения

```bash
# В контейнере
docker-compose exec backend printenv | grep DB_HOST
docker-compose exec directus printenv | grep SECRET
```

### Проверка доступности сервисов

```bash
# Production
curl http://127.0.0.1/
curl http://127.0.0.1/api/
curl http://127.0.0.1/api/docs
curl http://127.0.0.1/cms/

# Dev (локально)
curl http://localhost:3000/docs
curl http://localhost:5173
curl http://localhost:8055
```

---

## ⚙️ Конфигурация для разных окружений

### Development (локальная разработка)

**Используется:** `docker-compose.dev.yml`

**Что запущено в Docker:**
- PostgreSQL (порт 5432 проброшен)
- Directus (порт 8055 проброшен)

**Что запущено локально:**
- Backend (npm run start:dev) → `localhost:3000`
- Frontend (npm run dev) → `localhost:5173`

**В `.env`:**
```env
DB_HOST=localhost
NODE_ENV=development
```

### Production (все в Docker)

**Используется:** `docker-compose.yml`

**Что запущено:**
- PostgreSQL (только внутри сети)
- Directus (только внутри сети)
- Backend (только внутри сети)
- Frontend (только внутри сети)
- Nginx (порты 80, 443 проброшены)

**В `.env`:**
```env
DB_HOST=postgres
NODE_ENV=production
```

**Доступ только через Nginx:**
- `http://192.168.0.33/` → Frontend
- `http://192.168.0.33/api/` → Backend
- `http://192.168.0.33/cms/` → Directus

---

## 📊 Сравнение режимов

| Аспект | Dev режим | Production режим |
|--------|-----------|------------------|
| **Backend** | Локально (npm) | Docker контейнер |
| **Frontend** | Локально (npm) | Docker контейнер |
| **PostgreSQL** | Docker, порт 5432 | Docker, без портов |
| **Directus** | Docker, порт 8055 | Docker, без портов |
| **Nginx** | НЕ используется | Docker, порты 80/443 |
| **DB_HOST** | `localhost` | `postgres` |
| **Hot Reload** | ✅ Да | ❌ Нет |
| **Swagger** | `localhost:3000/docs` | `IP/api/docs` |

---

## 🎓 Примеры использования

### Разработка нового функционала

```bash
# 1. Запустите dev окружение
docker-compose -f docker-compose.dev.yml up -d

# 2. Backend с hot reload
cd server
npm run start:dev

# 3. Frontend с hot reload
cd frontend
npm run dev

# 4. Разрабатывайте с автоматической перезагрузкой!
```

### Деплой на production

```bash
# 1. Обновите .env
# DB_HOST=postgres
# NODE_ENV=production
# Измените пароли и секреты!

# 2. Запустите
docker-compose up -d --build

# 3. Проверьте
docker-compose ps
docker-compose logs -f
```

### Обновление production

```bash
# 1. Остановите сервисы
docker-compose down

# 2. Обновите код (git pull)

# 3. Пересоберите и запустите
docker-compose up -d --build

# 4. Проверьте логи
docker-compose logs -f --tail=100
```

---

## 🆘 Частые проблемы

### "Cannot find module '/app/dist/main.js'"

**Причина:** Проблема со сборкой backend.

**Решение:**
```bash
docker-compose build --no-cache backend
docker-compose up -d backend
```

### "ECONNREFUSED" при подключении к БД

**Dev режим:**
- Проверьте: `DB_HOST=localhost` в `.env`
- Убедитесь: `docker-compose -f docker-compose.dev.yml ps` → postgres работает

**Production:**
- Проверьте: `DB_HOST=postgres` в `.env`
- В docker-compose должно быть `DB_HOST: postgres` в environment

### Directus падает с ошибкой CSP

**Причина:** Неправильное экранирование в `CONTENT_SECURITY_POLICY_DIRECTIVES__FRAME_SRC`.

**Решение:** Используйте двойные кавычки:
```env
CONTENT_SECURITY_POLICY_DIRECTIVES__FRAME_SRC="'self' http://192.168.0.33"
```

### Swagger 404 Not Found

**Dev:**
- ✅ Правильно: `http://localhost:3000/docs`
- ❌ Неправильно: `http://localhost:3000/api/docs`

**Production:**
- ✅ Правильно: `http://192.168.0.33/api/docs`
- ❌ Неправильно: `http://192.168.0.33:3000/docs` (порт не проброшен)

### CORS ошибки

Убедитесь что в `.env` указаны все нужные источники:
```env
CORS_ORIGIN=http://localhost,http://localhost:5173,http://127.0.0.1,http://192.168.0.33
```

И в `server/src/main.ts` CORS настроен правильно.

---

## 📝 Важные файлы проекта

- `.env` - переменные окружения (НЕ коммитить!)
- `.env_example` - шаблон переменных (коммитить)
- `docker-compose.yml` - production конфигурация
- `docker-compose.dev.yml` - dev конфигурация (только БД + Directus)
- `.gitignore` - `.env` уже добавлен
- `server/README_DEV.md` - детали по backend разработке

---

## 🎯 Чек-лист перед деплоем

- [ ] `JWT_SECRET` изменен и совпадает с `DIRECTUS_SECRET`
- [ ] `DIRECTUS_KEY` изменен
- [ ] `DB_PASSWORD` изменен
- [ ] `ADMIN_PASSWORD` изменен
- [ ] `DB_HOST=postgres` в `.env`
- [ ] `NODE_ENV=production` в `.env`
- [ ] `PUBLIC_URL` указывает на ваш домен
- [ ] `CORS_ORIGIN` включает ваш домен
- [ ] SSL сертификаты настроены (для HTTPS)
- [ ] `*_COOKIE_SECURE=true` (для HTTPS)
- [ ] Файл `.env` НЕ закоммичен в git

---

**Важно:** Файл `.env` находится в `.gitignore` и не попадет в git! Используйте `.env_example` как шаблон для новых окружений.
