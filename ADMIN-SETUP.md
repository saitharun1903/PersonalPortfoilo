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

Visit `https://saitharunreddy.me/admin` and log in with the owner account. The editor opens on exactly what the live page shows. If that includes updates not yet in your database (such as the ten bundled certificates replacing the old sample cards), a blue note says so; click **Publish** once to save them.

**Sections:** Profile, Projects, Certificates, About, Skills, Experience, GitHub repos, Page text, Sections (turn whole sections on or off) and Media library. Each has a short guide at the top. Expand an item to edit it, move it up or down, or remove it. Fields that never appear on the live page are hidden.

**Publishing:** changes stay in the editor until you click **Publish** (or press Ctrl/Cmd + S). **Discard** throws away unpublished changes. The status next to the buttons shows when you last published. On phones these controls sit in a bar at the bottom of the screen. Closing the browser without publishing loses unpublished edits; the browser warns you first.

**Photos and files:** every image and PDF field (profile photo, resume, project screenshots, certificate images and PDFs) shows a preview with these buttons:

- **Upload / Replace** chooses a file from your device. Large photos (for example straight from a phone) are shrunk in your browser to at most 2400px and saved as WebP before upload, so they load fast. PDFs can be up to 4 MB.
- **From library** reuses a file you uploaded before.
- **Open** opens the current file; **Remove** clears the field. You can also paste a link.
- For certificates, uploading an image when the PDF field is empty also creates a PDF from it automatically, so the download button works. **Make PDF from image** does the same on demand.

**Media library** shows every uploaded file as a thumbnail. Upload several at once, copy a file's link, or delete files. Files used on the published page cannot be deleted; remove them from the page and publish first.

Uploads are public files. The public page reads the database on every request, so a publish shows up after a reload with no redeploy. If another admin tab published first, your save is rejected rather than overwriting its work; copy any edits you want to keep before reloading.

## 5. Verify the live setup

1. Publish a small edit, reload the public page, and confirm it is visible.
2. Sign out and confirm `/admin` shows only the login screen.
3. Sign back in and confirm the change remains.
4. Upload a certificate image, check a PDF was created for it, publish, and download it from the public page.
5. Remove the test item, publish, and confirm it disappears.

`npm run test:production` covers responsive public pages. `npm run test:database` exercises the real SQL policies in local PostgreSQL through PGlite, including denied anonymous/non-owner writes. Full cloud owner login/persistence checks require your owner session and the SQL setup above.
