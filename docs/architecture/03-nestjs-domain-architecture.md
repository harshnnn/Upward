# NestJS Domain Architecture

## Backend Design Pattern

Every domain module should follow the same internal shape:

- `controllers/` or `routes/` for transport
- `services/` for application orchestration
- `repositories/` for database access
- `entities/` or `models/` for persistent shape
- `dto/` for input and output contracts
- `events/` for emitted domain events
- `validators/` for domain-specific rules
- `mappers/` for translating between layers

The rule is simple: controllers should be thin, services should own orchestration, repositories should own persistence, and domain rules should not leak into UI clients.

## 1. Auth Module

### Responsibilities

- Sign-up, sign-in, logout, refresh, password reset, OAuth linking, session management, and device revocation
- Enforce authentication policy and security controls
- Provide the principal context for every other module

### Entities / Models

- `User`
- `Credential`
- `Session`
- `RefreshToken`
- `OAuthAccount`
- `Device`
- `AuthAttempt`

### DTOs

- `SignUpDto`
- `SignInDto`
- `RefreshTokenDto`
- `LogoutDto`
- `ResetPasswordRequestDto`
- `ResetPasswordConfirmDto`
- `LinkOAuthAccountDto`
- `RevokeSessionDto`
- `CurrentSessionDto`

### API Endpoints

