import { db, reports } from "@youly-en/db";
import { eq } from "drizzle-orm";

export async function createReport(
  reporterId: string,
  data: { targetType: "lesson"; targetId: string; message: string },
) {
  const [report] = await db
    .insert(reports)
    .values({ ...data, reporterId })
    .returning();
  return report;
}

export async function getOpenReports() {
  return db.select().from(reports).where(eq(reports.status, "open"));
}

export async function resolveReport(
  reportId: string,
  resolverId: string,
  decision: "resolved" | "dismissed",
) {
  const [report] = await db
    .update(reports)
    .set({ status: decision, resolvedBy: resolverId, resolvedAt: new Date() })
    .where(eq(reports.id, reportId))
    .returning();
  return report ?? null;
}
