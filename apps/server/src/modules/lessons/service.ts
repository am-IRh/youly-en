import { db, lessons } from "@youly-en/db";
import { and, count, eq } from "drizzle-orm";
import { paginated, toOffset } from "../../lib/pagination";
import { getLevelBySlug } from "../levels/service";

export async function getLessons(courseSlug: string, levelSlug: string, page = 1, limit = 20) {
  const level = await getLevelBySlug(courseSlug, levelSlug);
  if (!level) return null;

  const where = and(eq(lessons.levelId, level.id), eq(lessons.status, "published"));
  const { offset } = toOffset(page, limit);
  const [items, countResult] = await Promise.all([
    db.select().from(lessons).where(where).orderBy(lessons.order).limit(limit).offset(offset),
    db.select({ value: count() }).from(lessons).where(where),
  ]);

  const total = countResult[0]?.value ?? 0;

  return paginated(items, total, page, limit);
}

export async function getLessonBySlug(courseSlug: string, levelSlug: string, lessonSlug: string) {
  const level = await getLevelBySlug(courseSlug, levelSlug);
  if (!level) return null;
  const [lesson] = await db
    .select()
    .from(lessons)
    .where(
      and(
        eq(lessons.levelId, level.id),
        eq(lessons.slug, lessonSlug),
        eq(lessons.status, "published"),
      ),
    )
    .limit(1);
  return lesson ?? null;
}

export async function createLesson(
  levelId: string,
  authorId: string,
  data: { slug: string; title: string; order: number; content: unknown[] },
) {
  const [lesson] = await db
    .insert(lessons)
    .values({ ...data, levelId, authorId, status: "draft" })
    .returning();
  return lesson;
}

export async function submitLessonForReview(lessonId: string, authorId: string) {
  const [lesson] = await db
    .update(lessons)
    .set({ status: "pending_review", updatedAt: new Date() })
    .where(
      and(eq(lessons.id, lessonId), eq(lessons.authorId, authorId), eq(lessons.status, "draft")),
    )
    .returning();
  return lesson ?? null;
}

export async function reviewLesson(
  lessonId: string,
  reviewerId: string,
  decision: "published" | "rejected",
) {
  const [lesson] = await db
    .update(lessons)
    .set({ status: decision, reviewedBy: reviewerId, reviewedAt: new Date() })
    .where(and(eq(lessons.id, lessonId), eq(lessons.status, "pending_review")))
    .returning();
  return lesson ?? null;
}

export async function getMyLessons(authorId: string, page = 1, limit = 20) {
  const { offset } = toOffset(page, limit);
  const [items, countResult] = await Promise.all([
    db
      .select()
      .from(lessons)
      .where(eq(lessons.authorId, authorId))
      .orderBy(lessons.updatedAt)
      .limit(limit)
      .offset(offset),
    db.select({ value: count() }).from(lessons).where(eq(lessons.authorId, authorId)),
  ]);

  const total = countResult[0]?.value ?? 0;

  return paginated(items, total, page, limit);
}

export async function getPendingLessons(page = 1, limit = 20) {
  const where = eq(lessons.status, "pending_review");
  const { offset } = toOffset(page, limit);
  const [items, countResult] = await Promise.all([
    db.select().from(lessons).where(where).limit(limit).offset(offset),
    db.select({ value: count() }).from(lessons).where(where),
  ]);

  const total = countResult[0]?.value ?? 0;

  return paginated(items, total, page, limit);
}
