# Upward Backend Foundation

## Purpose

This document defines the backend foundation for Upward using NestJS, Prisma, PostgreSQL, TypeScript, JWT authentication, and a TurboRepo/pnpm monorepo.

The goal is to establish the production-grade infrastructure layer only. No business features are implemented here yet.

## Source-of-Truth Alignment

This backend foundation is constrained by the existing project docs:

- Modular monolith backend in the initial phase.
- PostgreSQL and Prisma as the operational data layer.
- Strict TypeScript and shared types across apps.
- Offline-first and analytics-ready architecture.
- Solo-developer friendly sequencing.
- No premature microservices.

## Critical Review Before Finalizing

A first-pass backend scaffold can fail in a few predictable ways:

- It can bury configuration across too many files.
- It can leak Prisma concerns into controllers.
- It can make error handling inconsistent across modules.
- It can create multiple competing response formats.
- It can allow feature modules to become too coupled too early.
- It can leave auth, health, and logging without shared conventions.

### Improvements Applied

- Centralized config module.
- Shared common module for errors, response formatting, and helpers.
- Thin controllers and isolated services.
- Prisma access only through repository/data-access layers.
- Explicit API versioning from the start.
- Security middleware and rate limiting prepared from day one.
- Event and background job boundaries prepared without forcing implementation too early.

## Final Backend Folder Structure

```text
apps/api/
  prisma/
    schema.prisma
    migrations/
    seed.ts
  src/
    main.ts
    app.module.ts
    app.controller.ts
    app.service.ts
    config/
      environment.ts
      app.config.ts
      database.config.ts
      auth.config.ts
      logging.config.ts
      validation.ts
    common/
      constants/
      decorators/
      dto/
      errors/
      filters/
      guards/
      interceptors/
      interfaces/
      middleware/
      pipes/
      utils/
      validators/
    database/
      prisma.service.ts
      prisma.module.ts
      prisma.client.ts
      repositories/
      transactions/
    modules/
      auth/
        auth.module.ts
        controllers/
        dto/
        guards/
        strategies/
        services/
        repositories/
        types/
      users/
        users.module.ts
        controllers/
        dto/
        services/
        repositories/
        types/
      health/
        health.module.ts
        health.controller.ts
        health.service.ts
      versioning/
        versioning.module.ts
      events/
        events.module.ts
        event-bus.service.ts
        event.types.ts
      jobs/
        jobs.module.ts
        jobs.service.ts
        jobs.types.ts
    infrastructure/
      cache/
      logger/
      rate-limit/
      security/
      swagger/
      tracing/
    shared/
      response/
      pagination/
      error-codes/
      request-context/
      base-dto/
      domain-events/
    test/
      factories/
      helpers/
      mocks/
      integration/
  test/
  package.json
  tsconfig.json
  nest-cli.json
  .env.example
```

## Package Dependencies

### `apps/api` runtime dependencies

Recommended dependencies for the backend foundation:

```json
{
  "@nestjs/common": "^11.0.0",
  "@nestjs/core": "^11.0.0",
  "@nestjs/config": "^4.0.0",
  "@nestjs/platform-express": "^11.0.0",
  "@nestjs/jwt": "^11.0.0",
  "@nestjs/passport": "^11.0.0",
  "@nestjs/swagger": "^11.0.0",
  "@nestjs/throttler": "^6.0.0",
  "@prisma/client": "^6.0.0",
  "class-transformer": "^0.5.0",
  "class-validator": "^0.14.0",
  "helmet": "^8.0.0",
  "passport": "^0.7.0",
  "passport-jwt": "^4.0.0",
  "pino": "^9.0.0",
  "pino-http": "^10.0.0",
  "rxjs": "^7.0.0",
  "zod": "^3.24.0"
}
```

### `apps/api` dev dependencies

```json
{
  "@nestjs/cli": "^11.0.0",
  "@types/express": "^5.0.0",
  "@types/node": "^22.0.0",
  "@types/passport-jwt": "^4.0.0",
  "prisma": "^6.0.0",
  "ts-node": "^10.0.0",
  "typescript": "^5.0.0",
  "vitest": "^2.0.0",
  "supertest": "^7.0.0"
}
```

