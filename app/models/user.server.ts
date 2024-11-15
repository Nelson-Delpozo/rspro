import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { prisma } from "~/db.server";

const SALT_ROUNDS = 10;

// Hash Password
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

// Validate Password
async function isPasswordValid(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

// Create Restaurant and First Manager
export async function createRestaurantWithManager({
  restaurantName,
  phoneNumber,
  location,
  managerEmail,
  password,
  managerName,
  managerPhoneNumber,
}: {
  restaurantName: string;
  phoneNumber?: string;
  location?: string;
  managerEmail: string;
  password: string;
  managerName: string;
  managerPhoneNumber?: string;
}) {
  const hashedPassword = await hashPassword(password);

  // Use a Prisma transaction to create the restaurant and manager in a single step
  return await prisma.$transaction(async (prisma) => {
    const restaurant = await prisma.restaurant.create({
      data: {
        name: restaurantName,
        phoneNumber,
        location,
      },
    });

    const manager = await prisma.user.create({
      data: {
        email: managerEmail,
        password: hashedPassword,
        name: managerName,
        phoneNumber: managerPhoneNumber,
        roles: ['MANAGER'],
        restaurantId: restaurant.id,
      },
    });

    return { restaurant, manager };
  });
}

// Register Employee with Token
export async function registerEmployeeWithToken({
  email,
  password,
  name,
  token,
  phoneNumber,
}: {
  email: string;
  password: string;
  name: string;
  token: string;
  phoneNumber?: string;
}) {
  // Fetch invitation by token
  const invitation = await prisma.invitation.findUnique({
    where: { token },
  });

  if (!invitation || invitation.expiresAt < new Date()) {
    throw new Error('Invalid or expired invitation token');
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Create the employee account
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      phoneNumber,
      roles: invitation.role,
      restaurantId: invitation.restaurantId,
    },
  });

  // Mark the invitation as accepted
  await prisma.invitation.update({
    where: { id: invitation.id },
    data: { acceptedAt: new Date() },
  });

  return user;
}

// Verify Login
export async function verifyLogin(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  const isValid = await isPasswordValid(password, user.password);

  if (!isValid) {
    return null;
  }

  return user;
}

// Initiate Password Reset
export async function initiatePasswordReset(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const resetToken = uuidv4();
  const resetTokenExpiresAt = new Date();
  resetTokenExpiresAt.setHours(resetTokenExpiresAt.getHours() + 1); // Token valid for 1 hour

  await prisma.user.update({
    where: { email },
    data: {
      resetToken,
      resetTokenExpiresAt,
    },
  });

  // TODO: Send reset token via email
  return resetToken;
}

// Reset Password
export async function resetPassword(token: string, newPassword: string) {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiresAt: {
        gte: new Date(),
      },
    },
  });

  if (!user) {
    throw new Error('Invalid or expired reset token');
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiresAt: null,
    },
  });

  return true;
}

// Utility Function to Fetch User by ID
export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
  });
}

// Utility Function to Fetch All Users by Restaurant ID
export async function getUsersByRestaurant(restaurantId: string) {
  return prisma.user.findMany({
    where: { restaurantId },
  });
} 

// Utility Function to Fetch Users by Role
export async function getUsersByRole({
  restaurantId,
  role,
}: {
  restaurantId: string;
  role: Role;
}) {
  return prisma.user.findMany({
    where: {
      restaurantId,
      roles: {
        has: role,
      },
    },
  });
} 

export type Role = 'MANAGER' | 'SERVER' | 'BARTENDER' | 'BUSSER' | 'KITCHEN' | 'BARBACK' | 'EXPO';
