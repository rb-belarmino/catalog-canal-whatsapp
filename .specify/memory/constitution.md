<!--
SYNC IMPACT REPORT (temporary — remove before commit)
======================================================
Version change: (none) → 1.0.0 (initial ratification)
Added sections:
  - Core Principles (I–VII)
  - Security & Secrets Policy
  - Development Workflow & Quality Gates
  - Governance
Modified principles: N/A (first version)
Removed sections: N/A
Follow-up TODOs:
  - TODO(PROJECT_STACK): Technology stack (language, framework) not yet specified — define in first feature spec or README.
  - TODO(RATIFICATION_DATE): Exact ratification date set to today (2026-09-12); confirm if a different date applies.
-->

# Catalog Canal WhatsApp Constitution

## Core Principles

### I. Clean Code (NON-NEGOTIABLE)

Every line of code MUST be readable, expressive, and self-documenting.

- Functions and methods MUST do one thing only (Single Responsibility).
- Names MUST reveal intent: variables, functions, classes, and modules MUST be named
  clearly in English (names) or Portuguese (domain language), never abbreviated beyond
  industry-standard acronyms.
- Functions MUST be kept short (≤ 20 lines preferred; ≤ 40 lines maximum before refactoring).
- Dead code, commented-out blocks, and orphan files MUST be removed before merging.
- Code MUST be written for the next developer first, for the machine second.

**Rationale**: Maintainability compounds over time. Code that cannot be understood is code
that cannot be safely changed or debugged — this is unacceptable for a production system.

### II. Modular Monolith Architecture

The system MUST be structured as a modularized monolith: a single deployable unit divided
into cohesive, independently reasoned modules.

- Each module MUST encapsulate its own domain logic, data access, and public interface.
- Cross-module communication MUST happen only through defined public interfaces (no direct
  internal imports between modules).
- Modules MUST NOT have circular dependencies.
- Shared infrastructure (logging, config, HTTP client) MUST live in a dedicated `shared/`
  or `core/` layer, never duplicated across modules.
- The modular boundaries MUST be designed so that a module can be extracted to a separate
  service in the future with minimal friction.

**Rationale**: A monolith avoids distributed systems complexity while modularization
prevents the Big Ball of Mud anti-pattern and keeps the codebase evolvable.

### III. Excellent User Experience (NON-NEGOTIABLE)

Every user-facing feature MUST be designed and validated from the user's perspective first.

- Flows MUST be clear, fast, and forgiving — users MUST never be left confused about
  what happened or what to do next.
- Error messages MUST be human-readable, actionable, and free of technical jargon.
- Loading states, confirmations, and feedback MUST always be present for actions that take
  time or have side effects.
- Accessibility (a11y) MUST be considered for every UI component.
- WhatsApp-specific UX patterns (message threading, quick replies, catalog navigation)
  MUST be respected and leveraged, not reinvented.

**Rationale**: The channel is WhatsApp. Users expect conversational, instant, and
frictionless interactions. A poor UX directly translates to abandoned sessions and lost sales.

### IV. Security by Design — Zero Secrets in Code

No passwords, tokens, API keys, connection strings, or any sensitive data MAY appear
in source code, comments, commit history, or configuration files tracked by version control.

- ALL secrets MUST be stored exclusively in `.env` files, which MUST be listed in `.gitignore`.
- Application code MUST read secrets through environment variables only (e.g., `process.env.VAR`
  or equivalent).
- `.env.example` files with placeholder values (not real secrets) MUST be committed to
  document required variables.
- Secret scanning MUST be part of CI/CD; builds MUST fail if a known secret pattern is detected.
- Secrets MUST be rotated immediately if accidentally committed; the commit MUST be purged
  from history.

**Rationale**: WhatsApp Business API credentials and catalog data are high-value targets.
A single leaked secret can compromise the entire system and customer data.

### V. Test-Driven Quality

All business logic MUST have automated test coverage before the feature is considered done.

