# Software Requirements Specification (SRS)

## 1. Document Information

- Project Name: Lab-Actions / BGMI Elite Tournament Platform
- Version: 1.0
- Status: Draft
- Date: 2026-09-09
- Type: Full-stack esports tournament and registration platform

## 2. Introduction

This project is a full-stack esports platform built for tournament discovery, player registration, leaderboard management, live tournament tracking, reviews, and admin operations. The system supports a modern frontend built with Next.js and a backend built with Spring Boot and PostgreSQL, with Redis-based caching and JWT-based authentication.

The platform is designed to help:
- players discover upcoming tournaments,
- register and pay for events,
- view leaderboard results and performance,
- review tournaments,
- allow admins to manage tournament lifecycle and participant flow.

## 3. Purpose

The primary purpose of the system is to manage a competitive gaming ecosystem centered on BGMI-style tournaments. The platform must provide a reliable digital workflow for tournament publication, participant onboarding, monitoring, result tracking, and administrative oversight.

## 4. Scope

### 4.1 In Scope
- Public landing page and tournament marketing experience.
- Tournament listing for upcoming and completed events.
- User registration and login.
- Tournament enrollment and payment-related onboarding flow.
- Player leaderboard and ranking computation.
- Admin dashboard for tournament and participant management.
- Review and feedback submission for tournaments.
- Live stream link support for tournaments.
- Caching, rate limiting, and backend data synchronization.

### 4.2 Out of Scope
- Real-money payment processing integration beyond the current QR/payment flow patterns.
- Full multiplayer match engine or in-game server integration.
- Automatic tournament bracket generation beyond the current admin-managed workflow.
- Complex analytics beyond dashboard summaries and charts.

## 5. Product Perspective

The system follows a layered architecture:

1. Frontend Layer
   - Next.js web application in the root project
   - Client-side routing and UI for players and admins
   - Components for home page, tournament pages, leaderboard, reviews, and admin panel

2. Backend Layer
   - Java Spring Boot services and REST controllers
   - Business logic for users, tournaments, leaderboard, reviews, and admin data

3. Data Layer
   - PostgreSQL for persistent business data
   - Redis cache for frequently accessed tournament and admin data

4. Security Layer
   - JWT-based authentication
   - Admin policy checks based on approved phone numbers
   - Rate limiting for API protection

## 6. Users and Stakeholders

### 6.1 End Users
- Players / participants
- Tournament organizers / admins
- Reviewers / community members

### 6.2 Admin Users
- Create and manage tournaments
- Approve participants
- Modify tournament details
- Remove or deactivate tournaments
- View admin metrics and registration data

### 6.3 System Stakeholders
- Business owner / platform operator
- Tournament organizers
- Community and players
- Technical maintainers / developers

## 7. Functional Requirements

### 7.1 User Authentication and Access

FR-01: The system shall allow a user to register using valid user details.

FR-02: The system shall allow a user to log in with credentials and receive a JWT token.

FR-03: The system shall determine whether the user is an admin based on configured admin contact policy.

FR-04: The system shall support password reset and confirmation flows.

FR-05: The system shall protect admin-only routes and privileged functions.

### 7.2 Tournament Management

FR-06: The system shall allow admins to create tournaments with fields such as name, prize pool, date/time, slot, platform, and description.

FR-07: The system shall allow admins to update existing tournament details.

FR-08: The system shall allow admins to delete one or more tournaments.

FR-09: The system shall expose upcoming, completed, last, and next tournament APIs.

FR-10: The system shall store and retrieve tournament metadata efficiently using caching.

FR-11: The system shall support setting a live stream link for a tournament.

### 7.3 Player Registration and Participation

FR-12: The system shall allow a user to register for a tournament.

FR-13: The system shall prevent duplicate registration for the same user in the same tournament.

FR-14: The system shall validate registration data including transaction ID and tournament membership details.

FR-15: The system shall support tournament participant approval workflows.

FR-16: The system shall allow admins to update participant participation status.

FR-17: The system shall allow admins to manage participant lists by tournament.

### 7.4 Leaderboard and Rankings

