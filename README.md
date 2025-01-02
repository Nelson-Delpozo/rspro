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
schema.prisma # Database schema
seed.ts # Seed script

2. Notifications
   - Email for password reset using Twilio
   - Wire up the contact form

3. New restaurant should create subscription
   - Set to active, set plan to trial, set trial expiration date
   - Account settings page needs Stripe integration
   - Button to activate pro, cancel pro
   - Take payment, set billing cycle, set plan to pro, send email
   - Monthly payment reminders three days
   - Reminders toward the end of the trial (one month, two weeks, one week, three days, last day)

4. Availability functionality
   - CRUD

5. Shift functionality
   - Create, edit, delete, notes, assign/unassign (managers)
   - My-shifts (both), open shifts (employee)
   - Drop, pickup for employees (add 'open' to shift status for manager control?)
   - Filter for shifts (assigned, unassigned, open, assigned to, date)
   - System generated SMS for shift assignments, request approval/declines

6. User management
   - Send invitation button/form - mark new user as 'new' until the manager views them
   - Update, delete, see availability, assign/unassign shifts, filter view (role, availability)

7. Invitation functionality
   - Expiration date
   - Manager view send invitation
   - Email, text?
   - Follow up reminder notification
   - Manager notification of expired unaccepted invitations

8. Schedule view and auto-scheduling

9. Update about, help
