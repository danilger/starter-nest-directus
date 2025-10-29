# ⚡ Быстрый старт

## 🎯 Production (все в Docker)

```bash
# 1. Создайте .env
cp .env_example .env

# 2. Отредактируйте .env
# - Измените JWT_SECRET и DIRECTUS_SECRET (одинаковые!)
# - Установите DB_HOST=postgres
# - Измените пароли

# 3. Запустите
docker-compose up -d --build

# 4. Откройте
http://192.168.0.33/
```

---

## 🛠️ Dev режим (с hot reload)

```bash
# 1. В .env установите
DB_HOST=localhost
NODE_ENV=development

# 2. Запустите БД и Directus
docker-compose -f docker-compose.dev.yml up -d

# 3. Backend (в отдельном терминале)
cd server
npm install
npm run start:dev
# → http://localhost:3000/docs

# 4. Frontend (в отдельном терминале)
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## 🔑 Критически важно!

```env
# ДОЛЖНЫ быть ОДИНАКОВЫМИ:
JWT_SECRET=your_secret_key_32_chars_minimum
DIRECTUS_SECRET=your_secret_key_32_chars_minimum
```

---

## 📚 Подробнее

См. [README.md](README.md) для полной документации.