### Workspace package dependencies

- `packages/types` should hold shared DTO and domain types.
- `packages/utils` should hold pure helpers.
- `packages/config` should hold typed config helpers.
- `packages/ui` is not consumed by the API.
- `packages/eslint-config` and `packages/tsconfig` are consumed by all workspaces.

## NestJS App Bootstrap Setup

### Bootstrap entry

`src/main.ts` should do only the minimum required application bootstrap:

- create the Nest application
- apply global pipes, filters, interceptors, and guards
- set API versioning
- enable security middleware
- initialize Swagger in non-production environments
- start listening

### App module composition

`src/app.module.ts` should import only infrastructure and foundational modules:

- Config module
- Prisma module
- Common module
- Auth module
- Users module
- Health module
- Events module
- Jobs module
- Shared infrastructure modules

### Bootstrap rules

- No business feature modules yet.
- No tracker, workout, or journal modules yet.
- Keep startup side effects minimal.
- Validate config before the app fully starts.
- Make startup failure explicit if environment variables are invalid.

## Prisma Integration Setup

### Prisma ownership

- Prisma schema stays in `apps/api/prisma`.
- Prisma client is wrapped behind a `PrismaService`.
- Repositories depend on `PrismaService`, not directly on raw client creation.
- Transactions should be encapsulated in helper methods or repository flows.

### Prisma module structure

- `PrismaModule` should export `PrismaService`.
- `PrismaService` should manage lifecycle hooks and connection readiness.
- Connection cleanup should happen on shutdown.
- Database access should remain testable through injectable services.

### Prisma rules

- Do not expose Prisma client directly to controllers.
- Do not let transport-layer DTOs leak into repository queries.
- Use Prisma migrations as the schema authority.
- Keep generated client usage inside the backend boundary.

## Environment Configuration System

### Goals

- Centralized and typed environment access.
- Fail-fast startup on missing secrets or malformed values.
- Separate server-only and public-facing variables.
- Keep config out of feature code.

### Recommended config modules

- `environment.ts` for env loading and parsing.
- `app.config.ts` for app-level flags.
- `database.config.ts` for DB and pool settings.
- `auth.config.ts` for JWT and session settings.
- `logging.config.ts` for log level and redaction rules.
- `validation.ts` for env schema checks.

### Environment strategy

- Use `.env.example` as the canonical example file.
- Load secrets only through process env or deployment provider.
- Validate at startup using Zod or class-validator based schemas.
- Keep one typed config object per concern.

## Database Connection Management

### Required behavior

- Initialize Prisma once.
- Reuse the connection client across the app.
- Cleanly disconnect on shutdown.
- Support migrations and runtime queries without duplication.

### Connection rules

- Do not create client instances inside request handlers.
- Do not hide database access in controllers.
- Support graceful shutdown hooks.
- Keep database access out of websocket or background plumbing unless explicitly needed.

### Scalability notes

- Prepare for pooling and connection limits early.
- Keep query shapes narrow.
- Avoid chatty ORM patterns.
- Use repository methods that align with access patterns, not just table shapes.

## Global Validation Setup

### Validation strategy

Use a global validation layer for all incoming requests.

Recommended behavior:

- Strip unknown properties.
- Reject invalid payloads.
- Transform primitive inputs where safe.
- Keep validation consistent across all modules.

### Validation options

Two acceptable approaches:

- `class-validator` + `class-transformer` for Nest-native DTO classes.
- Zod schemas at the edge with adapters into Nest controllers.

### Recommended choice

Use one convention consistently across the backend. For this foundation, `class-validator` is the default for DTO classes, while Zod can be introduced later for shared schema alignment if desired.

### Validation rules

- Validate at the transport boundary.
- Keep business validation in services where it belongs.
- Do not trust client-side validation alone.

## Global Exception Handling

### Error strategy

Use a single global exception filter so all errors return a consistent shape.

### Required behavior

- Normalize validation, auth, not-found, conflict, and server errors.
- Include request context and correlation id where available.
- Avoid leaking stack traces in production.
- Return machine-readable error codes.

