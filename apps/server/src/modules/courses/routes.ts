import { Elysia, t } from "elysia";
import { paginationQuery } from "../../lib/pagination";
import { getCourseBySlug, getCourses } from "./service";

export const coursesModule = new Elysia({ name: "courses", prefix: "/courses" })
  .get("/", ({ query }) => getCourses(query.page, query.limit), { query: paginationQuery })
  .get(
    "/:courseSlug",
    async ({ params, status }) => {
      const course = await getCourseBySlug(params.courseSlug);
      if (!course) return status(404);
      return course;
    },
    { params: t.Object({ courseSlug: t.String() }) },
  );
