import { auth } from "@youly-en/auth";
import { badges, db, userBadges } from "@youly-en/db";
import { and, eq } from "drizzle-orm";
import { Elysia } from "elysia";

async function getSessionUser(headers: Headers) {
  const session = await auth.api.getSession({ headers });
  return session?.user ?? null;
}

async function hasContentPermission(user: { id: string; role: string }) {
  if (user.role === "admin") return true;
  const [badge] = await db
    .select()
    .from(userBadges)
    .innerJoin(badges, eq(userBadges.badgeId, badges.id))
    .where(and(eq(userBadges.userId, user.id), eq(badges.grantsContentCreation, true)))
    .limit(1);
  return !!badge;
}

export const permissionsPlugin = new Elysia({ name: "permissions" }).macro({
  requireContentPermission: {
    async resolve({ status, request: { headers } }) {
      const user = await getSessionUser(headers);
      if (!user) return status(401);
      if (!(await hasContentPermission(user))) return status(403);
      return { user };
    },
  },
  requireAdmin: {
    async resolve({ status, request: { headers } }) {
      const user = await getSessionUser(headers);
      if (!user) return status(401);
      if (user.role !== "admin") return status(403);
      return { user };
    },
  },
});
