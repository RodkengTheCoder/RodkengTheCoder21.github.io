CREATE TABLE `audit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`detail` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `menus` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`price` real NOT NULL,
	`image_url` text,
	`image_position` text DEFAULT 'center' NOT NULL,
	`is_available` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` text NOT NULL,
	`menu_id` text NOT NULL,
	`menu_name` text NOT NULL,
	`unit_price` real NOT NULL,
	`quantity` integer NOT NULL,
	`line_total` real NOT NULL
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`public_token` text NOT NULL,
	`queue_date` text NOT NULL,
	`queue_no` integer NOT NULL,
	`customer_name` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`pickup_type` text DEFAULT 'pickup' NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'received' NOT NULL,
	`subtotal` real NOT NULL,
	`total` real NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`delivered_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_public_token_unique` ON `orders` (`public_token`);--> statement-breakpoint
CREATE TABLE `queue_counters` (
	`queue_date` text PRIMARY KEY NOT NULL,
	`last_queue_no` integer DEFAULT 0 NOT NULL
);