### Error response shape

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload",
    "details": [],
    "requestId": "..."
  }
}
```

### Error rules

- Controllers should not manually format errors.
- Exceptions should remain meaningful to API clients.
- Logging should capture full internal details while responses stay safe.

## Logging System

### Logging goals

- Structured logs.
- Request correlation.
- Security-friendly redaction.
- Clean output for local development and production observability.

### Recommended setup

- `pino` as the logger.
- HTTP request logging middleware.
- Correlation id propagation.
- Sensitive field redaction.

### Log categories

- Request logs
- Response logs
- Auth logs
- Validation logs
- DB error logs
- Job logs
- Audit logs

### Logging rules

- Never log tokens or secrets.
- Never log passwords or refresh tokens.
- Include request id and user id when available.
- Keep logs machine-readable.

## Request and Response Interceptors

### Response interceptor

Standardize outbound responses so the API returns a predictable envelope.

### Suggested response shape

```json
{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "...",
    "timestamp": "..."
  }
}
```

### Interceptor responsibilities

- Wrap successful responses.
- Add metadata.
- Preserve pagination and trace information.
- Avoid altering error responses.

### Request interceptor responsibilities

- Attach correlation context.
- Track request duration.
- Help observability and logging.

## Auth Module Foundation

### Responsibilities

- Sign-up, sign-in, refresh, logout, session management, and password handling.
- JWT access and refresh token support.
- Device-aware session control.
- Guard and strategy setup for protected routes.

### Folder shape

```text
modules/auth/
  auth.module.ts
  controllers/
  dto/
  guards/
  strategies/
  services/
  repositories/
  types/
```

### Auth foundation rules

- Access tokens should be short-lived.
- Refresh tokens should rotate.
- Session revocation should be explicit.
- Token handling should be isolated from transport.
- Auth should be ready for OAuth expansion later.

## User Module Foundation

### Responsibilities

- Basic user identity, profile loading, preferences, and current-user retrieval.
- Central user access layer for the rest of the backend.

### Folder shape

```text
modules/users/
  users.module.ts
  controllers/
  dto/
  services/
  repositories/
  types/
```

### User foundation rules

- Keep profile data separate from auth secrets.
- Provide a clean current-user service abstraction.
- Keep user lookups cacheable.
- Support future social relationships without changing the user root model.

## Health Check Module

### Responsibilities

- Liveness and readiness.
- Basic DB connectivity checks.
- Deployment safety checks.

### Endpoints

- `GET /health`
- `GET /health/live`
- `GET /health/ready`

### Rules

- Health endpoints should be lightweight.
- Readiness should include database and critical infrastructure checks.
- Health endpoints should not require auth.

## Shared/Common Module

### Responsibilities

- Response helpers
- Request context helpers
- Base DTOs
- Error codes
- Utility decorators
- Common guards, filters, interceptors, and pipes

### Why it exists

- Keeps cross-cutting logic centralized.
- Prevents duplication across modules.
- Makes the core architecture easier to maintain.

## Base DTO Strategy

### Base DTO concepts

- Pagination DTO
- Sort DTO
- Filter DTO
- Idempotency DTO
- Date-range DTO
- Cursor DTO
- Response metadata DTO

### Rules

- Shared DTOs belong in `common/dto` or `shared/base-dto`.
- Domain DTOs should extend or compose base DTOs rather than redefining them.
- Keep DTOs simple and explicit.

## API Response Format Standardization

### Success response

```json
{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "...",
    "version": "v1"
  }
}
```

### Error response

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "details": [],
    "requestId": "..."
  }
}
```

### Rules

- Keep the envelope consistent everywhere.
- Preserve pagination metadata.
- Preserve request context.
- Do not mix success and error shapes.

## Middleware Setup

### Recommended middleware stack

- Helmet for security headers.
- CORS with explicit origins.
- Request id middleware.
- Body size limits.
- Compression if needed.
- Raw request logging middleware where useful.

### Middleware rules

- Keep middleware small and observable.
- Apply security middleware early.
- Avoid hidden global side effects.
- Do not make middleware responsible for business logic.

