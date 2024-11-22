import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation, useParams } from "@remix-run/react";
import { useState } from "react";

import {
  resetPassword,
  getUserByResetToken,
  validateNewPassword,
} from "~/models/user.server";

export const meta: MetaFunction = () => [{ title: "Set New Password" }];

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { token } = params as { token: string };

  if (!token) {
    return redirect("/reset-password");
  }

  const user = await getUserByResetToken(token);
  if (!user) {
    return redirect("/reset-password");
  }

  console.log(`User found for reset token ${token}: ${user.email}`);

  return new Response(JSON.stringify({ token }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { token } = params as { token: string };
  const formData = await request.formData();
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (typeof password !== "string" || !validateNewPassword(password)) {
    return new Response(
      JSON.stringify({ error: "Please enter a valid password." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  if (password !== confirmPassword) {
    return new Response(JSON.stringify({ error: "Passwords do not match." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await resetPassword(token, password);
    return redirect("/login?reset=success");
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export default function ResetPasswordToken() {
  const { token } = useParams<{ token: string }>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8 py-8">
        <h1 className="mb-4 text-center font-pressStart text-2xl text-red-700">
          Set New Password
        </h1>
        {actionData?.error ? (
          <div className="mb-4 text-sm text-red-600">{actionData.error}</div>
        ) : null}
        <Form
          method="post"
          action={`/reset-password?token=${token}`}
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <div className="mt-1">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded bg-blue-900 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-700"
            disabled={navigation.state === "submitting"}
          >
            {navigation.state === "submitting"
              ? "Updating..."
              : "Update Password"}
          </button>
        </Form>
      </div>
    </div>
  );
}
