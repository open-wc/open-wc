# `component-a`

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

## `failed snapshots`

####   `throws an error when a snapshot does not match`

```html
<div>
  0.15723879259035956
</div>

```

```html
<div>
  0.15723879259035956
</div>

```

####   `does not throw an error when a snapshot does not match using negate`

```html
<div>
  0.5959025306605419
</div>

```

```html
<div>
  0.5959025306605419
</div>

```

