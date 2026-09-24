import { Elysia, t } from "elysia";
import { betterAuthPlugin } from "../../lib/auth-plugin";
import { permissionsPlugin } from "../../lib/permissions";
import { createReport, getOpenReports, resolveReport } from "./service";

export const reportsModule = new Elysia({ name: "reports", prefix: "/reports" })
  .use(betterAuthPlugin)
  .use(permissionsPlugin)
  .post("/", async ({ body, user }) => createReport(user.id, body), {
    body: t.Object({
      targetType: t.Literal("lesson"),
      targetId: t.String(),
      message: t.String({ minLength: 3 }),
    }),
    auth: true,
  })
  .get("/", async () => getOpenReports(), { requireContentPermission: true })
  .post(
    "/:reportId/resolve",
    async ({ params, body, user, status }) => {
      const report = await resolveReport(params.reportId, user.id, body.decision);
      if (!report) return status(404);
      return report;
    },
    {
      params: t.Object({ reportId: t.String() }),
      body: t.Object({ decision: t.Union([t.Literal("resolved"), t.Literal("dismissed")]) }),
      requireContentPermission: true,
    },
  );
