import { auth } from "@youly-en/auth";
import { badges, db, userBadges } from "@youly-en/db";
import { and, eq } from "drizzle-orm";
import { Elysia } from "elysia";

export const permissionsPlugin = new Elysia({ name: "permissions" }).macro({
  requireContentPermission: {
    async resolve({ status, request: { headers } }) {
      const session = await auth.api.getSession({ headers });
      if (!session) return status(401);

      if (session.user.role === "admin") {
        return { user: session.user };
      }

      const [badge] = await db
        .select()
        .from(userBadges)
        .innerJoin(badges, eq(userBadges.badgeId, badges.id))
        .where(and(eq(userBadges.userId, session.user.id), eq(badges.grantsContentCreation, true)))
        .limit(1);

      if (!badge) return status(403);
      return { user: session.user };
    },
  },
});
