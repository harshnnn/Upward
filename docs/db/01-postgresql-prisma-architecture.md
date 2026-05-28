# Upward PostgreSQL and Prisma Architecture

## Scope

This document defines the production-grade PostgreSQL data model for Upward using Prisma ORM. It is designed to support user identity, auth, habits, trackers, workouts, nutrition, body weight, vocabulary, journals, mood, reminders, notifications, sync, audit logs, analytics snapshots, and future AI/social features.

The design keeps the schema normalized, scalable, and maintainable without over-engineering microservice boundaries or premature data platform complexity.

## Design Goals

- PostgreSQL-first and Prisma-friendly.
- UUID primary keys everywhere.
- createdAt and updatedAt everywhere.
- Soft delete where user-facing recovery matters.
- Scalable to millions of records.
- Offline-first and multi-device sync ready.
- Analytics-ready without forcing a warehouse design too early.
- Flexible custom trackers without schema chaos.
- Future AI and social support without redesigning the core model.

## Critical Review Before Finalizing

A simpler first draft of this schema would have had these weaknesses:

- Custom trackers could become too ad hoc if versioning was not explicit.
- Tags could become duplicated across modules if each feature invented its own join table shape.
- Analytics could accidentally mix source facts and derived data.
- Offline sync could be under-modeled if device state and mutation tracking were not first-class.
- Vocabulary could become hard to query if meanings, examples, personal sentences, and revisions were collapsed into one table.
- Future AI and social features could force a later schema rewrite if no lightweight placeholders existed.

### Improvements Applied

- Tracker templates are versioned explicitly.
- Tags use a single reusable assignment model with typed entity references.
- Derived analytics is separated from raw facts.
- Sync metadata is first-class with device and mutation tables.
- Vocabulary is normalized into meanings, examples, personal sentences, and revision history.
- AI insights and user relationships are modeled as light, optional extensions rather than a separate system.

## Final Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  USER
  ADMIN
}

enum UserStatus {
  ACTIVE
  SUSPENDED
  DELETED
}

enum AuthProvider {
  PASSWORD
  GOOGLE
  APPLE
  GITHUB
}

enum SessionStatus {
  ACTIVE
  REVOKED
  EXPIRED
}

enum GoalStatus {
  ACTIVE
  PAUSED
  COMPLETED
  ARCHIVED
}

enum GoalScopeType {
  HABIT
  TRACKER_TEMPLATE
  TRACKER_ENTRY
  WORKOUT
  NUTRITION
  BODY_WEIGHT
  LEARNING
  DSA
  VOCABULARY
  JOURNAL
  MOOD
  CUSTOM
}

enum StreakSourceType {
  HABIT
  GOAL
  CUSTOM
}

enum HabitCadenceType {
  DAILY
  WEEKLY
  MONTHLY
  CUSTOM
}

enum HabitLogStatus {
  DONE
  SKIPPED
}

enum TrackerFieldType {
  TEXT
  NUMBER
  BOOLEAN
  DATE
  DATETIME
  SELECT
  MULTI_SELECT
  JSON
}

enum TrackerEntryStatus {
  DRAFT
  CONFIRMED
  DELETED
}

enum WorkoutSetType {
  WARMUP
  WORKING
  DROP_SET
  FINISHER
}

enum WorkoutUnit {
  KG
  LB
  REPS
  SECONDS
  MINUTES
}

enum NutritionMealType {
  BREAKFAST
  LUNCH
  DINNER
  SNACK
  PRE_WORKOUT
  POST_WORKOUT
  OTHER
}

enum WeightUnit {
  KG
  LB
}

enum ReminderStatus {
  ACTIVE
  PAUSED
  DISABLED
}

enum NotificationChannel {
  IN_APP
  PUSH
  EMAIL
}

enum NotificationStatus {
  QUEUED
  SENT
  DELIVERED
  FAILED
  READ
  DISMISSED
}

enum SyncMutationStatus {
  PENDING
  APPLIED
  FAILED
  CONFLICT
}

enum SyncConflictStatus {
  OPEN
  RESOLVED
  IGNORED
}

enum AuditAction {
  CREATE
  UPDATE
  DELETE
  LOGIN
  LOGOUT
  SYNC_APPLY
  SYSTEM
}

enum RelationshipType {
  FOLLOW
  FRIEND
  SHARED_ACCESS
  BLOCK
}

enum RelationshipStatus {
  PENDING
  ACCEPTED
  REJECTED
  BLOCKED
}

enum InsightStatus {
  PENDING
  READY
  DISMISSED
  EXPIRED
}

enum TagTargetType {
  HABIT
  TRACKER_TEMPLATE
  TRACKER_ENTRY
  WORKOUT_SESSION
  NUTRITION_ENTRY
  BODY_WEIGHT_ENTRY
  SAVED_WORD
  JOURNAL_ENTRY
  MOOD_ENTRY
  GOAL
  REMINDER
  AI_INSIGHT
}

enum AIInsightType {
  SUMMARY
  CORRELATION
  FORECAST
  ANOMALY
  SUGGESTION
}

