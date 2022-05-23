import styles from "~/styles/global.css";
import canvasLogo from "~/images/canvas_logomark_only@2x.png";
import footerLogo from "~/images/footer-logo@2x.png";
import { json, LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { useState } from "react";
import { getClient } from "./data";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Iframed Canvas",
  viewport: "width=device-width,initial-scale=1",
});

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export type LayoutContext = {
  showLayout: boolean;
  setShowLayout: (show: boolean) => void;
};

export const loader: LoaderFunction = async ({ request }) => {
  const client = getClient(request);
  try {
    return json((await client.get("api/v1/users/self")).body);
  } catch (e) {
    if (!new URL(request.url).pathname.startsWith("/login"))
      return redirect("/login");
    return null;
  }
};

export default function App() {
  const user = useLoaderData();
  const [showLayout, setShowLayout] = useState<boolean>(user ? true : false);
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {showLayout && <Navigation />}
        <section id="main" className={showLayout ? "full" : "modal"}>
          <section id="content">
            <Outlet context={{ showLayout, setShowLayout }} />
          </section>
          {showLayout && <Footer />}
        </section>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function Navigation() {
  return (
    <ul role="navigation" id="primary-nav">
      <li>
        <Link to="/" className="home-link">
          <img src={canvasLogo} alt="Canvas" height="100%" />
        </Link>
      </li>
      <li>
        <a href="/profile">Account</a>
      </li>
      <li>
        <a href="/accounts">Admin</a>
      </li>
      <li>
        <Link to="/">Dashboard</Link>
      </li>
      <li>
        <a href="/courses">Courses</a>
      </li>
      <li>
        <a href="/calendar">Calendar</a>
      </li>
      <li>
        <a href="/conversations">Inbox</a>
      </li>
      <li>
        <a
          href="https://community.canvaslms.com/t5/Canvas/ct-p/canvas"
          target="_blank"
        >
          Help
        </a>
      </li>
    </ul>
  );
}

function Footer() {
  return (
    <section id="footer">
      <a href="https://www.instructure.com" target="_blank">
        <img src={footerLogo} alt="Instructure" width="114" height="16" />
      </a>
      <a href="https://www.instructure.com" target="_blank">
        Open Source LMS
      </a>
    </section>
  );
}
