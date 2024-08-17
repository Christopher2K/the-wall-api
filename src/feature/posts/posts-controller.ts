import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { authRequired } from "#root/feature/auth/auth-middlewares";
import {
  createPost,
  deletePost,
  getAllPosts,
} from "#root/feature/posts/posts-services";
import { createPostRequestValidator } from "#root/feature/posts/posts-requests";
import { paramIdValidator } from "#root/feature/global/global-requests";

export const posts = new Hono<{
  Bindings: AppBindings;
  variables: AppVariables;
}>().basePath("/posts");

posts.get("/", (c) =>
  getAllPosts().match(
    (posts) =>
      c.json(
        {
          data: posts,
        },
        200,
      ),
    (error) => c.json({ error: { message: error.message } }, 500),
  ),
);

posts.post(
  "/",
  authRequired(),
  zValidator("json", createPostRequestValidator),
  (c) => {
    // @ts-expect-error
    const userId = c.get("userId") as number;
    const newPost = c.req.valid("json");
    return createPost(newPost, userId).match(
      (post) => c.json({ data: post }, 201),
      (error) => c.json({ error: { message: error.message } }, 500),
    );
  },
);

posts.delete(
  "/:id",
  authRequired(),
  zValidator("param", paramIdValidator),
  (c) => {
    // @ts-expect-error
    const userId = c.get("userId") as number;
    const postId = c.req.valid("param").id;
    return deletePost(postId, userId).match(
      (data) => c.json({ data: { deleted: data } }, 200),
      (error) => c.json({ error: { message: error.message } }, 500),
    );
  },
);
