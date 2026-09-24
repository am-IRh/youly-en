import { Elysia, t } from "elysia";
import { permissionsPlugin } from "../../lib/permissions";
import { createCourse, updateCourse } from "./service";

export const courseManagementModule = new Elysia({ name: "course-management", prefix: "/courses" })
  .use(permissionsPlugin)
  .post("/", ({ body }) => createCourse(body), {
    body: t.Object({
      slug: t.String(),
      title: t.String(),
      description: t.Optional(t.String()),
      coverImageUrl: t.Optional(t.String()),
    }),
    requireAdmin: true,
  })
  .put(
    "/:courseId",
    async ({ params, body, status }) => {
      const course = await updateCourse(params.courseId, body);
      if (!course) return status(404);
      return course;
    },
    {
      params: t.Object({ courseId: t.String() }),
      body: t.Partial(
        t.Object({ title: t.String(), description: t.String(), coverImageUrl: t.String() }),
      ),
      requireAdmin: true,
    },
  );
