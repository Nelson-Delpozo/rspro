import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: "Help" }];

export default function Terms() {
  return (
    <main className="flex flex-col flex-grow items-center justify-center bg-white">
      <div className="mx-auto w-full max-w-2xl px-8 pb-16">
      <h1 className="text-gray font-pressStart text-center text-2xl font-bold">
          Terms of Use
        </h1>
        <p className="text-md mt-4 text-gray-800">
        These Terms of Use constitute an agreement between RS-PRO and you. By using the site, you affirm that you are able and legally competent to agree to and comply with these Terms of Use. If you do not agree to these Terms of Use or if you are not legally competent to agree to them, then you may not use the site.
        </p>
        <h2 className="mt-5 text-lg font-bold">
          Privacy and Security
        </h2>
        <p className="text-md mt-4 text-gray-800">
        You are responsible for all activities that occur under your account on the site, and for establishing security procedures for maintaining the security and confidentiality of passwords associated with your account. You may not share your account or password with anyone, and you agree to (1) notify RS-PRO immediately of any unauthorized access to or use of your password or any other breach of security; and (2) exit from your account at the end of each session on the site. You agree not to create an account using a false identity or information, or on behalf of someone other than yourself.
        </p>
      </div>
    </main>
  );
}
