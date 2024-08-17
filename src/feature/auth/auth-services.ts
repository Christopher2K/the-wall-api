import {
  fromPromise,
  err,
  ok,
  fromSafePromise,
  fromThrowable,
} from "neverthrow";
import argon2 from "argon2";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

import { db, users, type DbNewUser, type DbUser } from "#root/db";

import { tokenDataValidator, type SigninRequest } from "./auth-requests";
import { serializeDbUser } from "./auth-converters";

const safeVerityJWT = fromThrowable(jwt.verify);

export async function register(data: DbNewUser) {
  return await fromPromise(
    argon2.hash(data.password),
    (_) => new Error("Unable to hash password"),
  ).andThen((hashedPassword) =>
    fromPromise(
      db
        .insert(users)
        .values({
          username: data.username,
          password: hashedPassword,
        })
        .returning(),
      (_) => new Error("Unable to create new user"),
    ).map(([user]) => ({
      token: createLoginToken(user),
      user: serializeDbUser(user),
    })),
  );
}

export async function login(data: SigninRequest) {
  return fromPromise(
    db.query.users.findFirst({ where: eq(users.username, data.username) }),
    (_) => new Error("Unable to find user"),
  )
    .andThen((user) => (!user ? err(new Error("User not found")) : ok(user)))
    .andThen((user) =>
      fromSafePromise(argon2.verify(user.password, data.password)).andThen(
        (isPasswordValid) =>
          isPasswordValid
            ? ok({
                token: createLoginToken(user),
                user: serializeDbUser(user),
              })
            : err(new Error("Invalid password")),
      ),
    );
}

export function createLoginToken(user: DbUser) {
  return jwt.sign(
    {
      userId: user.id,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "1h",
      issuer: "the-wall-api",
    },
  );
}

export function verityAuthToken(token: string) {
  return safeVerityJWT(token, process.env.SECRET_KEY).map((jwt) => {
    return tokenDataValidator.parse(jwt);
  });
}
