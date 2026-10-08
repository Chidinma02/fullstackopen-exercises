import { pgTable, serial, text, integer, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("passwordHash").notNull(),
  token: text("token"),
});

export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  url: text("url").notNull(),
  likes: integer("likes").default(0).notNull(),
  userId: integer("userId").references(() => users.id, { onDelete: "cascade" }),
});

export const readingLists = pgTable("readingLists", {
  id: serial("id").primaryKey(),
  userId: integer("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  blogId: integer("blogId")
    .references(() => blogs.id, { onDelete: "cascade" })
    .notNull(),
  read: boolean("read").default(false).notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  blogs: many(blogs),
  readingLists: many(readingLists),
}));

export const blogsRelations = relations(blogs, ({ one, many }) => ({
  user: one(users, {
    fields: [blogs.userId],
    references: [users.id],
  }),
  readingLists: many(readingLists),
}));

export const readingListsRelations = relations(readingLists, ({ one }) => ({
  user: one(users, {
    fields: [readingLists.userId],
    references: [users.id],
  }),
  blog: one(blogs, {
    fields: [readingLists.blogId],
    references: [blogs.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Blog = typeof blogs.$inferSelect;
export type NewBlog = typeof blogs.$inferInsert;
export type ReadingList = typeof readingLists.$inferSelect;
export type NewReadingList = typeof readingLists.$inferInsert;
