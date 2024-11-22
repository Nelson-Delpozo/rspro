import type { MetaFunction, ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";

import { resetPassword, validateNewPassword, initiatePasswordReset } from "~/models/user.server";
export const meta: MetaFunction = () => [{ title: "Reset Password" }];

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const token = formData.get("token");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (email && typeof email === "string") {
    try {
      await initiatePasswordReset(email);
      return redirect("/login?reset=link-sent"); // <-- Redirect after sending the link.
    } catch (error) {
      if ((error as Error).message.includes("active reset token")) {
        return new Response(
          JSON.stringify({ error: "A reset token is already active for this account. Please check your email." }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      return new Response(JSON.stringify({ error: (error as Error).message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  
  if (token && typeof token === "string") {
    if (typeof password !== "string" || !validateNewPassword(password)) {
      return new Response(JSON.stringify({ error: "Please enter a valid password." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
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
  }

  return new Response(JSON.stringify({ error: "Invalid request." }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
};

export default function ResetPassword() {
  const actionData = useActionData<{ error?: string }>();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, []);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8 py-8">
        {token ? (
          // Set New Password Form
          <>
            <h1 className="text-2xl font-bold text-center mb-4">Set New Password</h1>
            {actionData?.error ? (
              <div className="mb-4 text-sm text-red-600">{actionData.error}</div>
            ) : null}
            <Form method="post" action={`/reset-password?token=${token}`} className="space-y-6">
              <input type="hidden" name="token" value={token} />
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
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
                {navigation.state === "submitting" ? "Updating..." : "Update Password"}
              </button>
            </Form>
          </>
        ) : (
          // Send Reset Link Form
          <>
            <h1 className="text-2xl font-bold text-center mb-4">Reset Password</h1>
            {actionData?.error ? (
              <div className="mb-4 text-sm text-red-600">{actionData.error}</div>
            ) : null}
            <Form method="post" action="/reset-password" className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
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
                {navigation.state === "submitting" ? "Sending..." : "Send Reset Link"}
              </button>
            </Form>
            <div className="text-center text-sm text-gray-500 mt-5">
              <Link
                className="text-blue-700 underline"
                to={{
                  pathname: "/login",
                }}
              >
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
