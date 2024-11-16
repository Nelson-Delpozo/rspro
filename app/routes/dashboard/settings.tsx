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
    <div className="container mx-auto p-6">
      <h2 className="mb-4 text-2xl font-bold">Account Settings</h2>
      <p className="mb-4">
        Welcome, {user.name}. Here you can manage your account settings and
        preferences.
      </p>
      {/* Placeholder content - Add account settings management functionality here */}
      <Link to="/dashboard" className="text-blue-600 hover:underline">
        Back to Dashboard
      </Link>
    </div>
  );
}
