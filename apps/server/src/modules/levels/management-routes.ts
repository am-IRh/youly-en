import { Elysia, t } from "elysia";
import { permissionsPlugin } from "../../lib/permissions";
import { createLevel, getLevelsByCourseId, updateLevel } from "./service";

export const levelManagementModule = new Elysia({ name: "level-management", prefix: "/levels" })
  .use(permissionsPlugin)
  .post("/", ({ body }) => createLevel(body), {
    body: t.Object({
      courseId: t.String(),
      slug: t.String(),
      title: t.String(),
      order: t.Number(),
    }),
    requireAdmin: true,
  })
  .put(
    "/:levelId",
    async ({ params, body, status }) => {
      const level = await updateLevel(params.levelId, body);
      if (!level) return status(404);
      return level;
    },
    {
      params: t.Object({ levelId: t.String() }),
      body: t.Partial(t.Object({ title: t.String(), order: t.Number() })),
      requireAdmin: true,
    },
  )
  .get("/", ({ query }) => getLevelsByCourseId(query.courseId), {
    query: t.Object({ courseId: t.String() }),
    requireAdmin: true,
  });
