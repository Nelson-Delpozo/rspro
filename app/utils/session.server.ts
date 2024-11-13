import { createCookieSessionStorage, redirect } from "@remix-run/node";

import { prisma } from "~/db.server";

// Session storage setup
const sessionSecret = process.env.SESSION_SECRET || "super-secret-key"; // Use a secure key in production
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "rspro_session",
    secure: process.env.NODE_ENV === "production", // Use HTTPS in production
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
});

// Get user session
export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

// Create a new session
export async function createUserSession(userId: string, redirectTo: string) {
  const session = await sessionStorage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

// Destroy session
export async function destroyUserSession(request: Request) {
  const session = await getSession(request);
  return redirect("/auth/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

// Require authentication
export async function requireUserId(request: Request) {
  const session = await getSession(request);
  const userId = session.get("userId");
  if (!userId) throw redirect("/auth/login");
  return userId;
}

export async function requireUserRoles(request: Request) {
  const userId = await requireUserId(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { roles: true },
  });
  if (!user) throw redirect("/auth/login");
  return user.roles;
}

