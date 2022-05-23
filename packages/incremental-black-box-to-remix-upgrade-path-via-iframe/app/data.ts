import got from "got";

// TODO: conditionally set target based on environment variables, as this may be different in actual deployments
const target = "http://localhost:3001";

export const getClient = (request: Request) => {
  const cookie = request.headers.get("cookie") ?? undefined;
  return got.extend({
    prefixUrl: target,
    headers: { cookie },
    responseType: "json",
  });
};