model User {
  id           String        @id @default(uuid()) @db.Uuid
  email        String        @unique
  handle       String?       @unique
  displayName  String?
  role         UserRole      @default(USER)
  status       UserStatus    @default(ACTIVE)
  lastLoginAt  DateTime?
  deletedAt    DateTime?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  profile          UserProfile?
  credential       UserCredential?
  oauthAccounts    OAuthAccount[]
  sessions         Session[]
  devices          Device[]
  syncStates       DeviceSyncState[]
  habits           Habit[]
  habitLogs        HabitLog[]
  goals            Goal[]
  streaks          Streak[]
  dailySummaries   DailySummary[]
  trackerTemplates TrackerTemplate[]
  trackerEntries   TrackerEntry[]
  workoutPlans     WorkoutPlan[]
  workoutSessions  WorkoutSession[]
  exercises        Exercise[]
  personalRecords  PersonalRecord[]
  nutritionGoals   NutritionGoal[]
  nutritionEntries  NutritionEntry[]
  bodyWeightLogs   BodyWeightEntry[]
  savedWords       SavedWord[]
  journalEntries   JournalEntry[]
  moodEntries      MoodEntry[]
  tags             Tag[]
  reminders        Reminder[]
  notifications    Notification[]
  analytics        AnalyticsSnapshot[]
  aiInsights       AiInsight[]
  auditLogsAsActor  AuditLog[] @relation("AuditActor")
  auditLogsAsTarget AuditLog[] @relation("AuditTarget")
  outgoingRelations UserRelation[] @relation("OutgoingRelations")
  incomingRelations UserRelation[] @relation("IncomingRelations")

  @@index([status, createdAt])
  @@map("users")
}

model UserProfile {
  id                   String   @id @default(uuid()) @db.Uuid
  userId               String   @unique @db.Uuid
  timezone             String
  locale               String   @default("en")
  measurementSystem    String   @default("metric")
  darkModePreferred    Boolean  @default(true)
  onboardingCompletedAt DateTime?
  bio                  String?
  avatarUrl            String?
  deletedAt            DateTime?
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([timezone])
  @@map("user_profiles")
}

model UserCredential {
  id                   String      @id @default(uuid()) @db.Uuid
  userId               String      @unique @db.Uuid
  provider             AuthProvider @default(PASSWORD)
  passwordHash         String?
  passwordChangedAt    DateTime?
  mustChangePassword   Boolean     @default(false)
  deletedAt            DateTime?
  createdAt            DateTime    @default(now())
  updatedAt            DateTime    @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([provider])
  @@map("user_credentials")
}

model OAuthAccount {
  id                    String   @id @default(uuid()) @db.Uuid
  userId                String   @db.Uuid
  provider              AuthProvider
  providerAccountId     String
  accessTokenEncrypted  String?
  refreshTokenEncrypted String?
  scopes                String?
  deletedAt             DateTime?
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId, provider])
  @@map("oauth_accounts")
}

model Session {
  id                   String        @id @default(uuid()) @db.Uuid
  userId               String        @db.Uuid
  deviceId             String?       @db.Uuid
  status               SessionStatus @default(ACTIVE)
  ipAddress            String?
  userAgent            String?
  refreshTokenHash     String?
  issuedAt             DateTime      @default(now())
  expiresAt            DateTime
  revokedAt            DateTime?
  lastSeenAt           DateTime?
  deletedAt            DateTime?
  createdAt            DateTime      @default(now())
  updatedAt            DateTime      @updatedAt

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  device Device? @relation(fields: [deviceId], references: [id], onDelete: SetNull)

  @@index([userId, status, expiresAt])
  @@index([deviceId, status])
  @@map("sessions")
}

model Device {
  id               String   @id @default(uuid()) @db.Uuid
  userId           String   @db.Uuid
  name             String
  platform         String
  pushToken        String?
  deviceFingerprint String?
  lastSeenAt       DateTime?
  deletedAt        DateTime?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  user         User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  sessions     Session[]
  syncState    DeviceSyncState?

  @@unique([userId, deviceFingerprint])
  @@index([userId, platform])
  @@map("devices")
}

model DeviceSyncState {
  id                String   @id @default(uuid()) @db.Uuid
  userId            String   @db.Uuid
  deviceId          String   @unique @db.Uuid
  lastPulledCursor   String?
  lastPushedCursor   String?
  lastSyncAt        DateTime?
  deletedAt         DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  device Device @relation(fields: [deviceId], references: [id], onDelete: Cascade)

  @@index([userId, lastSyncAt])
  @@map("device_sync_states")
}

model SyncMutation {
  id                String            @id @default(uuid()) @db.Uuid
  userId            String            @db.Uuid
  deviceId          String            @db.Uuid
  clientMutationId  String
  entityType        String
  entityId          String?
  operation         String
  payload           Json
  status            SyncMutationStatus @default(PENDING)
  errorMessage      String?
  occurredAt        DateTime
  appliedAt         DateTime?
  deletedAt         DateTime?
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  device Device @relation(fields: [deviceId], references: [id], onDelete: Cascade)

  @@unique([userId, deviceId, clientMutationId])
  @@index([userId, status, occurredAt])
  @@index([entityType, entityId])
  @@map("sync_mutations")
}

model SyncConflict {
  id               String            @id @default(uuid()) @db.Uuid
  userId           String            @db.Uuid
  deviceId         String?           @db.Uuid
  mutationId       String?           @db.Uuid
  entityType       String
  entityId         String?
  status           SyncConflictStatus @default(OPEN)
  clientState      Json?
  serverState      Json?
  resolvedByUserId String?           @db.Uuid
  resolvedAt       DateTime?
  deletedAt       DateTime?
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  user    User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  device  Device?   @relation(fields: [deviceId], references: [id], onDelete: SetNull)
  mutation SyncMutation? @relation(fields: [mutationId], references: [id], onDelete: SetNull)
  resolver User?    @relation(fields: [resolvedByUserId], references: [id], onDelete: SetNull)

  @@index([userId, status, createdAt])
  @@index([entityType, entityId])
  @@map("sync_conflicts")
}

