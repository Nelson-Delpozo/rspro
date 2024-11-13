import { destroyUserSession } from "~/utils/session.server";

export async function action({ request }: { request: Request }) {
  return destroyUserSession(request);
}

export default function LogoutPage() {
  return (
    <form method="post">
      <button type="submit">Log Out</button>
    </form>
  );
}
