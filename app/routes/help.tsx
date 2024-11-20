import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: "Help" }];

export default function Help() {
  return (
    <main className="flex flex-col flex-grow items-center justify-center bg-white">
      <div className="mx-auto w-full max-w-2xl px-8 py-16">
        <h1 className="text-3xl font-bold text-red-700 font-pressStart text-center">Help Center</h1>
        <p className="mt-4 text-lg text-gray-700">
          Welcome to our restaurant scheduling app! We are committed to providing
          an easy-to-use solution for restaurant managers and staff to handle
          their daily schedules and improve communication.
        </p>
        <p className="mt-4 text-lg text-gray-700">
          Our mission is to make restaurant management more efficient, allowing
          teams to focus on what they do best: creating amazing experiences for
          their guests.
        </p>
        <p className="mt-4 text-lg text-gray-700">
          Stay tuned for more updates, and thank you for being a part of our
          journey!
        </p>
      </div>
    </main>
  );
}
