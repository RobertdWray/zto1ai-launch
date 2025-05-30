# Comprehensive Bug Report Guidelines

When reporting a bug, providing detailed information is crucial for efficient diagnosis and resolution. Please use the following structure as a template for your bug reports.

## 0. How this impacts users and why the user would care. 

If you don't know the answer to this quetsion or other questions in this templated bug report, please ask the user before creating this report. 

## 1. Environment Details

Specify the technical environment where the bug occurred. This helps reproduce the issue accurately. Include:

*   **Framework/Library Versions:** (e.g., Next.js: 15.3.0, React: 18.2.0)
*   **Language Runtimes:** (e.g., Node.js: 20.11.0, Python: 3.10)
*   **Relevant Package Versions:** (e.g., TypeScript: ^5, Zod: 3.22.4)
*   **Operating System:** (e.g., macOS Sonoma 14.5, Ubuntu 22.04, Windows 11)
*   **Browser (if applicable):** (e.g., Chrome 126, Firefox 127)
*   **Relevant Configuration:** Include snippets of configuration files (like `tsconfig.json`, `package.json` relevant dependencies, `.env` variables *if safe to share*, etc.) that might influence the behavior. Redact sensitive information.

```json
// Example: tsconfig.json snippet
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    // ... other options
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

## 2. Problem Summary

Provide a clear and concise overview of the bug.

*   **Bug Context:** When does the bug occur? (e.g., during build, runtime, specific user action, interacting with a specific component/API).
*   **Affected Area:** Pinpoint the specific file, function, component, or route where the issue manifests.
*   **Nature of Issue:** Briefly describe the core problem (e.g., type error, unexpected behavior, crash, UI glitch, performance degradation).
*   **Overall Description:** A short paragraph summarizing the problem and its impact.

## 3. Expected vs. Actual Behavior

*   **Expected Behavior:** Describe what *should* have happened.
*   **Actual Behavior:** Describe what *actually* happened.

## 4. Exact Error Message(s)

If the bug produces error messages, logs, or stack traces, **copy and paste the complete, unedited output**. Use code blocks for readability.

```
// Example Error Log
TypeError: Cannot read properties of undefined (reading 'id')
    at handleUserAction (/path/to/your/code/file.ts:42:15)
    at onClick (/path/to/your/component/button.tsx:10:5)
    ... (rest of stack trace)
```

## 5. Relevant Code Snippet(s)

Include the *minimal* code necessary to reproduce or understand the bug. Focus on the specific functions, components, or configuration directly involved.

```typescript
// Example: src/utils/dataProcessing.ts
export function processData(input: unknown): ProcessedData | null {
  if (typeof input !== 'object' || input === null) {
    console.error("Invalid input type");
    // Bug might be here - should it return null or throw?
    return null;
  }
  // ... rest of the processing logic
  const id = input.id; // Potential error source if id is missing
  return { /* ... processed data ... */ };
}
```

## 6. Steps to Reproduce

Provide a clear, numbered list of steps that consistently trigger the bug.

1.  Navigate to the `/dashboard` page.
2.  Click the "Generate Report" button.
3.  Observe the console for errors.
4.  Notice that the report download fails.

## 7. Troubleshooting Steps Attempted

List any steps you've already taken to try and fix or diagnose the issue. This prevents redundant suggestions.

*   Cleared node_modules and reinstalled dependencies (`rm -rf node_modules && npm install`).
*   Upgraded `library-x` from v1.2.0 to v1.3.0.
*   Tried commenting out the `useEffect` hook in `MyComponent.tsx`.
*   Checked network requests; status code 500 on `/api/data`.

## 8. Additional Context / Follow-up

Include any other relevant information:

*   Has this worked previously? If so, what changed?
*   Are there specific conditions under which it works/fails? (e.g., only fails for specific users, specific data inputs)
*   Screenshots or recordings (if helpful, especially for UI bugs).
*   Links to relevant documentation or discussions.
*   Answers to any anticipated follow-up questions.

By providing these details, you help us understand the problem faster and work towards a solution more effectively.
