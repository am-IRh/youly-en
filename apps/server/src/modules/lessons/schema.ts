import { t } from "elysia";

export const lessonBlockSchema = t.Union([
  t.Object({ type: t.Literal("paragraph"), text: t.String() }),
  t.Object({
    type: t.Literal("heading"),
    text: t.String(),
    level: t.Union([t.Literal(2), t.Literal(3)]),
  }),
  t.Object({
    type: t.Literal("vocabulary"),
    word: t.String(),
    translation: t.String(),
    example: t.Optional(t.String()),
    audioUrl: t.Optional(t.String()),
  }),
]);

export const createLessonBody = t.Object({
  levelId: t.String(),
  slug: t.String(),
  title: t.String(),
  order: t.Number(),
  content: t.Array(lessonBlockSchema),
});
