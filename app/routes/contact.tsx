import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: "Contact Us" }];

export default function Contact() {
  return (
    <main className="flex flex-col flex-grow items-center justify-center bg-white">
      <div className="mx-auto w-full max-w-2xl px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
        <p className="mt-4 text-lg text-gray-700">
          We&apos;d love to hear from you! Please fill out the form below to get in touch with us.
        </p>
        <form method="post" className="mt-8 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <div className="mt-1">
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <div className="mt-1">
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-700"
          >
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
}