model Goal {
  id                String        @id @default(uuid()) @db.Uuid
  userId            String        @db.Uuid
  title             String
  description       String?
  status            GoalStatus     @default(ACTIVE)
  scopeType         GoalScopeType
  sourceEntityType  String?
  sourceEntityId    String?
  metricKey         String?
  comparison        String?
  targetValue       Decimal?      @db.Decimal(18, 4)
  currentValue      Decimal?      @db.Decimal(18, 4)
  unit              String?
  startDate         DateTime?
  targetDate        DateTime?
  completedAt       DateTime?
  archivedAt        DateTime?
  deletedAt         DateTime?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, status, scopeType])
  @@index([sourceEntityType, sourceEntityId])
  @@map("goals")
}

model Streak {
  id               String           @id @default(uuid()) @db.Uuid
  userId           String           @db.Uuid
  sourceType       StreakSourceType
  sourceEntityType String
  sourceEntityId    String
  currentCount     Int              @default(0)
  bestCount        Int              @default(0)
  startedAt        DateTime?
  lastAchievedAt   DateTime?
  brokenAt         DateTime?
  isActive         Boolean          @default(true)
  deletedAt        DateTime?
  createdAt        DateTime         @default(now())
  updatedAt        DateTime         @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, sourceType, sourceEntityType, sourceEntityId])
  @@index([userId, isActive])
  @@map("streaks")
}

model DailySummary {
  id           String   @id @default(uuid()) @db.Uuid
  userId       String   @db.Uuid
  summaryDate  DateTime
  score        Decimal? @db.Decimal(10, 2)
  stats        Json
  version      Int      @default(1)
  deletedAt    DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, summaryDate])
  @@index([userId, summaryDate])
  @@map("daily_summaries")
}

model Habit {
  id              String            @id @default(uuid()) @db.Uuid
  userId          String            @db.Uuid
  title           String
  description     String?
  cadenceType     HabitCadenceType   @default(DAILY)
  targetCount     Int               @default(1)
  completionUnit   String?
  startDate       DateTime?
  endDate         DateTime?
  archivedAt      DateTime?
  deletedAt       DateTime?
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  user     User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  schedule HabitSchedule?
  logs     HabitLog[]

  @@index([userId, cadenceType, deletedAt])
  @@map("habits")
}

model HabitSchedule {
  id              String   @id @default(uuid()) @db.Uuid
  habitId         String   @unique @db.Uuid
  timezone        String
  scheduleRule    Json
  reminderLeadMin Int      @default(0)
  deletedAt       DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  habit Habit @relation(fields: [habitId], references: [id], onDelete: Cascade)

  @@index([timezone])
  @@map("habit_schedules")
}

model HabitLog {
  id               String          @id @default(uuid()) @db.Uuid
  userId           String          @db.Uuid
  habitId          String          @db.Uuid
  occurredAt       DateTime
  status           HabitLogStatus  @default(DONE)
  quantity         Decimal?        @db.Decimal(18, 4)
  note             String?
  sourceMutationId String?
  deletedAt        DateTime?
  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt

  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  habit Habit @relation(fields: [habitId], references: [id], onDelete: Cascade)

  @@unique([userId, sourceMutationId])
  @@index([userId, habitId, occurredAt])
  @@index([habitId, occurredAt])
  @@map("habit_logs")
}

model TrackerTemplate {
  id                String   @id @default(uuid()) @db.Uuid
  userId            String   @db.Uuid
  name              String
  description       String?
  status            String   @default("active")
  currentVersionId  String?  @db.Uuid
  deletedAt         DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  user      User                   @relation(fields: [userId], references: [id], onDelete: Cascade)
  versions  TrackerTemplateVersion[]
  entries   TrackerEntry[]

  @@index([userId, status])
  @@map("tracker_templates")
}

model TrackerTemplateVersion {
  id                String   @id @default(uuid()) @db.Uuid
  templateId        String   @db.Uuid
  versionNumber     Int
  schemaNotes       String?
  deletedAt         DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  template TrackerTemplate @relation(fields: [templateId], references: [id], onDelete: Cascade)
  fields   TrackerField[]
  entries  TrackerEntry[]

  @@unique([templateId, versionNumber])
  @@index([templateId, versionNumber])
  @@map("tracker_template_versions")
}

model TrackerField {
  id               String           @id @default(uuid()) @db.Uuid
  versionId        String           @db.Uuid
  key              String
  label            String
  fieldType        TrackerFieldType
  isRequired       Boolean          @default(false)
  isIndexed        Boolean          @default(false)
  sortOrder        Int              @default(0)
  config           Json?
  deletedAt        DateTime?
  createdAt        DateTime         @default(now())
  updatedAt        DateTime         @updatedAt

  version TrackerTemplateVersion @relation(fields: [versionId], references: [id], onDelete: Cascade)
  values  TrackerEntryValue[]

  @@unique([versionId, key])
  @@index([versionId, sortOrder])
  @@map("tracker_fields")
}

model TrackerEntry {
  id               String             @id @default(uuid()) @db.Uuid
  userId           String             @db.Uuid
  templateId       String             @db.Uuid
  versionId        String             @db.Uuid
  entryDate        DateTime
  status           TrackerEntryStatus @default(CONFIRMED)
  notes            String?
  sourceMutationId String?
  deletedAt        DateTime?
  createdAt        DateTime           @default(now())
  updatedAt        DateTime           @updatedAt

  user     User                   @relation(fields: [userId], references: [id], onDelete: Cascade)
  template TrackerTemplate        @relation(fields: [templateId], references: [id], onDelete: Cascade)
  version  TrackerTemplateVersion @relation(fields: [versionId], references: [id], onDelete: Cascade)
  values   TrackerEntryValue[]

  @@unique([userId, sourceMutationId])
  @@index([userId, templateId, entryDate])
  @@index([templateId, entryDate])
  @@map("tracker_entries")
}

