# Documentation & Developer Experience

A clean and intuitive developer experience is essential for both "vibe" coders and professional engineers. This guide covers best practices for documentation and code organization.

## Project Documentation

### Comprehensive README

Your repository should have a README.md that covers:

- **Project overview**: What the application does and its tech stack
- **Getting started**:
  - How to run in development (`npm install`, `npm run dev`)
  - Setup requirements (copying `.env.example` to `.env`, etc.)
- **Build and deploy instructions**
- **Project structure explanation** (folder layout and conventions)
- **Coding guidelines or philosophy**
- **Quick start guide** for common tasks (e.g., adding a new page)

### Specialized Documentation

Consider additional documentation files for specific aspects:

- `CONTRIBUTING.md` for contribution guidelines
- `ARCHITECTURE.md` for system design details
- Documentation folders for more complex topics

## Code Documentation

### Inline Documentation

Write comments in code where logic isn't immediately obvious:

- Aim for self-explanatory code (clear variable and function names)
- When implementing a workaround or complex logic, explain the reasoning
- Comments should provide context or intention, not just narrate the code

Good example:
```typescript
// Using debounce to prevent excessive API calls during typing
// Wait 300ms after typing stops before sending request
const debouncedSearch = useDebouncedCallback((term) => {
  fetchResults(term);
}, 300);
```

Poor example:
```typescript
// Increment i
i++;
```

### TypeScript and JSDoc

Use TypeScript types as self-documentation:

```typescript
/**
 * Processes a verification request for a meal tray
 * @param imageData - The binary image data captured from the camera
 * @param ticketId - The meal ticket identifier to compare against
 * @returns A verification result with confidence score
 */
async function verifyMealContent(
  imageData: Buffer,
  ticketId: string
): Promise<VerificationResult> {
  // Implementation...
}
```

TypeScript types and JSDoc comments help with editor tooltips for your teammates.

### Document AI Prompts

For AI features, document how prompts are structured:

- Add comments explaining the rationale behind prompt design
- Note any specific formatting or tokens that are important
- Document the expected output structure

## Code Consistency

### Linting and Formatting

Use ESLint and Prettier to maintain consistent code style:

- ESLint catches common issues (like exhaustive deps in useEffect)
- Prettier ensures uniform formatting
- Include these in your CI process

Sample configuration:
```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "prettier"
  ],
  "rules": {
    "react-hooks/exhaustive-deps": "warn",
    // Other custom rules...
  }
}
```

### Git Practices

Write meaningful commit messages:

- Bad: "Fix stuff"
- Good: "Fix image upload error handling in verification flow"

Consider a commit message format like:
```
feat(auth): Add email verification flow

- Sends verification email on signup
- Adds verification page with token validation
- Updates user model with emailVerified field
```

### Handoff Documentation

When transitioning a project to a new team, create a handoff document:

- Summarize the current state
- Note any technical debt or known issues
- Explain any unconventional patterns or decisions
- List planned features or improvements

## Testing

Even if not fully implemented, set up a basic testing framework:

- Unit tests for critical utility functions
- Component tests for key UI elements
- Basic API route tests

Example Jest test:
```typescript
// lib/utils.test.ts
import { formatCurrency } from './utils';

describe('formatCurrency', () => {
  it('formats USD correctly', () => {
    expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
  });
  
  it('handles zero values', () => {
    expect(formatCurrency(0, 'USD')).toBe('$0.00');
  });
});
```

Tests serve as documentation-by-example, showing how functions are meant to be used.

## Developer Scripts

Provide helpful scripts in package.json:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "jest",
  "db:studio": "prisma studio",
  "db:push": "prisma db push",
  "db:migrate": "prisma migrate dev"
}
```

Document these in the README so developers know what tools are available.

## Keep Dependencies Lean

A tidy package.json contributes to maintainability:

- Remove unused packages
- Consolidate similar libraries
- Document why unusual dependencies are included
- Consider the impact on bundle size

## Code Understandability

Write code with the assumption that someone else will read it:

- Prefer clarity over cleverness
- Break complex operations into named steps
- Use meaningful variable and function names
- Follow established patterns in the codebase

## Balancing Vibe Coding and Professional Structure

The goal is code that feels lightweight but isn't fragile:

- **Favor simple solutions** initially and gradually introduce complexity
- **Refactor continuously** in small ways rather than massive rewrites
- **Use meaningful naming** to make code self-documenting
- **Leave TODO comments** for future improvements (but don't let them accumulate)
- **Embrace framework conventions** for predictable structure

Remember that good documentation and organization actually accelerate development by reducing the cognitive load. A well-documented project inspires confidence and makes it easier for anyone to contribute or maintain the codebase.

## Food Item Overrides Documentation

### User Documentation
When documenting the override system for managers and administrators:

1. Clearly explain the purpose: location-specific substitutions with optional expiration
2. Document the UI fields:
   - Original item
   - Replacement item
   - Start date (defaults to now)
   - Expiration date (optional, null means permanent)
   - Override notes (context for kitchen staff)
   - Active status toggle

3. Provide usage examples:
   - Temporary substitution due to supply shortage
   - Permanent menu change for a specific location
   - Seasonal ingredient substitution

### Technical Documentation
For developers working with the override system:

1. Document the database schema and relationships
2. Explain how overrides are fetched and incorporated into the AI prompt
3. Detail how applied overrides are tracked in verification results
4. Reference the override-specific API endpoints 