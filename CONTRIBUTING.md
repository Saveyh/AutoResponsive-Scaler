# Contributing

Thanks for taking the time to improve Responsive Scale Layout.

## Local Checks

Run:

```bash
npm test
```

This currently performs a syntax check on `responsive-scale.js`.

## Pull Request Guidelines

- Keep the script dependency-free.
- Keep the public API small and documented in `README.md`.
- Update `examples/basic/index.html` when changing behavior that affects usage.
- Update `CHANGELOG.md` for user-facing changes.
- Avoid build steps unless they solve a clear distribution problem.

## Good Issues To Report

- Layouts where the calculated body height is wrong.
- Fixed elements that do not scale or align correctly.
- Browser-specific behavior.
- Conflicts with common animation or scroll libraries.

Please include a reduced HTML/CSS example when possible.
