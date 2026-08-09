import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const learnerProfiles = sqliteTable("learner_profiles", {
  userId: text("user_id").primaryKey(),
  email: text("email").notNull(),
  progressJson: text("progress_json").notNull().default("{}"),
  selectedPlan: text("selected_plan").notNull().default("free"),
  billingCycle: text("billing_cycle").notNull().default("yearly"),
  updatedAt: integer("updated_at").notNull(),
});

export const commercialInterests = sqliteTable("commercial_interests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  email: text("email").notNull(),
  plan: text("plan").notNull(),
  billingCycle: text("billing_cycle").notNull(),
  createdAt: integer("created_at").notNull(),
}, (table) => [index("idx_commercial_interests_user_id").on(table.userId)]);