model TrackerEntryValue {
  id           String   @id @default(uuid()) @db.Uuid
  entryId      String   @db.Uuid
  fieldId      String   @db.Uuid
  valueText    String?
  valueNumber  Decimal? @db.Decimal(18, 4)
  valueBoolean Boolean?
  valueDate    DateTime?
  valueJson    Json?
  deletedAt    DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  entry TrackerEntry @relation(fields: [entryId], references: [id], onDelete: Cascade)
  field TrackerField @relation(fields: [fieldId], references: [id], onDelete: Cascade)

  @@unique([entryId, fieldId])
  @@index([fieldId])
  @@map("tracker_entry_values")
}

model WorkoutPlan {
  id           String   @id @default(uuid()) @db.Uuid
  userId       String   @db.Uuid
  name         String
  description  String?
  status       String   @default("active")
  deletedAt    DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user     User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  sessions WorkoutSession[]

  @@index([userId, status])
  @@map("workout_plans")
}

model WorkoutSession {
  id               String   @id @default(uuid()) @db.Uuid
  userId           String   @db.Uuid
  workoutPlanId    String?  @db.Uuid
  startedAt        DateTime
  endedAt          DateTime?
  durationSeconds  Int?
  notes            String?
  sourceMutationId String?
  deletedAt        DateTime?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  workoutPlan WorkoutPlan?  @relation(fields: [workoutPlanId], references: [id], onDelete: SetNull)
  exercises   WorkoutSessionExercise[]
  tags        TagAssignment[]

  @@unique([userId, sourceMutationId])
  @@index([userId, startedAt])
  @@index([workoutPlanId, startedAt])
  @@map("workout_sessions")
}

model Exercise {
  id           String   @id @default(uuid()) @db.Uuid
  userId       String?  @db.Uuid
  name         String
  normalizedName String
  muscleGroup  String?
  movementType String?
  aliases      Json?
  deletedAt    DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user      User?                   @relation(fields: [userId], references: [id], onDelete: Cascade)
  sessionExercises WorkoutSessionExercise[]
  personalRecords PersonalRecord[]

  @@unique([userId, normalizedName])
  @@index([normalizedName])
  @@map("exercises")
}

model WorkoutSessionExercise {
  id              String   @id @default(uuid()) @db.Uuid
  workoutSessionId String  @db.Uuid
  exerciseId      String   @db.Uuid
  orderIndex      Int      @default(0)
  notes           String?
  deletedAt       DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  workoutSession WorkoutSession @relation(fields: [workoutSessionId], references: [id], onDelete: Cascade)
  exercise       Exercise       @relation(fields: [exerciseId], references: [id], onDelete: Restrict)
  sets           WorkoutSet[]

  @@unique([workoutSessionId, exerciseId])
  @@index([exerciseId])
  @@map("workout_session_exercises")
}

model WorkoutSet {
  id                  String        @id @default(uuid()) @db.Uuid
  workoutSessionExerciseId String   @db.Uuid
  setType             WorkoutSetType @default(WORKING)
  reps                Int?
  weightValue         Decimal?      @db.Decimal(18, 4)
  weightUnit          WorkoutUnit?
  durationSeconds     Int?
  rpe                 Int?
  isPersonalBest      Boolean       @default(false)
  deletedAt           DateTime?
  createdAt           DateTime      @default(now())
  updatedAt           DateTime      @updatedAt

  workoutSessionExercise WorkoutSessionExercise @relation(fields: [workoutSessionExerciseId], references: [id], onDelete: Cascade)

  @@index([workoutSessionExerciseId])
  @@map("workout_sets")
}

model PersonalRecord {
  id               String   @id @default(uuid()) @db.Uuid
  userId           String   @db.Uuid
  exerciseId       String   @db.Uuid
  workoutSessionId  String?  @db.Uuid
  recordType       String
  valueNumber      Decimal  @db.Decimal(18, 4)
  unit             String
  recordedAt       DateTime
  sourceMutationId String?
  deletedAt        DateTime?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  user          User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  exercise      Exercise        @relation(fields: [exerciseId], references: [id], onDelete: Cascade)
  workoutSession WorkoutSession? @relation(fields: [workoutSessionId], references: [id], onDelete: SetNull)

  @@unique([userId, sourceMutationId])
  @@index([userId, exerciseId, recordType])
  @@map("personal_records")
}

model NutritionGoal {
  id                 String   @id @default(uuid()) @db.Uuid
  userId             String   @db.Uuid
  effectiveFrom       DateTime
  effectiveTo         DateTime?
  caloriesTarget     Int?
  proteinTargetGrams Decimal? @db.Decimal(18, 4)
  carbsTargetGrams   Decimal? @db.Decimal(18, 4)
  fatTargetGrams     Decimal? @db.Decimal(18, 4)
  deletedAt          DateTime?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, effectiveFrom])
  @@map("nutrition_goals")
}

