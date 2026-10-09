# Connect the portfolio admin

The admin lives at `/admin`. The public site keeps its bundled content until the first successful publish. Saves use Supabase Postgres, and uploads use Supabase Storage. No local filesystem or browser storage is used for published content.

## 1. Create your sole owner

Open [your Supabase project](https://supabase.com/dashboard/project/idwftxeyowgcymgddsbb).

In **Authentication → Users → Add user → Create new user**, create `saitharunreddy@writecode.in`, choose your own strong password, and enable **Auto Confirm User**. Keep the password private; use it at `/admin`.

In **Authentication → Sign In / Providers**, disable **Allow new users to sign up**. Keep Email/password enabled. No public registration is provided by the portfolio. Use the Supabase dashboard if you need to recover or change the owner password.

## 2. Create database and file permissions

Open **SQL Editor → New query**, paste the entire contents of [`supabase/setup.sql`](supabase/setup.sql), and run it. The script must complete successfully. It registers the confirmed owner UUID, creates the content table, enables row-level security, and creates the public `portfolio` file bucket with owner-only writes. It does not grant other accounts editing access.

The script is safe to run again and does not erase existing portfolio content. The private owner table is inaccessible through the public API. The public key alone cannot grant editing privileges.

## 3. Connect Vercel

Under your Vercel project → Settings → Environment Variables, add to Production and Preview:

```text
NEXT_PUBLIC_SUPABASE_URL=https://idwftxeyowgcymgddsbb.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your publishable key from Supabase>
NEXT_PUBLIC_SITE_URL=https://saitharunreddy.me
```

Use the publishable or legacy anon key, never a secret or service-role key. Redeploy after changing environment variables. Local development uses the ignored `.env.local` file.

## 4. Publish your content

Visit `https://saitharunreddy.me/admin`, log in with the owner account, and click **Publish changes** once to persist the current portfolio. Replace the four explicitly marked sample certificates with real credentials.

Use the sidebar to edit profile/contact, page text/SEO, projects, certifications, about paragraphs, skills, experience, GitHub links, and section visibility. Expand an item to edit, move, or remove it. Changes stay unpublished until you click **Publish changes**. Closing the browser without publishing discards those local edits.

Upload PNG, JPEG, WebP, and PDF files up to 3 MB using the appropriate field. Uploads are public portfolio assets. Resume PDFs from Storage open in a new tab and can be downloaded there. Removing a card removes it from the page; its file remains in Media library until deleted separately. Published file references are checked before deletion. Do not delete a file used by another unpublished editing tab.

The public page reads the database on every new request. Reload an already-open visitor tab to see changes. No redeploy is needed after a successful publish. If another admin tab publishes first, your stale save is rejected rather than overwriting its work. Copy any edits you wish to preserve before reloading.

## 5. Verify the live setup

1. Publish a small edit, reload the public page, and confirm it is visible.
2. Sign out and confirm `/admin` shows only the login screen.
3. Sign back in and confirm the change remains.
4. Upload a certificate PDF, publish its link, and open it from the public page.
5. Remove the test item, publish, and confirm it disappears.

`npm run test:production` covers responsive public pages. `npm run test:database` exercises the real SQL policies in local PostgreSQL through PGlite, including denied anonymous/non-owner writes. Full cloud owner login/persistence checks require your owner session and the SQL setup above.
