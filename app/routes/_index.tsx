import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => [{ title: "Welcome to RS-PRO" }];

export default function Index() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="mx-auto w-full max-w-md px-8 py-10 text-center">
        <h1 className="mb-6 text-4xl font-bold text-gray-800">
          Welcome to RS-PRO
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          The ultimate solution for managing restaurant scheduling and
          communication.
        </p>
        <div className="space-y-4">
          <Link
            to="/join"
            className="block w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Create an Account
          </Link>
          <Link
            to="/login"
            className="block w-full rounded border border-blue-500 px-4 py-2 text-blue-500 hover:bg-blue-600 hover:text-white focus:bg-blue-400"
          >
            Log In
          </Link>
        </div>
      </div>
    </main>
  );
}
