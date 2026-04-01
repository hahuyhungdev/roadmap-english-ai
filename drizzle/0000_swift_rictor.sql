CREATE TABLE "script_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"script_hash" varchar(64) NOT NULL,
	"script_preview" varchar(500),
	"sentences" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tts_cache" (
	"id" serial PRIMARY KEY NOT NULL,
	"text_hash" varchar(64) NOT NULL,
	"text" text NOT NULL,
	"voice" varchar(100) NOT NULL,
	"speed" real DEFAULT 1 NOT NULL,
	"audio_base64" text NOT NULL,
	"mime_type" varchar(50) DEFAULT 'audio/mpeg' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "youtube_transcripts" (
	"id" serial PRIMARY KEY NOT NULL,
	"video_id" varchar(20) NOT NULL,
	"video_title" varchar(500),
	"sentences" jsonb NOT NULL,
	"source" varchar(50) DEFAULT 'youtube-transcript',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "youtube_transcripts_video_id_unique" UNIQUE("video_id")
);
--> statement-breakpoint
CREATE INDEX "tts_cache_hash_idx" ON "tts_cache" USING btree ("text_hash");--> statement-breakpoint
CREATE INDEX "yt_video_id_idx" ON "youtube_transcripts" USING btree ("video_id");