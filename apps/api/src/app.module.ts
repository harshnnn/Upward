import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AuthModule } from './modules/auth/auth.module';
import { EventsModule } from './modules/events/events.module';
import { HealthModule } from './modules/health/health.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { UsersModule } from './modules/users/users.module';
import { TrackingModule } from './modules/tracking/tracking.module';
import { PrismaModule } from './database/prisma.module';
import { envValidationSchema } from './config/validation';
import { JournalModule } from './modules/journal/journal.module';
import { VocabularyModule } from './modules/vocabulary/vocabulary.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { SearchModule } from './modules/search/search.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { WorkoutsModule } from './modules/workouts/workouts.module';
import { NutritionModule } from './modules/nutrition/nutrition.module';
import { BodyMetricsModule } from './modules/body-metrics/body-metrics.module';
import { IdempotencyInterceptor } from './common/idempotency/idempotency.interceptor';
import { IdempotencyService } from './common/idempotency/idempotency.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: envValidationSchema,
      cache: true
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 100
      }
    ]),
    PrismaModule,
    EventsModule,
    JobsModule,
    HealthModule,
    UsersModule,
    JournalModule,
    TrackingModule,
    WorkoutsModule,
    NutritionModule,
    BodyMetricsModule,
    VocabularyModule,
    AnalyticsModule,
    SearchModule,
    NotificationsModule,
    AuthModule
  ],
  providers: [
    IdempotencyService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: IdempotencyInterceptor
    }
  ]
})
export class AppModule {}
