/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a restaurant
  const restaurant = await prisma.restaurant.create({
    data: {
      name: "Sunny Side Diner",
      phoneNumber: "123-456-7890",
      location: "Austin, TX",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create users (manager and employees)
  const manager = await prisma.user.create({
    data: {
      email: "manager@sunnyside.com",
      password: "hashed_password_1", // Use a real hash in production
      name: "Jane Doe",
      phoneNumber: "123-456-1234",
      roles: ["MANAGER"],
      restaurantId: restaurant.id,
    },
  });

  const server = await prisma.user.create({
    data: {
      email: "server@sunnyside.com",
      password: "hashed_password_2", // Use a real hash in production
      name: "John Smith",
      phoneNumber: "123-456-5678",
      roles: ["SERVER"],
      restaurantId: restaurant.id,
    },
  });

  const expo = await prisma.user.create({
    data: {
      email: "expo@sunnyside.com",
      password: "hashed_password_3", // Use a real hash in production
      name: "Mary Johnson",
      phoneNumber: "123-456-6789",
      roles: ["EXPO"],
      restaurantId: restaurant.id,
    },
  });

  // Create a subscription
  await prisma.subscription.create({
    data: {
      restaurantId: restaurant.id,
      plan: "PRO",
      trialEnds: new Date(new Date().setMonth(new Date().getMonth() + 3)), // 3-month trial
      isActive: true,
      createdAt: new Date(),
    },
  });

  // Create shifts
  const shift1 = await prisma.shift.create({
    data: {
      restaurantId: restaurant.id,
      date: new Date("2024-11-14"),
      startTime: new Date("2024-11-14T08:00:00Z"),
      endTime: new Date("2024-11-14T16:00:00Z"),
      role: "SERVER",
    },
  });

  const shift2 = await prisma.shift.create({
    data: {
      restaurantId: restaurant.id,
      date: new Date("2024-11-14"),
      startTime: new Date("2024-11-14T12:00:00Z"),
      endTime: new Date("2024-11-14T20:00:00Z"),
      role: "EXPO",
    },
  });

  // Create availability records
  await prisma.availability.createMany({
    data: [
      {
        restaurantId: restaurant.id,
        userId: server.id,
        date: new Date("2024-11-14"),
        startTime: new Date("2024-11-14T08:00:00Z"),
        endTime: new Date("2024-11-14T16:00:00Z"),
      },
      {
        restaurantId: restaurant.id,
        userId: expo.id,
        date: new Date("2024-11-14"),
        startTime: new Date("2024-11-14T12:00:00Z"),
        endTime: new Date("2024-11-14T20:00:00Z"),
      },
    ],
  });

  // Create invitations for employees
  await prisma.invitation.createMany({
    data: [
      {
        email: "new_server@sunnyside.com",
        restaurantId: restaurant.id,
        role: ["SERVER"],
        token: "unique_token_1",
        expiresAt: new Date(new Date().setDate(new Date().getDate() + 7)), // Expires in 7 days
        createdAt: new Date(),
      },
      {
        email: "new_expo@sunnyside.com",
        restaurantId: restaurant.id,
        role: ["EXPO"],
        token: "unique_token_2",
        expiresAt: new Date(new Date().setDate(new Date().getDate() + 7)), // Expires in 7 days
        createdAt: new Date(),
      },
    ],
  });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error("Error during seeding", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
