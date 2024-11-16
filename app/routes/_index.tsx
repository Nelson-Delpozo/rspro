import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { getUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) {
    // If the user is already logged in, redirect them to the dashboard
    return redirect("/dashboard");
  }

  // Continue to render the landing page if the user is not logged in
  return new Response(null, {
    status: 200,
  });
};

export const meta: MetaFunction = () => [{ title: "Welcome to RS-PRO" }];

export default function Index() {
  return (
    <main className="flex flex-col flex-grow items-center justify-center bg-white">
      <div className="mx-auto w-full max-w-md px-8 py-10 text-center">
        <h1 className="mb-6 text-4xl font-bold text-gray-800">
          Welcome to Restaurant Scheduler PRO
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          The ultimate solution for managing restaurant scheduling and
          communication.
        </p>
        <div className="space-y-4">
          <Link
            to="/join"
            className="block w-full rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-700"
          >
            Create an Account
          </Link>
          <Link
            to="/login"
            className="block w-full rounded border border-blue-700 px-4 py-2 text-blue-700 hover:bg-blue-600 hover:text-white focus:bg-blue-400"
          >
            Log In
          </Link>
        </div>
      </div>
    </main>
  );
}
