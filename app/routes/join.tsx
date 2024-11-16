import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

import { prisma } from "~/db.server";
import {
  createRestaurantWithManager,
  registerEmployeeWithToken,
} from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect, validateEmail } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return new Response(null, {
    status: 204,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/dashboard");
  const isManagerRegistration =
    formData.get("isManagerRegistration") === "true";
  const token = formData.get("token");
  const restaurantName = formData.get("restaurantName");
  const managerName = formData.get("managerName");
  const phoneNumber = formData.get("phoneNumber") as string | undefined;
  const userPhoneNumber = formData.get("userPhoneNumber") as string | undefined;
  const location = formData.get("location");

  // Validate Email
  if (typeof email !== "string" || !validateEmail(email)) {
    return new Response(
      JSON.stringify({
        errors: {
          email: "Email is invalid",
          password: null,
          confirmPassword: null,
        },
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Validate Password
  if (typeof password !== "string" || password.length === 0) {
    return new Response(
      JSON.stringify({
        errors: {
          email: null,
          password: "Password is required",
          confirmPassword: null,
        },
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }
  if (password.length < 8) {
    return new Response(
      JSON.stringify({
        errors: {
          email: null,
          password: "Password is too short",
          confirmPassword: null,
        },
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Validate Confirm Password
  if (password !== confirmPassword) {
    return new Response(
      JSON.stringify({
        errors: {
          email: null,
          password: null,
          confirmPassword: "Passwords do not match",
        },
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Check for existing user
  const existingUser = await prisma.user.findUnique({
    where: { email: email as string },
  });
  if (existingUser) {
    return new Response(
      JSON.stringify({
        errors: {
          email: "A user already exists with this email",
          password: null,
          confirmPassword: null,
        },
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  let user;
  if (isManagerRegistration) {
    // Register a new restaurant and manager
    if (
      typeof restaurantName !== "string" ||
      typeof managerName !== "string" ||
      typeof location !== "string"
    ) {
      return new Response(
        JSON.stringify({
          errors: {
            general:
              "Missing required restaurant, manager, or location information",
          },
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const { manager } = await createRestaurantWithManager({
      restaurantName,
      managerEmail: email,
      password,
      managerName,
      phoneNumber,
      location,
      userPhoneNumber,
    });
    user = manager;
  } else if (typeof token === "string") {
    // Register a new employee using a token
    if (typeof managerName !== "string") {
      return new Response(
        JSON.stringify({
          errors: {
            general: "Manager name is required for employee registration",
          },
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    try {
      user = await registerEmployeeWithToken({
        email,
        password,
        name: managerName,
        token,
        phoneNumber: userPhoneNumber,
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ errors: { general: (error as Error).message } }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
  } else {
    return new Response(
      JSON.stringify({ errors: { general: "Invalid registration flow" } }),
      { status: 400, headers: { "Content-Type": "application/json" } },
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
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const userPhoneNumberRef = useRef<HTMLInputElement>(null);
  const restaurantNameRef = useRef<HTMLInputElement>(null);
  const managerNameRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const [isManagerRegistration, setIsManagerRegistration] = useState(false);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    } else if (actionData?.errors?.confirmPassword) {
      confirmPasswordRef.current?.focus();
    } else if (actionData?.errors?.phoneNumber) {
      phoneNumberRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8 py-8">
        <Form method="post" className="space-y-6">
          {isManagerRegistration ? (
            <>
              <div>
                <label
                  htmlFor="restaurantName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Restaurant Name
                </label>
                <div className="mt-1">
                  <input
                    id="restaurantName"
                    ref={restaurantNameRef}
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus={true}
                    name="restaurantName"
                    type="text"
                    required={isManagerRegistration}
                    className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <div className="mt-1">
                  <input
                    id="location"
                    ref={locationRef}
                    name="location"
                    type="text"
                    required={isManagerRegistration}
                    className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <div className="mt-1">
                  <input
                    id="phoneNumber"
                    ref={phoneNumberRef}
                    name="phoneNumber"
                    type="text"
                    autoComplete="tel"
                    className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="managerName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Manager Name
                </label>
                <div className="mt-1">
                  <input
                    id="managerName"
                    ref={managerNameRef}
                    name="managerName"
                    type="text"
                    required={isManagerRegistration}
                    className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                  />
                </div>
              </div>

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
                    aria-invalid={
                      actionData?.errors?.password ? true : undefined
                    }
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

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    ref={confirmPasswordRef}
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    aria-invalid={
                      actionData?.errors?.confirmPassword ? true : undefined
                    }
                    aria-describedby="confirm-password-error"
                    className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                  />
                  {actionData?.errors?.confirmPassword ? (
                    <div
                      className="pt-1 text-red-700"
                      id="confirm-password-error"
                    >
                      {actionData.errors.confirmPassword}
                    </div>
                  ) : null}
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label
                  htmlFor="managerName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    id="managerName"
                    ref={managerNameRef}
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus={true}
                    name="managerName"
                    type="text"
                    required
                    className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                  />
                </div>
              </div>

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
                    aria-invalid={
                      actionData?.errors?.password ? true : undefined
                    }
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

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    ref={confirmPasswordRef}
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    aria-invalid={
                      actionData?.errors?.confirmPassword ? true : undefined
                    }
                    aria-describedby="confirm-password-error"
                    className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                  />
                  {actionData?.errors?.confirmPassword ? (
                    <div
                      className="pt-1 text-red-700"
                      id="confirm-password-error"
                    >
                      {actionData.errors.confirmPassword}
                    </div>
                  ) : null}
                </div>
              </div>

              <div>
                <label
                  htmlFor="userPhoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <div className="mt-1">
                  <input
                    id="userPhoneNumber"
                    ref={userPhoneNumberRef}
                    name="userPhoneNumber"
                    type="text"
                    autoComplete="tel"
                    className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex items-center">
            <input
              id="isManagerRegistration"
              name="isManagerRegistration"
              type="checkbox"
              checked={isManagerRegistration}
              onChange={(e) => setIsManagerRegistration(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-700 focus:ring-blue-700"
            />
            <label
              htmlFor="isManagerRegistration"
              className="ml-2 block text-sm text-gray-900"
            >
              Register as a Restaurant Manager
            </label>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button
            type="submit"
            className="w-full rounded bg-blue-900 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-700"
          >
            Create Account
          </button>
          <div className="flex items-center justify-center">
            <div className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                className="text-blue-700 underline"
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
