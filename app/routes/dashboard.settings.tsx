// Directory: app/routes/dashboard/settings.tsx

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

export default function SettingsPage() {
  const { user } = useLoaderData<{ user: { name: string } }>();

  return (
    <div className="container mx-auto p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
      <p className="mb-4">Welcome, {user.name}. Here you can manage your account settings and preferences.</p>
      {/* Placeholder content - Add account settings management functionality here */}
      <Link to="/dashboard" className="inline-block mt-4 px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-600">Back to Dashboard</Link>
    </div>
  );
}