model NutritionEntry {
  id               String        @id @default(uuid()) @db.Uuid
  userId           String        @db.Uuid
  consumedAt       DateTime
  mealType         NutritionMealType @default(OTHER)
  calories         Int?
  proteinGrams     Decimal?      @db.Decimal(18, 4)
  carbsGrams       Decimal?      @db.Decimal(18, 4)
  fatGrams         Decimal?      @db.Decimal(18, 4)
  notes            String?
  sourceMutationId String?
  deletedAt        DateTime?
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, sourceMutationId])
  @@index([userId, consumedAt])
  @@index([mealType, consumedAt])
  @@map("nutrition_entries")
}

model BodyWeightEntry {
  id               String   @id @default(uuid()) @db.Uuid
  userId           String   @db.Uuid
  measuredAt       DateTime
  weightValue      Decimal  @db.Decimal(18, 4)
  unit             WeightUnit
  notes            String?
  sourceMutationId String?
  deletedAt        DateTime?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, sourceMutationId])
  @@index([userId, measuredAt])
  @@map("body_weight_entries")
}

model SavedWord {
  id              String   @id @default(uuid()) @db.Uuid
  userId          String   @db.Uuid
  word            String
  normalizedWord  String
  language        String?
  partOfSpeech    String?
  sourceContext   String?
  masteryScore    Decimal? @db.Decimal(10, 4)
  archivedAt      DateTime?
  deletedAt       DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user      User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  meanings  WordMeaning[]
  examples  WordExampleSentence[]
  personalSentences PersonalSentence[]
  revisions WordRevisionHistory[]
  tags      TagAssignment[]

  @@unique([userId, normalizedWord])
  @@index([userId, archivedAt])
  @@map("saved_words")
}

model WordMeaning {
  id            String   @id @default(uuid()) @db.Uuid
  savedWordId   String   @db.Uuid
  meaningText   String
  language      String?
  orderIndex    Int      @default(0)
  deletedAt     DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  savedWord SavedWord @relation(fields: [savedWordId], references: [id], onDelete: Cascade)

  @@index([savedWordId, orderIndex])
  @@map("word_meanings")
}

model WordExampleSentence {
  id           String   @id @default(uuid()) @db.Uuid
  savedWordId  String   @db.Uuid
  exampleText  String
  source       String?
  orderIndex   Int      @default(0)
  deletedAt    DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  savedWord SavedWord @relation(fields: [savedWordId], references: [id], onDelete: Cascade)

  @@index([savedWordId, orderIndex])
  @@map("word_example_sentences")
}

model PersonalSentence {
  id           String   @id @default(uuid()) @db.Uuid
  savedWordId  String   @db.Uuid
  sentenceText String
  notes        String?
  deletedAt    DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  savedWord SavedWord @relation(fields: [savedWordId], references: [id], onDelete: Cascade)

  @@index([savedWordId])
  @@map("personal_sentences")
}

model WordRevisionHistory {
  id               String   @id @default(uuid()) @db.Uuid
  savedWordId      String   @db.Uuid
  reviewedAt       DateTime
  result           String
  easeFactor       Decimal? @db.Decimal(10, 4)
  nextReviewAt     DateTime?
  memoryStrength   Decimal? @db.Decimal(10, 4)
  sourceMutationId String?
  deletedAt        DateTime?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  savedWord SavedWord @relation(fields: [savedWordId], references: [id], onDelete: Cascade)

  @@unique([savedWordId, sourceMutationId])
  @@index([savedWordId, reviewedAt])
  @@map("word_revision_history")
}

model JournalEntry {
  id               String   @id @default(uuid()) @db.Uuid
  userId           String   @db.Uuid
  title            String?
  body             String
  occurredAt       DateTime
  sourceMutationId String?
  deletedAt        DateTime?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  tags TagAssignment[]

  @@unique([userId, sourceMutationId])
  @@index([userId, occurredAt])
  @@map("journal_entries")
}

model MoodEntry {
  id               String   @id @default(uuid()) @db.Uuid
  userId           String   @db.Uuid
  occurredAt       DateTime
  moodScore        Int
  energyScore      Int?
  stressScore      Int?
  note             String?
  sourceMutationId String?
  deletedAt        DateTime?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  tags TagAssignment[]

  @@unique([userId, sourceMutationId])
  @@index([userId, occurredAt])
  @@map("mood_entries")
}

model Tag {
  id            String   @id @default(uuid()) @db.Uuid
  userId        String   @db.Uuid
  name          String
  normalizedName String
  color         String?
  deletedAt     DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user        User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  assignments TagAssignment[]

  @@unique([userId, normalizedName])
  @@index([userId, name])
  @@map("tags")
}

model TagAssignment {
  id           String        @id @default(uuid()) @db.Uuid
  userId       String        @db.Uuid
  tagId        String        @db.Uuid
  entityType   TagTargetType
  entityId     String
  deletedAt    DateTime?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  tag  Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@unique([userId, tagId, entityType, entityId])
  @@index([userId, entityType, entityId])
  @@map("tag_assignments")
}

model Reminder {
  id            String         @id @default(uuid()) @db.Uuid
  userId        String         @db.Uuid
  sourceType    String
  sourceEntityId String?
  title         String
  body          String?
  scheduleRule  Json
  nextRunAt     DateTime?
  lastRunAt     DateTime?
  status        ReminderStatus @default(ACTIVE)
  deletedAt     DateTime?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  user          User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  notifications Notification[]

  @@index([userId, status, nextRunAt])
  @@index([sourceType, sourceEntityId])
  @@map("reminders")
}

