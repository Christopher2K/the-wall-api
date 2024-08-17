import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import {
  signinRequestValidator,
  signupRequestValidator,
} from "#root/feature/auth/auth-requests";
import { login, register } from "#root/feature/auth/auth-services";
import { authRequired } from "#root/feature/auth/auth-middlewares";

export const auth = new Hono<{
  Bindings: AppBindings;
  variables: AppVariables;
}>().basePath("/auth");

auth.post("/signup", zValidator("json", signupRequestValidator), async (c) => {
  const result = await register(c.req.valid("json"));
  return result.match(
    ({ user, token }) =>
      c.json(
        {
          data: {
            user,
            token,
          },
        },
        201,
      ),
    (error) => c.json({ error: { message: error?.message } }, 400),
  );
});

auth.post("/signin", zValidator("json", signinRequestValidator), async (c) => {
  const result = await login(c.req.valid("json"));

  return result.match(
    ({ user, token }) =>
      c.json(
        {
          data: {
            user,
            token,
          },
        },
        200,
      ),
    (error) => c.json({ error: { message: error.message } }, 401),
  );
});

auth.get("/signout", authRequired(), (c) => c.json({}, 200));