FR-18: The system shall maintain leaderboard entries for users in tournaments.

FR-19: The system shall display leaderboard data by tournament and globally.

FR-20: The system shall support top-player result presentation and ranking summaries.

FR-21: The system shall allow leaderboard update operations with user and tournament validation.

### 7.5 Reviews and Community Feedback

FR-22: The system shall allow users to submit reviews tied to a tournament.

FR-23: The system shall allow admins to reply to submitted reviews.

FR-24: The system shall display reviews on the frontend under the reviews section.

### 7.6 Admin Dashboard and Reporting

FR-25: The system shall provide an admin dashboard showing overview statistics.

FR-26: The system shall expose data for tournament performance, investment trends, and registration charts.

FR-27: The system shall allow admins to manage participants, tournaments, reviews, and settings from one interface.

FR-28: The system shall stream admin data updates to the frontend using server-sent events (SSE).

### 7.7 Public Frontend Features

FR-29: The system shall display hero content and promotional sections for the platform.

FR-30: The system shall list upcoming tournaments on the landing page.

FR-31: The system shall show winner highlights and stats sections.

FR-32: The system shall provide contact and support-related information.

FR-33: The system shall present tournament and leaderboard data in a responsive UI.

## 8. Non-Functional Requirements

### 8.1 Performance
NFR-01: Key pages and data requests should load quickly for users on typical broadband connections.

NFR-02: Frequently accessed tournament and admin data should be cached to reduce latency.

NFR-03: The frontend should use lazy loading and dynamic imports for heavy sections.

### 8.2 Security
NFR-04: All authenticated requests must include valid JWT credentials.

NFR-05: Admin endpoints must enforce authorization checks.

NFR-06: Sensitive endpoints must be excluded from broad caching.

NFR-07: API requests must be protected against abuse through rate limiting.

### 8.3 Reliability
NFR-08: The system must handle invalid or missing data gracefully with clear error responses.

NFR-09: Failed requests should surface safe user-facing error states without exposing backend details.

NFR-10: The service must maintain data integrity during updates and deletes.

### 8.4 Scalability
NFR-11: The backend should support growing sets of users, tournaments, and leaderboard entries.

NFR-12: Cache layers should allow the API to scale without repeated expensive database reads.

### 8.5 Maintainability
NFR-13: The project should follow modular separation between UI, service, controller, and repository layers.

NFR-14: Code should be organized around clear domain responsibilities such as users, tournaments, leaderboard, and reviews.

### 8.6 Usability
NFR-15: The platform should provide intuitive navigation for visitors and admins.

NFR-16: The application should work across desktop and mobile-sized screens.

## 9. System Architecture Overview

### 9.1 Frontend
- Framework: Next.js
- Primary UI technology: React and component-based page structure
- Main areas:
  - home
  - auth
  - leaderboard
  - review
  - tournament
  - admin
  - live

### 9.2 Backend
- Framework: Spring Boot
- Main domains:
  - UserController
  - TournamentController
  - LeaderboardController
  - ReviewController
  - AdminController
- Services include: UserService, TournamentService, LeaderboardService, ReviewService, AdminService

### 9.3 Data Stores
- PostgreSQL as the persistent relational database
- Redis caching for derived data and frequent reads
- Application configuration supports both local and Docker-based deployment

## 10. External Interface Requirements

### 10.1 User Interface
The UI shall support:
- hero section and promotional landing page,
- upcoming tournament cards,
- registration flow,
- tournament detail and leaderboard views,
- admin dashboard panels,
- review submission forms.

### 10.2 API Interfaces
The backend exposes REST endpoints for:
- user login and registration,
- password reset,
- tournament CRUD operations,
- leaderboard registration and ranking,
- reviews and admin replies,
- admin data streaming.

### 10.3 Hardware and Software Interfaces
- Browser-based web UI,
- Java application runtime,
- PostgreSQL database,
- Redis cache,
- Docker-enabled deployment environment.

## 11. Use Cases

### UC-01: User Registers on the Platform
Primary actor: Player

Steps:
1. User enters registration details.
2. System validates data.
3. User record is stored.
4. System returns success or conflict error.

