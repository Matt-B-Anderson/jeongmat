import { sql } from "drizzle-orm";
import {
  integer,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const batches = sqliteTable("batches", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull(),
  name: text("name").notNull(),
  kimchi_type: text("kimchi_type").notNull(),
  cabbage_weight_g: real("cabbage_weight_g").notNull(),
  salt_amount_g: real("salt_amount_g").notNull(),
  salt_type: text("salt_type").notNull(),
  gochugaru_amount_g: real("gochugaru_amount_g"),
  fish_sauce_ml: real("fish_sauce_ml"),
  saeujeot_amount_g: real("saeujeot_amount_g"),
  garlic_amount_g: real("garlic_amount_g"),
  ginger_amount_g: real("ginger_amount_g"),
  container_type: text("container_type"),
  ambient_temp_c: real("ambient_temp_c").notNull(),
  start_date: text("start_date").notNull(),
  fridge_date: text("fridge_date"),
  recipe_notes: text("recipe_notes"),
  is_vegan: integer("is_vegan").default(0).notNull(),
  is_shellfish_free: integer("is_shellfish_free").default(0).notNull(),
  is_gluten_free: integer("is_gluten_free").default(0).notNull(),
  overall_rating: integer("overall_rating"),
  lessons_learned: text("lessons_learned"),
  status: text("status").default("fermenting").notNull(),
  created_at: text("created_at")
    .default(sql`(datetime('now'))`)
    .notNull(),
  updated_at: text("updated_at")
    .default(sql`(datetime('now'))`)
    .notNull(),
});

export const tasting_logs = sqliteTable("tasting_logs", {
  id: text("id").primaryKey(),
  batch_id: text("batch_id").notNull(),
  user_id: text("user_id").notNull(),
  tasting_date: text("tasting_date").notNull(),
  sourness: integer("sourness"),
  saltiness: integer("saltiness"),
  crunch: integer("crunch"),
  fizz: integer("fizz"),
  overall: integer("overall"),
  notes: text("notes"),
  created_at: text("created_at")
    .default(sql`(datetime('now'))`)
    .notNull(),
});

export type Batch = typeof batches.$inferSelect;
export type NewBatch = typeof batches.$inferInsert;
export type TastingLog = typeof tasting_logs.$inferSelect;
export type NewTastingLog = typeof tasting_logs.$inferInsert;
