// Directory: app/routes/dashboard/shifts.tsx

import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { prisma } from "~/db.server";
import { getUser } from "~/session.server";

// Loader function to ensure user is authenticated and fetch shifts
export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const user = await getUser(request);
    if (!user) {
      throw new Response("Unauthorized", { status: 401 });
    }

    // Fetch shifts for the restaurant the user belongs to
    const shifts = await prisma.shift.findMany({
      where: {
        restaurantId: user.restaurantId,
      },
      include: {
        assignedTo: true,
      },
    });

    return { user, shifts };
  } catch (error) {
    console.error("Error loading shifts:", error);
    throw new Response(
      "Something went wrong while fetching shifts. Please try again later.",
      {
        status: 500,
      },
    );
  }
};

export default function ShiftsPage() {
  const { user, shifts } = useLoaderData<{
    user: { name: string; roles: string[]; restaurantId: string };
    shifts: {
      id: string;
      title: string;
      startTime: string;
      endTime: string;
      assignedEmployee?: { name: string };
    }[];
  }>();

  // Conditional rendering based on role
  const isManager = user.roles.includes("MANAGER");

  return (
    <div className="container mx-auto p-6 text-center">
      {isManager ? (
        <>
          <h2 className="mb-4 text-2xl font-bungee">
            Shift Management
          </h2>

          {shifts.length === 0 ? (
            <p className="text-red-500">No shifts created</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {shifts.map((shift) => (
                <div
                  key={shift.id}
                  className="rounded-lg border border-gray-300 p-4 shadow-md"
                >
                  <h3 className="text-lg font-semibold">{shift.title}</h3>
                  <p>
                    <strong>Start:</strong>{" "}
                    {new Date(shift.startTime).toLocaleString()}
                  </p>
                  <p>
                    <strong>End:</strong>{" "}
                    {new Date(shift.endTime).toLocaleString()}
                  </p>
                  <p>
                    <strong>Assigned to:</strong>{" "}
                    {shift.assignedEmployee
                      ? shift.assignedEmployee.name
                      : "Unassigned"}
                  </p>
                  {/* Placeholder for editing or deleting shifts */}
                  <div className="mt-2 flex justify-center gap-4">
                    <button className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600">
                      Edit
                    </button>
                    <button className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link
            to="/dashboard"
            className="mt-4 inline-block rounded bg-blue-900 px-4 py-2 text-white hover:bg-blue-600"
          >
            Back to Dashboard
          </Link>
        </>
      ) : (
        <>
          <h2 className="mb-4 text-2xl font-bungee">Your Shifts</h2>
          {shifts.length === 0 ? (
            <p className="text-red-500">
              You currently have no shifts assigned
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {shifts
                .filter((shift) => shift.assignedEmployee?.name === user.name)
                .map((shift) => (
                  <div
                    key={shift.id}
                    className="rounded-lg border border-gray-300 p-4 shadow-md"
                  >
                    <h3 className="text-lg font-semibold">{shift.title}</h3>
                    <p>
                      <strong>Start:</strong>{" "}
                      {new Date(shift.startTime).toLocaleString()}
                    </p>
                    <p>
                      <strong>End:</strong>{" "}
                      {new Date(shift.endTime).toLocaleString()}
                    </p>
                  </div>
                ))}
            </div>
          )}

          <Link
            to="/dashboard"
            className="mt-4 inline-block rounded bg-blue-900 px-4 py-2 text-white hover:bg-blue-600"
          >
            Back to Dashboard
          </Link>
        </>
      )}
    </div>
  );
}
