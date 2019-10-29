## Testing with Karma
To run the suite of karma tests, run
```bash
<%= scriptRunCommand %> test
```
or to run them in compatibility mode for legacy browsers
```bash
<%= scriptRunCommand %> test:compatibility
```

To run the tests in watch mode (for <abbr title="test driven development">TDD</abbr>, for example), run

```bash
<%= scriptRunCommand %> test:watch
```
or
```bash
<%= scriptRunCommand %> test:compatibility
```

## Testing with Karma via BrowserStack
To run the suite of karma tests in BrowserStack, run
```bash
<%= scriptRunCommand %> test:bs
```

## Managing Test Snapshots
You can manage the test snapshots using
```bash
<%= scriptRunCommand %> test:update-snapshots
```
or
```bash
<%= scriptRunCommand %> test:prune-snapshots
```
