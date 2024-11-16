// Directory: app/routes/dashboard/schedule.tsx

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

export default function SchedulePage() {
  const { user } = useLoaderData<{ user: { name: string; roles: string[] } }>();

  // Conditional rendering based on role
  const isManager = user.roles.includes("MANAGER");

  return (
    <div className="container mx-auto p-6 text-center">
      {isManager ? (
        <>
          <h2 className="mb-4 text-2xl font-bold">Manage Employee Schedule</h2>
          <p className="mb-4">
            Welcome, {user.name}. Here you can create, edit, and manage schedules for your employees.
          </p>
          {/* Placeholder content - Add schedule management functionality here */}
          <Link to="/dashboard" className="inline-block mt-4 px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-600">
            Back to Dashboard
          </Link>
        </>
      ) : (
        <>
          <h2 className="mb-4 text-2xl font-bold">View Your Schedule</h2>
          <p className="mb-4">
            Welcome, {user.name}. Here you can view your work schedule.
          </p>
          {/* Placeholder content - Add schedule viewing functionality for employees */}
          <Link to="/dashboard" className="inline-block mt-4 px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-600">
            Back to Dashboard
          </Link>
        </>
      )}
    </div>
  );
}
