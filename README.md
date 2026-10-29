# Franxx MD — Web Dashboard Preview

A responsive Next.js + TypeScript website for testing account flows before a VPS/runtime is available. It includes a landing page, Supabase email/password sign-up and sign-in, password reset, protected dashboard, logout, and per-account basic bot settings.

## What's intentionally not enabled

- No WhatsApp connection, Baileys process, QR pairing, or bot start/stop yet.
- The `0/200` daily command quota is a preview only; it is not enforced until a server-side atomic quota endpoint exists.
- No plugin editor in the Free plan.
- Do not deploy the bot runtime on Vercel Functions. Keep a persistent bot process on a VPS/worker later, one Node process per bot instance.

## Deploy to Vercel

1. Create a new Supabase project.
2. In Supabase Authentication > URL Configuration, set Site URL to your Vercel domain and add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://YOUR-PROJECT.vercel.app/auth/callback`
3. In Supabase Authentication > Providers > Email, choose whether to require email confirmation. For easiest testing, confirmation can be disabled temporarily; re-enable it for production.
4. Copy `.env.example` values into a local `.env.local` and into Vercel Project Settings > Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (local URL locally; Vercel URL on Vercel)
5. Push this folder's contents to a GitHub repository and import it in Vercel. Framework preset: Next.js.
6. Run `npm install`, `npm run dev` locally or deploy from Vercel.

## Security notes

- Auth uses `@supabase/ssr`; Supabase manages its auth cookies and the middleware refreshes the session. Do not put access tokens in localStorage or expose the Supabase service-role key to the browser.
- `.env.local` is ignored by Git; never commit secrets.
- Settings currently use Supabase `user_metadata` for a simple preview. Users can generally edit their own metadata, so do not use it as the authority for roles, quotas, admin rights, or runtime secrets.
- Before enabling runtime, move trusted configuration/quotas into server-controlled tables with RLS and server-only operations. Store WhatsApp session data only in private persistent server storage, not Vercel's ephemeral filesystem.

## Project structure

- `app/page.tsx` — landing page
- `app/login`, `app/register`, `app/forgot-password` — auth pages
- `app/dashboard` — protected dashboard
- `app/settings` — basic account/bot config form
- `app/actions` — server actions
- `lib/supabase` — cookie-based SSR client and session middleware
- `supabase/schema.sql` — optional starter table for future instances

## Troubleshooting

- `Invalid API key`: use the Supabase **anon/public** key, not the service-role key.
- Redirect/callback issue: add the exact Vercel URL to Supabase Auth redirect allowlist and update `NEXT_PUBLIC_SITE_URL`.
- Email not arriving: check Supabase Auth email settings and spam; for a temporary test project, confirmation can be disabled.

## Account roles and Admin Panel
Admin authorization reads the server-managed Supabase `app_metadata.role` claim. Do not use editable `user_metadata` for authorization.
1. Install dependencies: `npm install`.
2. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` only in your trusted terminal environment.
3. Run `node scripts/set-admin.mjs account@email.com admin` after that account has registered.
4. Revoke with `node scripts/set-admin.mjs account@email.com user`.
Never expose the service-role key in `NEXT_PUBLIC_*`, browser code, or a public repository.

Dashboard banner and name-banner fields accept image URLs. The dashboard banner can also be set to video; it plays muted, inline, and loops. The WhatsApp pairing-number field stores configuration only; an actual pairing code/session requires a separately deployed WhatsApp runtime and secure session storage.
