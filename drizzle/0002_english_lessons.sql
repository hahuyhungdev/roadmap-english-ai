CREATE TABLE "english_sessions" (
	"slug" varchar(100) PRIMARY KEY NOT NULL,
	"session_number" integer NOT NULL,
	"title" varchar(500) NOT NULL,
	"topic" varchar(500) NOT NULL,
	"phase" varchar(200) NOT NULL,
	"level" varchar(50),
	"description" text,
	"content_md" text NOT NULL,
	"synced_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_progress" (
	"session_slug" varchar(100) PRIMARY KEY NOT NULL,
	"done" text DEFAULT 'false' NOT NULL,
	"done_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
