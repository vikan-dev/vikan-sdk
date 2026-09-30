# Publishing @vikan/sdk

GitHub organizations and npm organizations are independent. The GitHub repository
is `vikan-dev/vikan-sdk`; publishing `@vikan/sdk` requires control of the npm
`vikan` user/organization scope. Prefer a `vikan` organization. Its public-package
plan is free; the organization name becomes the package scope.

1. Sign in to npm and [create the vikan organization](https://www.npmjs.com/org/create)
   if you do not already own that scope. Choose **Unlimited public packages**.
   If the name is unavailable, resolve the intended scope before changing package names.
2. Add the maintainer's npm account to that organization with publishing rights.
3. Authenticate locally with `bunx npm login`; `bun pm whoami` should identify
   the account. Complete npm's 2FA/browser authentication yourself. Do not put
   tokens or one-time passwords in source files or commits.
4. Run `bun run check`, `bun run check:contract ../eztodo`, and
   `bun pm pack --dry-run`. Verify the package contains built JS, declarations,
   README and license notices.
5. Publish with `bun publish --access public`, then verify the registry version
   and update the README installation section. The repository has no automatic
   publish-on-push job.

For later releases, npm also supports a GitHub Actions **Trusted Publisher**
bound to an exact organization, repository and workflow filename. Configure it
in the package's npm settings before adding a release workflow. npm currently
documents Node 22.14+ and npm CLI 11.5.1+ for OIDC publishing; this is separate
from Bun-based development and builds.

References: [npm organization setup](https://docs.npmjs.com/creating-an-organization/),
[scoped public packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/),
[trusted publishing](https://docs.npmjs.com/trusted-publishers/),
[Bun publishing](https://bun.sh/docs/pm/cli/publish).
