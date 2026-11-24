# Shafa Labarin Shuni

Mobile-first Hausa story site starter.

## Files
- `index.html`: public story homepage and reader (includes sample stories).
- `admin.html`: admin sign-in and story CRUD interface.
- `config.example.js`: safe browser configuration template; copy to `config.js`.
- `supabase/schema.sql`: database tables and row-level security policies.

## Supabase setup
1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. In Supabase Authentication, create your admin user.
4. In SQL Editor, promote that user (replace the UUID):
   `UPDATE public.profiles SET role = 'admin' WHERE id = 'YOUR-AUTH-USER-UUID';`
   If no profile row exists, insert it:
   `INSERT INTO public.profiles (id, display_name, role) VALUES ('YOUR-AUTH-USER-UUID', 'Admin', 'admin');`
5. Copy `config.example.js` to `config.js`; set the project URL and anon/public key. Do not use a service_role key in the browser.
6. In Supabase Storage, create a `story-covers` bucket. Set its public/read and admin-write policies before using cover uploads.

## Deploy
Import this GitHub repository into Vercel and deploy it as a static site. The root `index.html` is the homepage.

## Current limitations
The homepage currently displays sample stories; it is not yet connected to the stories database. The admin screen can manage story records after Supabase is configured. Audio narration, episode management, payment/locking, AI story helper, and admin-managed cover/audio upload are not wired yet. Do not advertise these as live features until implemented and tested.
