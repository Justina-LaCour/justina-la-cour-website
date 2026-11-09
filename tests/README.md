# Tests

Tests live outside `src` so production modules and route folders contain only
application code.

- `unit/` mirrors the production tree and contains test cases.
- `support/` contains test-only factories, fixtures, and mocks shared by cases.

Import production code through `$lib` or `$src`, and test helpers through
`$tests`. Run the suite with `npm test` or use `npm run test:watch` while
developing.
