// Directory: app/routes/dashboard/employees.tsx

import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getUser } from "~/session.server";

// Loader function to ensure user is authenticated
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return { user };
};

export default function EmployeesPage() {
  const { user } = useLoaderData<{ user: { name: string } }>();

  console.log(user); // Use the user variable

  return (
    <div className="container mx-auto p-6 text-center">
      <h2 className="font-bungee mb-4 text-2xl">Staff Management</h2>
      {/* Placeholder content - Add employee management functionality here */}
      <Link
        to="/dashboard"
        className="mt-4 inline-block rounded bg-blue-900 px-4 py-2 text-white hover:bg-blue-600"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
