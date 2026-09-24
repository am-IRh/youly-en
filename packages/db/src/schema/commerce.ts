import { boolean, integer, pgEnum, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { courses, levels } from "./content";

export const pricingTypeEnum = pgEnum("pricing_type", ["free", "paid"]);

export const coursePricing = pgTable("course_pricing", {
  courseId: text("course_id")
    .primaryKey()
    .references(() => courses.id, { onDelete: "cascade" }),
  type: pricingTypeEnum("type").notNull().default("free"),
  priceToman: integer("price_toman"),
});

export const levelPricing = pgTable("level_pricing", {
  levelId: text("level_id")
    .primaryKey()
    .references(() => levels.id, { onDelete: "cascade" }),
  priceToman: integer("price_toman").notNull(),
});

export const enrollments = pgTable(
  "enrollments",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    courseId: text("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    levelId: text("level_id").references(() => levels.id, { onDelete: "cascade" }), // null = course
    //     purchasedAt: timestamp("purchased_at").notNull().defaultNow(),
  },
  (t) => [unique().on(t.userId, t.courseId, t.levelId)],
);

export const subscriptions = pgTable("subscriptions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  active: boolean("active").notNull().default(true),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
});
