import { prisma } from "~/db.server"; // Assuming we have a Prisma client setup

// Create Restaurant
export async function createRestaurant({
  name,
  phoneNumber,
  location,
}: {
  name: string;
  phoneNumber?: string;
  location?: string;
}) {
  return prisma.restaurant.create({
    data: {
      name,
      phoneNumber,
      location,
    },
  });
}

// Update Restaurant Information
export async function updateRestaurant({
  restaurantId,
  name,
  phoneNumber,
  location,
}: {
  restaurantId: string;
  name?: string;
  phoneNumber?: string;
  location?: string;
}) {
  return prisma.restaurant.update({
    where: { id: restaurantId },
    data: {
      name,
      phoneNumber,
      location,
    },
  });
}

// Get Restaurant by ID
export async function getRestaurantById(restaurantId: string) {
  return prisma.restaurant.findUnique({
    where: { id: restaurantId },
  });
}

// Get All Restaurants (optional, for listing all restaurants)
export async function getAllRestaurants() {
  return prisma.restaurant.findMany();
}

// Delete Restaurant
export async function deleteRestaurant(restaurantId: string) {
  return prisma.restaurant.delete({
    where: { id: restaurantId },
  });
}

// Utility Function to Fetch Restaurant Users
export async function getRestaurantUsers(restaurantId: string) {
  return prisma.user.findMany({
    where: { restaurantId },
  });
}

// Utility Function to Fetch Restaurant Shifts
export async function getRestaurantShifts(restaurantId: string) {
  return prisma.shift.findMany({
    where: { restaurantId },
  });
}

// Utility Function to Fetch Restaurant Invitations
export async function getRestaurantInvitations(restaurantId: string) {
  return prisma.invitation.findMany({
    where: { restaurantId },
  });
}
