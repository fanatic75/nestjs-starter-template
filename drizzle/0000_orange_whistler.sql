CREATE SCHEMA "data";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "data"."user" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256)
);
