import {
  pgTable,
  serial,
  varchar,
  date,
  text,
  integer,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 32 })
    .notNull()
    .unique("users_username"),
  password: text("password").notNull(),
  insertedAt: date("inserted_at").notNull().defaultNow(),
  updatedAt: date("updated_at").notNull().defaultNow(),
});

export type DbNewUser = typeof users.$inferInsert;
export type DbUser = typeof users.$inferSelect;

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").references(() => users.id),
  insertedAt: date("inserted_at").notNull().defaultNow(),
  updatedAt: date("updated_at").notNull().defaultNow(),
});

export type DbNewPost = typeof posts.$inferInsert;
export type DbPost = typeof posts.$inferSelect;
