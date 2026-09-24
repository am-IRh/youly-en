import openapi, { fromTypes } from "@elysia/openapi";
import { cors } from "@elysiajs/cors";
import { env } from "@youly-en/env/server";
import { Elysia } from "elysia";
import { z } from "zod/mini";
import { betterAuthPlugin } from "./lib/auth-plugin";
import { badgesModule } from "./modules/badges/routes";
import { courseManagementModule } from "./modules/courses/management-routes";
import { coursesModule } from "./modules/courses/routes";
import { lessonManagementModule } from "./modules/lessons/management-routes";
import { lessonsModule } from "./modules/lessons/routes";
import { levelManagementModule } from "./modules/levels/management-routes";
import { levelsModule } from "./modules/levels/routes";
import { reportsModule } from "./modules/reports/routes";

const app = new Elysia({ prefix: "/api" })
  .onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      set.status = 422;
      return { error: "ورودی نامعتبره", details: error.message };
    }
    if (code === "NOT_FOUND") {
      set.status = 404;
      return { error: "پیدا نشد" };
    }
    console.error(error);
    set.status = 500;
    return { error: "خطای سرور، لطفاً بعداً امتحان کنید" };
  })
  .use(
    openapi({
      references: fromTypes(),
      mapJsonSchema: { zod: z.toJSONSchema },
    }),
  )
  .use(
    cors({
      origin: env.WEB_URL,
      credentials: true,
    }),
  )
  .use(betterAuthPlugin)
  .get("/", () => "OK")
  .use(coursesModule)
  .use(levelsModule)
  .use(lessonsModule)
  .use(courseManagementModule)
  .use(levelManagementModule)
  .use(lessonManagementModule)
  .use(reportsModule)
  .use(badgesModule)
  .get("/me", ({ user }) => user, { auth: true })
  .listen(env.SERVER_PORT, () => {
    console.log(`Server is running on ${env.SERVER_PORT}`);
  });

export type App = typeof app;
