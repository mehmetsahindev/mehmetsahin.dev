# mehmetsahin.dev

Personal website of Mehmet Şahin: portfolio, blog and admin panel.

Originally based on [chanhdai.com](https://github.com/ncdai/chanhdai.com) by Nguyễn Chánh Đại (MIT License). It is maintained independently and does not track upstream.

## Development

Requirements: Node.js 22+, pnpm 12, Docker (for the local database).

```bash
pnpm install
cp .env.example .env.local          # then fill in the secrets
docker compose -f compose.dev.yaml up -d
pnpm dev
```

Open http://localhost:3000. The admin panel lives at `/admin`. Database migrations run automatically when the server starts.

After changing `src/db/schema`, create a migration with `pnpm db:generate`.

## Deployment (Dokploy)

The whole stack (app + Postgres + uploads volume) is defined in `compose.yaml`.

1. Create a GitHub OAuth App at https://github.com/settings/developers
   - Homepage URL: `https://mehmetsahin.dev`
   - Callback URL: `https://mehmetsahin.dev/api/auth/callback/github`
2. In Dokploy, create a Compose service from this repository using `compose.yaml`.
3. Set these environment variables:
   - `NEXT_PUBLIC_APP_URL` (e.g. `https://mehmetsahin.dev`)
   - `POSTGRES_PASSWORD`
   - `BETTER_AUTH_SECRET` (`openssl rand -base64 32`)
   - `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
   - `ADMIN_GITHUB_USERNAME`
   - `SITE_NOINDEX=true` on non-production deployments (e.g. `dev.mehmetsahin.dev`): robots.txt blocks all crawlers and pages get `noindex`
4. Add a domain pointing to service `app`, port `3000`, and deploy.

## License

MIT. See [LICENSE](LICENSE).
