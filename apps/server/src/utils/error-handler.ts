// import { ApiError, ApiResponse } from "./api-response";

// type ErrorContext = {
//   code: string;
//   error: unknown;
// };

/**
 * Global error handler aligned with Elysia's lifecycle. Wire it up in
 * `src/index.ts`:
 *
 *   import { errorHandler } from "./utils/error-handler";
 *   new Elysia().onError(errorHandler);
 */
// export function errorHandler({ code, error }: ErrorContext): Response {
//   if (error instanceof ApiError) {
//     return Response.json(ApiResponse.failure(error.status, error.message, error.details), {
//       status: error.status,
//     });
//   }
//   if (code === "NOT_FOUND") {
//     return Response.json(ApiResponse.notFound(), { status: 404 });
//   }
//   if (code === "VALIDATION") {
//     return Response.json(
//       ApiResponse.badRequest(error instanceof Error ? error.message : "Validation failed"),
//       { status: 400 },
//     );
//   }
//   console.error("Unhandled error:", error);
//   return Response.json(ApiResponse.internal(), { status: 500 });
// }
