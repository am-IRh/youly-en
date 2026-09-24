import { Elysia, t } from "elysia";
import { paginationQuery } from "../../lib/pagination";
import { permissionsPlugin } from "../../lib/permissions";
import { createLessonBody } from "./schema";
import {
  createLesson,
  getLessonById,
  getMyLessons,
  getPendingLessons,
  reviewLesson,
  submitLessonForReview,
} from "./service";

export const lessonManagementModule = new Elysia({ name: "lesson-management", prefix: "/lessons" })
  .use(permissionsPlugin)
  .post(
    "/",
    async ({ body, user }) => {
      const { levelId, ...rest } = body;
      return createLesson(levelId, user.id, rest);
    },
    { body: createLessonBody, requireContentPermission: true },
  )
  .get("/mine", ({ query, user }) => getMyLessons(user.id, query.page, query.limit), {
    query: paginationQuery,
    requireContentPermission: true,
  })
  .post(
    "/:lessonId/submit",
    async ({ params, user, status }) => {
      const lesson = await submitLessonForReview(params.lessonId, user.id);
      if (!lesson) return status(400);
      return lesson;
    },
    { params: t.Object({ lessonId: t.String() }), requireContentPermission: true },
  )
  .get("/pending", ({ query }) => getPendingLessons(query.page, query.limit), {
    query: paginationQuery,
    requireAdmin: true,
  })
  .post(
    "/:lessonId/review",
    async ({ params, body, user, status }) => {
      const lesson = await reviewLesson(params.lessonId, user.id, body.decision);
      if (!lesson) return status(400);
      return lesson;
    },
    {
      params: t.Object({ lessonId: t.String() }),
      body: t.Object({ decision: t.Union([t.Literal("published"), t.Literal("rejected")]) }),
      requireAdmin: true,
    },
  )
  .get(
    "/:lessonId",
    async ({ params, status }) => {
      const lesson = await getLessonById(params.lessonId);
      if (!lesson) return status(404);
      return lesson;
    },
    { params: t.Object({ lessonId: t.String() }), requireContentPermission: true },
  );