- `POST /api/v1/auth/sign-up`
- `POST /api/v1/auth/sign-in`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/password-reset/request`
- `POST /api/v1/auth/password-reset/confirm`
- `POST /api/v1/auth/oauth/:provider/link`
- `GET /api/v1/auth/me`
- `GET /api/v1/auth/sessions`
- `DELETE /api/v1/auth/sessions/:id`

### Services

- `AuthService`
- `TokenService`
- `SessionService`
- `PasswordService`
- `OAuthService`
- `DeviceService`

### Repositories

- `UserRepository`
- `CredentialRepository`
- `SessionRepository`
- `RefreshTokenRepository`
- `OAuthAccountRepository`
- `DeviceRepository`

### Events

- `user.created`
- `user.signed_in`
- `session.created`
- `session.revoked`
- `password.reset_requested`
- `oauth.account_linked`

### Validation Rules

- Email normalization and uniqueness
- Password complexity and length enforcement
- Refresh token rotation on every refresh cycle
- Login throttling and request rate limiting
- Device binding for session revocation and visibility
- Idempotent sign-up and password reset requests where applicable

### Relationships With Other Modules

- Supplies authenticated user identity and device context to every other module
- Emits events consumed by notifications and audit processes
- Owns account-level identity boundaries used by analytics and sync

### Future Scalability Considerations

- Add multi-device support from day one
- Preserve the ability to add passkeys or future auth providers
- Keep session state queryable for security dashboards
- Separate authentication and authorization concerns early

## 2. Profile Module

### Responsibilities

- User profile, defaults, preferences, locale, timezone, privacy settings, and onboarding state

### Entities / Models

- `UserProfile`
- `UserPreference`
- `UserSettings`
- `PrivacySetting`
- `OnboardingState`

### DTOs

- `UpdateProfileDto`
- `UpdatePreferencesDto`
- `UpdateSettingsDto`
- `UpdatePrivacySettingsDto`
- `CompleteOnboardingDto`

### API Endpoints

- `GET /api/v1/profile`
- `PATCH /api/v1/profile`
- `GET /api/v1/profile/preferences`
- `PATCH /api/v1/profile/preferences`
- `GET /api/v1/profile/settings`
- `PATCH /api/v1/profile/settings`

### Services

- `ProfileService`
- `PreferenceService`
- `SettingsService`
- `OnboardingService`
- `TimezoneService`

### Repositories

- `ProfileRepository`
- `PreferenceRepository`
- `SettingsRepository`

### Events

- `profile.updated`
- `preferences.updated`
- `settings.updated`
- `onboarding.completed`

### Validation Rules

- Timezone must be a valid IANA timezone
- Locale must be supported by the app
- Units must be consistent across weight, nutrition, and workout calculations
- Privacy options must not conflict with each other

### Relationships With Other Modules

- Feeds user defaults to workouts, nutrition, body weight, and analytics formatting
- Used by reminder scheduling and timestamp rendering
- Affects offline sync behavior through timezone and locale assumptions

### Future Scalability Considerations

- Cache profile reads aggressively
- Keep settings normalized so defaults can evolve independently
- Support multiple display contexts later without schema churn

## 3. Habits Module

### Responsibilities

- Habit creation, schedules, completion logging, streak calculations, reminders, and adherence tracking

### Entities / Models

- `Habit`
- `HabitSchedule`
- `HabitLog`
- `HabitStreak`
- `HabitRule`
- `HabitReminder`

### DTOs

- `CreateHabitDto`
- `UpdateHabitDto`
- `LogHabitCompletionDto`
- `UpdateHabitScheduleDto`
- `HabitStreakQueryDto`

### API Endpoints

- `GET /api/v1/habits`
- `POST /api/v1/habits`
- `GET /api/v1/habits/:id`
- `PATCH /api/v1/habits/:id`
- `DELETE /api/v1/habits/:id`
- `POST /api/v1/habits/:id/logs`
- `GET /api/v1/habits/:id/logs`
- `GET /api/v1/habits/:id/streak`
- `POST /api/v1/habits/:id/reminders`

### Services

- `HabitService`
- `HabitLogService`
- `HabitRuleService`
- `HabitReminderService`
- `StreakService`

### Repositories

- `HabitRepository`
- `HabitScheduleRepository`
- `HabitLogRepository`
- `HabitReminderRepository`

### Events

- `habit.created`
- `habit.updated`
- `habit.completed`
- `habit.streak_broken`
- `habit.reminder_due`

### Validation Rules

- Habit schedule cadence must be valid
- Completion logs must respect the scheduled period
- Duplicate log submissions should be idempotent where appropriate
- Reminder timestamps must respect user timezone and quiet hours

### Relationships With Other Modules

- Analytics consumes logs and streak events
- Notifications consumes reminder events
- Profile preferences influence timing and display

### Future Scalability Considerations

- Keep logs append-only
- Use daily rollups for streak and adherence calculations
- Partition logs if completion volume grows substantially

## 4. Learning Module

### Responsibilities

- Track learning goals, sessions, progress, notes, and completion status across books, courses, and topics

### Entities / Models

- `LearningGoal`
- `LearningItem`
- `LearningSession`
- `LearningProgress`
- `LearningCheckpoint`
- `LearningNote`

### DTOs

- `CreateLearningItemDto`
- `UpdateLearningItemDto`
- `LogLearningSessionDto`
- `UpdateLearningProgressDto`
- `CompleteLearningGoalDto`

### API Endpoints

- `GET /api/v1/learning/items`
- `POST /api/v1/learning/items`
- `GET /api/v1/learning/items/:id`
- `PATCH /api/v1/learning/items/:id`
- `POST /api/v1/learning/items/:id/sessions`
- `GET /api/v1/learning/items/:id/sessions`
- `PATCH /api/v1/learning/items/:id/progress`
- `GET /api/v1/learning/summary`

### Services

- `LearningItemService`
- `LearningSessionService`
- `LearningProgressService`
- `LearningGoalService`

### Repositories

- `LearningItemRepository`
- `LearningSessionRepository`
- `LearningProgressRepository`

### Events

- `learning.item_created`
- `learning.session_logged`
- `learning.progress_updated`
- `learning.goal_completed`

### Validation Rules

- Progress values must stay within configured bounds
- Session durations must be non-negative and realistic
- Duplicate session posts must be idempotent
- Completion state transitions must be coherent

### Relationships With Other Modules

- Feeds analytics for learning velocity and consistency
- Can attach notes or tags that later become searchable
- Can be correlated with habits and custom trackers

### Future Scalability Considerations

- Keep sessions append-only
- Use cursors for large item lists
- Aggregate progress metrics asynchronously

## 5. DSA Module

### Responsibilities

- Track algorithm questions, attempts, solutions, revisions, topic mastery, and practice history

### Entities / Models

- `DsaQuestion`
- `DsaAttempt`
- `DsaSolution`
- `DsaPattern`
- `DsaRevision`
- `DsaCompanyTag`

### DTOs

- `CreateDsaQuestionDto`
- `LogDsaAttemptDto`
- `SaveDsaSolutionDto`
- `UpdateDsaStatusDto`
- `QueryDsaProgressDto`

### API Endpoints

- `GET /api/v1/dsa/questions`
- `POST /api/v1/dsa/questions`
- `GET /api/v1/dsa/questions/:id`
- `PATCH /api/v1/dsa/questions/:id`
- `POST /api/v1/dsa/questions/:id/attempts`
- `POST /api/v1/dsa/questions/:id/solutions`
- `GET /api/v1/dsa/summary`

### Services

- `DsaQuestionService`
- `DsaAttemptService`
- `DsaSolutionService`
- `DsaProgressService`

### Repositories

- `DsaQuestionRepository`
- `DsaAttemptRepository`
- `DsaSolutionRepository`

### Events

- `dsa.question_created`
- `dsa.attempt_logged`
- `dsa.question_solved`
- `dsa.revision_completed`

### Validation Rules

- Difficulty and status should map to controlled values
- Attempts should not be duplicated accidentally
- Solution text should be sanitized and bounded
- Revision history should remain consistent across edits

### Relationships With Other Modules

- Feeds analytics for solve rate, topic coverage, and consistency
- Can share tag and note semantics with learning and search

### Future Scalability Considerations

- Store raw attempts and current state separately
- Add search-friendly indexing for notes later
- Keep solution history versioned for replay and review

## 6. Vocabulary Module

### Responsibilities

- Word capture, review scheduling, retention tracking, examples, and language growth analytics

### Entities / Models

- `VocabularyWord`
- `VocabularyDefinition`
- `VocabularyExample`
- `VocabularyReview`
- `VocabularySource`
- `VocabularyMemoryScore`

### DTOs

- `CreateVocabularyWordDto`
- `UpdateVocabularyWordDto`
- `LogVocabularyReviewDto`
- `BulkImportVocabularyDto`

### API Endpoints

- `GET /api/v1/vocabulary/words`
- `POST /api/v1/vocabulary/words`
- `GET /api/v1/vocabulary/words/:id`
- `PATCH /api/v1/vocabulary/words/:id`
- `POST /api/v1/vocabulary/words/:id/reviews`
- `GET /api/v1/vocabulary/review-queue`

### Services

- `VocabularyService`
- `VocabularyReviewService`
- `VocabularySpacedRepetitionService`

### Repositories

- `VocabularyWordRepository`
- `VocabularyReviewRepository`

### Events

- `vocabulary.word_added`
- `vocabulary.review_logged`
- `vocabulary.retention_updated`

### Validation Rules

- Word uniqueness should be enforced by scope where needed
- Review timestamps must support spaced-repetition logic
- Definitions and examples must be size-limited
- Imported records should be deduplicated cleanly

### Relationships With Other Modules

- Feeds analytics for growth and retention curves
- Can later participate in full-text search and AI summaries

### Future Scalability Considerations

- Cache the next review queue
- Keep review logs append-only
- Offload retention calculations to the worker

## 7. Custom Trackers Module

### Responsibilities

- Flexible, user-defined trackers with arbitrary schemas, typed fields, entries, and visualization metadata

### Entities / Models

- `TrackerDefinition`
- `TrackerField`
- `TrackerEntry`
- `TrackerEntryValue`
- `TrackerViewConfig`
- `TrackerAggregationConfig`

### DTOs

- `CreateTrackerDefinitionDto`
- `UpdateTrackerDefinitionDto`
- `CreateTrackerEntryDto`
- `UpdateTrackerEntryDto`
- `BulkCreateTrackerEntriesDto`
- `ReorderTrackerFieldsDto`

### API Endpoints

- `GET /api/v1/trackers`
- `POST /api/v1/trackers`
- `GET /api/v1/trackers/:id`
- `PATCH /api/v1/trackers/:id`
- `DELETE /api/v1/trackers/:id`
- `POST /api/v1/trackers/:id/entries`
- `GET /api/v1/trackers/:id/entries`
- `PATCH /api/v1/trackers/:id/entries/:entryId`
- `DELETE /api/v1/trackers/:id/entries/:entryId`

### Services

- `TrackerDefinitionService`
- `TrackerFieldService`
- `TrackerEntryService`
- `TrackerValidationService`
- `TrackerAggregationService`

### Repositories

- `TrackerDefinitionRepository`
- `TrackerFieldRepository`
- `TrackerEntryRepository`
- `TrackerEntryValueRepository`

### Events

- `tracker.created`
- `tracker.updated`
- `tracker.entry_created`
- `tracker.entry_updated`
- `tracker.field_changed`

### Validation Rules

- Field types must be constrained
- Numeric fields must enforce min/max and unit consistency
- Time-based fields must respect timezone semantics
- Schema evolution must not corrupt historical entries
- Field changes should be versioned rather than destructive when possible

### Relationships With Other Modules

- Analytics consumes tracker entries generically
- Sync must understand schema evolution for offline writes
- Search can index tracker definitions and tags later

### Future Scalability Considerations

- Version tracker schemas explicitly
- Avoid a JSONB-only design for every entry if queryability matters
- Use typed storage paths for frequently queried dimensions

## 8. Workouts Module

### Responsibilities

- Workout sessions, exercises, sets, personal records, training plans, and progression history

### Entities / Models

- `WorkoutSession`
- `Exercise`
- `WorkoutExercise`
- `WorkoutSet`
- `WorkoutPlan`
- `ExercisePR`
- `WorkoutTemplate`

### DTOs

- `CreateWorkoutSessionDto`
- `LogWorkoutSetDto`
- `CreateWorkoutPlanDto`
- `UpdateWorkoutPlanDto`
- `CompleteWorkoutSessionDto`
- `LogExercisePrDto`

### API Endpoints

- `GET /api/v1/workouts/sessions`
- `POST /api/v1/workouts/sessions`
- `GET /api/v1/workouts/sessions/:id`
- `PATCH /api/v1/workouts/sessions/:id`
- `POST /api/v1/workouts/sessions/:id/sets`
- `GET /api/v1/workouts/plans`
- `POST /api/v1/workouts/plans`
- `GET /api/v1/workouts/exercises`
- `POST /api/v1/workouts/exercises/:id/prs`

### Services

- `WorkoutSessionService`
- `WorkoutPlanService`
- `ExerciseService`
- `ProgressionService`
- `ExercisePrService`

### Repositories

- `WorkoutSessionRepository`
- `WorkoutSetRepository`
- `WorkoutPlanRepository`
- `ExerciseRepository`
- `ExercisePrRepository`

### Events

- `workout.session_started`
- `workout.session_completed`
- `workout.set_logged`
- `exercise.pr_updated`

### Validation Rules

- Set values must be realistic and non-negative
- Session completion state must remain consistent
- Exercise naming should be normalized
- PR updates should be deduplicated or versioned

### Relationships With Other Modules

- Nutrition can correlate protein intake with training
- Body weight and mood can correlate with training consistency
- Analytics consumes session volume and PR progression

### Future Scalability Considerations

- Keep session and set data append-friendly
- Precompute weekly volume and PR summaries
- Use indexes on user and session date

## 9. Nutrition Module

### Responsibilities

- Food and macro logging with emphasis on protein intake, goals, and compliance

### Entities / Models

- `NutritionEntry`
- `Meal`
- `MacroTarget`
- `ProteinGoal`
- `FoodItem`
- `NutritionSource`

### DTOs

- `LogNutritionEntryDto`
- `UpdateMacroTargetDto`
- `SetProteinGoalDto`
- `CreateMealDto`

### API Endpoints

- `GET /api/v1/nutrition/entries`
- `POST /api/v1/nutrition/entries`
- `GET /api/v1/nutrition/summary`
- `PATCH /api/v1/nutrition/goals`
- `POST /api/v1/nutrition/meals`

### Services

- `NutritionService`
- `MacroTargetService`
- `ProteinGoalService`
- `MealService`

### Repositories

- `NutritionEntryRepository`
- `MacroTargetRepository`
- `MealRepository`

### Events

- `nutrition.entry_logged`
- `nutrition.goal_updated`
- `protein.target_met`
- `protein.target_missed`

### Validation Rules

- Macro values must be internally consistent
- Nutrient quantities must be non-negative
- Goals must stay within sane ranges
- Meal timestamps must be timezone-aware

### Relationships With Other Modules

- Correlates with workouts and weight trends
- Feeds analytics for protein adherence and diet compliance
- Can be referenced by custom trackers for specialized nutrition goals

### Future Scalability Considerations

- Keep raw entries but build daily summaries
- Cache dashboard nutrition cards
- Avoid expensive recomputation on every read

## 10. Body Weight Module

### Responsibilities

- Weight entry logging, trend smoothing, and progress analysis

### Entities / Models

- `BodyWeightEntry`
- `WeightTrend`
- `MeasurementUnitPreference`

### DTOs

- `LogBodyWeightDto`
- `UpdateBodyWeightEntryDto`
- `WeightTrendQueryDto`

### API Endpoints

- `GET /api/v1/body-weight/entries`
- `POST /api/v1/body-weight/entries`
- `PATCH /api/v1/body-weight/entries/:id`
- `GET /api/v1/body-weight/trend`
- `GET /api/v1/body-weight/summary`

### Services

- `BodyWeightService`
- `WeightTrendService`
- `WeightNormalizationService`

### Repositories

- `BodyWeightEntryRepository`
- `WeightTrendRepository`

### Events

- `body_weight.logged`
- `body_weight.trend_updated`

### Validation Rules

- Weight must be positive and realistic
- Units must match user preferences and stored conversions
- Duplicate timestamps should be handled deliberately

### Relationships With Other Modules

- Feeds health dashboards and trend summaries
- Correlates with nutrition and workout adherence
- Can participate in weight-loss or bulk goals later

### Future Scalability Considerations

- Index on user and date
- Keep raw entries immutable when possible
- Use worker-generated trend smoothing

## 11. Mood Module

### Responsibilities

- Mood logging, sentiment scale tracking, tags, and mood trend analysis

### Entities / Models

- `MoodEntry`
- `MoodTag`
- `MoodScaleDefinition`
- `MoodCorrelation`

### DTOs

- `LogMoodEntryDto`
- `UpdateMoodEntryDto`
- `MoodTrendQueryDto`
- `MoodTagDto`

### API Endpoints

- `GET /api/v1/mood/entries`
- `POST /api/v1/mood/entries`
- `PATCH /api/v1/mood/entries/:id`
- `GET /api/v1/mood/trend`
- `GET /api/v1/mood/summary`

### Services

- `MoodService`
- `MoodTrendService`
- `MoodCorrelationService`

### Repositories

- `MoodEntryRepository`
- `MoodTagRepository`

### Events

- `mood.logged`
- `mood.updated`
- `mood.trend_changed`

### Validation Rules

- Scale values must stay within the configured range
- Tags should be normalized
- Entry text should be bounded and sanitized

### Relationships With Other Modules

- Correlates with habits, workouts, sleep-adjacent future modules, and thoughts
- Feeds long-term behavioral insights

### Future Scalability Considerations

- Keep raw logs for future AI and trend analysis
- Run correlations asynchronously
- Index by date and tag

## 12. Thoughts Module

### Responsibilities

- Timestamped thoughts, journaling, reflections, tags, and timeline capture

### Entities / Models

- `Thought`
- `ThoughtTag`
- `ThoughtThread`
- `ThoughtReflection`

### DTOs

- `CreateThoughtDto`
- `UpdateThoughtDto`
- `TagThoughtDto`
- `SearchThoughtsDto`
- `ReflectOnThoughtDto`

### API Endpoints

- `GET /api/v1/thoughts`
- `POST /api/v1/thoughts`
- `GET /api/v1/thoughts/:id`
- `PATCH /api/v1/thoughts/:id`
- `DELETE /api/v1/thoughts/:id`
- `POST /api/v1/thoughts/:id/tags`
- `GET /api/v1/thoughts/search`

### Services

- `ThoughtService`
- `ThoughtTagService`
- `ThoughtSearchService`
- `ReflectionService`

### Repositories

- `ThoughtRepository`
- `ThoughtTagRepository`
- `ThoughtThreadRepository`

### Events

- `thought.created`
- `thought.updated`
- `thought.tagged`
- `thought.reflection_added`

### Validation Rules

- Timestamp must be timezone-aware
- Text length should be bounded
- Searchable fields must be sanitized
- Tags should be normalized

### Relationships With Other Modules

- Feeds analytics for journaling frequency and mood linkage
- Natural future consumer of search infrastructure
- Can later support AI summaries and reflections

### Future Scalability Considerations

- Prefer append-like capture semantics
- Keep search indexing separate from request handling
- Support long timeline queries with cursor pagination

## 13. Integrations / PRs Module

### Responsibilities

- External integrations, repository linking, PR metadata sync, and provider event reconciliation

### Entities / Models

- `Integration`
- `IntegrationAccount`
- `GitHubRepositoryLink`
- `PullRequestRecord`
- `PullRequestEvent`
- `IntegrationSyncCursor`

### DTOs

- `ConnectIntegrationDto`
- `DisconnectIntegrationDto`
- `SyncIntegrationDto`
- `UpsertPrRecordDto`
- `RepositoryLinkDto`

### API Endpoints

- `GET /api/v1/integrations`
- `POST /api/v1/integrations/github/connect`
- `POST /api/v1/integrations/github/sync`
- `DELETE /api/v1/integrations/:id`
- `GET /api/v1/integrations/github/repositories`
- `POST /api/v1/integrations/github/repositories/link`

### Services

- `IntegrationService`
- `GitHubIntegrationService`
- `IntegrationSyncService`
- `PullRequestService`

### Repositories

- `IntegrationRepository`
- `IntegrationAccountRepository`
- `PullRequestRepository`
- `IntegrationSyncCursorRepository`

### Events

- `integration.connected`
- `integration.disconnected`
- `integration.sync_requested`
- `pull_request.recorded`
- `pull_request.merged`

### Validation Rules

- Provider tokens must be encrypted and rotated safely
- Repository ownership must be verified
- Sync cursors must move monotonically
- Provider event ids must deduplicate incoming payloads

### Relationships With Other Modules

- PR throughput can become a custom tracker or analytics metric
- Can feed productivity dashboards
- May later support multiple providers beyond GitHub

### Future Scalability Considerations

- Prefer webhook-driven sync plus periodic reconciliation
- Store provider ids for idempotency
- Keep external provider logic isolated from core domains

## 14. Notifications Module

### Responsibilities

- Reminders, nudges, digests, scheduled delivery, and notification state

### Entities / Models

- `Notification`
- `NotificationRule`
- `NotificationPreference`
- `DeliveryAttempt`
- `ReminderSchedule`

### DTOs

- `CreateNotificationRuleDto`
- `UpdateNotificationPreferenceDto`
- `CreateReminderDto`
- `MarkNotificationReadDto`

### API Endpoints

- `GET /api/v1/notifications`
- `POST /api/v1/notifications/rules`
- `PATCH /api/v1/notifications/preferences`
- `POST /api/v1/notifications/:id/read`

### Services

- `NotificationService`
- `ReminderService`
- `DeliveryService`
- `DigestService`

### Repositories

- `NotificationRepository`
- `NotificationRuleRepository`
- `DeliveryAttemptRepository`

### Events

- `notification.scheduled`
- `notification.sent`
- `notification.failed`
- `reminder.due`

### Validation Rules

- Delivery channels must respect user preferences
- Quiet hours and timezone windows must be enforced
- Retry policies must be bounded

### Relationships With Other Modules

- Consumes events from habits, workouts, mood, and sync
- Keeps the system behaviorally active without polluting domain logic

### Future Scalability Considerations

- Send delivery work through jobs, not request threads
- Keep notification generation idempotent
- Separate selection logic from transport logic

## 15. Sync Module

### Responsibilities

- Offline synchronization, mutation queues, conflict handling, and incremental state exchange

### Entities / Models

- `DeviceSyncState`
- `SyncCursor`
- `PendingMutation`
- `AppliedMutation`
- `ConflictRecord`

### DTOs

- `PushSyncDto`
- `PullSyncDto`
- `MutationEnvelopeDto`
- `SyncAckDto`
- `ConflictResolutionDto`

### API Endpoints

- `POST /api/v1/sync/push`
- `GET /api/v1/sync/pull`
- `POST /api/v1/sync/ack`
- `GET /api/v1/sync/state`

### Services

- `SyncService`
- `MutationInboxService`
- `ConflictResolutionService`
- `ChangefeedService`

### Repositories

- `SyncCursorRepository`
- `PendingMutationRepository`
- `ConflictRepository`

### Events

- `sync.mutation_received`
- `sync.mutation_applied`
- `sync.conflict_detected`
- `sync.cursor_advanced`

### Validation Rules

- Mutation envelopes must be idempotent
- Cursors must only move forward
- Every push or pull request must be user-scoped and authenticated
- Conflicts must be classified consistently

### Relationships With Other Modules

- Sync is a transport and reconciliation layer, not a business domain
- It coordinates writes across all tracking modules
- It is essential for mobile offline behavior

### Future Scalability Considerations

- Cursor-based deltas only
- Device-aware sync state
- Append-only mutation logs for replay safety
- Separate push and pull flows cleanly

## 16. Analytics Module

### Responsibilities

- Aggregations, rollups, trends, correlations, and dashboard-ready read models

### Entities / Models

- `MetricDefinition`
- `MetricSnapshot`
- `DailyRollup`
- `WeeklyRollup`
- `MonthlyRollup`
- `LifetimeSummary`
- `CorrelationResult`
- `AnalyticsCursor`

### DTOs

- `AnalyticsRangeQueryDto`
- `AnalyticsSummaryDto`
- `MetricBreakdownDto`
- `CorrelationQueryDto`

### API Endpoints

- `GET /api/v1/analytics/summary`
- `GET /api/v1/analytics/daily`
- `GET /api/v1/analytics/weekly`
- `GET /api/v1/analytics/monthly`
- `GET /api/v1/analytics/metrics/:metricKey`
- `GET /api/v1/analytics/correlations`

### Services

- `AnalyticsQueryService`
- `AnalyticsRollupService`
- `CorrelationService`
- `GrowthSummaryService`
- `MetricRegistryService`

### Repositories

- `DailyRollupRepository`
- `WeeklyRollupRepository`
- `MonthlyRollupRepository`
- `LifetimeSummaryRepository`
- `MetricSnapshotRepository`

### Events

- `analytics.rollup_requested`
- `analytics.rollup_completed`
- `analytics.summary_updated`

### Validation Rules

- Date ranges must be bounded
- Metric keys must be registered and versioned
- Rollup windows must respect timezone rules

### Relationships With Other Modules

- Consumes events from every tracking domain
- Serves all long-term growth and dashboard views
- Must stay isolated from write-path latency

### Future Scalability Considerations

- Precompute aggressively
- Use partitioned or compact summary tables as needed
- Keep metrics versioned so charts stay stable over time
- Prefer read models optimized for screen needs over raw data shape

## 17. Search Module, Optional but Recommended Later

### Responsibilities

- Cross-domain search for thoughts, trackers, vocabulary, learning, and other text-heavy records

### Entities / Models

- `SearchIndexRecord`
- `SearchCursor`

### DTOs

- `SearchQueryDto`

### API Endpoints

- `GET /api/v1/search`

### Services

- `SearchService`
- `IndexingService`

### Repositories

- `SearchIndexRepository`

### Events

- `search.index_requested`
- `search.index_updated`

### Validation Rules

- Query length should be bounded
- Search access must respect authorization scope
- Indexing must be idempotent

### Relationships With Other Modules

- Consumes events from all content-heavy domains
- Useful for future retrieval and AI-assisted workflows

### Future Scalability Considerations

- Begin with PostgreSQL full-text search if it is sufficient
- Move to a dedicated search engine only when query complexity demands it

## 18. Cross-Cutting Support Modules

### Admin Module

- Internal dashboards, moderation, migrations, user support tools, and repair actions
- Keep tightly locked down and separate from end-user paths

### Health Module

- Liveness, readiness, dependency checks, and release verification
- Essential for deployment safety and observability

### Why These Matter

- They support production operations without polluting user-facing domains
- They let the team operate the system safely as data volume grows

## Module Interaction Summary

- Auth and Profile establish identity and defaults
- Habits, Learning, DSA, Vocabulary, Workouts, Nutrition, Weight, Mood, Thoughts, and Custom Trackers produce the raw facts
- Integrations brings in external productivity data like PRs
- Sync keeps offline clients aligned with the server
- Notifications keeps engagement and reminders timely
- Analytics turns facts into growth insights
- Search becomes the retrieval layer when text volume grows

## Scalability Posture

The module strategy is intentionally conservative:

- Keep domains isolated
- Keep contracts explicit
- Keep writes simple and idempotent
- Keep analytics asynchronous
- Keep expensive work in workers
- Keep future service extraction possible without overengineering now
