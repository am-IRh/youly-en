import { courses, db } from "@youly-en/db";
import { count, eq } from "drizzle-orm";
import { paginated, toOffset } from "../../lib/pagination";

export async function getCourses(page = 1, limit = 20) {
  const { offset } = toOffset(page, limit);

  const [items, countResult] = await Promise.all([
    db.select().from(courses).limit(limit).offset(offset),
    db.select({ value: count() }).from(courses),
  ]);

  const total = countResult[0]?.value ?? 0;

  return paginated(items, total, page, limit);
}

export async function getCourseBySlug(slug: string) {
  const [course] = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1);
  return course ?? null;
}

export async function createCourse(data: {
  slug: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
}) {
  const [course] = await db.insert(courses).values(data).returning();
  return course;
}

export async function updateCourse(
  courseId: string,
  data: Partial<{ title: string; description: string; coverImageUrl: string }>,
) {
  const [course] = await db
    .update(courses)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(courses.id, courseId))
    .returning();
  return course ?? null;
}
