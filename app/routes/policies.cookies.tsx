import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: "Help" }];

export default function Cookies() {
  return (
    <main className="flex flex-grow flex-col items-center justify-center bg-white">
      <div className="mx-auto w-full max-w-2xl px-8 pb-16">
        <h1 className="font-pressStart text-center text-2xl font-bold text-gray-800">
          Cookie Policy
        </h1>
        <h2 className="mt-5 text-lg font-bold">
          What are Cookies?
        </h2>
        <p className="text-md mt-4 text-gray-800">
          Cookies are text files that websites store on a visitor&apos;s device
          to uniquely identify the visitor&apos;s browser or to store
          information or settings in the browser for the purpose of helping you
          navigate between pages efficiently, remembering your preferences,
          enabling functionality, helping us understand activity and patterns,
          and facilitating online advertising.
        </p>
        <h2 className="mt-5 text-lg font-bold">
          How do we use Cookies?
        </h2>
        <p className="text-md mt-4 text-gray-800">
        We use only session cookies. Session cookies are deleted once you close your web browser. we use Session Cookies to determine whether you are an authorized logged in user. The cookies placed through your use of our website are always set by us (first-party cookies). We do not use third-party cookies. 
        </p>
        <p className="text-md mt-4 text-gray-800">
        These cookies are necessary for you to interact with RS-PRO&apos;s basic features. For example, they allow you to navigate the site, securely access important areas like your dashboard, and more. Also, necessary cookies are used to maintain the website&apos;s security features.
        </p>
      </div>
    </main>
  );
}
