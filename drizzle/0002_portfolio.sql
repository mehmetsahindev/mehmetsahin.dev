CREATE TABLE "bookmark" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"author" text DEFAULT '' NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"icon_slug" text,
	"icon_media_id" uuid,
	"bookmarked_at" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookmark_category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bookmark_category_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "education" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"school" text NOT NULL,
	"degree" text DEFAULT '' NOT NULL,
	"field_of_study" text DEFAULT '' NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text,
	"description" text DEFAULT '' NOT NULL,
	"skills" text[] DEFAULT '{}' NOT NULL,
	"is_expanded" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "experience" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_name" text NOT NULL,
	"company_website" text DEFAULT '' NOT NULL,
	"logo_id" uuid,
	"location" text DEFAULT '' NOT NULL,
	"location_type" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "experience_position" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"experience_id" uuid NOT NULL,
	"title" text NOT NULL,
	"employment_type" text DEFAULT '' NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text,
	"description" text DEFAULT '' NOT NULL,
	"skills" text[] DEFAULT '{}' NOT NULL,
	"icon" text DEFAULT 'code' NOT NULL,
	"is_expanded" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"first_name" text DEFAULT '' NOT NULL,
	"last_name" text DEFAULT '' NOT NULL,
	"display_name" text DEFAULT '' NOT NULL,
	"username" text DEFAULT '' NOT NULL,
	"job_title" text DEFAULT '' NOT NULL,
	"bio" text DEFAULT '' NOT NULL,
	"taglines" text[] DEFAULT '{}' NOT NULL,
	"about" text DEFAULT '' NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"time_zone" text DEFAULT 'Europe/Istanbul' NOT NULL,
	"avatar_id" uuid,
	"og_image_id" uuid,
	"keywords" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"url" text DEFAULT '' NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text,
	"description" text DEFAULT '' NOT NULL,
	"skills" text[] DEFAULT '{}' NOT NULL,
	"icon_slug" text,
	"icon_media_id" uuid,
	"is_expanded" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"home_sections" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "social_link" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform" text NOT NULL,
	"handle" text DEFAULT '' NOT NULL,
	"url" text NOT NULL,
	"same_as" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tech_category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tech_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"name" text NOT NULL,
	"url" text DEFAULT '' NOT NULL,
	"icon_slug" text,
	"icon_media_id" uuid,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_category_id_bookmark_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."bookmark_category"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_icon_media_id_media_id_fk" FOREIGN KEY ("icon_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experience" ADD CONSTRAINT "experience_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experience_position" ADD CONSTRAINT "experience_position_experience_id_experience_id_fk" FOREIGN KEY ("experience_id") REFERENCES "public"."experience"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_icon_media_id_media_id_fk" FOREIGN KEY ("icon_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tech_item" ADD CONSTRAINT "tech_item_category_id_tech_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."tech_category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tech_item" ADD CONSTRAINT "tech_item_icon_media_id_media_id_fk" FOREIGN KEY ("icon_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bookmark_category_idx" ON "bookmark" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "experience_position_experience_idx" ON "experience_position" USING btree ("experience_id");--> statement-breakpoint
CREATE INDEX "tech_item_category_idx" ON "tech_item" USING btree ("category_id");