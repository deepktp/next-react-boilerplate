# Fullstack Boilerplate

A production-ready fullstack monorepo boilerplate built with:

- **Backend**: NestJS + Drizzle ORM + MySQL
- **Frontend**: React 19 + Vite + Ant Design + React Query + Zustand
- **Shared packages**: `@app/types` (TypeScript interfaces), `@app/utils` (helpers)
- **Package manager**: pnpm + Bun runtime
- **CI/CD**: GitHub Actions (CI, deploy to production, deploy to staging)

## Project Structure

```
boilerplate/
├── apps/
│   ├── api/          # NestJS backend
│   ├── web/          # React frontend
│   └── docs/         # VitePress documentation
├── packages/
│   ├── types/        # Shared TypeScript interfaces
│   └── utils/        # Shared utilities
├── .github/
│   └── workflows/    # CI/CD pipelines
├── .env.example
├── ecosystem.config.js
└── turbo.json
```

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment
cp .env.example .env.development
# Edit .env.development with your MySQL credentials

# 3. Run database migrations
cd apps/api && pnpm db:migrate

# 4. Seed the database (optional)
pnpm db:seed

# 5. Start development servers
pnpm dev
```

The API will be available at `http://localhost:3000` and the web app at `http://localhost:5173`.

## Architecture

### Multi-tenancy

Every request carries:
- `X-Tenant-Slug` header → resolved to `tenantId` via middleware
- `X-Organization-Id` header → attached as `req.organizationId`

### Auth

- JWT access tokens (1h TTL)
- SHA-256 hashed refresh tokens (7d TTL) stored in DB, rotated on use
- RBAC: 6-level role hierarchy (SUPER_ADMIN → VIEWER)
- Permissions stored per role, loaded into JWT payload on login

### Security

- Helmet + CSP headers
- XSS sanitization middleware
- Rate limiting (ThrottlerModule)
- `ValidationPipe(whitelist: true, forbidNonWhitelisted: true)`
- Audit log interceptor (POST/PATCH/PUT/DELETE)

### Database Schema (MySQL)

Core tables: `tenants`, `users`, `roles`, `permissions`, `user_tenant_roles`,
`role_permissions`, `organizations`, `organization_users`, `refresh_tokens`,
`password_reset_tokens`, `audit_logs`, `settings`, `plans`, `subscriptions`

### API

- Global prefix: `/v1`
- Swagger docs: `http://localhost:3000/docs` (dev only)

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start API + web in watch mode |
| `pnpm build` | Build all packages and apps |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Run pending migrations |
| `pnpm db:seed` | Seed database with initial data |
| `pnpm db:studio` | Open Drizzle Studio |

## Deployment

Uses PM2 in cluster mode (2 instances). See `ecosystem.config.js` and `.github/workflows/deploy.yml`.
