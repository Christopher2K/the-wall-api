import { bearerAuth } from "hono/bearer-auth";

import { verityAuthToken } from "./auth-services";

export function authRequired() {
  return bearerAuth({
    verifyToken: (token, c) =>
      verityAuthToken(token).match(
        (data) => {
          c.set("userId", data.userId);
          return true;
        },
        (_) => false,
      ),
  });
}
