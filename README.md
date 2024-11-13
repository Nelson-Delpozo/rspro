Restaurant Scheduling App
Overview
This application simplifies restaurant staff scheduling by providing tools for managers and employees to manage shifts, availability, and shift requests. It also includes features for notifications, subscriptions, and onboarding through invitations.

Purpose
Streamline scheduling for restaurant managers.
Empower employees with tools to manage their availability and shift requests.
Provide a subscription-based business model for scalability.
Tech Stack
Framework: Remix (Indie Stack with Tailwind CSS and Prisma)
Database: PostgreSQL
Deployment: Targeting Vercel or other cloud hosting services
Additional Features: Planned AI integration for automated scheduling.
Database Schema
Core Models
Restaurant:

Stores restaurant information (e.g., name, phone number, location).
Relationships with users, shifts, subscriptions, and invitations.
User:

Employees and managers with role-based permissions.
Includes authentication and unique phone numbers for notifications.
Shift:

Represents scheduled shifts with assigned roles and users.
Tracks start/end times and shift assignments.
Availability:

Tracks employee availability for scheduling purposes.
ShiftRequest:

Handles shift requests (swap, drop, pickup) with statuses (pending, approved, rejected).
Notification:

Sends messages for system updates, shift requests, and reminders.
Subscription:

Tracks subscription plans (TRIAL, PRO, ENTERPRISE) and integrates with Stripe for billing.
Invitation:

Handles employee onboarding through unique invitation links.
Enums
Role: MANAGER, SERVER, BARTENDER, BUSSER, KITCHEN, BARBACK, EXPO.
ShiftRole: Same as Role but scoped to shift assignments.
NotificationType: SYSTEM, SHIFT_REQUEST, REMINDER, GENERAL.
SubscriptionPlan: TRIAL, PRO, ENTERPRISE.
RequestType: SWAP, DROP, PICKUP.
RequestStatus: PENDING, APPROVED, REJECTED.
Server Files
The app includes 8 server files that encapsulate reusable data-fetching and mutation logic:

availability.server.ts:

Manages CRUD operations for employee availability.
Filters by date range and restaurant.
shift.server.ts:

Handles CRUD operations for shifts, including assignments and role filtering.
user.server.ts:

Handles user CRUD, authentication, and role management.
restaurant.server.ts:

Manages restaurant creation, updates, and associated data.
notification.server.ts:

Sends and retrieves notifications for managers and employees.
shiftRequest.server.ts:

Handles shift request workflows (swap, drop, pickup).
subscription.server.ts:

Manages subscriptions, trial validation, and Stripe integration.
invitation.server.ts:

Handles onboarding of employees via unique invitation links.
File Structure
Routes
plaintext
Copy code
src/
  routes/
    dashboard/
      index.tsx                # Manager dashboard
      shifts.tsx               # Shift management
      availability.tsx         # Employee availability management
      requests.tsx             # Shift requests
      notifications.tsx        # Notifications panel
    api/
      users.tsx                # API for users
      restaurants.tsx          # API for restaurants
      subscriptions.tsx        # API for subscriptions
      notifications.tsx        # API for notifications
      shifts.tsx               # API for shifts
      availability.tsx         # API for availability
      requests.tsx             # API for shift requests
      invitations.tsx          # API for invitations
    auth/
      login.tsx                # Login page
      logout.tsx               # Logout action
      signup.tsx               # Manager signup
    invitations/
      accept.tsx               # Accept invitation to create account
    subscription/
      billing.tsx              # Subscription management and billing
      trial-expired.tsx        # Trial expiration warning
    index.tsx                  # Landing page
    about.tsx                  # About page
    contact.tsx                # Contact page
Models
plaintext
Copy code
src/
  models/
    availability.server.ts
    shift.server.ts
    user.server.ts
    restaurant.server.ts
    notification.server.ts
    shiftRequest.server.ts
    subscription.server.ts
    invitation.server.ts
Database
plaintext
Copy code
prisma/
  schema.prisma               # Database schema
  seed.ts                     # Seed script
Completed Milestones
Prisma Schema:

Designed a robust schema with all necessary relationships and enums.
Fixed migration errors and ran successful migrations.
Verified data integrity through Prisma Studio after seeding.
Seed Data:

Created seed data for:
A restaurant with users, shifts, and availability.
Shift requests and notifications.
A subscription linked to Stripe placeholders.
Server Files:

Implemented reusable database functions for all models.
File Structure:

Organized routes and models for maintainability and scalability.
Next Steps
Short-Term
Build Core API Routes:

Implement API endpoints for key models (users, shifts, availability, requests, etc.).
Use server files to fetch and manipulate data.
Front-End Integration:

Create loaders and actions for dashboard routes.
Design forms for managing shifts, availability, and requests.
Authentication:

Implement user authentication (login/signup).
Add role-based access control for routes.
Long-Term
Stripe Integration:

Connect Stripe for subscription management.
Validate trial periods.
AI for Scheduling:

Research and integrate AI for auto-generating shifts.
Testing:

Add integration and end-to-end tests for workflows.
This document serves as a snapshot of the app’s current state and a reference for future development. Keep it updated as new features are added or milestones are achieved.

