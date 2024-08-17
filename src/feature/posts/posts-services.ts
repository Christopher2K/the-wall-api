import { fromPromise, err, ok } from "neverthrow";
import { and, eq } from "drizzle-orm";
import { db, posts } from "#root/db";

import { CreatePostRequest } from "./posts-requests";

export function createPost(data: CreatePostRequest, userId: number) {
  return fromPromise(
    db
      .insert(posts)
      .values({
        title: data.title,
        content: data.content,
        authorId: userId,
      })
      .returning(),
    (_) => new Error("Unable to create new post"),
  ).map(([post]) => ({
    post,
  }));
}

export function deletePost(postId: number, userId: number) {
  return fromPromise(
    db
      .delete(posts)
      .where(and(eq(posts.id, postId), eq(posts.authorId, userId)))
      .returning(),
    (_) => new Error("Unable to delete post"),
  ).map((results) => results.at(0));
}

// TODO: Some bit of pagination I suppose
export function getAllPosts() {
  return fromPromise(
    db.query.posts.findMany(),
    (_) => new Error("Unable to find posts"),
  );
}
