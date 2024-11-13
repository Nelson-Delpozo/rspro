import { createCookieSessionStorage } from "@remix-run/node";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set in your environment variables.");
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

export async function getUser(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId) {
    return null;
  }
  return { id: userId };
}

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await sessionStorage.getSession();
  session.set("userId", userId);
  return new Response(null, {
    headers: {
      "Set-Cookie": await commitSession(session),
      Location: redirectTo,
    },
    status: 302,
  });
}

export async function requireUserId(request: Request): Promise<string> {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }

  return userId;
}

export async function logout(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return new Response(null, {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
    status: 302,
  });
}
