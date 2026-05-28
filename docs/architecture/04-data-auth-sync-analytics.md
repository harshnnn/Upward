# Data, Auth, Sync, Analytics, and Scalability

## Authentication Architecture

Use short-lived access tokens with rotating refresh tokens.

### Recommended shape

- Email/password for baseline support
- Google and Apple OAuth for frictionless mobile sign-in
- Device-bound sessions for per-device revocation
- Secure httpOnly refresh cookies on web
- Secure device storage for mobile refresh tokens
- Central session management screen for the user

### Auth data model

- `User`
- `Credential`
- `Session`
- `RefreshToken`
- `OAuthAccount`
- `Device`
- `AuthAttempt`

### Auth rules

- All sign-in paths should be rate limited
- Refresh tokens must rotate on use
- Revocation must invalidate the session chain
- Account linking must be explicit and auditable
- Tokens must be scoped to the minimum needed lifespan

### Why this scales

- Supports multi-device usage cleanly
- Enables future shared accounts or family dashboards
- Keeps auth stateless at the edge while preserving server-side revocation control

## Database Architecture

Use PostgreSQL as the operational database and design for a hybrid of normalized entities and append-heavy fact tables.

### Core tables

- `users`
- `sessions`
- `devices`
- `credentials`
- `oauth_accounts`
- `tracker_definitions`
- `tracker_fields`
- `user_preferences`
- `notification_preferences`

### High-volume fact tables

- `habit_logs`
- `learning_sessions`
- `dsa_attempts`
- `vocabulary_reviews`
- `workout_sessions`
- `workout_sets`
- `nutrition_entries`
- `body_weight_entries`
- `mood_entries`
- `thoughts`
- `tracker_entries`
- `pull_request_records`

### Design principles

- Every user-owned record should include `user_id`
- High-frequency tables should index by `user_id` and timestamp
- Append-only tables are preferred for logs and facts
- Soft delete should be used only where the product needs recovery semantics
- JSONB should be reserved for flexible, low-query, schema-escape data
- Custom trackers should keep definition and entries separated

### Custom tracker modeling

- Store tracker schema in definition tables
- Store entries in a generic but queryable table
- Use typed columns or child tables for frequently queried field types
- Preserve historical compatibility when tracker fields evolve

## Offline Sync Strategy

Mobile needs local-first behavior.

### Sync model

- Client writes locally first when offline
- Mutations are queued with client-generated ids
- Server applies mutations idempotently
- Client receives a server cursor for incremental pull
- Changes are exchanged as deltas, not full reloads

### Conflict strategy

- Append-only entries should rarely conflict
- Editable definitions should use versioning or field-level conflict detection
- Last-write-wins is acceptable only for low-risk user-owned scalar fields
- Important records should preserve both versions or emit a conflict state

### Sync data model

- `SyncCursor`
- `PendingMutation`
- `AppliedMutation`
- `ConflictRecord`
- `DeviceSyncState`

### Sync endpoints

- `POST /api/v1/sync/push`
- `GET /api/v1/sync/pull`
- `POST /api/v1/sync/ack`
- `GET /api/v1/sync/state`

### Sync rules

- Every mutation must be idempotent
- Cursors must move only forward
- User and device scope must be verified on every sync request
- Replayed mutations must not duplicate side effects

## Analytics Strategy

Analytics must be projection-based.

### Raw facts

The source of truth is always the raw entry or event table.

### Projection layers

- Daily rollups for dashboard cards
- Weekly rollups for trend views
- Monthly rollups for historical analysis
- Lifetime summaries for instant profile stats

### Metric families

- Habit consistency
- Learning velocity
- DSA solve rate
- Vocabulary retention
- Workout volume and PRs
- Protein adherence
- Weight trends
- Mood volatility
- Thought frequency
- Custom tracker summaries

### Analytics data flow

1. User writes a fact.
2. API persists the source record.
3. Domain event or job request is emitted.
4. Worker updates rollups and derived metrics.
5. Web and mobile read precomputed summaries.

### Analytics tables

- `daily_rollups`
- `weekly_rollups`
- `monthly_rollups`
- `lifetime_summaries`
- `metric_snapshots`
- `correlation_results`

### Analytics rules

- Never compute expensive summaries on the hot path if they can be projected
- Timezone-aware day boundaries are mandatory
- Historical summaries should be stable and not retroactively shift unless explicitly rebuilt
- Drill-down queries can use raw data, but dashboard queries should prefer projections

## Event-Driven Architecture Opportunities

Events are a major scaling lever for Upward.

### Good event candidates

- `user.created`
- `habit.completed`
- `learning.session_logged`
- `dsa.attempt_logged`
- `vocabulary.review_logged`
- `workout.completed`
- `nutrition.logged`
- `body_weight.logged`
- `mood.logged`
- `thought.created`
- `tracker.entry_created`
- `pull_request.synced`
- `notification.due`
- `sync.mutation_applied`

### Event uses

- Analytics rollup generation
- Notification scheduling
- Search indexing
- Digest creation
- Reconciliation tasks
- Streak updates
- Integration repair jobs

### Event rules

- Include versioned payload metadata
- Consumers must be idempotent
- Version event schemas explicitly
- Keep events narrow and semantically clear

## Background Job Opportunities

The worker process should own all expensive or delayed work.

### Job candidates

- Daily analytics rollup generation
- Streak recalculation
- Reminder dispatch
- Digest generation
- Sync reconciliation
- Integration webhook retry
- Search indexing
- Correlation computation
- Export generation
- Backfills and schema migrations for derived data

### Job rules

- Jobs must be idempotent
- Retry policies must be bounded
- Failed jobs should be visible and recoverable
- Job payloads should carry enough identity to deduplicate

## Caching Opportunities

Cache only what is read often and expensive to recompute.

### Best cache targets

- User profile and settings
- Tracker definitions
- Habit schedules and today's reminders
- Analytics summary cards
- Streak computations
- Vocabulary review queue
- Workout templates
- Session lookups
- Feature flags

### Cache rules

- Key by user and version when relevant
- Invalidate on mutation or projection update
- Keep TTLs short for sensitive dashboard data
- Prefer stale-while-revalidate for summaries if latency matters

## Scalability Considerations For Millions Of Records

### Core rules

- Use keyset pagination everywhere
- Avoid offset pagination on large tables
- Prefer append-only facts over mutable history
- Index every high-volume table by `user_id` and timestamp
- Partition time-series tables when growth demands it
- Keep analytics queries off the write path
- Separate operational tables from derived summary tables

### Operational rules

- Add request tracing early
- Log with correlation ids and user ids
- Make writes idempotent
- Use job queues for all delayed work
- Keep boundaries strict so modules can be extracted later

### Data lifecycle rules

- Preserve raw facts as long as the product needs growth analytics
- Implement explicit archive policies for very old high-volume data if required
- Rebuild projections from source facts if a metric definition changes

## API Versioning Strategy

The app API should be versioned explicitly.

### Recommended approach

- Public app traffic uses `/api/v1`
- Sync protocol can have its own version field
- Event payloads should have schema versions
- Breaking changes should move to a new version rather than mutating old semantics

### Versioning rules

- Additive changes stay in the current version
- Breaking changes introduce a new version
- Old versions should remain compatible through a defined deprecation window
- Offline clients should not be surprised by silent behavioral shifts

## Final Architectural Posture

The overall posture is:

- Modular monolith backend
- Dedicated worker for projection and side effects
- Shared contracts between client and server
- Local-first sync on mobile
- Projection-based analytics
- Strong user-scoped data boundaries
- Design for extraction only after real scale demands it
