# Directus CMS

**Directus** — это headless CMS (система управления контентом без интерфейса) с открытым исходным кодом, которая предоставляет REST API и GraphQL API для управления данными.

## Описание сервиса

- **Версия**: Directus 11.6.1
- **Порт**: 8055 (настраивается через переменную `DIRECTUS_PORT`)
- **База данных**: PostgreSQL (использует базу данных из Server)
- **Контейнеризация**: Docker
- **Режим работы**: Админка для NestJS приложения

## Возможности

- 📊 **Управление данными** — создание и редактирование коллекций, полей, связей
- 👥 **Аутентификация** — система пользователей и ролей
- 📡 **API** — REST и GraphQL API из коробки
- 🎛️ **Админ-панель** — веб-интерфейс для управления контентом
- 🔌 **Расширения** — кастомные расширения и модули
- 📁 **Файлы** — загрузка и управление медиафайлами
- 🔄 **Схема БД** — версионирование структуры базы данных

## Архитектура проекта

```
starter/
├── server/                    # NestJS Backend
│   ├── docker-compose.yml    # PostgreSQL контейнер
│   ├── database/
│   │   └── postgres/         # Данные PostgreSQL (volume)
│   └── ...
├── directus/                 # Directus CMS (Админка)
│   ├── docker-compose.yaml  # Directus контейнер
│   ├── .env                 # Переменные окружения
│   ├── migrations/          # Файлы схемы БД
│   ├── extensions/          # Кастомные расширения
│   ├── uploads/             # Загруженные файлы
│   └── README.md            # Документация
└── ...
```

## Принцип работы

1. **Server (NestJS)** - основной backend с PostgreSQL в Docker
2. **Directus** - админка, подключается к базе Server
3. **Общая база данных** - Directus создает свои таблицы в базе Server
4. **Volume в git** - данные БД сохраняются в `../server/database/postgres/`

## 🚀 Быстрый запуск

```bash
# 1. Запуск базы данных
cd ../server
docker-compose up -d

# 2. Запуск Directus
cd ../directus
docker-compose up -d

# 3. Запуск NestJS (опционально)
cd ../server
npm install
npm run start:dev
```

## Быстрый старт

### 1. Запуск базы данных PostgreSQL

```bash
# Перейти в папку server
cd ../server

# Запуск PostgreSQL
docker-compose up -d

# Проверка статуса
docker-compose ps
```

### 2. Настройка переменных окружения Directus

Создайте файл `.env` с настройками:

```env
# Порт Directus
DIRECTUS_PORT=8055

# Секретный ключ
DIRECTUS_SECRET=your-secret-key

# Настройки базы данных (подключение к Server)
DB_HOST=host.docker.internal
DB_PORT=5433
DB_DATABASE=postgres
DB_USER=postgres
DB_PASSWORD=postgres

# Админские данные
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# WebSocket настройки
WEBSOCKETS_ENABLED=true

# URL приложения
PUBLIC_URL=http://localhost:8055

# CORS настройки
CORS_ENABLED=true
CORS_ORIGIN=http://localhost:3000

# Cookie настройки
REFRESH_TOKEN_COOKIE_SECURE=false
REFRESH_TOKEN_COOKIE_SAME_SITE=lax
REFRESH_TOKEN_COOKIE_DOMAIN=localhost

SESSION_COOKIE_SECURE=false
SESSION_COOKIE_SAME_SITE=lax
SESSION_COOKIE_DOMAIN=localhost

# Расширения
EXTENSIONS_PATH=/directus/extensions
EXTENSIONS_AUTO_RELOAD=true

# CSP настройки
CONTENT_SECURITY_POLICY_DIRECTIVES__FRAME_SRC=*
```

### 3. Запуск Directus

```bash
# Запуск Directus (подключается к базе Server)
docker-compose up -d

# Запуск с выводом логов
docker-compose up

# Остановка
docker-compose down
```

### 4. Запуск NestJS сервера (опционально)

```bash
# Перейти в папку server
cd ../server

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run start:dev

# Доступ к API: http://localhost:5000
```

### 3. Доступ к сервису

- **Админ-панель**: http://localhost:8055
- **API**: http://localhost:8055/items/
- **GraphQL**: http://localhost:8055/graphql

## Миграции схемы (Directus 11.6.1)

### Стандартные команды CLI

```bash
# Войти в контейнер
docker exec -it directus-cms-template-directus-1 sh

# Создание снимка схемы
npx directus schema snapshot ./migrations/schema.yaml

# Применение миграции
npx directus schema apply ./migrations/schema.yaml

# Сравнение схем
npx directus schema diff ./migrations/schema.yaml
```

### Инициализация базы данных

```bash
# Войти в контейнер
docker exec -it directus-cms-template-directus-1 sh

# Установить/обновить схему БД
npx directus database install

# Bootstrap (полная инициализация)
npx directus bootstrap
```

### Что сохраняется в снимке схемы

- ✅ **Структура БД**: таблицы, поля, связи, индексы
- ✅ **Настройки коллекций**: типы полей, валидация, интерфейсы
- ✅ **Роли и разрешения**: права доступа к коллекциям и полям
- ✅ **Настройки проекта**: конфигурация Directus
- ❌ **Пользовательские данные**: содержимое коллекций
- ❌ **Файлы**: загруженные медиафайлы

### База данных как Volume

Directus использует базу данных Server (PostgreSQL), которая работает как Docker volume и сохраняется в папке `../server/database/postgres/`. Это означает:

- ✅ **Все данные сохраняются** в файловой системе проекта
- ✅ **Можно коммитить в git** (кроме больших файлов)
- ✅ **Простое копирование** между средами
- ✅ **Автоматическое сохранение** всех изменений
- ✅ **Настройки Directus** сохраняются в таблицах базы данных

### Структура данных

```
server/
├── docker-compose.yml    # Конфигурация PostgreSQL
└── database/
    └── postgres/         # PostgreSQL данные (volume)
        ├── base/         # Основные данные БД
        ├── pg_wal/      # WAL файлы
        └── ...          # Другие файлы PostgreSQL
```

### Таблицы Directus в базе Server

Directus создает свои таблицы в базе данных Server:
- `directus_*` - системные таблицы Directus
- `directus_collections` - коллекции
- `directus_fields` - поля
- `directus_relations` - связи
- `directus_settings` - настройки интерфейса
- И другие таблицы для управления контентом

## Команды для работы с данными

### Экспорт/Импорт данных

```bash
# Войти в контейнер
docker exec -it directus-cms-template-directus-1 sh

# Экспорт данных
npx directus database export ./backup.sql

# Импорт данных
npx directus database import ./backup.sql

# Экспорт схемы
npx directus schema snapshot ./migrations/schema.yaml
```

### Создание пользователей

```bash
# Войти в контейнер
docker exec -it directus-cms-template-directus-1 sh

# Создать пользователя
npx directus users create --email user@example.com --password password123
```

## Рабочий процесс с данными

### 1. Разработка (локальная среда)

```bash
# Запустить Server (PostgreSQL)
cd ../server
docker-compose up -d

# Запустить Directus (подключается к базе Server)
cd ../directus
docker-compose up -d

# Работать в админке: http://localhost:8055
# Все изменения автоматически сохраняются в ../server/database/postgres/
```

### 2. Сохранение в git

```bash
# Добавить изменения базы данных
git add ../server/database/postgres/

# Коммит
git commit -m "Update database schema and Directus settings"

# Push
git push origin main
```

### 3. Применение на продакшене

```bash
# Клонировать репозиторий
git clone your-repo

# Запустить Server (PostgreSQL)
cd server
docker-compose up -d

# Запустить Directus
cd ../directus
docker-compose up -d

# База данных автоматически восстановится из database/postgres/
# Настройки Directus будут доступны сразу
```

### 4. Резервное копирование

```bash
# Создать резервную копию
tar -czf postgres-backup-$(date +%Y%m%d).tar.gz ../server/database/postgres/

# Восстановить из резервной копии
tar -xzf postgres-backup-20240101.tar.gz -C ../server/database/
```

### 5. Преимущества архитектуры

- ✅ **Единая база данных** - Server и Directus используют одну БД
- ✅ **Настройки сохраняются** - цвета, темы, интерфейс в git
- ✅ **Простое развертывание** - клонирование + запуск контейнеров
- ✅ **Версионирование** - все изменения отслеживаются в git
- ✅ **Переносимость** - легко копировать между средами

## Полезные команды Docker

```bash
# Просмотр логов
docker-compose logs -f directus

# Перезапуск сервиса
docker-compose restart directus

# Просмотр статуса
docker-compose ps

# Очистка (удаление контейнеров и volumes)
docker-compose down -v
```

## Переменные окружения

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `DIRECTUS_PORT` | Порт сервиса | 8055 |
| `DIRECTUS_SECRET` | Секретный ключ | - |
| `DB_HOST` | Хост базы данных | host.docker.internal |
| `DB_PORT` | Порт базы данных | 5433 |
| `DB_DATABASE` | Имя базы данных | postgres |
| `DB_USER` | Пользователь БД | postgres |
| `DB_PASSWORD` | Пароль БД | postgres |
| `ADMIN_EMAIL` | Email администратора | admin@example.com |
| `ADMIN_PASSWORD` | Пароль администратора | admin123 |
| `WEBSOCKETS_ENABLED` | Включить WebSocket | true |
| `PUBLIC_URL` | Публичный URL | http://localhost:8055 |
| `CORS_ENABLED` | Включить CORS | true |
| `CORS_ORIGIN` | Разрешенные домены | http://localhost:3000 |

## Структура API

### REST API

```bash
# Получить все элементы коллекции
GET /items/{collection}

# Получить элемент по ID
GET /items/{collection}/{id}

# Создать элемент
POST /items/{collection}

# Обновить элемент
PATCH /items/{collection}/{id}

# Удалить элемент
DELETE /items/{collection}/{id}
```

### GraphQL API

```graphql
# Запрос
query {
  users {
    id
    email
    first_name
    last_name
  }
}

# Мутация
mutation {
  create_users_item(data: {
    email: "user@example.com"
    password: "password123"
  }) {
    id
    email
  }
}
```

## Troubleshooting

### Проблемы с подключением к БД

```bash
# Проверить статус контейнера
docker-compose ps

# Посмотреть логи
docker-compose logs directus

# Перезапустить сервис
docker-compose restart directus
```

### Проблемы со схемой

```bash
# Проверить различия в схемах
docker exec -it directus-cms-template-directus-1 npx directus schema diff ./migrations/schema.yaml

# Применить схему
docker exec -it directus-cms-template-directus-1 npx directus schema apply ./migrations/schema.yaml

# Переустановить базу данных
docker exec -it directus-cms-template-directus-1 npx directus database install
```

## Полезные ссылки

- [Официальная документация Directus](https://docs.directus.io/)
- [API Reference](https://docs.directus.io/reference/api/)
- [GraphQL Reference](https://docs.directus.io/reference/graphql/)
- [Docker Hub](https://hub.docker.com/r/directus/directus)