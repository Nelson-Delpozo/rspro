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

  console.log(user);

  return (
    <div className="container mx-auto p-6 text-center">
      <h2 className="font-pressStart mb-4 text-2xl">Account Management</h2>
      {/* Placeholder content - Add account settings management functionality here */}
      <Link
        to="/dashboard"
        className="mt-4 inline-block rounded bg-blue-900 px-4 py-2 text-white hover:bg-blue-600"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
