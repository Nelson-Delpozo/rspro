import type { MetaFunction } from "@remix-run/node";
import { Link, Outlet } from "react-router-dom";

export const meta: MetaFunction = () => [{ title: "Policies" }];

export default function Policies() {
  return (
    <main className="flex flex-col flex-grow items-center justify-center bg-white">
        <div className="mx-auto w-full max-w-2xl px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-900 font-bungee">Policies</h1>
        <p className="mt-4 text-lg text-gray-700">
          Please use the buttons below to view our policies
        </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link
              to="/policies/privacy"
              className="flex transform items-center rounded-md border border-gray-300 p-3 shadow-sm transition-transform hover:scale-105 focus:ring-2 focus:ring-green-500"
            >
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-lg font-semibold text-white">
                P
              </div>
              <span className="text-lg font-medium text-gray-800">
                Privacy Policy
              </span>
            </Link>
            <Link
              to="/policies/cookies"
              className="flex transform items-center rounded-md border border-gray-300 p-3 shadow-sm transition-transform hover:scale-105 focus:ring-2 focus:ring-green-500"
            >
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-lg font-semibold text-white">
                C
              </div>
              <span className="text-lg font-medium text-gray-800">
                Cookie Policy
              </span>
            </Link>
            <Link
              to="/policies/terms"
              className="flex transform items-center rounded-md border border-gray-300 p-3 shadow-sm transition-transform hover:scale-105 focus:ring-2 focus:ring-green-500"
            >
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-lg font-semibold text-white">
                T
              </div>
              <span className="text-lg font-medium text-gray-800">
                Terms and Conditions
              </span>
            </Link>
            </div>
            </div>
            <Outlet />
    </main>
  );
}
