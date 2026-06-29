# micro-fe-pet

Two independently deployed apps wired together with **Webpack 5 Module Federation**. The host
loads a component from the remote **at runtime**, so the remote can ship a new version with no
host rebuild.

**Live demo:**
- Host (shell): https://micro-fe-host.netlify.app
- Remote (standalone): https://micro-fe-remote.netlify.app

The apps model two teams sharing one page:
- **`host/`** — the shop shell, owned by the *Platform team*. Runs on `:3000`.
- **`remote/`** — a promo `Widget`, owned by the *Growth team*. Runs on `:3001`, also standalone.

```
host (:3000)                          remote (:3001)
  import('remote/Widget')               exposes ./Widget
        │                                     │
        └──── fetch remoteEntry.js ──────────▶│   (manifest)
        ◀───── Widget code over network ──────┘
  renders <Widget /> in place
```

## The pain it solves

In a monolith, shipping a one-line change to the promo means rebuilding and redeploying the
**whole** app — the Growth team waits in the Platform team's release train.

With Module Federation the promo is a separate app. Each side shows its own version and build
time, so you can watch them deploy independently:

1. Open the host — the promo is fetched from the remote's domain at runtime.
2. Edit `remote/src/Widget.tsx` (change the copy, bump `version` in `remote/package.json`).
3. `git push` → only the **remote** Netlify site rebuilds.
4. Reload the host (never redeployed) → new promo + new *remote* build time, while the *host*
   build time is unchanged.

That is the whole point: the Growth team shipped to the shell without the Platform team
deploying or being involved.

## Run locally

Two terminals (the apps are independent):

```bash
cd remote && npm install && npm start   # http://localhost:3001
cd host   && npm install && npm start   # http://localhost:3000
```

Open http://localhost:3000 — the widget is fetched from the remote at runtime (see the
`remoteEntry.js` request to `:3001` in DevTools → Network).

## How it works

**Remote exposes the component** (`remote/webpack.config.js`):

```js
new ModuleFederationPlugin({
  name: 'remote',
  filename: 'remoteEntry.js',               // manifest the host fetches
  exposes: { './Widget': './src/Widget' },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
});
```

**Host consumes it by URL** (`host/webpack.config.js`):

```js
const REMOTE_URL = process.env.REMOTE_URL || 'http://localhost:3001';
new ModuleFederationPlugin({
  name: 'host',
  remotes: { remote: `remote@${REMOTE_URL}/remoteEntry.js` }, // resolved at runtime
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
});
```

**Host renders it lazily, with a fallback** (`host/src/App.tsx`):

```tsx
const RemoteWidget = lazy(() => import('remote/Widget'));
// <RemoteErrorBoundary fallback={<Fallback/>}>
//   <Suspense fallback={…}><RemoteWidget /></Suspense>
// </RemoteErrorBoundary>
```

Three things that are easy to get wrong:

1. **Async boundary** — `src/index.ts` does `import('./bootstrap')` instead of importing
   directly. Otherwise MF throws `Shared module is not available for eager consumption`,
   because shared deps initialize asynchronously.
2. **`singleton: true`** for react/react-dom — without it the browser loads two copies of
   React and the remote's hooks/context break.
3. **`publicPath: 'auto'` + CORS** on `remoteEntry.js` — so chunks load from the remote's own
   origin even when the host is on a different domain.

## Deploy (Netlify, two sites)

Host and remote are **separate sites on separate URLs**. Deploying the remote needs no host
redeploy. `netlify.toml` is preconfigured in each app.

1. **Remote site** — base directory `remote`, build `npm run build`, publish `dist`. Gives
   `https://<remote>.netlify.app`. Verify `/remoteEntry.js` loads.
2. **Host site** — base directory `host`, same build/publish. Set env var
   `REMOTE_URL = https://<remote>.netlify.app`.
3. Open the host URL — the widget is loaded cross-origin from the remote's production URL.

## Stack

Webpack 5 · `ModuleFederationPlugin` · React 18 · TypeScript (babel-loader) · webpack-dev-server
