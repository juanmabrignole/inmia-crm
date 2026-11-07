# Inmia CRM

CRM para inmobiliarias en Argentina. SvelteKit + Supabase, desplegado en Cloudflare Workers.

## Desarrollo

```bash
npm install
cp .env.example .env   # completar con URL y publishable key de Supabase
npm run dev
```

## Migraciones

Las migraciones están en `supabase/migrations/`. Se aplican en el SQL Editor de Supabase, en orden.

## Deploy en Cloudflare Workers

```bash
npm run deploy
```

Las variables `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_PUBLISHABLE_KEY` se cargan en Cloudflare (Workers → Settings → Variables).
