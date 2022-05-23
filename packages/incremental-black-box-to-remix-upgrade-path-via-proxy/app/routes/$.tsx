import type { ActionFunction, LoaderFunction } from "@remix-run/node";

// TODO ideally we'd just use @remix-run/web-fetch, but it has some bugs due to it being an
// older fork of node-fetch, e.g. https://github.com/node-fetch/node-fetch/pull/1222
import got, { Method } from "got";

// TODO: conditionally set target based on environment variables, as this may be different in actual deployments
const target = "http://localhost:3001";

const proxyHandler = async ({
  request,
}: {
  request: Request;
}): Promise<Response> => {
  const { pathname, search } = new URL(request.url);
  const url = new URL(`${pathname}${search}`, target).toString();

  const response = await got({
    url,
    method: request.method as Method,
    // TODO you might need to set additional options, or consider a more robust proxying approach if this doesn't suit your needs
    headers: {
      ...Object.fromEntries(request.headers.entries()),
    },
    followRedirect: false,
    responseType: "buffer",
    body: request.body ? await request.text() : undefined,
  });

  const text = response.body;
  const headers = new Headers();

  for (let [key, values] of Object.entries(response.headers)) {
    if (!values) continue;
    if (typeof values === "string") values = [values];
    for (let value of values) headers.append(key, value);
  }

  return new Response(text, { status: response.statusCode, headers });
};

export const loader: LoaderFunction = proxyHandler;
export const action: ActionFunction = proxyHandler;
