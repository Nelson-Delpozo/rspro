import { randomBytes } from "crypto";

import { Role } from "@prisma/client";

import { prisma } from "~/db.server";



export async function createInvitation(email: string, role: Role[], restaurantId: string) { // Accept Role[] as the type
    // Generate a secure random token
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7-day expiration
  
    const invitation = await prisma.invitation.create({
      data: {
        email,
        token,
        role, // Pass the array of roles directly
        restaurantId,
        expiresAt,
      },
    });
  
    return invitation;
  }
