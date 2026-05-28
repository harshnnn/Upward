# TurboRepo Package Map

## Proposed Workspace Layout

```text
apps/
  web/
  mobile/
  api/
  worker/

packages/
  ui/
  design-tokens/
  contracts/
  api-client/
  domain/
  db/
  auth/
  sync/
  analytics/
  storage/
  logger/
  observability/
  config/
  utils/
  testing/
  feature-flags/
  eslint-config/
  tsconfig/
```

## App Responsibilities

### `apps/web`

- React dashboard and review experience
- Rich analytics, charts, tables, and settings
- Fast browsing of historical data
- Desktop-first interactions

### `apps/mobile`

- React Native + Expo capture app
- Offline logging and quick entry
- Native notifications and device integrations
- Low-friction input for high-frequency actions

### `apps/api`

- NestJS HTTP API
- Auth, validation, business rules, persistence orchestration
- Source of truth for all user data
- Versioned REST endpoints and sync endpoints

### `apps/worker`

- Background jobs and scheduled processing
- Rollups, digests, streak recomputation, sync repair, integration retries
- Event consumption and projection updates

## Shared Package Responsibilities

### `packages/contracts`

- Request and response contracts
- DTO schemas and validation schemas
- Event payload shapes
- Cursor and pagination types
- Sync protocol contracts

This package should be the compatibility anchor for the entire repo.

### `packages/domain`

- Pure business rules
- Enums, value objects, time helpers, unit logic, tracker primitives
- Shared semantics that do not depend on NestJS or React

### `packages/api-client`

- Typed request helpers for web and mobile
- Query key factories
- Mutation helpers
- Error normalization and retry conventions

### `packages/db`

- Prisma schema and migrations
- Transaction helpers and repository primitives
- Database connection configuration
- Seed helpers and database utility functions

### `packages/auth`

- Principal and session types
- Token and permission helpers
- Shared auth contract helpers
- Cross-platform auth utilities

### `packages/sync`

- Offline mutation envelopes
- Cursor shapes and sync state contracts
- Conflict metadata and reconciliation helpers
- Device-scoped sync utilities

### `packages/analytics`

- Metric definitions
- Time-window and rollup helpers
- Analytics contracts and derived metric keys
- Correlation and growth summary types

### `packages/ui`

- Reusable UI primitives
- Buttons, inputs, cards, dialogs, forms, charts shells, empty states
- Shared interaction patterns and visual consistency

### `packages/design-tokens`

- Color palette
- Typography tokens
- Spacing and layout tokens
- Motion, radius, elevation, and semantic theme values

### `packages/storage`

- File and media abstractions
- Upload metadata and future object-storage integration

### `packages/logger`

- Structured logging conventions
- Context propagation helpers
- Redaction rules and error formatting

### `packages/observability`

- Tracing and metric helpers
- Instrumentation wrappers
- Request and job correlation support

### `packages/config`

- Environment parsing
- Feature flag normalization
- Runtime config contracts

### `packages/utils`

- Only true cross-cutting helpers
- Keep this package small to avoid becoming a dumping ground

### `packages/testing`

- Factories, mocks, fixtures, test utilities, and sample payload builders

### `packages/feature-flags`

- Feature flag contract and flag evaluation helpers
- Safe rollout behavior for new modules and experiments

## Dependency Flow

The dependency graph should be strongly directional.

### Allowed dependencies

- `apps/web` -> `packages/ui`, `packages/design-tokens`, `packages/contracts`, `packages/api-client`, `packages/auth`, `packages/sync`, `packages/analytics`, `packages/config`, `packages/utils`
- `apps/mobile` -> `packages/ui`, `packages/design-tokens`, `packages/contracts`, `packages/api-client`, `packages/auth`, `packages/sync`, `packages/analytics`, `packages/config`, `packages/utils`
- `apps/api` -> `packages/contracts`, `packages/domain`, `packages/db`, `packages/auth`, `packages/logger`, `packages/observability`, `packages/config`, `packages/utils`, `packages/analytics`
- `apps/worker` -> `packages/domain`, `packages/db`, `packages/auth`, `packages/logger`, `packages/observability`, `packages/config`, `packages/utils`, `packages/sync`, `packages/analytics`
- `packages/ui` -> `packages/design-tokens`, `packages/utils`
- `packages/api-client` -> `packages/contracts`, `packages/auth`, `packages/utils`, `packages/config`
- `packages/domain` -> `packages/utils` only if needed, otherwise nothing app-specific
- `packages/db` -> `packages/config`, `packages/logger`, optional repository utilities from `packages/domain`
- `packages/contracts` -> as close to pure as possible
- `packages/sync` -> `packages/contracts`, `packages/domain`, `packages/utils`
- `packages/analytics` -> `packages/domain`, `packages/utils`, `packages/contracts`

### Disallowed dependencies

- Web packages importing NestJS code
- Mobile packages importing server-only database code
- Domain packages importing framework classes, React components, or Prisma internals
- Contracts depending on platform-specific UI code
- Circular dependency paths between app and shared packages

## Package Boundary Rules

- UI never owns business logic.
- Domain never owns transport logic.
- Contracts never own runtime behavior.
- DB never owns orchestration logic.
- Worker never owns request-response semantics.
- API never duplicates client state management.

## Package Structure Philosophy

- Separate packages by change frequency and ownership.
- Put shared contracts at the center of the repo.
- Keep app-specific behavior in apps, not packages.
- Keep reusable business logic in domain packages.
- Make every dependency direction obvious from the package graph.

## Why This Layout Scales

- Multiple client apps can share contracts without sharing rendering internals.
- Backend modules remain testable and swappable.
- A worker process can grow without tangling request latency.
- Analytics and sync stay explicit rather than hiding inside feature code.
- The repo can later split packages or apps into separate deployment units if needed.
