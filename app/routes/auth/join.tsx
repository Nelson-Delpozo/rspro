import { prisma } from "~/db.server";
import { hashPassword } from "~/utils/auth.server";
import { createUserSession } from "~/utils/session.server";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (token) {
    // Validate the token for employee signup
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: { restaurant: true },
    });

    if (!invitation || invitation.acceptedAt || invitation.expiresAt < new Date()) {
      return new Response("Invalid or expired invitation token.", { status: 400 });
    }

    return {
      restaurantName: invitation.restaurant.name,
      isManagerSignup: false,
      role: invitation.role,
      token,
    };
  }

  // For manager signup
  return { isManagerSignup: true };
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const token = formData.get("token") as string | null;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (token) {
    // Employee signup flow (with token)
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: { restaurant: true },
    });

    if (!invitation || invitation.acceptedAt || invitation.expiresAt < new Date()) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired invitation token." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create the employee user
    const hashedPassword = await hashPassword(password);
const newUser = await prisma.user.create({
  data: {
    email,
    password: hashedPassword,
    name,
    roles: invitation.role, // Directly assign the array
    restaurantId: invitation.restaurantId,
  },
});

    // Mark invitation as accepted
    await prisma.invitation.update({
      where: { token },
      data: { acceptedAt: new Date() },
    });

    // Create a session and redirect to the employee dashboard
    return createUserSession(newUser.id, "/dashboard");
  }

  // Manager signup flow
  const restaurantName = formData.get("restaurantName") as string;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return new Response(
      JSON.stringify({ error: "A user with this email already exists." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const hashedPassword = await hashPassword(password);
  const newRestaurant = await prisma.restaurant.create({
    data: {
      name: restaurantName,
      users: {
        create: {
          email,
          password: hashedPassword,
          name,
          roles: ["MANAGER"],
        },
      },
    },
    include: { users: true },
  });

  const newUser = newRestaurant.users[0]; // Retrieve the manager

  return createUserSession(newUser.id, "/dashboard");
}

interface SignupPageData {
  restaurantName?: string;
  isManagerSignup: boolean;
  role?: string;
  token?: string;
}

export default function SignupPage({ data }: { data: SignupPageData }) {
  const { restaurantName, isManagerSignup, token } = data;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-semibold text-center text-gray-700">
          {isManagerSignup ? "Manager Sign Up" : `Join ${restaurantName}`}
        </h1>
        <form method="post" className="space-y-4">
          <input type="hidden" name="token" value={token || ""} />
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="w-full px-4 py-2 mt-1 text-sm border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="w-full px-4 py-2 mt-1 text-sm border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="w-full px-4 py-2 mt-1 text-sm border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          {isManagerSignup ? (
            <div>
              <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-600">
                Restaurant Name
              </label>
              <input
                type="text"
                name="restaurantName"
                id="restaurantName"
                required
                className="w-full px-4 py-2 mt-1 text-sm border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          ) : null}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isManagerSignup ? "Sign Up" : "Join Restaurant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
