/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password", 10);

  // Create Restaurants with Managers and Employees
  const restaurants = [
    {
      name: "Sunny Side Diner",
      location: "Austin, TX",
      phoneNumber: "123-456-7890",
      manager: {
        email: "manager1@sunnyside.com",
        name: "Jane Doe",
        phoneNumber: "123-456-1234",
      },
      employees: [
        {
          email: "server1@sunnyside.com",
          name: "John Smith",
          phoneNumber: "123-456-5678",
          roles: [Role.SERVER],
        },
        {
          email: "cook1@sunnyside.com",
          name: "Mary Johnson",
          phoneNumber: "123-456-6789",
          roles: [Role.KITCHEN],
        },
        {
          email: "expo1@sunnyside.com",
          name: "James Brown",
          phoneNumber: "123-456-7891",
          roles: [Role.EXPO],
        },
      ],
    },
    {
      name: "Green Garden Eatery",
      location: "Denver, CO",
      phoneNumber: "234-567-8901",
      manager: {
        email: "manager2@greengarden.com",
        name: "Alice Green",
        phoneNumber: "234-567-1234",
      },
      employees: [
        {
          email: "server2@greengarden.com",
          name: "Tom White",
          phoneNumber: "234-567-5678",
          roles: [Role.SERVER],
        },
        {
          email: "cook2@greengarden.com",
          name: "Sarah Black",
          phoneNumber: "234-567-6789",
          roles: [Role.KITCHEN],
        },
        {
          email: "bartender1@greengarden.com",
          name: "Chris Blue",
          phoneNumber: "234-567-7891",
          roles: [Role.BARTENDER],
        },
      ],
    },
    {
      name: "Ocean Breeze Cafe",
      location: "San Francisco, CA",
      phoneNumber: "345-678-9012",
      manager: {
        email: "manager3@oceanbreeze.com",
        name: "Robert Ocean",
        phoneNumber: "345-678-1234",
      },
      employees: [
        {
          email: "server3@oceanbreeze.com",
          name: "Emily Wave",
          phoneNumber: "345-678-5678",
          roles: [Role.SERVER],
        },
        {
          email: "cook3@oceanbreeze.com",
          name: "Nina Shore",
          phoneNumber: "345-678-6789",
          roles: [Role.BARTENDER],
        },
        {
          email: "host1@oceanbreeze.com",
          name: "Liam Sand",
          phoneNumber: "345-678-7891",
          roles: [Role.MANAGER],
        },
      ],
    },
  ];

  for (const restaurant of restaurants) {
    const createdRestaurant = await prisma.restaurant.create({
      data: {
        name: restaurant.name,
        location: restaurant.location,
        phoneNumber: restaurant.phoneNumber,
      },
    });

    const manager = restaurant.manager;
    await prisma.user.create({
      data: {
        email: manager.email,
        password: hashedPassword,
        name: manager.name,
        phoneNumber: manager.phoneNumber,
        roles: [Role.MANAGER],
        restaurantId: createdRestaurant.id,
      },
    });

    for (const employee of restaurant.employees) {
      await prisma.user.create({
        data: {
          email: employee.email,
          password: hashedPassword,
          name: employee.name,
          phoneNumber: employee.phoneNumber,
          roles: employee.roles,
          restaurantId: createdRestaurant.id,
        },
      });
    }
  }

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
