import { Elysia, t } from "elysia";
import { paginationQuery } from "../../lib/pagination";
import { getLessonBySlug, getLessons } from "./service";

export const lessonsModule = new Elysia({
  name: "lessons",
  prefix: "/courses/:courseSlug/levels/:levelSlug/lessons",
})
  .get(
    "/",
    async ({ params, query, status }) => {
      const result = await getLessons(params.courseSlug, params.levelSlug, query.page, query.limit);
      if (!result) return status(404);
      return result;
    },
    { params: t.Object({ courseSlug: t.String(), levelSlug: t.String() }), query: paginationQuery },
  )
  .get(
    "/:lessonSlug",
    async ({ params, status }) => {
      const lesson = await getLessonBySlug(params.courseSlug, params.levelSlug, params.lessonSlug);
      if (!lesson) return status(404);
      console.log(lesson);
      return lesson;
    },
    { params: t.Object({ courseSlug: t.String(), levelSlug: t.String(), lessonSlug: t.String() }) },
  );
