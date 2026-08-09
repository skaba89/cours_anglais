CREATE TABLE `commercial_interests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`email` text NOT NULL,
	`plan` text NOT NULL,
	`billing_cycle` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `learner_profiles` (
	`user_id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`progress_json` text DEFAULT '{}' NOT NULL,
	`selected_plan` text DEFAULT 'free' NOT NULL,
	`billing_cycle` text DEFAULT 'yearly' NOT NULL,
	`updated_at` integer NOT NULL
);
