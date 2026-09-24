import { badges, db, userBadges } from "@youly-en/db";
import { Elysia, t } from "elysia";
import { permissionsPlugin } from "../../lib/permissions";

export const badgesModule = new Elysia({ name: "badges", prefix: "/badges" })
  .use(permissionsPlugin)
  .get("/", async () => db.select().from(badges), { requireAdmin: true })
  .post(
    "/",
    async ({ body }) => {
      const [badge] = await db.insert(badges).values(body).returning();
      return badge;
    },
    {
      body: t.Object({ slug: t.String(), title: t.String(), grantsContentCreation: t.Boolean() }),
      requireAdmin: true,
    },
  )
  .post(
    "/:badgeId/grant/:userId",
    async ({ params, user }) => {
      await db
        .insert(userBadges)
        .values({ userId: params.userId, badgeId: params.badgeId, grantedBy: user.id });
      return { success: true };
    },
    { params: t.Object({ badgeId: t.String(), userId: t.String() }), requireAdmin: true },
  );
