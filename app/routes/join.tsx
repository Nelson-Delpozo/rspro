import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { prisma } from "~/db.server";
import { createRestaurantWithManager, registerEmployeeWithToken } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect, validateEmail } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return new Response(JSON.stringify({}), {
    headers: { "Content-Type": "application/json" },
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/dashboard");
  const isManagerRegistration = formData.get("isManagerRegistration") === "true";
  const token = formData.get("token");
  const restaurantName = formData.get("restaurantName");
  const managerName = formData.get("managerName");
  const phoneNumber = formData.get("phoneNumber") as string | undefined;

  // Validate Email
  if (typeof email !== "string" || !validateEmail(email)) {
    return new Response(
      JSON.stringify({ errors: { email: "Email is invalid", password: null } }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Validate Password
  if (typeof password !== "string" || password.length === 0) {
    return new Response(
      JSON.stringify({ errors: { email: null, password: "Password is required" } }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  if (password.length < 8) {
    return new Response(
      JSON.stringify({ errors: { email: null, password: "Password is too short" } }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Check for existing user
  const existingUser = await prisma.user.findUnique({ where: { email: email as string } });
  if (existingUser) {
    return new Response(
      JSON.stringify({ errors: { email: "A user already exists with this email", password: null } }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  let user;
  if (isManagerRegistration) {
    // Register a new restaurant and manager
    if (typeof restaurantName !== "string" || typeof managerName !== "string") {
      return new Response(
        JSON.stringify({ errors: { general: "Missing required restaurant or manager information" } }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { manager } = await createRestaurantWithManager({
      restaurantName,
      managerEmail: email,
      password,
      managerName,
      phoneNumber,
    });
    user = manager;
  } else if (typeof token === "string") {
    // Register a new employee using a token
    if (typeof managerName !== "string") {
      return new Response(
        JSON.stringify({ errors: { general: "Manager name is required for employee registration" } }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    try {
      user = await registerEmployeeWithToken({ email, password, name: managerName, token, phoneNumber });
    } catch (error) {
      return new Response(
        JSON.stringify({ errors: { general: (error as Error).message } }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  } else {
    return new Response(
      JSON.stringify({ errors: { general: "Invalid registration flow" } }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  return createUserSession({
    redirectTo,
    remember: false,
    request,
    userId: user.id,
  });
};

export const meta: MetaFunction = () => [{ title: "Sign Up" }];

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                ref={emailRef}
                id="email"
                required
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus={true}
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.email ? (
                <div className="pt-1 text-red-700" id="email-error">
                  {actionData.errors.email}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                ref={passwordRef}
                name="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.password ? (
                <div className="pt-1 text-red-700" id="password-error">
                  {actionData.errors.password}
                </div>
              ) : null}
            </div>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button
            type="submit"
            className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Create Account
          </button>
          <div className="flex items-center justify-center">
            <div className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                className="text-blue-500 underline"
                to={{
                  pathname: "/login",
                  search: searchParams.toString(),
                }}
              >
                Log in
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
