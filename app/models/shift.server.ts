import { ShiftRole } from '@prisma/client';

import { prisma } from '~/db.server'; // Assuming we have a Prisma client setup

// Create Shift
export async function createShift({
  restaurantId,
  date,
  startTime,
  endTime,
  role,
}: {
  restaurantId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  role: ShiftRole;
}) {
  return prisma.shift.create({
    data: {
      restaurantId,
      date,
      startTime,
      endTime,
      role,
    },
  });
}

// Update Shift
export async function updateShift({
  shiftId,
  date,
  startTime,
  endTime,
  role,
  assignedToId,
}: {
  shiftId: string;
  date?: Date;
  startTime?: Date;
  endTime?: Date;
  role?: ShiftRole;
  assignedToId?: string;
}) {
  return prisma.shift.update({
    where: { id: shiftId },
    data: {
      date,
      startTime,
      endTime,
      role,
      assignedToId,
    },
  });
}

// Delete Shift
export async function deleteShift(shiftId: string) {
  return prisma.shift.delete({
    where: { id: shiftId },
  });
}

// Get Shift by ID
export async function getShiftById(shiftId: string) {
  return prisma.shift.findUnique({
    where: { id: shiftId },
  });
}

// Get Shifts by Date Range
export async function getShiftsByDateRange({
  restaurantId,
  startDate,
  endDate,
}: {
  restaurantId: string;
  startDate: Date;
  endDate: Date;
}) {
  return prisma.shift.findMany({
    where: {
      restaurantId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
}

// Assign User to Shift
export async function assignUserToShift({
  shiftId,
  userId,
}: {
  shiftId: string;
  userId: string;
}) {
  return prisma.shift.update({
    where: { id: shiftId },
    data: { assignedToId: userId },
  });
}

// Unassign User from Shift
export async function unassignUserFromShift(shiftId: string) {
  return prisma.shift.update({
    where: { id: shiftId },
    data: { assignedToId: null },
  });
}

// Get Shifts by Role
export async function getShiftsByRole({
  restaurantId,
  role,
}: {
  restaurantId: string;
  role: ShiftRole;
}) {
  return prisma.shift.findMany({
    where: {
      restaurantId,
      role,
    },
  });
}
