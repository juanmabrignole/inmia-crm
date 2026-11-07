# Inmia CRM

CRM para inmobiliarias en Argentina: cartera de propiedades con fotos, asesores asignados, tasaciones con informe en PDF y un feed XML para publicar en portales. Hecho con SvelteKit, Supabase y Cloudflare Workers.

## Qué incluye

- **Panel**: indicadores de cartera, tasaciones por mes y últimas tasaciones.
- **Propiedades**: alta, edición, fotos (Supabase Storage), estados de venta y alquiler, publicar o pausar.
- **Asesores**: alta, edición, baja y asignación a propiedades.
- **Tasaciones**: informe imprimible en PDF con estimación orientativa de valor de mercado.
- **Feed XML** en `/feed/propiedades`: propiedades publicadas con fotos y contacto del asesor, listo para cargar en portales.
- **Acceso**: login con email y contraseña. No hay registro público; los usuarios se invitan desde Supabase.
- **Modo claro y oscuro.**

## Puesta en marcha para una inmobiliaria nueva

Estos pasos sirven tanto para una demo como para instalar el CRM en una inmobiliaria real. Cada cliente tiene su propia base de datos y su propio deploy.

### 1. Crear el proyecto en Supabase

1. Creá un proyecto nuevo en supabase.com.
2. En **Settings → API** copiá la **Project URL** y la **publishable key**.
3. En **Authentication → Providers → Email**, desactivá **Allow new users to sign up** (así solo entran usuarios invitados).

### 2. Crear la base de datos

En **SQL Editor**, ejecutá en orden los archivos de `supabase/migrations/`:

1. `0001_propiedades.sql`
2. `0002_tasaciones.sql`
3. `0003_panel_propiedades_y_feed.sql`
4. `0004_asesores.sql`

Si querés datos de ejemplo para mostrar la app, ejecutá también `supabase/seed/demo.sql`. Se puede correr más de una vez y solo toca sus propios registros.

### 3. Invitar a los usuarios

En **Authentication → Users → Invite user** cargá el email de cada asesor o administrador. Recibe un mail para crear la contraseña.

### 4. Configurar la app

Dos archivos concentran la personalización:

- `src/lib/config.ts`: URL y publishable key del proyecto de Supabase del cliente.
- `src/lib/brand.ts`: nombre y slogan de la marca. Los colores y la tipografía están en `src/app.css`.

Para desarrollo local: `npm install`, copiar `.env.example` a `.env` y ejecutar `npm run dev`.

### 5. Desplegar en Cloudflare Workers

Conectá el repositorio de GitHub en **Workers & Pages** con estos comandos:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

Cada push a `main` despliega solo. Para un dominio propio, agregalo en **Settings → Domains & Routes**.

## Feed para portales

`https://TU-DOMINIO/feed/propiedades` devuelve un XML con las propiedades publicadas, sus fotos y el asesor responsable. Es la base para integrar ZonaProp, Argenprop, Mudafy u otros portales que acepten feeds o cargas por archivo. La integración directa depende de cada portal.

## Estructura

- `src/routes/`: pantallas y acciones del servidor (SvelteKit).
- `src/lib/`: lógica compartida, formularios, configuración y marca.
- `supabase/migrations/`: esquema y políticas de seguridad (RLS), en orden.
- `supabase/seed/`: datos de demo.

## Próximos módulos

Inquilinos y contratos con vencimientos de alquiler, mensajes, envío de mails y compartir propiedades desde la app.
