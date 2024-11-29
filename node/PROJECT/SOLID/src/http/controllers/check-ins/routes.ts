import { FastifyInstance } from "fastify";

import { verifyJWT } from "@/middlewares/verify-jwt";
import { create } from "./create";
import { validate } from "./validate";
import { metrics } from "./metrics";
import { history } from "./history";
import { verifyUserRole } from "@/middlewares/verify-user-role";

export async function checkInRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/check-ins/history", history);
  app.get("/check-ins/metrics", metrics);

  app.post("/gyms/:gymId/check-ins", create);
  app.patch(
    "/check-ins/:checkInId/validate",
    { onRequest: [verifyUserRole("ADMIN")] },
    validate
  );
}
