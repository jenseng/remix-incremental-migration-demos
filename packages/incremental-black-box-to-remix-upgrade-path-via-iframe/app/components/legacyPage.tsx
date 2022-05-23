import { useLocation, useNavigate, useOutletContext } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
import type { LayoutContext } from "~/root";

// TODO: conditionally set target based on environment variables, as this may be different in actual deployments
const target = "http://localhost:3001";

export function LegacyPage() {
  const { pathname, search } = useLocation();
  const { setShowLayout } = useOutletContext<LayoutContext>();
  const url = `${pathname}${search}`;
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState(url);
  const navigate = useNavigate();

  useEffect(() => {
    const handlePostMessage = (event: MessageEvent) => {
      if (event.origin !== target) return;
      const { data } = event;
      if (data.type === "remix-run:iframe-loaded") {
        setNextUrl(data.path);
        navigate(data.path);
        setShowLayout(data.showLayout);
      } else if (data.type === "remix-run:iframe-navigate") {
        setNextUrl(data.path);
        navigate(data.path);
      }
    };
    window.addEventListener("message", handlePostMessage);
    return () => {
      window.removeEventListener("message", handlePostMessage);
    };
  }, []);

  // only reload/rerender the iframe if the navigation happened above us
  useEffect(() => {
    if (nextUrl) {
      if (url === nextUrl) {
        setNextUrl(null);
      }
    } else {
      setCurrentUrl(url);
    }
  }, [url, nextUrl]);

  return (
    <div
      className="legacy-page-holder"
      style={{ display: nextUrl ? "none" : "block" }}
    >
      {useMemo(
        () => (
          <iframe
            src={new URL(currentUrl, target).toString()}
            key={currentUrl}
            className="legacy-page"
          ></iframe>
        ),
        [currentUrl]
      )}
    </div>
  );
}
