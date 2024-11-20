import { Link, Outlet } from "@remix-run/react";

export default function Policies() {
  return (
    <main className="flex flex-col flex-grow items-center justify-center bg-white">
      <div className="mx-auto w-full max-w-4xl px-8 py-16">
        <h1 className="text-3xl font-bold text-red-700 font-pressStart text-center">Policies</h1>
        <p className="mt-4 text-lg text-gray-700 mb-5 text-center">
          Please use the buttons below to view our policies.
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/policies/privacy"
            className="flex transform items-center rounded-md border border-gray-300 p-3 shadow-sm transition-transform hover:scale-105 focus:ring-2 focus:ring-blue-900"
          >
            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-900 text-lg font-semibold text-white">
              P
            </div>
            <span className="text-lg font-medium text-gray-800">
              Privacy Policy
            </span>
          </Link>
          <Link
            to="/policies/cookies"
            className="flex transform items-center rounded-md border border-gray-300 p-3 shadow-sm transition-transform hover:scale-105 focus:ring-2 focus:ring-blue-900"
          >
            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-900 text-lg font-semibold text-white">
              C
            </div>
            <span className="text-lg font-medium text-gray-800">
              Cookie Policy
            </span>
          </Link>
          <Link
            to="/policies/terms"
            className="flex transform items-center rounded-md border border-gray-300 p-3 shadow-sm transition-transform hover:scale-105 focus:ring-2 focus:ring-blue-900"
          >
            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-900 text-lg font-semibold text-white">
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
