import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    API_INTERNAL_URL: z.url().default("http://localhost:3000"),
  },
  runtimeEnv: {
    API_INTERNAL_URL: process.env.API_INTERNAL_URL,
  },
  emptyStringAsUndefined: true,
});
