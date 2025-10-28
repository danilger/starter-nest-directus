# 🚀 Инструкция по запуску проекта

## 📋 Начальная настройка

### 1. Настройка переменных окружения

⚠️ **ВАЖНО:** В проекте используется **ОДИН `.env` файл в корне проекта**!

Скопируйте файл с примером переменных окружения:

```bash
cp .env_example .env
```

**НЕ создавайте** `.env` файлы в подпапках (`server/.env`, `frontend/.env` и т.д.)!

### 2. Важные настройки в `.env`

#### ⚠️ **КРИТИЧЕСКИ ВАЖНО!**

**JWT_SECRET и DIRECTUS_SECRET должны быть ОДИНАКОВЫМИ!**

```env
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_long_change_this_in_production
DIRECTUS_SECRET=your_super_secret_jwt_key_min_32_chars_long_change_this_in_production
```

Эти значения должны совпадать для корректной работы аутентификации между backend и Directus!

#### 🔐 Обязательно измените перед продакшеном:

1. **JWT_SECRET / DIRECTUS_SECRET** - секретный ключ для JWT (минимум 32 символа)
2. **DIRECTUS_KEY** - ключ для Directus
3. **DB_PASSWORD** - пароль базы данных
4. **ADMIN_PASSWORD** - пароль администратора Directus

#### 🌐 Настройка для вашего сервера:

Замените `192.168.0.33` на IP вашего сервера в следующих переменных:

```env
PUBLIC_URL=http://ВАШ_IP/cms
CORS_ORIGIN=http://localhost,http://localhost:5173,http://127.0.0.1,http://ВАШ_IP
REFRESH_TOKEN_DOMAIN=.ВАШ_IP
SESSION_COOKIE_DOMAIN=.ВАШ_IP
CONTENT_SECURITY_POLICY_DIRECTIVES__FRAME_SRC='self' http://ВАШ_IP
VITE_API_URL=http://ВАШ_IP/api
VITE_DIRECTUS_URL=http://ВАШ_IP/cms
```

### 3. Запуск проекта

```bash
# Сборка и запуск всех контейнеров
docker-compose up -d --build

# Проверка статуса контейнеров
docker-compose ps

# Просмотр логов
docker-compose logs -f

# Просмотр логов конкретного сервиса
docker-compose logs -f backend
docker-compose logs -f directus
```

### 4. Доступ к сервисам

После успешного запуска сервисы будут доступны:

- **Frontend**: http://ВАШ_IP/
- **Backend API**: http://ВАШ_IP/api/
- **Swagger API Docs**: http://ВАШ_IP/api/api
- **Directus CMS**: http://ВАШ_IP/cms/
  - Email: admin@example.com (или значение из `ADMIN_EMAIL`)
  - Password: admin1234 (или значение из `ADMIN_PASSWORD`)

### 5. Остановка проекта

```bash
# Остановка всех контейнеров
docker-compose down

# Остановка с удалением volumes (БД будет удалена!)
docker-compose down -v
```

## 🔧 Полезные команды

```bash
# Перезапуск конкретного сервиса
docker-compose restart backend

# Пересборка конкретного сервиса
docker-compose up -d --build backend

# Просмотр логов в реальном времени
docker-compose logs -f --tail=100

# Выполнение команды внутри контейнера
docker-compose exec backend sh
docker-compose exec postgres psql -U postgres -d app_db
```

## 📝 Структура переменных окружения

### База данных (PostgreSQL)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`

### Backend (NestJS)
- `NODE_ENV`, `PORT`, `BACKEND_PORT`, `JWT_SECRET`

### Directus CMS
- Все переменные с префиксом `DIRECTUS_*`
- Cookie настройки для JWT токенов
- CORS и WebSocket настройки

### Frontend (React + Vite)
- `VITE_API_URL`, `VITE_DIRECTUS_URL`

### Nginx
- `NGINX_PORT`, `NGINX_SSL_PORT`

## ⚠️ Важные замечания

1. **Никогда не коммитьте `.env` файл в git!** Файл уже добавлен в `.gitignore`
2. Используйте `.env_example` как шаблон для новых окружений
3. В продакшене используйте сильные пароли и секретные ключи
4. Для HTTPS настройте SSL сертификаты в nginx
5. JWT_SECRET и DIRECTUS_SECRET должны быть идентичными!

## 🆘 Решение проблем

### Контейнер не запускается
```bash
# Просмотр логов
docker-compose logs имя_контейнера

# Пересборка без кэша
docker-compose build --no-cache имя_контейнера
```

### Проблемы с базой данных
```bash
# Проверка подключения к БД
docker-compose exec postgres psql -U postgres -d app_db -c "SELECT 1"

# Просмотр списка баз данных
docker-compose exec postgres psql -U postgres -c "\l"
```

### Проблемы с портами
Убедитесь, что порты 80, 443, 3000, 5432, 8055 не заняты другими приложениями.

