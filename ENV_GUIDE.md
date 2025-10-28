# 📝 Руководство по переменным окружения

## 🎯 Главное правило

**В проекте используется ОДИН `.env` файл в корне проекта!**

```
D:\projects\chemical\.env  ← ЕДИНСТВЕННЫЙ .env файл!
```

## 📂 Как это работает

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
```

### В разработке (dev)

```typescript
// server/src/app.module.ts
ConfigModule.forRoot({
  envFilePath: '../.env',  // ← читает из корня проекта
  isGlobal: true,
})
```

## 🔑 Критически важные переменные

### JWT токены (ДОЛЖНЫ быть ОДИНАКОВЫМИ!)

```env
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_long
DIRECTUS_SECRET=your_super_secret_jwt_key_min_32_chars_long
```

⚠️ Если эти значения разные - аутентификация между backend и Directus НЕ будет работать!

### Генерация безопасного ключа

```bash
# В PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})

# В Linux/Mac
openssl rand -base64 32
```

## 📋 Полный список переменных

### База данных (PostgreSQL)
```env
DB_HOST=postgres          # В Docker: postgres, в dev: localhost
DB_PORT=5432
DB_NAME=app_db
DB_USER=postgres
DB_PASSWORD=postgres      # ← СМЕНИТЕ В ПРОДАКШЕНЕ!
```

### Backend (NestJS)
```env
NODE_ENV=production       # или development
PORT=3000
BACKEND_PORT=3000
JWT_SECRET=...            # ← Должен совпадать с DIRECTUS_SECRET!
```

### Directus CMS
```env
# Основные
DIRECTUS_PORT=8055
DIRECTUS_KEY=...          # ← СМЕНИТЕ В ПРОДАКШЕНЕ!
DIRECTUS_SECRET=...       # ← Должен совпадать с JWT_SECRET!

# URL и админ
PUBLIC_URL=http://192.168.0.33/cms
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=...        # ← СМЕНИТЕ В ПРОДАКШЕНЕ!

# WebSockets
WEBSOCKETS_ENABLED=true

# CORS
CORS_ENABLED=true
CORS_ORIGIN=http://localhost,http://127.0.0.1,http://192.168.0.33

# Cookie настройки (для JWT токенов)
REFRESH_TOKEN_COOKIE_NAME=refresh_token
REFRESH_TOKEN_COOKIE_SECURE=false      # true для HTTPS
REFRESH_TOKEN_COOKIE_SAME_SITE=lax
REFRESH_TOKEN_DOMAIN=.192.168.0.33    # Ваш домен

SESSION_COOKIE_SECURE=false            # true для HTTPS
SESSION_COOKIE_SAME_SITE=lax
SESSION_COOKIE_DOMAIN=.192.168.0.33   # Ваш домен

# Extensions
EXTENSIONS_PATH=/directus/extensions
EXTENSIONS_AUTO_RELOAD=true

# CSP
CONTENT_SECURITY_POLICY_DIRECTIVES__FRAME_SRC="'self' http://192.168.0.33"
```

### Frontend (React + Vite)
```env
VITE_API_URL=http://192.168.0.33/api
VITE_DIRECTUS_URL=http://192.168.0.33/cms
```

### Nginx
```env
NGINX_PORT=80
NGINX_SSL_PORT=443
```

## 🚫 ЧТО НЕ НУЖНО ДЕЛАТЬ

❌ НЕ создавайте `server/.env`  
❌ НЕ создавайте `frontend/.env`  
❌ НЕ создавайте `directus/.env`  
❌ НЕ коммитьте `.env` в git (уже в `.gitignore`)

## ✅ Что нужно делать

✅ Используйте ОДИН `.env` в корне: `D:\projects\chemical\.env`  
✅ Копируйте `.env_example` → `.env` для новых окружений  
✅ Меняйте настройки только в корневом `.env`  
✅ JWT_SECRET = DIRECTUS_SECRET (одинаковые!)

## 🔄 Применение изменений

После изменения `.env`:

```bash
# Пересоздайте контейнеры для применения изменений
docker-compose up -d

# Или с пересборкой
docker-compose up -d --build
```

## 📖 См. также

- [README.md](README.md) - Главная документация
- [SETUP.md](SETUP.md) - Детальная инструкция по запуску
- [server/README_DEV.md](server/README_DEV.md) - Разработка backend

