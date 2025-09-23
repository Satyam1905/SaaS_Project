# SaaS Notes Application

A multi-tenant notes application built with Next.js, TypeScript, and PostgreSQL.

## Multi-tenancy Approach

We use a **Shared Schema with tenant_id column** approach.

### Why This Approach?

- **Simplicity**: Easy to implement and maintain
- **Performance**: Single database connection pool
- **Scalability**: Can scale vertically or implement row-level security later
- **Cost-effective**: Single database instance for multiple tenants

### Data Isolation

- All tenant-specific queries include `tenantId` in WHERE clauses
- API middleware validates tenant context for every request
- No cross-tenant data access possible through normal API usage

## Test Accounts

All accounts use password: `password`

### Acme Tenant

- Admin: `admin@acme.test`
- Member: `user@acme.test`

### Globex Tenant

- Admin: `admin@globex.test`
- Member: `user@globex.test`

## API Endpoints

### Authentication

- `POST /api/auth/login` - User authentication

### Notes

- `GET /api/notes` - List notes for current tenant
- `POST /api/notes` - Create a new note
- `GET /api/notes/:id` - Get specific note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Tenants

- `POST /api/tenants/:id/upgrade` - Upgrade tenant plan (Admin only)

### Health

- `GET /api/health` - Health check

## Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Local Development

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
