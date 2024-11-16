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
  const { user } = useLoaderData<{ user: { name: string } }>();

  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="mb-4 text-3xl font-bold">
        Welcome to Your Dashboard, {user.name}!
      </h1>
      <p className="mb-6 text-lg">
        Here you can manage all aspects of your restaurant operations. Use the
        links below to get started.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link
          to="/dashboard/employees"
          className="flex transform items-center rounded-md border border-gray-300 p-3 shadow-sm transition-transform hover:scale-105 focus:ring-2 focus:ring-blue-500"
        >
          <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-lg font-semibold text-white">
            E
          </div>
          <span className="text-lg font-medium text-gray-800">
            Manage Employees
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
          to="/dashboard/settings"
          className="flex transform items-center rounded-md border border-gray-300 p-3 shadow-sm transition-transform hover:scale-105 focus:ring-2 focus:ring-yellow-500"
        >
          <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500 text-lg font-semibold text-white">
            A
          </div>
          <span className="text-lg font-medium text-gray-800">
            Account Settings
          </span>
        </Link>
      </div>

      <Outlet />
    </div>
  );
}
