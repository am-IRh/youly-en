import { treaty } from "@elysiajs/eden";
import type { App } from "@youly-en/api";

export const api = treaty<App>(
  typeof window === "undefined" ? (process.env.API_INTERNAL_URL ?? "http://localhost:4000") : "",
);
