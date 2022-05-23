# Migrate an app to Remix by proxying

This is an example of how you can incrementally migrate a legacy app to Remix. This could be a fully server-rendered app (e.g. Rails, PHP), a kitchen-sink React app (e.g. Next.js), or a non-React single-page-app (Vue, Preact, etc).

This particular example is pre-wired to work with [a vanilla canvas-lms setup](https://github.com/instructure/canvas-lms/wiki/Quick-Start). The app layout and top-level index route have been reimplemented in Remix, and a new nested route has been created. All other requests are proxied to the old app.

The process is generally the same no matter what type of app you're migrating:

1. Install Remix and set up the conventional files of `app/{root,entry.client,entry.server}.tsx`
2. Create a `app/routes/$.tsx` file like [the one](app/routes/$.tsx) in this repo that will proxy all requests. Tweak the proxying config as necessary, depending on the environment (local, test, prod).
3. Modify the `start` command to run both the old and new apps simultaneously.
4. The root route can't be proxied with this mechanism, so you either have to reimplement it in Remix now, or change its URL and redirect to it.
5. Apart from that, everything should work locally at this point (and it'll be server rendered too!!). Commit + push!
6. Modify your infra (DNS, CDN, etc.) to point your app hostname(s) at your deployed Remix app.
7. Over time, reimplement routes in this app to take over URLs from the old app.
8. You're done!
