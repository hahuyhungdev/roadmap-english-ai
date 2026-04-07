CREATE TABLE "shadowing_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"mode" varchar(20) NOT NULL,
	"title" varchar(500) NOT NULL,
	"video_id" varchar(20),
	"video_url" text,
	"script_text" text,
	"sentences" jsonb,
	"tts_voice" varchar(100) DEFAULT 'en-US-Chirp3-HD-Fenrir',
	"tts_speed" real DEFAULT 0.75,
	"active_sentence_idx" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "ss_created_idx" ON "shadowing_sessions" USING btree ("created_at");