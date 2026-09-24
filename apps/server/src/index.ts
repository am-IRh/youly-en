import openapi, { fromTypes } from "@elysia/openapi";
import { cors } from "@elysiajs/cors";
import { env } from "@youly-en/env/server";
import { Elysia } from "elysia";
import { z } from "zod/mini";
import { betterAuthPlugin } from "./lib/auth-plugin";
import { coursesModule } from "./modules/courses/routes";
import { lessonsModule } from "./modules/lessons/routes";
import { levelsModule } from "./modules/levels/routes";

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
  .get("/me", ({ user }) => user, { auth: true })
  .listen(env.SERVER_PORT, () => {
    console.log(`Server is running on ${env.SERVER_PORT}`);
  });

export type App = typeof app;
