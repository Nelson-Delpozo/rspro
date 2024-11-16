import { prisma } from "~/db.server"; // Assuming we have a Prisma client setup

// Create Availability Record
export async function createAvailability({
  restaurantId,
  userId,
  date,
  startTime,
  endTime,
}: {
  restaurantId: string;
  userId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
}) {
  return prisma.availability.create({
    data: {
      restaurantId,
      userId,
      date,
      startTime,
      endTime,
    },
  });
}

// Update Availability Record
export async function updateAvailability({
  availabilityId,
  date,
  startTime,
  endTime,
}: {
  availabilityId: string;
  date?: Date;
  startTime?: Date;
  endTime?: Date;
}) {
  return prisma.availability.update({
    where: { id: availabilityId },
    data: {
      date,
      startTime,
      endTime,
    },
  });
}

// Delete Availability Record
export async function deleteAvailability(availabilityId: string) {
  return prisma.availability.delete({
    where: { id: availabilityId },
  });
}

// Get Availability by User
export async function getAvailabilityByUser({
  userId,
  startDate,
  endDate,
}: {
  userId: string;
  startDate: Date;
  endDate: Date;
}) {
  return prisma.availability.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { date: "asc" },
  });
}

// Get Availability for Restaurant by Date Range
export async function getAvailabilityByRestaurant({
  restaurantId,
  startDate,
  endDate,
}: {
  restaurantId: string;
  startDate: Date;
  endDate: Date;
}) {
  return prisma.availability.findMany({
    where: {
      restaurantId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { date: "asc" },
  });
}
