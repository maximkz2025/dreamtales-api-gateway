# DreamTales API Gateway

Простой API Gateway для приложения DreamTales, который проксирует запросы к OpenAI API.

## Быстрый старт

### 1. Установка Vercel CLI
```bash
npm i -g vercel
```

### 2. Логин в Vercel
```bash
vercel login
```

### 3. Настройка переменных окружения
В настройках проекта Vercel добавьте:
- `OPENAI_API_KEY` = ваш ключ OpenAI

### 4. Деплой
```bash
vercel --prod
```

## Структура проекта

```
api/
├── openai-proxy.js    # Основная функция API Gateway
├── package.json       # Зависимости проекта
├── vercel.json       # Конфигурация Vercel
└── README.md         # Этот файл
```

## API Endpoints

### POST /api/openai-proxy

Генерирует сказку через OpenAI API.

**Request Body:**
```json
{
  "prompt": "Создай сказку о храбром рыцаре",
  "genre": "adventure"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "Храбрый рыцарь и волшебный меч",
    "content": "Жил-был храбрый рыцарь...",
    "fullContent": "Храбрый рыцарь и волшебный меч\n\nЖил-был храбрый рыцарь..."
  }
}
```

## Жанры сказок

- `adventure` - Приключенческие сказки
- `fantasy` - Фантастические сказки  
- `educational` - Поучительные сказки
- `funny` - Смешные сказки

## Безопасность

- API ключ OpenAI хранится только на сервере
- CORS настроен для работы с Flutter Web
- Rate limiting можно добавить при необходимости

## Стоимость

- **Vercel**: Бесплатно до 100GB-hours/месяц
- **OpenAI**: ~$0.002 за 1K токенов
- **Для 1000 пользователей**: ~$1/день

## Мониторинг

Логи доступны в Vercel Dashboard:
1. Перейдите в ваш проект
2. Выберите функцию `openai-proxy`
3. Просмотрите логи в реальном времени

## Локальная разработка

```bash
vercel dev
```

Функция будет доступна по адресу: `http://localhost:3000/api/openai-proxy` 