## Guards Structure

### Guard layers

- Authentication guard
- Role or permission guard
- Rate-limit guard where needed
- Feature-flag guard if the product later introduces gates

### Rules

- Guards should answer authorization questions only.
- Keep data access out of guards.
- Keep guard logic reusable and testable.

## Utility Helpers

### Useful utilities in the foundation

- correlation id helpers
- safe string normalization
- pagination helpers
- date helpers
- exception mapping helpers
- environment parsing helpers
- response envelope helpers
- idempotency helpers

### Rules

- Keep helpers pure when possible.
- Avoid feature-specific helpers in common utilities.
- Prefer helpers that support multiple modules.

## Error Response Structure

### Canonical structure

```json
{
  "success": false,
  "error": {
    "code": "SOMETHING_WENT_WRONG",
    "message": "Human readable message",
    "details": [],
    "requestId": "...",
    "timestamp": "..."
  }
}
```

### Standard codes

- `VALIDATION_ERROR`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `CONFLICT`
- `RATE_LIMITED`
- `INTERNAL_ERROR`

### Rules

- Codes must be stable.
- Details should be structured where useful.
- Errors should be safe for client display.

## API Versioning Strategy

### Recommended strategy

- Prefix public routes with `/api/v1`.
- Keep versioning explicit in controllers or route registration.
- Reserve the ability to add `/api/v2` later without breaking v1 clients.
- Version the response envelope only if the structure changes materially.

### Rules

- New fields can be additive inside v1.
- Breaking changes require a new version.
- Client and server should not infer version behavior implicitly.

## Recommended Dependency Injection Patterns

### Patterns to use

- Constructor injection for all services.
- Interface-like tokens only when abstraction is needed.
- Repository providers for persistence access.
- Module-level exports only for stable cross-module contracts.

### Patterns to avoid

- Service locators.
- Circular service dependencies.
- Static singletons that bypass Nest DI.

### DI rules

- Keep dependencies explicit.
- Prefer small services over giant god services.
- Use factories only when construction complexity genuinely requires it.

## Security Middleware Recommendations

- Helmet
- CORS whitelist
- CSRF protection if cookie-based browser flows need it
- Request size limiting
- Secure headers
- Session and token hardening
- Redaction in logs

### Security rules

- Never trust client payloads.
- Lock down CORS by environment.
- Keep secrets server-side.
- Enforce auth at the route boundary.

## Rate Limiting Architecture

### Recommended setup

- Global throttling for public endpoints.
- More restrictive limits on auth endpoints.
- Separate limit policies for sync and search later.
- Support per-user and per-IP strategies where useful.

### Rules

- Protect sign-in and sign-up flows.
- Protect password reset flows.
- Protect sync pushes from abuse.
- Keep rate limiting observable.

## Caching Architecture Preparation

### Prep goals

- Create the abstraction now, even if only a subset is active.
- Keep cache usage aligned with user-scoped data.
- Avoid caching sensitive auth tokens unless specifically designed.

### Good early cache targets

- user profile and settings
- health of external dependencies where appropriate
- feature flags
- read-heavy metadata
- analytics snapshots

### Rules

- Cache should be optional and replaceable.
- Cache keys must be explicit and namespaced.
- Cache invalidation should be event-aware where possible.

## Event System Preparation

### Preparation goals

- Define an internal event bus abstraction.
- Prepare domain event types.
- Keep publisher and consumer contracts separate.
- Support future background handlers and analytics projections.

### Minimum viable event system

- `DomainEvent` interface
- Event bus service
- Event publisher helper
- Event consumer registration pattern

### Rules

- Do not couple event publishing to controllers.
- Events should represent domain facts, not UI actions.
- Keep events serializable.

## Background Jobs Preparation

### Preparation goals

- Create a jobs module and job interface early.
- Keep the first version simple.
- Leave room for a queue runner later.

### Initial job candidates

- analytics rollups
- reminder dispatch
- sync repair
- digest generation
- export generation later

### Rules

- Jobs must be idempotent.
- Jobs should not be hidden in request handlers.
- Keep queue implementation replaceable.

