# mytonprovider.org

Фронтенд для https://mytonprovider.org - агрегатор TON Storage провайдеров. Создан с использованием React, TypeScript и Tailwind CSS. Включает десктопную и мобильную версии.

## Начало работы

### Установка

```bash
npm install
```

### Локальная разработка

Создайте локальный env-файл, чтобы frontend ходил в локальный backend, а не в production:

```bash
cp .env.example .env.local
```

`.env.example` уже указывает на `http://localhost:9090`, что совпадает с локальным backend dev flow.

Запустите dev-сервер:

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### Сборка

```bash
npm run build
```

Результат статического экспорта будет в директории `out/`.

### Базовый URL API

- Для локальной разработки задайте `NEXT_PUBLIC_API_BASE_URL=http://localhost:9090`.
- В production за nginx оставляйте `NEXT_PUBLIC_API_BASE_URL` пустым, чтобы приложение использовало same-origin запросы к `/api/...`.
- Если frontend и API деплоятся раздельно, передавайте `NEXT_PUBLIC_API_BASE_URL` на этапе сборки.

## Структура проекта

```
# Классическая структура для подобных проектов
app/                # Директория приложения
components/         # Переиспользуемые UI компоненты
hooks/              # Пользовательские React хуки
lib/                # Утилиты и API вызовы
types/              # Определения типов TypeScript
public/             # Статические файлы
```

## Лицензия

Apache-2.0



Этот проект был создан по заказу участника сообщества TON Foundation.
