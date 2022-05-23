import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { getClient } from "~/data";
import fs from "fs";

import { LegacyPage } from "../components/legacyPage";

export const loader: LoaderFunction = async ({ request }) => {
  const client = getClient(request);
  return json({
    courses: (await client.get("api/v1/courses")).body,
    // TODO: use a database 😆
    newDash: fs.existsSync("/tmp/newDash"),
  });
};

export const action: ActionFunction = async () => {
  // TODO: use a database 😆
  fs.existsSync("/tmp/newDash")
    ? fs.unlinkSync("/tmp/newDash")
    : fs.closeSync(fs.openSync("/tmp/newDash", "w"));
  return redirect("/");
};

function Dashboard() {
  const { courses } = useLoaderData();
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

export default function Index() {
  const { newDash } = useLoaderData();
  return (
    <>
      <Form
        method="post"
        style={{ position: "absolute", right: "1em", bottom: "1em" }}
      >
        <button type="submit">
          {newDash ? "🥱 Go to Old Dashboard 🥱" : "✨ Go to New Dashboard ✨"}
        </button>
      </Form>
      {newDash ? <Dashboard /> : <LegacyPage />}
    </>
  );
}
