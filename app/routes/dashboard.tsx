import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { getUser } from "~/session.server";

// Loader to fetch user data
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return { user };
};

// Main Dashboard Component
export default function DashboardIndex() {
  const { user } = useLoaderData<{
    user: { name: string; roles: string[] };
  }>();

  // Conditional Rendering Based on Role
  const isManager = user.roles.includes("MANAGER");

  return (
    <div className="container mx-auto p-6 text-center">
      {isManager ? (
        <>
          <h1 className="font-pressStart mb-4 text-3xl text-red-700">Manager Dashboard</h1>
          <h1 className="font-pressStart mb-4 text-xl text-red-500">{user.name}</h1>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link
              to="/dashboard/employees"
              className="flex transform items-center rounded-md border border-gray-300 p-3 shadow-sm transition-transform hover:scale-105 focus:ring-2 focus:ring-blue-500"
            >
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-lg font-semibold text-white">
                S
              </div>
              <span className="text-lg font-medium text-gray-800">
                Manage Staff
              </span>
            </Link>

            <Link
              to="/dashboard/shifts"
              className="flex transform items-center rounded-md border border-gray-300 p-3 shadow-sm transition-transform hover:scale-105 focus:ring-2 focus:ring-green-500"
            >
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-lg font-semibold text-white">
                S
              </div>
              <span className="text-lg font-medium text-gray-800">
                Manage Shifts
              </span>
            </Link>
            <Link
              to="/dashboard/schedule"
              className="flex transform items-center rounded-md border border-gray-300 p-3 shadow-sm transition-transform hover:scale-105 focus:ring-2 focus:ring-purple-500"
            >
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 text-lg font-semibold text-white">
                S
              </div>
              <span className="text-lg font-medium text-gray-800">
                Manage Schedules
              </span>
            </Link>

            <Link
              to="/dashboard/settings"
              className="flex transform items-center rounded-md border border-gray-300 p-3 shadow-sm transition-transform hover:scale-105 focus:ring-2 focus:ring-yellow-500"
            >
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500 text-lg font-semibold text-white">
                A
              </div>
              <span className="text-lg font-medium text-gray-800">
                Manage Account
              </span>
            </Link>
          </div>
        </>
      ) : (
        <>
          <h1 className="font-pressStart mb-4 text-3xl text-red-700">
            Employee Dashboard
          </h1>
          <h1 className="font-pressStart mb-4 text-xl text-red-500">{user.name}</h1>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link
              to="/dashboard/shifts"
              className="flex transform items-center rounded-md border border-gray-300 p-3 shadow-sm transition-transform hover:scale-105 focus:ring-2 focus:ring-green-500"
            >
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-lg font-semibold text-white">
                S
              </div>
              <span className="text-lg font-medium text-gray-800">
                View Shifts
              </span>
            </Link>

            <Link
              to="/dashboard/availability"
              className="flex transform items-center rounded-md border border-gray-300 p-3 shadow-sm transition-transform hover:scale-105 focus:ring-2 focus:ring-blue-500"
            >
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-lg font-semibold text-white">
                A
              </div>
              <span className="text-lg font-medium text-gray-800">
                Manage Availability
              </span>
            </Link>
            <Link
              to="/dashboard/schedule"
              className="flex transform items-center rounded-md border border-gray-300 p-3 shadow-sm transition-transform hover:scale-105 focus:ring-2 focus:ring-purple-500"
            >
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 text-lg font-semibold text-white">
                S
              </div>
              <span className="text-lg font-medium text-gray-800">
                View Schedule
              </span>
            </Link>

            <Link
              to="/dashboard/notifications"
              className="flex transform items-center rounded-md border border-gray-300 p-3 shadow-sm transition-transform hover:scale-105 focus:ring-2 focus:ring-yellow-500"
            >
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500 text-lg font-semibold text-white">
                N
              </div>
              <span className="text-lg font-medium text-gray-800">
                Notifications
              </span>
            </Link>
          </div>
        </>
      )}

      <Outlet />
    </div>
  );
}
