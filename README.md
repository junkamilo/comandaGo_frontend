# ComandaGo · Frontend (Next.js)

Panel de operación para restaurantes. Stack: **Next.js 15** App Router, React 19, Tailwind CSS v4, shadcn/ui.

## Requisitos

- Node.js **>= 20.9** (recomendado: 22, ver `.nvmrc`)
- npm 10+
- Backend `comandago_backend` en `http://localhost:8080`

## Desarrollo

```bash
cd comanda-swift
node -v   # >= 20.9
npm install
cp .env.example .env.local   # si no existe
npm run dev   # http://localhost:3000
```

Flujo: abrir `http://localhost:3000` → redirige a `/login` → credenciales → pantalla inicial según rol (ADMIN → dashboard `/`, MESERO → `/pedidos`, RECEPCIONISTA → `/recepcion`, etc.).

## Scripts

| Comando         | Descripción                           |
| --------------- | ------------------------------------- |
| `npm run dev`   | Servidor de desarrollo en puerto 3000 |
| `npm run build` | Build de producción                   |
| `npm run start` | Servidor de producción                |
| `npm run lint`  | ESLint (Next.js)                      |

## Variables de entorno

Copia `.env.example` a `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

## Arquitectura (`src/`)

```
app/
  (auth)/login/           ← login público
  (admin)/                ← shell con sidebar + guards por rol
    page.tsx              ← Inicio (ADMIN)
    pedidos/              ← POS
    cocina/ mesas/ recepcion/ ventas/ caja/ personal/ configuracion/
    carta/productos|categorias|disponibilidad/

features/
  auth/                   ← login, tokens, schemas
  navigation/             ← MODULOS, AppShell, guards
  dashboard/              ← KPIs mock (ADMIN)
  pos/                    ← POS mock
  cocina/ mesas/ recepcion/ productos/ ...  ← pantallas por módulo
  personal/               ← CRUD usuarios staff (API /usuarios)

components/ui/            ← shadcn compartido
lib/                      ← api-client, auth-storage, format-cop, query-client
middleware.ts             ← token + rol (cg_rol) + rutas permitidas
```

## Navegación y carga

Feedback de navegación en 4 capas, definido una sola vez:

| Capa | Implementación                           | Efecto                                    |
| ---- | ---------------------------------------- | ----------------------------------------- |
| 1    | `NavItem` + `useLinkStatus`              | Spinner en el ítem del sidebar al tocar   |
| 2    | `app/(admin)/loading.tsx` + skeletons    | Placeholder gris mientras carga el módulo |
| 3    | `lib/query-client.ts` (`staleTime: 60s`) | Cache React Query; 2ª visita sin refetch  |
| 4    | `nextjs-toploader` en root layout        | Barra naranja arriba en cada navegación   |

Skeletons: `features/shared/components/ModuleSkeleton.tsx` (default global). Overrides por layout: `mesas/`, `cocina/`, `pedidos/`.

Al conectar API en un módulo, usar `useQuery` con `queryKey` por dominio; los defaults del cliente ya aplican cache.

## Módulo Personal (`/personal`)

Solo ADMIN. Conectado a `GET/POST/PUT/DELETE/PATCH /api/v1/usuarios`.

- Listado con filtro Todos / Activos / Inactivos
- **Nuevo usuario**: dialog con nombre, email, contraseña, teléfono, rol (select staff)
- Editar, restablecer contraseña, desactivar (soft delete)
- Roles permitidos al crear/editar: MESERO, COCINERO, CAJERO, RECEPCIONISTA

## Módulo Recepción (`/recepcion`)

Solo ADMIN y RECEPCIONISTA. Conectado a `GET /api/v1/mesas` y `PATCH /api/v1/mesas/{id}/estado`.

- Panel de mesas activas con resumen (libres, reservadas, ocupadas)
- Filtro por estado
- Acciones: reservar mesa libre, sentar clientes, cancelar reserva, liberar mesa ocupada
- Tras login, RECEPCIONISTA redirige a `/recepcion`

## Módulos por rol

La navegación se define en `features/navigation/modulos-data.ts` (`MODULO_DEFINITIONS` + `modulosPara(rol)`).

| Rol      | Rutas iniciales / acceso     |
| -------- | ---------------------------- |
| ADMIN          | Todos los módulos (12)       |
| MESERO         | Pedidos, Mesas, Menú del día |
| COCINERO       | Cocina                       |
| CAJERO         | Pedidos, Caja                |
| RECEPCIONISTA  | Recepción                    |

Rutas sensibles (Ventas, Personal, Caja) se ocultan en UI por rol; el backend deberá aplicar `@PreAuthorize` al conectar API real.

## Multi-tenant (futuro)

Aislamiento por `restaurante_id` en JWT y BD — **no implementado** en este frontend. El cliente no envía `restaurante_id`; solo usa el token.

## Superadmin (futuro)

Panel `(superadmin)/` para gestión multi-restaurante — pendiente de diseño.

## Backend

```bash
cd ../comandago_backend
./mvnw spring-boot:run
```

CORS ya permite `http://localhost:3000`.

## Auth

- `POST /auth/login` desde `features/auth`
- Tokens en `localStorage` + cookies `cg_access_token` y `cg_rol` (middleware)
- Redirect post-login: `rutaInicialPorRol(rol)`
- Validación de credenciales en el backend; el frontend solo valida campos vacíos/email
