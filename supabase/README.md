# SIIG Supabase setup

1. Create a Supabase project.
2. Open **SQL Editor**, paste `schema.sql`, and run it.
3. Open **Authentication > Users** and create the first administrator.
4. Run the final commented `insert into profiles` statement in `schema.sql`, replacing the email.
5. Copy `.env.example` to `.env.local` and add the project URL and public anon key from **Project Settings > API**.
6. Add the same two variables to the Vercel project for Production, Preview, and Development.

Never expose the Supabase service role key in this frontend project. The public anon key is safe to use because database access is protected by Row Level Security.

