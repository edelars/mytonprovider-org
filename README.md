# mytonprovider.org

**[Русская версия](README.ru.md)**

Frontend for https://mytonprovider.org - a TON Storage providers aggregator. Built with React, TypeScript and Tailwind CSS. Includes desktop and mobile versions.

## Getting Started

### Installation

```bash
npm install
```

### Local Development

Create a local env file so the frontend talks to the local backend instead of production:

```bash
cp .env.example .env.local
```

`.env.example` points to `http://localhost:9090`, which matches the backend local dev setup.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

The static export output is written to `out/`.

### API Base URL

- In local development, set `NEXT_PUBLIC_API_BASE_URL=http://localhost:9090`.
- In production behind nginx, leave `NEXT_PUBLIC_API_BASE_URL` unset so the app uses same-origin `/api/...` requests.
- If you deploy the frontend separately from the API, set `NEXT_PUBLIC_API_BASE_URL` at build time.


## Project Structure

```
# Classic structure for project like this
app/                # App directory
components/         # Reusable UI components
hooks/              # Custom React hooks
lib/                # Utility functions and API calls
types/              # TypeScript type definitions
public/             # Static assets
```

## License

Apache-2.0



This project was created by order of a TON Foundation community member.
