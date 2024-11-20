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
  Link,
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
    user: { id: string; name: string; email: string } | null;
  }>();

  const handleLogout = () => {
    fetcher.submit(null, { action: "/logout", method: "post" });
  };

  return (
    <html lang="en" className="h-full bg-white">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex h-full min-h-screen flex-col bg-white text-gray-900">
        <header className="bg-blue-900 p-4 text-white">
          <div className="container mx-auto flex items-center justify-between">
            <Link
              to="/"
              className="font-convergence font-pressStart text-xl font-bold"
            >
              RS-PRO
            </Link>
            {user ? (
              <button
                onClick={handleLogout}
                className="rounded bg-red-600 px-4 py-2 hover:bg-red-600 focus:bg-red-400"
              >
                Logout
              </button>
            ) : null}
          </div>
        </header>
        <div className="flex-grow">
          <Outlet />
        </div>
        <footer className="bg-blue-900 p-4 py-5 text-white">
          <div className="container mx-auto flex flex-col items-center">
            <p className="text-center">
              &copy; {new Date().getFullYear()} Restaurant Scheduler PRO
            </p>
            <div className="mt-2 flex flex-wrap justify-center space-x-4">
              <Link to="/help" className="hover:underline">
                Help
              </Link>
              <Link to="/about" className="hover:underline">
                About
              </Link>
              <Link to="/contact" className="hover:underline">
                Contact
              </Link>
              <Link to="/policies" className="hover:underline">
                Policies
              </Link>
            </div>
          </div>
        </footer>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
