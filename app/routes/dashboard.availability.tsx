// Directory: app/routes/dashboard/availability.tsx

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

export default function AvailabilityPage() {
  const { user } = useLoaderData<{ user: { name: string; roles: string[] } }>();

  // Conditional rendering based on role
  const isManager = user.roles.includes("MANAGER");

  return (
    <div className="container mx-auto p-6 text-center">
      {isManager ? (
        <>
          <h2 className="font-pressStart mb-4 text-2xl">
            Manage Employee Availability
          </h2>
          {/* Placeholder content - Add availability management functionality here */}
          <Link
            to="/dashboard"
            className="mt-4 inline-block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Back to Dashboard
          </Link>
        </>
      ) : (
        <>
          <h2 className="font-pressStart mb-4 text-2xl">Your Availability</h2>
          {/* Placeholder content - Add availability viewing/updating functionality for employees */}
          <Link
            to="/dashboard"
            className="mt-4 inline-block rounded bg-blue-900 px-4 py-2 text-white hover:bg-blue-600"
          >
            Back to Dashboard
          </Link>
        </>
      )}
    </div>
  );
}
