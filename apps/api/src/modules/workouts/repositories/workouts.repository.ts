import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import type { Prisma } from '@prisma/client';

@Injectable()
export class WorkoutsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Exercises
  createExercise(data: Prisma.ExerciseCreateInput) {
    return this.prisma.exercise.create({ data });
  }

  findExercises(userId: string, q?: string, category?: string) {
    const where: any = { OR: [{ userId }, { userId: null }] };
    if (q) where.name = { contains: q, mode: 'insensitive' };
    if (category) where.categoryId = category;
    return this.prisma.exercise.findMany({ where, orderBy: { name: 'asc' }, take: 200 });
  }

  findExerciseById(id: string) {
    return this.prisma.exercise.findUnique({ where: { id } });
  }

  updateExercise(id: string, data: Prisma.ExerciseUpdateInput) {
    return this.prisma.exercise.update({ where: { id }, data });
  }

  // Sessions
  createSession(data: Prisma.WorkoutSessionCreateInput) {
    return this.prisma.workoutSession.create({ data });
  }

  findSessions(userId: string, from?: Date, to?: Date) {
    const where: any = { userId };
    if (from || to) {
      where.startedAt = {};
      if (from) where.startedAt.gte = from;
      if (to) where.startedAt.lte = to;
    }
    return this.prisma.workoutSession.findMany({ where, orderBy: { startedAt: 'desc' }, take: 200 });
  }

  findSessionById(id: string) {
    return this.prisma.workoutSession.findUnique({ where: { id }, include: { exercises: { include: { sets: true } } } });
  }

  // Sets
  createSet(data: Prisma.WorkoutSetCreateInput) {
    return this.prisma.workoutSet.create({ data });
  }

  // PRs
  findPRs(userId: string) {
    return this.prisma.personalRecord.findMany({ where: { userId }, orderBy: { achievedAt: 'desc' }, take: 100 });
  }
}

export default WorkoutsRepository;
