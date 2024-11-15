import { NotificationType } from '@prisma/client';

import { prisma } from '~/db.server'; // Assuming we have a Prisma client setup

// Create Notification
export async function createNotification({
  senderId,
  recipientId,
  message,
  type,
}: {
  senderId?: string;
  recipientId: string;
  message: string;
  type: NotificationType;
}) {
  return prisma.notification.create({
    data: {
      senderId,
      recipientId,
      message,
      type,
      sentAt: new Date(),
    },
  });
}

// Get Notifications by User
export async function getNotificationsByUser(userId: string) {
  return prisma.notification.findMany({
    where: { recipientId: userId },
    orderBy: { sentAt: 'desc' },
  });
}

// Mark Notification as Read
export async function markNotificationAsRead(notificationId: string) {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { readAt: new Date() },
  });
}

// Get Unread Notifications by User
export async function getUnreadNotificationsByUser(userId: string) {
  return prisma.notification.findMany({
    where: {
      recipientId: userId,
      readAt: null,
    },
    orderBy: { sentAt: 'desc' },
  });
}

// Delete Notification
export async function deleteNotification(notificationId: string) {
  return prisma.notification.delete({
    where: { id: notificationId },
  });
}
