# mehmetsahin.dev

Personal website of Mehmet Şahin: portfolio, blog and admin panel.

Based on [chanhdai.com](https://github.com/ncdai/chanhdai.com) by Nguyễn Chánh Đại (MIT License).

## Development

Requirements: Node.js 22+, pnpm 12.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open http://localhost:3000.

## Pulling updates from upstream

This repository is a fork of `ncdai/chanhdai.com`. The original is added as the `upstream` remote (push disabled):

```bash
git remote add upstream https://github.com/ncdai/chanhdai.com.git
git remote set-url --push upstream no_push
```

The two codebases have diverged a lot, so prefer cherry-picking individual commits over merging everything:

```bash
git fetch upstream
git log --oneline main..upstream/main   # see what is new upstream
git cherry-pick <commit>                # take only what you want
```

## License

MIT. See [LICENSE](LICENSE).
