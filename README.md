# TFC Jersey Registration

Cloudflare Pages + Pages Functions + D1.

The homepage saves and publicly displays every registered player's name, size, and jersey number. Duplicate jersey numbers are allowed. The list refreshes immediately after a submission and every 15 seconds for visitors already on the page.

## Deploy
1. Push the project to GitHub.
2. Create a Cloudflare D1 database named `tfc-jersey`.
3. Run `schema.sql` in the D1 console.
4. Create a Pages project from the repository.
5. Framework preset: None. Build command: empty. Build output directory: `/`.
6. Add a D1 binding named exactly `DB` and select `tfc-jersey`.
7. Redeploy.
8. Add `tfc.harish8.com` as the custom domain.
