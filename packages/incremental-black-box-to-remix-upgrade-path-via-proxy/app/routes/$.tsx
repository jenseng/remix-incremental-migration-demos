import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { fetch } from "@remix-run/web-fetch";

// TODO: conditionally set target based on environment variables, as this may be different in actual deployments
const target = "http://localhost:3001";

const proxyHandler = ({ request }: { request: Request }): Promise<Response> => {
  const { pathname, search } = new URL(request.url);
  const url = new URL(`${pathname}${search}`, target).toString();

  // TODO you might need to set additional options, or consider a more robust proxying approach.
  // While this generally works well and it streams the response, it is not comprehensive, e.g.
  // it doesn't rewrite URLs anywhere in the response headers or body
  return fetch(url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: "manual",
  });
};

export const loader: LoaderFunction = proxyHandler;
export const action: ActionFunction = proxyHandler;
