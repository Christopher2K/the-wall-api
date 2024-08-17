import "dotenv/config";

import { serve } from "@hono/node-server";
import { Hono } from "hono";

import { auth } from "./feature/auth/auth-controller";
import { posts } from "./feature/posts/posts-controller";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

const app = new Hono().basePath("/api/v1");

app.use(logger());
app.use(cors());

app.route("/", auth);
app.route("/", posts);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

console.debug(`API running on ${process.env.PORT}`);
serve({
  fetch: app.fetch,
  port: +process.env.PORT,
});
