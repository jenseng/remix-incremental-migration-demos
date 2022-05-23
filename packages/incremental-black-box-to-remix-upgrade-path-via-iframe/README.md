# Migrate an app to Remix by iframe-ing

This is an example of how you can incrementally migrate a legacy app to Remix. This could be a fully server-rendered app (e.g. Rails, PHP), a kitchen-sink React app (e.g. Next.js), or a non-React single-page-app (Vue, Preact, etc).

## Considerations

- If your current app is based on React Router, consider following [this guide](https://remix.run/docs/en/v1/guides/migrating-react-router-app) instead.
- If your current app is a generic React-based single page app, consider following [this guide](../incremental-non-rr-spa-to-remix-upgrade-path/) instead.
- This approach is well suited for migrating nested components/layouts in a flexible manner.
  - If you don't need this flexibility (i.e. you're going to migrate complete pages at a time), or if you are unable to embed your old site in an iframe (e.g. due to your IdP/SSO flow or other Reasons™), consider the [proxying approach](../incremental-black-box-to-remix-upgrade-path-via-proxy/) instead. Note that you can do both approaches at the same time if you like 🥳

## About This App

This particular example is pre-wired to work with a modified Canvas LMS setup. The app layout has been reimplemented in Remix and removed from Canvas. Additionally, the root index route can toggle between a new and an iframed view, and a new nested course route has been created. All other routes will load the corresponding pages from the old app using an iframe. Canvas has also been modified to emit `postMessage` events to let Remix know when a page is loaded or a navigation happens.

## General Process

The process is generally the same no matter what type of app you're migrating:

1. Install Remix and set up the conventional files of `app/{root,entry.client,entry.server}.tsx`
2. Create a `app/routes/$.tsx` file like [the one](app/routes/$.tsx) in this repo that will iframe all unknown routes. Tweak the `target` config as necessary, depending on the environment (local, test, prod).
3. If you plan to migrate your layout from your old app into Remix, you'll also want to copy/adapt the `LayoutContext` logic in [`app/root.tsx`](app/root.tsx) and deprecate the layout in your old app.
4. Modify the `start` command to run both the old and new apps simultaneously.
5. Apart from that, everything should work locally at this point (and it'll be server rendered too!!). Commit + push!
6. Modify your infra (DNS, CDN, etc.) to point your app hostname(s) at your deployed Remix app, and use a new hostname for your old app (see `target` note in step 2).
7. Over time, reimplement routes in this app to take over URLs from the old app.
8. You're done!
