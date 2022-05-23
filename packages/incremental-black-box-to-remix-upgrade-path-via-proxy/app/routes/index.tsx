import { json, LoaderFunction, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getClient } from "~/data";

export const loader: LoaderFunction = async ({ request }) => {
  const client = getClient(request);
  try {
    return json((await client.get("api/v1/courses")).body);
  } catch (e) {
    if (!request.url.startsWith("/login")) return redirect("/login");
  }
};

export default function Dashboard() {
  const courses = useLoaderData();
  return (
    <main>
      <h2>Dashboard</h2>
      <h3>Courses</h3>
      <ul>
        {courses.map((course: any) => (
          <li key={course.id}>
            <a href={`/courses/${course.id}`}>{course.name}</a> |{" "}
            <Link to={`/courses/${course.id}/remix`}>✨</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
