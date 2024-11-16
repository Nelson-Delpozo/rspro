import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";

import { getUser } from "~/routes/session.server";
import stylesheet from "~/tailwind.css";

// Add links for stylesheets
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

// Loader to fetch user data
export const loader = async ({ request }: { request: Request }) => {
  const user = await getUser(request);
  return new Response(JSON.stringify({ user }), {
    headers: { "Content-Type": "application/json" },
  });
};

// Main App component
export default function App() {
  const fetcher = useFetcher();
  const { user } = useLoaderData<{
    user: { id: string; name: string; email: string };
  }>();

  const handleLogout = () => {
    fetcher.submit(null, { action: "/logout", method: "post" });
  };

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-gray-100 text-gray-900">
        <header className="bg-blue-700 p-4 text-white">
          <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold">RS-PRO</h1>
            {user ? (
              <button
                onClick={handleLogout}
                className="rounded bg-red-500 px-4 py-2 hover:bg-red-600 focus:bg-red-400"
              >
                Logout
              </button>
            ) : null}
          </div>
        </header>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
