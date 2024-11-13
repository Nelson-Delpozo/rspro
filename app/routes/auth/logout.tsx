import { ActionFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";

import { logout } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  // Call the logout function to destroy the session and redirect
  return logout(request);
};

export default function LogoutPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-md">
        <h1 className="mb-4 text-xl font-semibold text-gray-700 text-center">
          Are you sure you want to log out?
        </h1>
        <Form method="post">
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Log Out
          </button>
        </Form>
      </div>
    </div>
  );
}