- Unit tests MUST cover pure domain logic and use-case layers.
- Integration tests MUST cover module boundaries and external service adapters.
- End-to-end (E2E) tests MUST cover critical user journeys (e.g., catalog browsing, order
  initiation via WhatsApp).
- Tests MUST be deterministic, isolated, and fast (unit suite < 30 s, integration suite < 5 min).
- The test suite MUST pass on every pull request before merge; no exceptions.

**Rationale**: Automated tests are the safety net that allows the team to move fast without
breaking the user experience — the most important project invariant.

### VI. Observability & Structured Logging

The system MUST produce logs that allow engineers to diagnose production issues without
accessing user devices or redeploying.

- All log entries MUST be structured (JSON preferred) and include: timestamp, severity,
  correlation/trace ID, module name, and a human-readable message.
- Errors MUST be logged with full stack traces and contextual metadata.
- Business-critical events (order initiated, catalog fetched, message sent) MUST emit
  explicit log entries.
- Sensitive data (phone numbers, tokens, payment info) MUST NEVER appear in log output.

**Rationale**: WhatsApp integrations are event-driven and asynchronous; without structured
logs, debugging production failures is nearly impossible.

### VII. Simplicity & YAGNI

The simplest solution that satisfies the current requirement MUST be preferred.

- Abstractions MUST be introduced only when needed by at least two concrete use cases
  (Rule of Three).
- Over-engineering, speculative generalization, and gold-plating are prohibited.
- Dependencies MUST be added deliberately; every new package MUST be justified in the PR
  description.

**Rationale**: Complexity is the enemy of UX quality and maintainability. Every unnecessary
abstraction is technical debt disguised as architecture.

## Security & Secrets Policy

All contributors MUST comply with the following rules on every commit:

- `.env` files MUST be in `.gitignore` and MUST NEVER be committed.
- `.env.example` MUST document every required environment variable with a description and
  a safe placeholder value (e.g., `WHATSAPP_API_TOKEN=your_token_here`).
- CI/CD pipelines MUST inject secrets via the hosting platform's secret management
  (e.g., GitHub Actions Secrets, Railway / Heroku config vars) — never hardcoded in
  pipeline YAML.
- Code review MUST explicitly check for secrets; reviewers MUST reject PRs containing any.
- If a secret is accidentally committed, the incident MUST be reported, the secret rotated
  within 1 hour, and the commit purged from Git history using `git filter-repo` or BFG.

## Development Workflow & Quality Gates

### Branching Strategy

- `main` MUST always be deployable.
- Feature work MUST happen on short-lived branches named `feat/<scope>`, `fix/<scope>`,
  or `chore/<scope>`.
- Pull Requests MUST be reviewed by at least one other developer before merge.

### Definition of Done

A feature is DONE only when ALL of the following are true:

- [ ] Acceptance criteria from the spec are met.
- [ ] Unit and integration tests pass with >= 80% coverage on new code.
- [ ] No secrets in source code (automated check passes).
- [ ] Code review approved.
- [ ] UX has been validated against the "Excellent User Experience" principle.
- [ ] Observability: relevant business events are logged.
- [ ] Documentation updated (`.env.example`, module README if applicable).

### Code Review Standards

- Reviewers MUST verify Clean Code compliance, security policy adherence, and UX impact.
- Comments MUST be constructive and specific.
- Authors MUST respond to or resolve all review comments before merge.

## Governance

This constitution supersedes all informal agreements, prior conventions, and conflicting
documentation. Amendments require:

1. A written proposal describing the change, motivation, and migration plan.
2. Review and approval by the project lead (or majority of the active team if no lead
   is designated).
3. Version bump according to semantic versioning rules (MAJOR/MINOR/PATCH).
4. The amended constitution MUST be committed with the message format:
   `docs: amend constitution to vX.Y.Z (<brief rationale>)`.

All pull requests and code reviews MUST verify compliance with this constitution.
Complexity introduced without justification MUST be challenged and refactored.

**Version**: 1.0.0 | **Ratified**: 2026-09-12 | **Last Amended**: 2026-09-12
