# micro-fe-pet

Two independent apps wired together with **Webpack 5 Module Federation**. The host loads a
component from the remote **at runtime** — not at build time.

- **`remote/`** — exposes a `Button` component. Runs on `:3001`, also runs standalone.
- **`host/`** — shell that renders the remote's `Button`. Runs on `:3000`.

The point of micro frontends: teams ship independently. A new `remote` release needs no
`host` rebuild.

```
host (:3000)                         remote (:3001)
  import('remote/Button')              exposes ./Button
        │                                    │
        └──── fetch remoteEntry.js ─────────▶│   (manifest)
        ◀───── Button code over network ─────┘
  renders <Button /> in place
```

## Run locally

Two terminals (the apps are independent):

```bash
cd remote && npm install && npm start   # http://localhost:3001
cd host   && npm install && npm start   # http://localhost:3000
```

Open http://localhost:3000 — the button is fetched from the remote at runtime (see the
`remoteEntry.js` request to `:3001` in DevTools → Network).

## How it works

**Remote exposes the component** (`remote/webpack.config.js`):

```js
new ModuleFederationPlugin({
  name: 'remote',
  filename: 'remoteEntry.js',               // manifest the host fetches
  exposes: { './Button': './src/Button' },
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
const RemoteButton = lazy(() => import('remote/Button'));
// <RemoteErrorBoundary fallback={<LocalFallbackButton/>}>
//   <Suspense fallback={…}><RemoteButton /></Suspense>
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
3. Open the host URL — the button is loaded cross-origin from the remote's production URL.
4. Change `remote/src/Button.tsx`, push → only the remote site rebuilds; the host picks up
   the new version on next load.

## Stack

Webpack 5 · `ModuleFederationPlugin` · React 18 · TypeScript (babel-loader) · webpack-dev-server
