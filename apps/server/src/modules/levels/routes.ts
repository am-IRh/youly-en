import { Elysia, t } from "elysia";
import { paginationQuery } from "../../lib/pagination";
import { getLevelBySlug, getLevels } from "./service";

export const levelsModule = new Elysia({
  name: "levels",
  prefix: "/courses/:courseSlug/levels",
})
  .get(
    "/",
    async ({ params, query, status }) => {
      const result = await getLevels(params.courseSlug, query.page, query.limit);
      if (!result) return status(404);
      return result;
    },
    { params: t.Object({ courseSlug: t.String() }), query: paginationQuery },
  )
  .get(
    "/:levelSlug",
    async ({ params, status }) => {
      const level = await getLevelBySlug(params.courseSlug, params.levelSlug);
      if (!level) return status(404);
      return level;
    },
    { params: t.Object({ courseSlug: t.String(), levelSlug: t.String() }) },
  );
