# 📋 Структура переменных окружения проекта

## ✅ ТЕКУЩАЯ СТРУКТУРА (после настройки)

```
D:\projects\chemical\
├── .env                    ← ЕДИНСТВЕННЫЙ .env файл для ВСЕГО проекта!
├── .env_example            ← Шаблон с примерами
├── .gitignore              ← .env уже добавлен (не попадет в git)
│
├── server/
│   ├── src/
│   │   └── app.module.ts   ← читает ../env (из корня)
│   └── (НЕТ .env файла!)
│
├── frontend/
│   └── (НЕТ .env файла!)
│
└── docker-compose.yml      ← все сервисы используют env_file: .env
```

## 🔄 Как работают переменные

### 1. В Docker Compose (production)

```yaml
services:
  backend:
    env_file:
      - .env          # ← читает из корня проекта
  
  directus:
    env_file:
      - .env          # ← тот же файл
  
  postgres:
    environment:
      POSTGRES_USER: ${DB_USER}    # ← берет из .env
      POSTGRES_PASSWORD: ${DB_PASSWORD}
```

### 2. В разработке (dev режим)

```typescript
// server/src/app.module.ts
ConfigModule.forRoot({
  envFilePath: '../.env',   // ← читает из корня проекта
  isGlobal: true,
})
```

## 🔑 Критически важные переменные

### JWT токены (ОБЯЗАТЕЛЬНО ОДИНАКОВЫЕ!)

```env
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_long
DIRECTUS_SECRET=your_super_secret_jwt_key_min_32_chars_long
```

⚠️ **Эти значения ДОЛЖНЫ совпадать!** Иначе аутентификация между backend и Directus не работает.

## 📦 Что изменено

### Было (неправильно):
- ❌ Разные `.env` файлы в разных папках
- ❌ Backend использовал `env_file: .env` в docker-compose
- ❌ Дублирование переменных
- ❌ Путаница с настройками

### Стало (правильно):
- ✅ **ОДИН** `.env` файл в корне проекта
- ✅ Backend: `env_file: - .env` в docker-compose
- ✅ Directus: `env_file: - .env` в docker-compose  
- ✅ Dev режим: `envFilePath: '../.env'` в app.module.ts
- ✅ Все переменные в одном месте
- ✅ `JWT_SECRET = DIRECTUS_SECRET`

## 🎯 Быстрая проверка

```bash
# 1. Проверить что .env в корне
Test-Path .env
# → должно быть True

# 2. Проверить что НЕТ .env в подпапках
Test-Path server/.env
# → должно быть False

Test-Path frontend/.env
# → должно быть False

# 3. Проверить что переменные загружены в контейнеры
docker-compose exec backend printenv | Select-String JWT_SECRET
docker-compose exec directus printenv | Select-String DIRECTUS_SECRET
```

## 📝 Использование

### Создание .env для нового окружения

```bash
# 1. Скопируйте шаблон
cp .env_example .env

# 2. Отредактируйте .env
# - Измените JWT_SECRET и DIRECTUS_SECRET (одинаковые!)
# - Измените пароли
# - Укажите IP вашего сервера

# 3. Запустите
docker-compose up -d --build
```

### Обновление переменных

```bash
# 1. Отредактируйте .env в корне проекта
nano .env  # или любой редактор

# 2. Пересоздайте контейнеры
docker-compose up -d

# Или с пересборкой (если менялся код)
docker-compose up -d --build
```

## 📚 Документация

- [README.md](README.md) - Главная документация проекта
- [SETUP.md](SETUP.md) - Детальная инструкция по запуску
- [ENV_GUIDE.md](ENV_GUIDE.md) - Руководство по переменным
- [server/README_DEV.md](server/README_DEV.md) - Dev режим backend

## ✨ Итог

Теперь у вас:
- ✅ Один `.env` файл для всего проекта
- ✅ Работает в Docker
- ✅ Работает в dev режиме
- ✅ JWT токены синхронизированы
- ✅ Нет дублирования настроек
- ✅ Легко управлять переменными

