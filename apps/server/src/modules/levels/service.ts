import { db, levels } from "@youly-en/db";
import { and, count, eq } from "drizzle-orm";
import { paginated, toOffset } from "../../lib/pagination";
import { getCourseBySlug } from "../courses/service";

export async function getLevels(courseSlug: string, page = 1, limit = 20) {
  const course = await getCourseBySlug(courseSlug);
  if (!course) return null;

  const { offset } = toOffset(page, limit);
  const [items, countResult] = await Promise.all([
    db
      .select()
      .from(levels)
      .where(eq(levels.courseId, course.id))
      .orderBy(levels.order)
      .limit(limit)
      .offset(offset),
    db.select({ value: count() }).from(levels).where(eq(levels.courseId, course.id)),
  ]);
  const total = countResult[0]?.value ?? 0;

  return paginated(items, total, page, limit);
}

export async function getLevelBySlug(courseSlug: string, levelSlug: string) {
  const course = await getCourseBySlug(courseSlug);
  if (!course) return null;
  const [level] = await db
    .select()
    .from(levels)
    .where(and(eq(levels.courseId, course.id), eq(levels.slug, levelSlug)))
    .limit(1);
  return level ?? null;
}
