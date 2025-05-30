# Template: Workplan for New Feature/Enhancement

**Purpose of this Template:** This document serves as a comprehensive blueprint for planning and executing the development of a new feature or significant enhancement. The goal is to provide **sufficient detail** so that a developer can understand the requirements, architecture, and tasks involved, enabling them to begin implementation **without needing further clarification** from product managers, supervisors, or users. Fill out each section thoroughly.

---

## NEW FEATURE: [Feature Name]

*   **Provide a clear, concise name for the feature.** Example: "User Profile Page", "Real-time Collaboration", "Admin Dashboard v2".

**Status**: ⬜️ (Not Yet Started) / 🟡 (In Progress) / ✅ (Completed)

*   **Indicate the current development status.**

**Target Route(s)**: `[Proposed URL Path(s)]`

*   **Specify the intended URL route(s) for this feature.** Example: `/app/settings/profile`, `/admin/users`, `/api/posts`. Be specific about proposed locations within the application structure.

**Target Users**: `[Role(s) or User Group(s)]`

*   **Identify the primary user roles or groups who will interact with this feature.** Example: `AUTHENTICATED_USER`, `ADMIN`, `MANAGER`, `GUEST`. This informs access control and UI/UX considerations.

**Purpose & Why**:

*   **Explain the core objective of this feature.** What problem does it solve? What value does it bring to the target users or the system?
*   **Justify the need for this feature.** Why is it important now? What are the business goals or user needs driving its development?
*   **Be detailed.** A developer should understand the *motivation* behind the feature, not just the technical requirements. This helps in making informed decisions during implementation.

**Architecture & Implementation Notes**:

*   **This is a critical section for technical guidance.** Outline the proposed technical approach, key components, and integration points.
*   **Code Reuse:** Explicitly state which existing components, services, APIs, or libraries **should be reused or adapted**. This minimizes redundancy and ensures consistency. Be specific (e.g., "Reuse `useFetchData` hook", "Adapt `Button` component from `src/components/ui`").
*   **New Components/Modules:** Describe any major new components, modules, or services that need to be created.
*   **Data Models & Database:** Specify any necessary database schema changes (new tables, columns, relationships), migrations, or interactions. Mention specific models or data structures.
*   **API Design:** If new API endpoints are required, outline their purpose, expected request/response formats, and integration with the frontend. Reference the `api-routes.md` guideline.
*   **Third-Party Services:** Detail any integration with external services (e.g., payment gateways, analytics platforms, cloud storage like R2). Include required credentials or configuration notes.
*   **UI/UX Considerations:** Mention key UI patterns, libraries (like ShadCN), or specific user experience goals. Reference `styling/` guidelines if applicable.
*   **Technical Constraints/Decisions:** Note any important technical limitations, performance considerations, or specific technology choices made and why.
*   **Provide enough detail** so the developer understands the *how* without needing to re-architect on the fly.

**Core Features & Requirements**:

*   **List the specific, user-facing functionalities of the feature.** Use a numbered or bulleted list.
*   **Be granular and unambiguous.** Each item should represent a distinct capability.
    *   Example (Good): "1. Allow users to upload a profile picture (JPG, PNG, max 5MB)."
    *   Example (Bad): "1. User profile editing."
*   **Include functional requirements:** What the system *must do*.
*   **Include non-functional requirements (if applicable):** Performance targets, security considerations, accessibility standards.
*   **Detail expected inputs, outputs, and behaviors** for each feature point.

**Development Tasks Checklist**:

*   **Break down the implementation into actionable tasks.** This forms the developer's to-do list.
*   **Group tasks logically** (e.g., Backend Setup, Frontend Components, API Integration, Styling, Testing).
*   **Use checkboxes `[ ]`** to track progress. Mark pre-existing completed items if adapting this from another plan `[✅]`.
*   **Be specific.** Each task should be small enough to be manageable and verifiable.
    *   Example (Good): `[ ] Create Prisma schema migration for 'user_profiles' table.`
    *   Example (Bad): `[ ] Implement backend.`
*   **Include tasks for:**
    *   Backend logic (API endpoints, services, data access).
    *   Frontend UI components.
    *   State management.
    *   API integration (connecting frontend to backend).
    *   Database migrations/setup.
    *   Configuration updates (.env, etc.).
    *   Testing (unit, integration, end-to-end).
    *   Documentation updates.
    *   Styling and UI polish.
*   **Reference specific files or components** where applicable (e.g., `[ ] Update component X in `src/components/feature/componentX.tsx`).

---

## Dependencies for [Feature Name]

*   **Identify any tasks, components, or setup steps outside the direct scope of *this* feature that *must* be completed before *this* feature can be fully implemented or finalized.**
*   **Think about prerequisites:** Are there core library updates needed? Is another team building a required API? Does foundational infrastructure (like auth or base layout) need to be in place?
*   **List specific components/files/tasks and their status.** Use indicators like `⬜️`, `🟡`, `✅`.
    *   Example: `**1. Core Authentication Service (`/lib/auth.ts`) (`🟡`)**`
        *   `[✅]` Implement basic login.
        *   `[⬜️]` Add role-based access control logic needed for [Feature Name].
*   **This section prevents blockers** by highlighting external dependencies early. 