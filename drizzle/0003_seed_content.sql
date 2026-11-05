-- Initial content: the single profile and settings rows, and the bookmark
-- categories the site started with. All of it is editable in the admin.
INSERT INTO "profile" ("id", "first_name", "last_name", "display_name", "username", "job_title", "bio", "taglines", "about", "location", "time_zone", "keywords")
VALUES (1, 'Mehmet', 'Şahin', 'Mehmet Şahin', 'mehmetsahindev', 'Software Developer', 'Software developer.', ARRAY['Software developer.'], '- Hi, I''m Mehmet. This section is editable from the admin panel.', 'Türkiye', 'Europe/Istanbul', ARRAY['mehmetsahindev', 'mehmet sahin', 'mehmet şahin'])
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "site_settings" ("id") VALUES (1) ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "social_link" ("platform", "handle", "url", "sort_order") VALUES
  ('x', '@mehmetsahindev', 'https://x.com/mehmetsahindev', 0),
  ('github', 'mehmetsahindev', 'https://github.com/mehmetsahindev', 1),
  ('linkedin', 'mehmetsahindev', 'https://linkedin.com/in/mehmetsahindev', 2);
--> statement-breakpoint
INSERT INTO "bookmark_category" ("name", "slug", "sort_order") VALUES
  ('Article', 'article', 0),
  ('Course', 'course', 1),
  ('Book', 'book', 2),
  ('Reference', 'reference', 3),
  ('UI Library', 'ui-library', 4),
  ('Software', 'software', 5),
  ('Inspiration', 'inspiration', 6)
ON CONFLICT ("slug") DO NOTHING;
