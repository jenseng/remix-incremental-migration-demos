import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getClient } from "~/data";

export const loader: LoaderFunction = async ({ request, params }) => {
  const client = getClient(request);
  return json((await client.get(`api/v1/courses/${params.courseId}`)).body);
};

export default function Remix() {
  const course = useLoaderData();
  return (
    <main>
      <h2>
        <a href=".">{course.name}</a>
      </h2>
      <p>✨ Oooh... we're nested inside a legacy proxied route ✨ </p>
    </main>
  );
}