model NotificationPreference {
  id                String   @id @default(uuid()) @db.Uuid
  userId            String   @unique @db.Uuid
  inAppEnabled      Boolean  @default(true)
  pushEnabled       Boolean  @default(true)
  emailEnabled      Boolean  @default(false)
  quietHoursStart   String?
  quietHoursEnd     String?
  deletedAt         DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("notification_preferences")
}

model Notification {
  id               String            @id @default(uuid()) @db.Uuid
  userId           String            @db.Uuid
  reminderId       String?           @db.Uuid
  channel          NotificationChannel
  status           NotificationStatus @default(QUEUED)
  title            String
  body             String?
  queuedAt         DateTime          @default(now())
  sentAt           DateTime?
  deliveredAt      DateTime?
  readAt           DateTime?
  dismissedAt      DateTime?
  deletedAt        DateTime?
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt

  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  reminder Reminder? @relation(fields: [reminderId], references: [id], onDelete: SetNull)
  deliveries NotificationDelivery[]

  @@index([userId, status, queuedAt])
  @@index([reminderId])
  @@map("notifications")
}

model NotificationDelivery {
  id                 String   @id @default(uuid()) @db.Uuid
  notificationId     String   @db.Uuid
  provider           String
  providerMessageId  String?
  status             String
  attemptNumber      Int      @default(1)
  responsePayload    Json?
  attemptedAt        DateTime @default(now())
  deletedAt          DateTime?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  notification Notification @relation(fields: [notificationId], references: [id], onDelete: Cascade)

  @@index([notificationId, attemptedAt])
  @@map("notification_deliveries")
}

model AnalyticsSnapshot {
  id            String   @id @default(uuid()) @db.Uuid
  userId        String   @db.Uuid
  metricKey     String
  windowType    String
  windowStart   DateTime
  windowEnd     DateTime
  valueNumber   Decimal? @db.Decimal(18, 4)
  valueText     String?
  dimensions    Json?
  sourceVersion Int      @default(1)
  generatedAt   DateTime @default(now())
  deletedAt     DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, metricKey, windowType, windowStart])
  @@index([metricKey, windowType, windowStart])
  @@map("analytics_snapshots")
}

model AiInsight {
  id               String         @id @default(uuid()) @db.Uuid
  userId           String         @db.Uuid
  insightType      AIInsightType
  title            String
  summary          String
  detail           String?
  confidenceScore  Decimal?       @db.Decimal(6, 4)
  status           InsightStatus  @default(PENDING)
  modelName        String?
  sourceWindowStart DateTime?
  sourceWindowEnd   DateTime?
  metadata         Json?
  deletedAt        DateTime?
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt

  user    User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  sources AiInsightSource[]

  @@index([userId, insightType, status])
  @@map("ai_insights")
}

model AiInsightSource {
  id          String   @id @default(uuid()) @db.Uuid
  insightId   String   @db.Uuid
  entityType  String
  entityId    String
  weight      Decimal? @db.Decimal(10, 4)
  metadata    Json?
  deletedAt   DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  insight AiInsight @relation(fields: [insightId], references: [id], onDelete: Cascade)

  @@index([insightId, entityType, entityId])
  @@map("ai_insight_sources")
}

model AuditLog {
  id               String      @id @default(uuid()) @db.Uuid
  actorUserId      String?     @db.Uuid
  targetUserId     String?     @db.Uuid
  action           AuditAction
  entityType       String
  entityId         String?
  requestId        String?
  ipAddress        String?
  userAgent        String?
  before           Json?
  after            Json?
  metadata         Json?
  deletedAt        DateTime?
  createdAt        DateTime   @default(now())
  updatedAt        DateTime   @updatedAt

  actor  User? @relation("AuditActor", fields: [actorUserId], references: [id], onDelete: SetNull)
  target User? @relation("AuditTarget", fields: [targetUserId], references: [id], onDelete: SetNull)

  @@index([actorUserId, createdAt])
  @@index([entityType, entityId])
  @@map("audit_logs")
}