### UC-02: User Logs In
Primary actor: Player/Admin

Steps:
1. User provides credentials.
2. System validates credentials.
3. JWT token and user payload are returned.
4. Browser stores session data and grants access.

### UC-03: Player Joins Tournament
Primary actor: Player

Steps:
1. User selects a tournament.
2. User enters registration data and payment reference.
3. System validates uniqueness and tournament existence.
4. Player is added to the leaderboard/tournament registration dataset.

### UC-04: Admin Creates Tournament
Primary actor: Admin

Steps:
1. Admin enters tournament metadata.
2. System validates required fields.
3. Tournament is created and stored.
4. Admin can view the updated tournament list.

### UC-05: Admin Reviews Participant Data
Primary actor: Admin

Steps:
1. Admin opens tournament management view.
2. System loads tournament participant and registration data.
3. Admin approves or updates statuses.
4. Changes are saved and visible to the UI.

### UC-06: Admin Publishes Results
Primary actor: Admin

Steps:
1. Admin updates leaderboard rankings.
2. System validates tournament and user records.
3. Rankings are persisted and displayed.
4. Notifications and results views are refreshed.

### UC-07: User Writes Review
Primary actor: Player/Community Member

Steps:
1. User selects a tournament.
2. User submits a review.
3. System saves review and returns confirmation.
4. Review is displayed for the public or admin review flow.

## 12. Data Requirements

The system must manage the following primary data entities:

- User
- Tournament
- Leaderboard entry
- Review
- Admin data stream metadata

Key field groups include:
- user identity and credentials
- tournament details and schedule
- participant registrations and status
- ranking metrics and scores
- review text and moderation reply

## 13. Constraints and Assumptions

### Constraints
- Frontend must run in a browser using Next.js.
- Backend services must be implemented in Java Spring Boot.
- PostgreSQL is the system of record for persistent business data.
- JWT and admin checks are required for protected operations.
- API access is rate-limited to reduce abuse.

### Assumptions
- Admin users are identified via approved contact numbers.
- Tournaments are event-driven rather than dynamically generated from a match engine.
- Tournament results and rankings are managed by administrative workflows.
- Payment flow is integrated as a registration checkpoint rather than a full payment gateway system.

## 14. Acceptance Criteria

AC-01: A new user can create an account and log in successfully.

AC-02: A logged-in user can view upcoming tournaments and register for an eligible one.

AC-03: A duplicate registration attempt is rejected with a clear message.

AC-04: An admin can create, edit, and delete a tournament from admin tools.

AC-05: Admins can view participant lists and change participant status.

AC-06: Leaderboard entries can be updated and displayed publicly.

AC-07: A review can be submitted and displayed on the reviews section.

AC-08: User-facing pages render correctly on desktop and mobile layouts.

AC-09: Rate limited and unauthorized requests are blocked with proper responses.

## 15. Risks and Dependencies

### Risks
- Incomplete or inconsistent tournament data can disrupt registration and leaderboard integrity.
- Cached admin data may become stale if invalidation logic is not maintained.
- Payment validation and onboarding may be sensitive if not verified properly.

### Dependencies
- Java runtime and Maven build for backend.
- Node.js and npm for frontend build and development.
- PostgreSQL database.
- Redis cache service.
- Environment variables for API URL and deployment settings.

## 16. Priority Matrix

### High Priority
- User auth and registration
- Tournament creation and management
- Participant registration and approval
- Leaderboard updates
- Admin dashboard access

### Medium Priority
- Reviews and replies
- Live stream link support
- Reporting and charting
- Contact / marketing pages

### Low Priority
- Advanced visual polish
- Extended analytics features
- Expandable community widgets

## 17. Summary

The Lab-Actions platform is a complete esports tournament ecosystem covering discovery, registration, ranking, administration, and community feedback. It combines a modern frontend with a robust backend and secure admin controls to support tournament operations from event setup to result publication.

This SRS captures the essential functional and non-functional requirements for the current project version and provides a foundation for subsequent design, implementation, testing, and rollout planning.
