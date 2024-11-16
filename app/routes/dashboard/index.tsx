import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard, {user.name}!</h1>
      <p className="text-lg mb-6">Here you can manage all aspects of your restaurant operations. Use the links below to get started.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/dashboard/employees"
          className="block p-6 rounded-lg shadow-lg bg-blue-500 text-white text-center hover:bg-blue-600"
        >
          Manage Employees
        </Link>
        <Link
          to="/dashboard/shifts"
          className="block p-6 rounded-lg shadow-lg bg-green-500 text-white text-center hover:bg-green-600"
        >
          Manage Shifts
        </Link>
        <Link
          to="/dashboard/settings"
          className="block p-6 rounded-lg shadow-lg bg-yellow-500 text-white text-center hover:bg-yellow-600"
        >
          Account Settings
        </Link>
      </div>
    </div>
  );
}