model UserRelation {
  id               String           @id @default(uuid()) @db.Uuid
  requesterUserId  String           @db.Uuid
  addresseeUserId  String           @db.Uuid
  relationType     RelationshipType
  status           RelationshipStatus @default(PENDING)
  note             String?
  deletedAt        DateTime?
  createdAt        DateTime         @default(now())
  updatedAt        DateTime         @updatedAt

  requester User @relation("OutgoingRelations", fields: [requesterUserId], references: [id], onDelete: Cascade)
  addressee User @relation("IncomingRelations", fields: [addresseeUserId], references: [id], onDelete: Cascade)

  @@unique([requesterUserId, addresseeUserId, relationType])
  @@index([addresseeUserId, status])
  @@map("user_relations")
}
```

## Model Explanations

### Identity and Auth

- `User` is the account root and the owner of all user-scoped records.
- `UserProfile` stores timezone, locale, measurement preferences, and onboarding state.
- `UserCredential` stores password-based auth metadata without mixing it into the user profile row.
- `OAuthAccount` stores linked provider identities such as Google, Apple, and GitHub.
- `Session` stores active login sessions and refresh-token state for revocation and rotation.
- `Device` stores device identity for multi-device and offline sync support.
- `DeviceSyncState` stores per-device sync progress and cursors.
- `SyncMutation` stores offline or replayable mutations with idempotency keys.
- `SyncConflict` stores conflict states that need user review or automatic resolution.

### Goals, Streaks, and Summaries

- `Goal` is a generic goal container that can point to any tracked source entity.
- `Streak` is a generic streak record that can be attached to habits or other future sources.
- `DailySummary` stores one denormalized summary row per user per day for dashboard use.

### Habits

- `Habit` is the durable definition of a habit.
- `HabitSchedule` stores cadence and timezone-specific schedule logic.
- `HabitLog` stores completion or skip facts as append-only records.

### Custom Trackers

- `TrackerTemplate` defines a user-created tracker.
- `TrackerTemplateVersion` versions the schema so historical entries remain valid.
- `TrackerField` defines the fields and field types for a version.
- `TrackerEntry` stores one captured tracker event.
- `TrackerEntryValue` stores typed values per field so queryability remains strong.

### Workouts and PRs

- `WorkoutPlan` stores optional training plan structure.
- `WorkoutSession` stores one workout occurrence.
- `WorkoutSessionExercise` stores the exercises performed in a session.
- `Exercise` stores exercise catalog records and optional user-specific additions.
- `WorkoutSet` stores reps, weight, duration, and set type.
- `PersonalRecord` stores PR tracking independently from session history.

### Nutrition and Body Weight

- `NutritionGoal` stores versioned daily or effective-date nutrition targets.
- `NutritionEntry` stores meals and macro logs.
- `BodyWeightEntry` stores weight measurements over time.

### Vocabulary

- `SavedWord` stores the core vocabulary item.
- `WordMeaning` stores one or more meanings per saved word.
- `WordExampleSentence` stores example sentences.
- `PersonalSentence` stores the user’s own contextual sentence.
- `WordRevisionHistory` stores spaced-repetition and review history.

### Journaling, Mood, and Tags

- `JournalEntry` stores timestamped thoughts or longer journal entries.
- `MoodEntry` stores mood observations and supporting context.
- `Tag` stores reusable user-defined tags.
- `TagAssignment` provides a single tag relationship table for multiple target types.

### Reminders and Notifications

- `Reminder` stores reminder definitions and scheduling metadata.
- `NotificationPreference` stores per-user delivery preferences and quiet hours.
- `Notification` stores queued, sent, read, or dismissed notifications.
- `NotificationDelivery` stores provider-specific delivery attempts and retries.

### Analytics and AI

- `AnalyticsSnapshot` stores precomputed metric snapshots and rollups.
- `AiInsight` stores generated insight records for future AI support.
- `AiInsightSource` stores the source records that produced an insight.

### Audit and Future Social Features

- `AuditLog` stores who changed what, when, and from where.
- `UserRelation` stores future social or shared-access relationships without forcing them into the MVP UX.

## Relationships Between Entities

### Core Ownership

- `User` is the parent of nearly every business table.
- `UserProfile`, `UserCredential`, `OAuthAccount`, `Session`, `Device`, `Goal`, `Habit`, `HabitLog`, `TrackerTemplate`, `TrackerEntry`, `WorkoutPlan`, `WorkoutSession`, `NutritionGoal`, `NutritionEntry`, `BodyWeightEntry`, `SavedWord`, `JournalEntry`, `MoodEntry`, `Reminder`, `Notification`, `AnalyticsSnapshot`, `AiInsight`, and `AuditLog` all belong to one user.

### Auth and Sync

- `Session` optionally references `Device`.
- `DeviceSyncState` is one-to-one with `Device`.
- `SyncMutation` belongs to a user and device.
- `SyncConflict` can point to a mutation and optionally a device or resolving user.

### Habit and Goal Relationships

- `Habit` can have one `HabitSchedule` and many `HabitLog` rows.
- `Goal` can point to any tracked source via `sourceEntityType` and `sourceEntityId`.
- `Streak` can be attached to habits or other sources using the generic source fields.
- `DailySummary` can aggregate habits, goals, workouts, nutrition, mood, and other tracked data.

### Tracker Relationships

- `TrackerTemplate` has many `TrackerTemplateVersion` rows.
- Each version has many `TrackerField` rows.
- `TrackerEntry` belongs to one template and one version.
- `TrackerEntryValue` belongs to one entry and one field.

### Workout Relationships

- `WorkoutPlan` has many `WorkoutSession` rows.
- `WorkoutSession` has many `WorkoutSessionExercise` rows.
- `WorkoutSessionExercise` has many `WorkoutSet` rows.
- `Exercise` can be shared globally or scoped to a user.
- `PersonalRecord` belongs to an exercise and may optionally link to the workout session that produced it.

### Vocabulary Relationships

- `SavedWord` has many meanings, examples, personal sentences, and revision records.
- `WordRevisionHistory` is append-only so spaced repetition and memory strength can be analyzed over time.

### Tagging Relationships

- `Tag` belongs to a user.
- `TagAssignment` links a tag to a tagged entity using a typed entity reference.
- This avoids many separate tag join tables while keeping the schema manageable.

### Notification Relationships

- `Reminder` is the source of many `Notification` records.
- `Notification` is the source of many `NotificationDelivery` attempts.
- Preferences remain separate so delivery behavior can evolve independently.

### Analytics and AI Relationships

- `AnalyticsSnapshot` reads from raw facts but stores precomputed results.
- `AiInsight` summarizes data from one or more source records through `AiInsightSource`.
- This keeps derived data separate from source truth.

### Audit Relationships

- `AuditLog` can point to both an actor and a target user.
- `AuditLog` is intentionally broad because it should capture many actions across the system.

### Future Social Features

- `UserRelation` is a lightweight social edge model.
- It supports follow, friend, shared access, and block flows without requiring a rewrite later.

## Indexing Recommendations

### Universal Rules

- Index every table by its foreign key to `User`.
- Index every append-heavy table by `userId` and timestamp.
- Add unique constraints for idempotency keys and normalized lookup fields.
- Use partial indexes later for `deletedAt IS NULL` if soft delete becomes dominant.
- Keep wide indexes out of write-heavy tables unless they are clearly justified.

### Specific Indexes

- `users`: unique `email`, unique `handle`, and `status + createdAt`.
- `sessions`: `userId + status + expiresAt`, and `deviceId + status`.
- `devices`: `userId + platform`, unique `userId + deviceFingerprint`.
- `sync_mutations`: unique `(userId, deviceId, clientMutationId)`.
- `habits`: `userId + cadenceType + deletedAt`.
- `habit_logs`: `userId + habitId + occurredAt`, and `habitId + occurredAt`.
- `tracker_templates`: `userId + status`.
- `tracker_entries`: `userId + templateId + entryDate`.
- `tracker_entry_values`: `fieldId`.
- `workout_sessions`: `userId + startedAt`.
- `workout_session_exercises`: `exerciseId`.
- `workout_sets`: `workoutSessionExerciseId`.
- `personal_records`: `userId + exerciseId + recordType`.
- `nutrition_entries`: `userId + consumedAt`.
- `body_weight_entries`: `userId + measuredAt`.
- `saved_words`: unique `(userId, normalizedWord)`.
- `word_revision_history`: `savedWordId + reviewedAt`.
- `journal_entries`: `userId + occurredAt`.
- `mood_entries`: `userId + occurredAt`.
- `tags`: unique `(userId, normalizedName)`.
- `tag_assignments`: `userId + entityType + entityId`.
- `reminders`: `userId + status + nextRunAt`.
- `notifications`: `userId + status + queuedAt`.
- `analytics_snapshots`: `userId + metricKey + windowType + windowStart`.
- `ai_insights`: `userId + insightType + status`.
- `audit_logs`: `actorUserId + createdAt`, and `entityType + entityId`.

## Partitioning Recommendations

Partition only when volume justifies operational complexity.

### Good Partition Candidates

- `habit_logs`
- `tracker_entries`
- `workout_sets`
- `nutrition_entries`
- `journal_entries`
- `mood_entries`
- `word_revision_history`
- `sync_mutations`
- `audit_logs`
- `analytics_snapshots`

### Recommended Strategy

- Use range partitioning by `createdAt` or logical event date when tables exceed tens of millions of rows.
- Prefer monthly partitions for append-heavy activity logs.
- Keep partition keys consistent across similar event tables.
- Only partition after profiling shows a real need.

### Not Worth Partitioning Early

- `users`
- `sessions`
- `devices`
- `goals`
- `tracker_templates`
- `saved_words`
- `reminders`

## Query Optimization Notes

- Use keyset pagination for all timeline, log, and analytics list APIs.
- Avoid joining large fact tables directly in dashboard requests.
- Precompute daily and weekly summaries rather than recalculating on demand.
- Use covering indexes for common “latest by user” queries.
- Keep query shapes narrow for mobile.
- Use `sourceMutationId` or equivalent unique keys to deduplicate replayed writes.
- Keep JSONB fields for flexible metadata, but not as the only way to query high-traffic filters.
- For current-day queries, prefer materialized or summary tables over scanning raw event tables.

## Scaling Considerations

- The schema is designed as a modular monolith data model, not a distributed data platform.
- High-volume facts are append-only wherever possible.
- Versioned tracker schemas protect historical data from breaking changes.
- Generic source references for goals, streaks, reminders, tags, and AI insights reduce schema sprawl.
- Separate source facts from analytics projections so the read path stays fast.
- Use idempotency constraints to support offline-first sync safely.
- Keep per-user ownership boundaries strict so future sharing or collaboration can be layered on later.
- Preserve queryability with normalized relations before introducing denormalized reports.

## Caching Opportunities

- User profile and settings.
- Device sync state.
- Tracker templates and active template versions.
- Habit schedules and today’s reminders.
- Today’s dashboard summaries.
- Analytics snapshots for common windows.
- Notification preferences.
- Vocabulary review queues.
- Workout templates and recent exercise lookups.
- Cached lookup values such as tags, goals, and current streaks.

## Analytics Aggregation Opportunities

- Daily summaries should combine habit completion, mood, weight, nutrition, workouts, vocabulary, learning, and journal counts.
- Weekly rollups should summarize adherence and momentum.
- Monthly rollups should support long-term trend analysis.
- Lifetime summaries should power profile cards and growth charts.
- Analytics snapshots should be versioned so historical recalculation is possible.
- Derived metrics should be recomputable from raw facts.
- Correlation jobs should run asynchronously in the worker.

## Event-Driven Architecture Opportunities

- `HabitLog` creation can emit streak and reminder events.
- `TrackerEntry` creation can emit analytics and AI source events.
- `WorkoutSession` completion can emit PR and volume aggregation jobs.
- `NutritionEntry` and `BodyWeightEntry` can emit goal-compliance updates.
- `MoodEntry` and `JournalEntry` can feed insights and summaries.
- `SavedWord` and `WordRevisionHistory` can emit spaced repetition updates.
- `Reminder` due events can create notifications.
- `SyncMutation` application can create audit and analytics events.
- `AuditLog` should be written for sensitive state transitions.
- `AiInsight` generation should be event-driven and asynchronous, not inline with user writes.

## Final Assessment

This final schema intentionally avoids premature microservices while still leaving room for growth. The use of versioned trackers, generic source references for goals and streaks, append-only fact tables, and explicit sync metadata makes it suitable for a solo developer building with AI assistance and for a system expected to grow to millions of records.
