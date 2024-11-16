import { RequestType } from "@prisma/client";

import { prisma } from "~/db.server"; // Assuming we have a Prisma client setup

// Create Shift Request
export async function createShiftRequest({
  shiftId,
  userId,
  type,
  targetUserId,
}: {
  shiftId: string;
  userId: string;
  type: RequestType;
  targetUserId?: string;
}) {
  return prisma.shiftRequest.create({
    data: {
      shiftId,
      userId,
      type,
      status: "PENDING",
      targetUserId,
    },
  });
}

// Get Shift Request by ID
export async function getShiftRequestById(requestId: string) {
  return prisma.shiftRequest.findUnique({
    where: { id: requestId },
  });
}

// Get Shift Requests by User
export async function getShiftRequestsByUser(userId: string) {
  return prisma.shiftRequest.findMany({
    where: { userId },
  });
}

// Get Shift Requests by Shift
export async function getShiftRequestsByShift(shiftId: string) {
  return prisma.shiftRequest.findMany({
    where: { shiftId },
  });
}

// Approve Shift Request
export async function approveShiftRequest(requestId: string) {
  const request = await prisma.shiftRequest.update({
    where: { id: requestId },
    data: { status: "APPROVED", resolvedAt: new Date() },
  });

  // If the request is a drop or swap, unassign the current user
  if (request.type === "DROP" || request.type === "SWAP") {
    await prisma.shift.update({
      where: { id: request.shiftId },
      data: { assignedToId: request.targetUserId || null },
    });
  }

  return request;
}

// Reject Shift Request
export async function rejectShiftRequest(requestId: string) {
  return prisma.shiftRequest.update({
    where: { id: requestId },
    data: { status: "REJECTED", resolvedAt: new Date() },
  });
}

// Cancel Shift Request
export async function cancelShiftRequest(requestId: string) {
  return prisma.shiftRequest.delete({
    where: { id: requestId },
  });
}

// Get Pending Shift Requests
export async function getPendingShiftRequests(restaurantId: string) {
  return prisma.shiftRequest.findMany({
    where: {
      shift: {
        restaurantId,
      },
      status: "PENDING",
    },
  });
}
