# Migrate a non-React-Router SPA to Remix

This is an example of how you can incrementally migrate to Remix if you have a client-side React app that's not currently using React Router.

## Considerations

- If your current app is based on React Router, consider following [this guide](https://remix.run/docs/en/v1/guides/migrating-react-router-app) instead.
- If your current app is fully server-rendered app (e.g. Rails, PHP), a kitchen-sink React app (e.g. Next.js), or a non-React single-page-app (Vue, Preact, etc), consider using the [proxy](../incremental-black-box-to-remix-upgrade-path-via-proxy/) or [iframe](../incremental-black-box-to-remix-upgrade-path-via-iframe/) approaches instead.

## About This App

This particular app is using [wouter](https://github.com/molefrog/wouter). Its existing routes are generally untouched, though their `Link`s have been switched to `@remix-run/react` ones.

## General Process

This process should generally work with other client-side routers, or if your app has no routing at all:

1. Install Remix and set up the conventional files of `app/{root,entry.client,entry.server}.tsx`
2. Move all your existing code into a directory within the `app` directory (like `app/old-app` for example).
3. Create a `app/routes/$.tsx` file with just `export { default } from "~/old-app/app";` (or whatever file has the root component for your existing app).
4. Change any intra-app `a`/`Link` elements in your old app to use the `Link` from `@remix-run/react`, e.g. [like this](app/old-app/pages/page-2/index.js)
5. Remove all your old webpack build stuff and use the `remix` CLI instead. Your builds are now outrageously fast.
6. Address any gotchas listed in [this guide](https://remix.run/docs/en/v1/guides/migrating-react-router-app). If your legacy client-side router has unsafe browser references (e.g. accessing `location` during render), you may need to wire up a little polyfill in your `entry.server.tsx` [like this](./app/entry.server.tsx).
7. Everything should work at this point (_and_ it'll be server rendered too!!). Commit + push!
8. Over time, move old routes to the `routes` directory until you bring everything over.
9. You're done!

Many thanks to [@kentcdodds](https://github.com/kentcdodds) and [@chaance](https://github.com/chaance) for their react-router->remix migration docs and examples 🙏
