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

Models

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


1) new restaurant should create subscription
    set to active, set plan, set trial date, determine end-of-trial protocols
    prevent double trials

2) invitation functionality
    fix expiration date
    manager view send invitation
    email, text?
    follow up reminder notification
    manager notification of unaccepted invitations

3) shift functionality
    create, edit, delete, assign/unassign, my-shifts, swap, drop, pickup, templates
    tab view

4) availability functionality
    CRUD

5) user managment
    edit, delete, send invitation, see availability, assign/unassign shifts, roles

6) notifications
    system-generated on updates, approvals, declines, shift-requests, shift-assigns

7) schedule view and auto-scheduling

8) update contact, about, policies, help









