-- Jeong Mat: Kimchi Batch Tracker
-- Initial schema migration

CREATE TABLE IF NOT EXISTS `batches` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `name` text NOT NULL,
  `kimchi_type` text NOT NULL,
  `cabbage_weight_g` real NOT NULL,
  `salt_amount_g` real NOT NULL,
  `salt_type` text NOT NULL,
  `gochugaru_amount_g` real,
  `fish_sauce_ml` real,
  `saeujeot_amount_g` real,
  `garlic_amount_g` real,
  `ginger_amount_g` real,
  `container_type` text,
  `ambient_temp_c` real NOT NULL,
  `start_date` text NOT NULL,
  `fridge_date` text,
  `recipe_notes` text,
  `is_vegan` integer DEFAULT 0 NOT NULL,
  `is_shellfish_free` integer DEFAULT 0 NOT NULL,
  `is_gluten_free` integer DEFAULT 0 NOT NULL,
  `overall_rating` integer,
  `lessons_learned` text,
  `status` text DEFAULT 'fermenting' NOT NULL,
  `created_at` text DEFAULT (datetime('now')) NOT NULL,
  `updated_at` text DEFAULT (datetime('now')) NOT NULL
);

CREATE TABLE IF NOT EXISTS `tasting_logs` (
  `id` text PRIMARY KEY NOT NULL,
  `batch_id` text NOT NULL,
  `user_id` text NOT NULL,
  `tasting_date` text NOT NULL,
  `sourness` integer,
  `saltiness` integer,
  `crunch` integer,
  `fizz` integer,
  `overall` integer,
  `notes` text,
  `created_at` text DEFAULT (datetime('now')) NOT NULL
);

CREATE INDEX IF NOT EXISTS `batches_user_id_idx` ON `batches` (`user_id`);
CREATE INDEX IF NOT EXISTS `batches_status_idx` ON `batches` (`status`);
CREATE INDEX IF NOT EXISTS `tasting_logs_batch_id_idx` ON `tasting_logs` (`batch_id`);
