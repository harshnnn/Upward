# Upward Product Requirements Document

## App Vision

Upward is a personal life operating system that helps users track habits, learning, coding practice, vocabulary, workouts, productivity, nutrition, body weight, mood, thoughts, and long-term growth in one coherent system.

The product should feel like a durable personal command center: fast to capture, pleasant to review, highly trustworthy, and capable of turning daily actions into meaningful longitudinal insight.

## Product Goals

- Make capturing life data extremely fast.
- Make long-term trends and growth visible.
- Make the system reliable offline and online.
- Make cross-platform usage seamless on web, iOS, and Android.
- Make analytics and review useful rather than decorative.
- Make the architecture robust enough for millions of records.

## Core Product Areas

### Habits

- Create habits with flexible schedules.
- Log completions quickly.
- Show streaks, consistency, and missed-day context.
- Support reminders and habit-specific goals.

### Learning Progress

- Track books, courses, topics, and study sessions.
- Record progress increments and completion states.
- Show velocity and consistency over time.

### DSA Questions Solved

- Track questions, attempts, solutions, patterns, and revision history.
- Capture solve date, difficulty, company tags, and notes.
- Show topic coverage and solve rate trends.

### Vocabulary Learned

- Store new words, definitions, examples, review history, and memory strength.
- Support review queues and spaced repetition style review flows.
- Show retention and growth over time.

### Custom Trackers

- Allow user-defined trackers with custom fields and units.
- Support both simple and complex measurement formats.
- Allow future schema evolution without breaking history.

### Workouts

- Log sessions, sets, exercises, PRs, and plans.
- Support progression tracking and exercise-level history.
- Show training volume, consistency, and PR movement.

### PRs

- Track GitHub pull requests as a productivity and shipping metric.
- Show merges, cycle time, and throughput.
- Allow future integration expansion to other development systems.

### Protein Intake

- Track daily protein and macro goals.
- Compare intake with targets.
- Surface adherence and consistency signals.

### Body Weight

- Log weight with timestamps and units.
- Show trends, smoothing, and change over time.
- Correlate with nutrition and workout behavior.

### Mood

- Capture mood entries throughout the day.
- Support tags, context, and trend analysis.
- Enable correlation with habits, thoughts, and routines.

### Timestamped Thoughts

- Capture short thoughts throughout the day.
- Make journaling fast and lightweight.
- Support search, reflection, and long-term memory.

### Analytics and Long-Term Growth

- Show streaks, consistency, retention, progression, and trend lines.
- Support daily, weekly, monthly, and lifetime summaries.
- Make correlations between behaviors visible when useful.

## UX Behavior

### Global UX Principles

- Capture must be faster than navigating.
- Review must feel calm, clear, and low-friction.
- Mobile should be optimized for quick entry and offline resilience.
- Web should be optimized for analysis, history, and deeper editing.
- The app should support dark mode first while remaining fully accessible.

### Capture UX

- Default interaction should minimize typing.
- Frequently used actions should be one or two taps away.
- Users should be able to log from home, timeline, or dedicated quick-add surfaces.
- Autocomplete, presets, and recent values should be used wherever helpful.

### Review UX

- Dashboard cards should summarize the day and the week.
- Deep views should support timeline, trends, and filters.
- Historical exploration should not require excessive navigation.

### Offline UX

- The app should continue working when disconnected.
- Offline-created items should be visible immediately.
- Sync state should be transparent enough for trust but not noisy.

## User Flows

### Onboarding Flow

1. User signs up.
2. User sets timezone, units, and a few default preferences.
3. User selects which life areas they want to track first.
4. User is guided into the first capture action quickly.

### Daily Capture Flow

1. User opens the app.
2. The app shows today’s summary and quick-add actions.
3. User logs a habit, mood, thought, workout, weight, or nutrition item.
4. The app confirms capture immediately.
5. The item appears in the timeline and future analytics.

### Review Flow

1. User visits dashboard or analytics.
2. The app surfaces streaks, trends, and progress.
3. User filters by time range or category.
4. User drills into raw entries when needed.

### Offline Sync Flow

1. User logs data while offline.
2. Data is stored locally.
3. When network returns, the client pushes queued mutations.
4. Server resolves or flags conflicts.
5. Client pulls the latest state and reconciles.

## Edge Cases

- Duplicate submissions from retries should not create duplicate facts.
- Timezone changes should not corrupt daily streak boundaries.
- Historical edits should not silently rewrite summary history without controlled recomputation.
- Custom tracker schema changes should preserve prior entries.
- A user should be able to delete or archive data where product policy allows it.
- Notifications should not fire repeatedly for the same logical trigger.
- Sync conflicts should be visible and recoverable.

## Analytics Ideas

- Habit adherence and streak persistence.
- Learning velocity and completion curves.
- DSA solve frequency and topic gaps.
- Vocabulary retention and review efficiency.
- Workout volume and PR progression.
- Protein adherence against target.
- Weight trend smoothing and change velocity.
- Mood volatility and behavioral correlation.
- Thought frequency by time of day or context.
- Custom tracker charts and cross-tracker relationships.
- Life balance or growth score summaries across domains.

## Future Roadmap

### Near Term

- Core logging across all major domains.
- Responsive dashboard and timeline views.
- Offline-first mobile capture.
- Reliable sync and account/session management.

### Mid Term

- Advanced analytics and correlations.
- Reminder automation.
- Better search and filtering.
- Integration with external productivity sources.
- Export and import workflows.

### Long Term

- Smarter insight generation.
- Optional AI-assisted reflection and summaries.
- Additional integrations such as calendar, health, or wearable data.
- Shared or family account modes if the product expands beyond single-user use.
- Stronger data science and forecasting features.

## Product Non-Goals For v1

- Social network features
- Heavy collaboration workflows
- Microservice sprawl before scale requires it
- Overly complex AI features before the core capture and analytics experience is excellent

## Product Positioning

Upward should be opinionated about consistency, capture speed, and long-term signal. The app should feel like a system a user can trust for years, not a collection of disconnected trackers.