## Testing Setup Structure

### Recommended structure

```text
apps/api/test/
  unit/
  integration/
  e2e/
  helpers/
  factories/
  mocks/
```

### Test layers

- Unit tests for services and utilities.
- Integration tests for repositories and Prisma flows.
- E2E tests for auth, health, and foundational API behavior.

### Rules

- Keep tests deterministic.
- Test idempotency, auth, validation, and health first.
- Add regression tests for any bug that touches shared infrastructure.

## Swagger / OpenAPI Setup

### Goals

- Document versioned endpoints early.
- Make request and response contracts discoverable.
- Keep the spec aligned with DTOs.

### Recommended behavior

- Serve Swagger in non-production environments.
- Use tags by module.
- Document auth requirements clearly.
- Document pagination and error envelopes consistently.

### Rules

- Swagger should reflect the response wrapper.
- DTOs should be visible in generated docs.
- The API spec should help client generation later.

## Recommended Backend Coding Conventions

- Use feature modules, not flat folders.
- Keep controllers thin.
- Keep services focused.
- Keep repositories isolated.
- Keep Prisma access out of controllers.
- Keep DTOs explicit and validated.
- Use strict TypeScript always.
- Avoid `any`.
- Use request ids and structured logs.
- Use clear naming for module boundaries.
- Keep all public API behavior version-aware.

## Suggested Bootstrap Commands

### Install backend dependencies

```bash
pnpm add -F @upward/api @nestjs/common @nestjs/core @nestjs/platform-express @nestjs/config @nestjs/jwt @nestjs/passport @nestjs/swagger @nestjs/throttler @prisma/client class-transformer class-validator helmet passport passport-jwt pino pino-http rxjs zod
pnpm add -F @upward/api -D @nestjs/cli @types/express @types/node @types/passport-jwt prisma ts-node vitest supertest
```

### Initialize Prisma in the API app

```bash
pnpm --filter @upward/api prisma init
```

### Bootstrap NestJS structure

```bash
pnpm --filter @upward/api nest g module modules/auth
pnpm --filter @upward/api nest g module modules/users
pnpm --filter @upward/api nest g module modules/health
```

### Start the backend

```bash
pnpm --filter @upward/api dev
```

## Initialization Sequence

### Phase 1

1. Create the API app structure.
2. Install runtime and dev dependencies.
3. Create `src/main.ts`, `src/app.module.ts`, and foundational config files.
4. Add Prisma schema and connect the database service.
5. Add global validation, exception handling, and logging.

### Phase 2

1. Add auth foundation.
2. Add user foundation.
3. Add health module.
4. Add shared/common module and base DTO patterns.
5. Add Swagger and versioning.

### Phase 3

1. Add event bus abstraction.
2. Add job preparation module.
3. Add cache abstraction.
4. Add tests and e2e scaffolding.

## Final Improved Architecture

The improved backend foundation should remain intentionally small at first:

- One NestJS API app.
- One Prisma boundary.
- One shared common layer.
- One config system.
- One logging system.
- One response envelope.
- One validation convention.
- One versioned API surface.

This is enough to support the product’s early domains without forcing premature complexity.

## Exact Files To Create First

- `apps/api/package.json`
- `apps/api/tsconfig.json`
- `apps/api/nest-cli.json`
- `apps/api/.env.example`
- `apps/api/prisma/schema.prisma`
- `apps/api/src/main.ts`
- `apps/api/src/app.module.ts`
- `apps/api/src/config/*`
- `apps/api/src/common/*`
- `apps/api/src/database/*`
- `apps/api/src/modules/auth/*`
- `apps/api/src/modules/users/*`
- `apps/api/src/modules/health/*`
- `apps/api/src/modules/events/*`
- `apps/api/src/modules/jobs/*`
- `apps/api/src/infrastructure/*`
- `apps/api/src/shared/*`
- `apps/api/test/*`

## Final Assessment

This backend foundation is production-grade without being overbuilt. It gives Upward a secure, typed, observable, versioned, and scalable NestJS starting point while still leaving room for the actual product domains to be added later.
