import { Role } from '@prisma/client'; // Import Role enum directly from Prisma client
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { prisma } from '~/db.server'; // Import Prisma client instance

// Create Invitation
export async function createInvitation({
  email,
  restaurantId,
  role,
}: {
  email: string;
  restaurantId: string;
  role: Role[];
}) {
  const token = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Token valid for 7 days

  return prisma.invitation.create({
    data: {
      email,
      restaurantId,
      role,
      token,
      expiresAt,
    },
  });
}

// Accept Invitation
export async function acceptInvitation({
  token,
  email,
  password,
  name,
  phoneNumber,
}: {
  token: string;
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
}) {
  // Fetch invitation by token
  const invitation = await prisma.invitation.findUnique({
    where: { token },
  });

  if (!invitation || invitation.expiresAt < new Date()) {
    throw new Error('Invalid or expired invitation token');
  }

  if (invitation.email !== email) {
    throw new Error('Email does not match the invitation');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

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

// Get Invitation by Token
export async function getInvitationByToken(token: string) {
  return prisma.invitation.findUnique({
    where: { token },
  });
}

// Revoke Invitation
export async function revokeInvitation(invitationId: string) {
  return prisma.invitation.delete({
    where: { id: invitationId },
  });
}

// Utility Function to Fetch Invitations by Restaurant ID
export async function getInvitationsByRestaurant(restaurantId: string) {
  return prisma.invitation.findMany({
    where: { restaurantId },
  });
} 

// Extend Invitation Expiry
export async function extendInvitationExpiry(invitationId: string, additionalDays: number) {
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
  });

  if (!invitation) {
    throw new Error('Invitation not found');
  }

  const newExpiryDate = new Date(invitation.expiresAt);
  newExpiryDate.setDate(newExpiryDate.getDate() + additionalDays);

  return prisma.invitation.update({
    where: { id: invitationId },
    data: { expiresAt: newExpiryDate },
  });
}
