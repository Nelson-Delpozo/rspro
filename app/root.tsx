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
  const { user } = useLoaderData<{ user: { id: string; name: string; email: string } | null }>();

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
      <body className="h-full bg-gray-100 text-gray-900 flex flex-col min-h-screen">
        <header className="bg-blue-700 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">
              RS-PRO
            </Link>
            {user ? <button
                onClick={handleLogout}
                className="bg-red-700 px-4 py-2 rounded hover:bg-red-600 focus:bg-red-400"
              >
                Logout
              </button> : null}
          </div>
        </header>
        <div className="flex-grow">
          <Outlet />
        </div>
        <footer className="bg-blue-700 text-white p-4 mt-auto w-full">
          <div className="container mx-auto flex justify-between items-center">
            <p>&copy; {new Date().getFullYear()} RS PRO</p>
            <div className="flex space-x-4">
              <Link to="/about" className="hover:underline">
                About
              </Link>
              <Link to="/contact" className="hover:underline">
                Contact
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
