import { SubscriptionPlan } from "@prisma/client";

import { prisma } from "~/db.server"; // Assuming we have a Prisma client setup

// Create Subscription
export async function createSubscription({
  restaurantId,
  plan,
  trialEnds,
  stripeCustomerId,
}: {
  restaurantId: string;
  plan: SubscriptionPlan;
  trialEnds?: Date;
  stripeCustomerId?: string;
}) {
  return prisma.subscription.create({
    data: {
      restaurantId,
      plan,
      trialEnds,
      isActive: true,
      stripeCustomerId,
    },
  });
}

// Update Subscription Plan
export async function updateSubscriptionPlan({
  subscriptionId,
  plan,
  stripeSubscriptionId,
}: {
  subscriptionId: string;
  plan: SubscriptionPlan;
  stripeSubscriptionId?: string;
}) {
  return prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      plan,
      stripeSubscriptionId,
    },
  });
}

// Cancel Subscription
export async function cancelSubscription(subscriptionId: string) {
  return prisma.subscription.update({
    where: { id: subscriptionId },
    data: { isActive: false, billingCycleEnd: new Date() },
  });
}

// Get Subscription by Restaurant ID
export async function getSubscriptionByRestaurant(restaurantId: string) {
  return prisma.subscription.findUnique({
    where: { restaurantId },
  });
}

// Check if Subscription is Active
export async function isSubscriptionActive(restaurantId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { restaurantId },
  });

  return subscription?.isActive ?? false;
}

// Get All Subscriptions (Admin Use)
export async function getAllSubscriptions() {
  return prisma.subscription.findMany();
}
