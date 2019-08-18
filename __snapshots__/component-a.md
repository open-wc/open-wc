# `component-a`

## `failed snapshots`

####   `throws an error when a snapshot does not match`

```html
<div>
  0.6523866720855873
</div>
```

```html
<div>
  0.1401241753470146
</div>

```

## `success states`

####   `matches a string snapshot`

```html
<div>
  A
</div>
```

```html
<div>
  A
</div>
```

####   `matches a dom element snapshot`

```html
<div>
  B
</div>
```

```html
<div>
  B
</div>
```

####   `matches a dom element snapshot, using .dom`

```html
<div>
  C
</div>
```

```html
<div>
  C
</div>
```

## `error states`

####   `matches a lightdom snapshot`

```html
<span>
  A
</span>
```

```html
<span>
  A
</span>
```

####   `matches shadow dom snapshot`

```html
<span>
  B
</span>
```

```html
<span>
  B
</span>
```

