# Introduction

This boilerplate is a production-ready fullstack monorepo with:

- **Backend**: NestJS 10 + Drizzle ORM + MySQL 8
- **Frontend**: React 19 + Vite 7 + Ant Design
- **Auth**: JWT + refresh token rotation
- **Multi-tenancy**: Header-based tenant isolation
- **RBAC**: 6-level role hierarchy + permission system

## Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| API         | NestJS, Drizzle ORM, MySQL          |
| Web         | React, Vite, Ant Design, Zustand    |
| Auth        | Passport JWT, bcrypt                |
| Monorepo    | pnpm workspaces, Turborepo          |
| Runtime     | Bun / Node.js                       |
| Process Mgr | PM2                                 |

## Quick Start

```bash
# Install dependencies
pnpm install

# Copy env file
cp .env.example .env.development

# Run migrations
cd apps/api && bun run db:migrate

# Seed database
bun run db:seed

# Start development
pnpm dev
```
