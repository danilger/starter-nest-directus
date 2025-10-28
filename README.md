# 🚀 Chemical Project

Fullstack приложение с NestJS backend, React frontend, Directus CMS и PostgreSQL.

## 📁 Структура проекта

```
D:\projects\chemical\
├── .env                    ← ВСЕ переменные окружения ЗДЕСЬ!
├── .env_example            ← Шаблон переменных
├── docker-compose.yml      ← Конфигурация Docker
├── nginx/                  ← Настройки Nginx
├── server/                 ← Backend (NestJS)
├── frontend/               ← Frontend (React + Vite)
├── directus/               ← Directus CMS данные
└── postgres_data/          ← Данные PostgreSQL
```

## ⚡ Быстрый старт

### 1. Создайте файл `.env`

```bash
cp .env_example .env
```

### 2. **ОБЯЗАТЕЛЬНО!** Отредактируйте `.env`

⚠️ **КРИТИЧЕСКИ ВАЖНО:**

```env
# Эти значения ДОЛЖНЫ быть ОДИНАКОВЫМИ!
JWT_SECRET=ваш_секретный_ключ_минимум_32_символа
DIRECTUS_SECRET=ваш_секретный_ключ_минимум_32_символа

# Измените эти значения:
DIRECTUS_KEY=другой_уникальный_ключ
DB_PASSWORD=сильный_пароль
ADMIN_PASSWORD=сильный_пароль_администратора
```

Также укажите IP вашего сервера (замените `192.168.0.33`):

```env
PUBLIC_URL=http://ВАШ_IP/cms
CORS_ORIGIN=http://localhost,http://localhost:5173,http://127.0.0.1,http://ВАШ_IP
REFRESH_TOKEN_DOMAIN=.ВАШ_IP
SESSION_COOKIE_DOMAIN=.ВАШ_IP
VITE_API_URL=http://ВАШ_IP/api
VITE_DIRECTUS_URL=http://ВАШ_IP/cms
```

### 3. Запустите проект

```bash
docker-compose up -d --build
```

### 4. Проверьте статус

```bash
docker-compose ps
```

## 🌐 Доступ к сервисам

После успешного запуска:

- **Frontend**: http://ВАШ_IP/
- **Backend API**: http://ВАШ_IP/api/
- **Swagger API Docs**: http://ВАШ_IP/api/api
- **Directus CMS**: http://ВАШ_IP/cms/
  - Email: `admin@example.com` (или из `ADMIN_EMAIL`)
  - Password: `admin1234` (или из `ADMIN_PASSWORD`)

## 🛠️ Разработка

### Backend (Dev режим)

```bash
cd server
npm install
npm run start:dev
```

Backend будет использовать переменные из **корневого `.env`** файла (`../env` относительно папки `server/`).

Подробнее: [server/README_DEV.md](server/README_DEV.md)

### Frontend (Dev режим)

```bash
cd frontend
npm install
npm run dev
```

## 📝 Важно о переменных окружения

### ✅ Правильно

- **Один `.env` файл** в корне проекта: `D:\projects\chemical\.env`
- Все сервисы берут переменные из него
- В dev режиме backend использует `envFilePath: '../.env'`
- В Docker все сервисы используют `env_file: - .env`

### ❌ НЕправильно

- ~~`server/.env`~~ - НЕ создавайте!
- ~~`frontend/.env`~~ - НЕ создавайте!
- ~~Дублирование переменных в разных файлах~~

## 🔧 Полезные команды

```bash
# Просмотр статуса
docker-compose ps

# Просмотр логов
docker-compose logs -f

# Логи конкретного сервиса
docker-compose logs -f backend
docker-compose logs -f directus

# Перезапуск сервиса
docker-compose restart backend

# Пересборка и запуск
docker-compose up -d --build

# Остановка всех контейнеров
docker-compose down

# Остановка с удалением данных БД (ОСТОРОЖНО!)
docker-compose down -v
```

## 🔐 Безопасность

### Перед продакшеном обязательно:

1. ✅ Сгенерируйте сильный `JWT_SECRET` (минимум 32 символа)
2. ✅ Используйте тот же ключ для `DIRECTUS_SECRET`
3. ✅ Смените `DIRECTUS_KEY`
4. ✅ Установите сильные пароли (`DB_PASSWORD`, `ADMIN_PASSWORD`)
5. ✅ Настройте SSL/HTTPS в nginx
6. ✅ Для HTTPS установите `*_COOKIE_SECURE=true`
7. ✅ Добавьте ваш домен в `CORS_ORIGIN`

## 🐛 Решение проблем

### Контейнер не запускается

```bash
# Просмотр логов
docker-compose logs имя_контейнера

# Пересборка без кэша
docker-compose build --no-cache имя_контейнера

# Полная пересборка
docker-compose down
docker-compose up -d --build
```

### Проблемы с базой данных

```bash
# Проверка подключения
docker-compose exec postgres psql -U postgres -d app_db -c "SELECT 1"

# Список баз данных
docker-compose exec postgres psql -U postgres -c "\l"
```

### Не работает в dev режиме

1. Убедитесь что `.env` файл в корне проекта существует
2. Проверьте что **НЕТ** файла `server/.env`
3. Перезапустите dev сервер

## 📚 Документация

- [Настройка разработки Backend](server/README_DEV.md)
- [Быстрый старт](SETUP.md)

## 🏗️ Технологии

- **Backend**: NestJS, TypeORM, PostgreSQL
- **Frontend**: React, Vite, TypeScript
- **CMS**: Directus
- **Proxy**: Nginx
- **Контейнеризация**: Docker, Docker Compose

---

**Важно:** Файл `.env` уже добавлен в `.gitignore` и не будет закоммичен в git!
