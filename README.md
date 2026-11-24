# SHAFA LABARIN SHUNI

Mobile-first Hausa stories and serialized novels website.

## Website files
- `index.html` — public catalogue and story reader.
- `public.js` — loads published stories and accessible episodes from Supabase.
- `admin.html` — admin login and story management.
- `admin-episodes.html` — episode text, audio URL, publish/draft and lock scheduling.
- `config.js` — browser-safe Supabase project URL and publishable key.
- `config.example.js` — configuration template (do not overwrite the working config.js).
- `supabase/schema.sql` — legacy standalone schema reference only. The live site currently uses the isolated `shafa_stories`, `shafa_episodes`, and `shafa_episode_unlocks` tables in the connected Supabase project.

## Supabase and access
The live configuration points to the existing Student Loan Found Supabase project. Shafa data is stored in Shafa-prefixed tables; do not rename or modify the other project's tables for this site.

Admin pages authenticate with Supabase Auth and verify `public.user_roles` for the signed-in user's `user_id` where `role = 'admin'`. Do not put a service-role secret in browser code. The publishable/anon key is intended for browser use and database access is restricted by RLS.

## Deploy
The repository root contains `index.html`; import this repository into Vercel as a static site with no build command and no output directory override. Each push to the connected production branch should trigger a deployment.

## Current feature status
- Public story catalogue: connected to published Shafa stories.
- Story reader: loads published episodes.
- Admin story management: create, edit, publish/draft, delete.
- Admin episode management: create, edit, publish/draft, delete, audio URL, lock flag and scheduled unlock time.
- Locked episode content is filtered by database RLS unless the episode is unlocked by its scheduled time, an unlock record exists for the signed-in user, or the user is an admin.
- Direct cover image upload to the public `shafa-covers` Storage bucket (JPG/PNG/WebP, max 5MB).
- Direct audio upload to the public `shafa-audio` Storage bucket (MP3/MP4/OGG/WAV/WebM, max 25MB); external audio URLs are also supported.
- A published sample story, “Ranar Kasuwa”, with its first free episode is seeded in the database.
- Locked episode titles and scheduled unlock notices are shown through a metadata-only RPC; protected episode text remains behind table RLS.
- Rewarded-ad verification, payment processing, AI story assistant, and generated Mustapha/female narration are not yet implemented.
- Deployment and real-device end-to-end testing must be confirmed in Vercel/browser before describing the site as fully live.

## Important security note
Never expose a Supabase `service_role` key in `config.js`. Use only the publishable/anon key in the browser. Configure any future rewarded-ad or payment unlock through a trusted server-side verification flow; never unlock episodes merely because a user clicks an advertisement.
