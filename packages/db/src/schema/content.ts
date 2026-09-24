import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const contentStatusEnum = pgEnum("content_status", [
  "draft",
  "pending_review",
  "published",
  "rejected",
]);

export const courses = pgTable("courses", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  coverImageUrl: text("cover_image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const levels = pgTable(
  "levels",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    courseId: text("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    order: integer("order").notNull().default(0),
  },
  (t) => [unique("levels_course_slug_unique").on(t.courseId, t.slug)],
);

export const lessons = pgTable(
  "lessons",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    levelId: text("level_id")
      .notNull()
      .references(() => levels.id, { onDelete: "cascade" }),

    slug: text("slug").notNull(),

    title: text("title").notNull(),

    order: integer("order").notNull().default(0),

    content: jsonb("content").$type<unknown[]>().notNull().default([]),

    status: contentStatusEnum("status").notNull().default("draft"),

    authorId: text("author_id")
      .notNull()
      .references(() => user.id),

    reviewedBy: text("reviewed_by").references(() => user.id),

    reviewedAt: timestamp("reviewed_at"),

    createdAt: timestamp("created_at").notNull().defaultNow(),

    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [unique("lessons_level_slug_unique").on(t.levelId, t.slug)],
);

export const lessonNotes = pgTable("lesson_notes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  lessonId: text("lesson_id")
    .notNull()
    .references(() => lessons.id, { onDelete: "cascade" }),
  authorId: text("author_id")
    .notNull()
    .references(() => user.id),
  body: text("body").notNull(),
  status: contentStatusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reportTargetEnum = pgEnum("report_target", ["lesson"]); // someday: "note", "course", ...
export const reportStatusEnum = pgEnum("report_status", ["open", "resolved", "dismissed"]);

export const reports = pgTable("reports", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  targetType: reportTargetEnum("target_type").notNull().default("lesson"),
  targetId: text("target_id").notNull(),
  reporterId: text("reporter_id")
    .notNull()
    .references(() => user.id),
  message: text("message").notNull(),
  status: reportStatusEnum("status").notNull().default("open"),
  resolvedBy: text("resolved_by").references(() => user.id),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const badges = pgTable("badges", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(), // "verified-teacher", "english-7-plus"
  title: text("title").notNull(),
  grantsContentCreation: boolean("grants_content_creation").notNull().default(false),
});

export const userBadges = pgTable(
  "user_badges",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    badgeId: text("badge_id")
      .notNull()
      .references(() => badges.id, { onDelete: "cascade" }),
    grantedBy: text("granted_by")
      .notNull()
      .references(() => user.id),
    grantedAt: timestamp("granted_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.badgeId] })],
);
