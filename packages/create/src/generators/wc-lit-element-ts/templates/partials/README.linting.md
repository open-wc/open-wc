## Linting with ESLint, Prettier, and Types
To scan the project for linting errors, run
```bash
<%= scriptRunCommand %> lint
```

You can lint with ESLint and Prettier individually as well
```bash
<%= scriptRunCommand %> lint:eslint
```
```bash
<%= scriptRunCommand %> lint:prettier
```

To automatically fix many linting errors, run
```bash
<%= scriptRunCommand %> format
```

You can format using ESLint and Prettier individually as well
```bash
<%= scriptRunCommand %> format:eslint
```
```bash
<%= scriptRunCommand %> format:prettier
```
