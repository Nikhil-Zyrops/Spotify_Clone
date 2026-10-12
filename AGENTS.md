# Engineering Workflows & Standards (Matt Pocock Skills Default)

These engineering practices and skills are enabled and active by default across all coding workflows:

## 1. Intentional Alignment & Clarification (Default Before Non-Trivial Work)
- Before jumping straight into implementing non-trivial features, refactors, or new components, clarify the problem space.
- Apply the `grill-me` / `grill-with-docs` discipline: actively question assumptions, identify edge cases, determine boundaries, and agree on the public interface/seam before writing code.
- For larger initiatives, break down requirements into clear, verifiable slices (`to-spec`, `to-tickets`) before executing (`implement`).

## 2. Test-Driven Development (TDD Loop by Default)
- When writing application logic, algorithms, state management, or bug fixes, strictly adhere to the `tdd` skill:
  - **Seams First**: Test at public interfaces (boundaries), never test internal implementation details or private helpers.
  - **Red -> Green Loop**: Write the failing test first, verify failure, then write minimal code to pass.
  - **Vertical Slices**: Deliver one slice at a time (one seam, one failing test, minimal implementation, pass).
  - **Avoid Anti-Patterns**:
    - No horizontal slicing (writing extensive test suites before any implementation exists).
    - No tautological tests (assertions that duplicate the logic under test).
    - No implementation-coupled mocks (mock external boundaries like network/storage, not internal collaborators).

## 3. Disciplined Bug Diagnosis
- When encountering errors, regressions, or unexpected behaviors, follow the `diagnosing-bugs` workflow:
  - Formulate hypotheses and isolate the minimal reproduction.
  - Trace root cause through evidence before proposing changes.
  - Lock in the fix with a failing test before applying code modifications.

## 4. Deep Modules & Clean Architecture
- Follow the `codebase-design` principles:
  - Strive for deep modules: narrow, intuitive public API surfaces concealing substantial internal capabilities.
  - Keep domain language consistent and explicit (`domain-modeling`).

## 5. Verification & Code Review
- Before marking any implementation complete, self-evaluate using `code-review`:
  - **Standards**: Does the code adhere to repo guidelines, linting, and formatting?
  - **Spec**: Does it satisfy the requested scope without regressions or unwanted side effects?

## 6. Git Safety
- Respect safety guardrails (`git-guardrails-claude-code`): never perform destructive git commands (`git reset --hard`, force pushes, or branch deletion) without explicit confirmation.
