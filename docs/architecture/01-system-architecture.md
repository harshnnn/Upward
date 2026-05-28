# System Architecture

## Product Shape

Upward is a personal life operating system. The central architectural requirement is not just CRUD breadth, but consistent time-series capture, resilient offline behavior, and long-term analytics across many domains of user life.

The system should support:

- Fast capture on mobile
- Rich analysis on web
- A single source of truth on the backend
- Offline-first mutation handling
- Cross-domain analytics and growth tracking
- A future where volume reaches millions of records without a rewrite

## Platform Split

### Web

- React + Vite + TypeScript
- Used for dashboards, deep review flows, admin-style views, and dense analytics
- Optimized for fast rendering, complex tables, graphs, filters, and long-form content

### Mobile

- React Native + Expo + TypeScript
- Used for logging, quick capture, notifications, and offline use
- Optimized for speed of entry, not complex desktop-style layout

### Backend

- NestJS API for request handling and business rules
- Separate worker for jobs, projections, reminders, and integration sync
- PostgreSQL with Prisma as the primary data layer

## Architecture Style

The safest production-grade shape is a modular monolith with an async worker.

Why this fits Upward:

- Strong transactional consistency for user-owned data
- Easier development than early microservices
- Clean boundaries that can later be extracted if needed
- Better fit for a product with many related domains and shared analytics
- Lower operational overhead for a personal productivity app

## Architectural Principles

- User-owned data is the default boundary.
- Appends and logs are preferred over destructive updates.
- Analytics should use projections, not ad hoc scans on every request.
- Domain logic belongs on the backend, not in UI state.
- Offline mutations must be idempotent.
- Every table and endpoint should be designed for user-scoped access.
- Shared contracts should be explicit and versioned.
- Expensive work should be moved off the request path.

## Runtime Topology

- Web app talks to the API over HTTPS.
- Mobile app talks to the API over HTTPS and maintains an offline queue.
- API writes facts to PostgreSQL.
- Worker consumes jobs and domain events to build projections.
- Analytics reads from rollup tables and summary views.
- Notifications and integration sync happen asynchronously.

## Technology Stack Rationale

### TurboRepo

- Orchestrates app and package builds
- Keeps dependencies and caching efficient
- Makes the repo scalable as more packages appear

### NestJS

- Gives strict module boundaries
- Works well for validation, DI, guards, workers, schedulers, and background jobs
- Supports a clean domain-oriented backend structure

### PostgreSQL

- Strong fit for relational integrity and time-series data
- Handles both structured entities and append-heavy logs
- Supports indexing, partitioning, and rollup-friendly querying

### Prisma

- Type-safe database access
- Fast iteration for schema evolution and migrations
- Good developer ergonomics for a schema-heavy product

### TanStack Query

- Best fit for caching and server state on both web and mobile
- Handles retries, invalidation, background refresh, and optimistic updates

### Zustand

- Lightweight UI state management
- Good fit for drafts, modals, filters, selection state, and offline metadata

### Tailwind + NativeWind

- Shared visual language across web and native
- Enables token-driven styling and fast UI iteration

## Core Data Flow

1. User creates or edits data on web or mobile.
2. Client validates locally for immediate feedback.
3. Mutation is sent to API or stored in offline queue first.
4. API validates and persists the change.
5. Domain events or job requests are emitted.
6. Worker builds rollups, reminders, summaries, and search/index projections.
7. Client reads dashboard data through cached, versioned query endpoints.

## Key Strategic Choice

The most important decision is to treat analytics, notifications, and sync as projections over core facts rather than as part of the write transaction.

This keeps the product responsive, easier to reason about, and much easier to scale.
