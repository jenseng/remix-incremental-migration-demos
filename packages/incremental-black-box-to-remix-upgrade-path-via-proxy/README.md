# Migrate any app to Remix by proxying

This is an example of how you can use proxying to incrementally migrate an app to Remix. This could be a fully server-rendered app (e.g. Rails, PHP), a kitchen-sink React app (e.g. Next.js), or a non-React single-page-app (Vue, Preact, etc).

## Considerations

- If your current app is based on React Router, consider following [this guide](https://remix.run/docs/en/v1/guides/migrating-react-router-app) instead.
- If your current app is a generic React-based single page app, consider following [this guide](../incremental-non-rr-spa-to-remix-upgrade-path/) instead.
- This approach is well suited for migrating complete pages at a time, which means you will need to have navs/layouts implemented in both apps for the duration of the migration.
  - If you want more flexibility around migrating nested layouts/components at the cost of a little more complexity, consider the [iframe approach](../incremental-black-box-to-remix-upgrade-path-via-iframe/) instead. Note that you can do both approaches at the same time if you like 🥳

## General Process

The process is generally the same no matter what type of app you're migrating:

1. Install Remix and set up the conventional files of `app/{root,entry.client,entry.server}.tsx`
2. Create a `app/routes/$.tsx` file like [the one](app/routes/$.tsx) in this repo that will proxy all requests. Tweak the proxying config as necessary, depending on the environment (local, test, prod).
3. Modify the `dev` command to run both the old and new apps simultaneously.
4. **Important:** The root index route (/) can't be proxied with this mechanism, so you either have to 1. reimplement it in Remix now, 2. change its URL and redirect to it, or 3. proxy it another way (e.g. at the express layer).
5. Apart from that, everything should work locally at this point (and it'll be server rendered too!!). Commit + push!
6. Modify your infra (DNS, CDN, etc.) to point your app hostname(s) at your deployed Remix app. Depending on how/where you deploy, you may also need to change DNS/etc. for your old app (see proxying note in step 2).
7. Over time, reimplement routes in this app to take over URLs from the old app.
8. You're done!

## About This Demo App

This particular example is pre-wired to work with [a vanilla Canvas LMS setup](https://github.com/instructure/canvas-lms/wiki/Quick-Start). The app layout and root index route have been reimplemented in Remix, and a new nested route has been created. All other requests are proxied to Canvas.

### To Run This Demo App:

1. Follow the [Canvas Quick Start](https://github.com/instructure/canvas-lms/wiki/Quick-Start) guide to get Canvas set up locally
2. Clone this repo and run `npm install`
3. `cd packages/incremental-black-box-to-remix-upgrade-path-via-proxy && npm run dev`
4. Open your browser to `http://localhost:3000` and log in with the credentials you set up when installing Canvas.
