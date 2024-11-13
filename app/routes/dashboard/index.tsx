import { requireUserId } from "~/utils/session.server";

export async function loader({ request }: { request: Request }) {
  const userId = await requireUserId(request); // Redirects to login if not authenticated
  return { userId };
}

export default function Dashboard() {
  return <h1>Welcome to the Dashboard!</h1>;
}
