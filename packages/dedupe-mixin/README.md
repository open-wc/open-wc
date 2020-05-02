---
permalink: 'guide/dedupe-mixin.html'
title: Dedupe Mixin
section: guides
tags:
  - guides
---

# Dedupe Mixin

Automatically Deduplicate JavaScript Class Mixins

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

## Features

- Small
- Fast
- Typed

## Usage

Apply it to each mixin in the chain to make sure they are not applied more than once to the final class.

```js
import { dedupeMixin } from '@open-wc/dedupe-mixin';

export const MyMixin = dedupeMixin(
  superclass =>
    class MyMixin extends superclass {
      // your mixin code goes here
    },
);
```

## What is a Mixin?

> A mixin is an abstract subclass; i.e. a subclass definition that may be applied to different superclasses to create a related family of modified classes.
>
> - Gilad Bracha and William Cook, [Mixin-based Inheritance](http://www.bracha.org/oopsla90.pdf)

Let's take for example Logging. Imagine you have 3 Pages

- Red
- Green
- Blue

```
              +----------+
              |   Page   |
              +----------+
                |  |  |
     +----------+  |  +-----------+
     |             |              |
+---------+ +-----------+ +----------+
| PageRed | | PageGreen | | PageBlue |
+----+----+ +-----------+ +----------+

```

```js
class Page {}
class PageRed extends Page {}
class PageGreen extends Page {}
class PageBlue extends Page {}
```

Now we want to log whenever someone goes on Page Red.
To archive that we extend Page Red and make a Logged Page Red.

```
              +----------+
              |   Page   |
              +-+--+--+--+
                |  |  |
     +----------+  |  +-----------+
     |             |              |
+----+----+  +-----+-----+  +-----+----+
| PageRed |  | PageGreen |  | PageBlue |
+----+----+  +-----------+  +----------+
     |
+----+----+
| Logged  |
| PageRed |
+---------+
```

```js
class Page {}
class PageRed extends Page {}
class PageGreen extends Page {}
class PageBlue extends Page {}
class LoggedPagRed extends PageRed {}
```

If we want to start logging for PageGreen we have an issue:

- we can't put the logic in `Page` as Blue should not be logged
- we can't reuse the logic in `Logged PageGreen` as we can not extend from 2 source (even if we could it would mean conflicting info in Red and Green)

What we can do is put it in an "external" place and write it so it can be "mixed in".

```
               +----------+                +----------+
               |   Page   |                | Logging* |
               +-+--+--+--+                +----------+
                 |  |  |
      +----------+  |  +-----------+
      |             |              |
+-----+----+  +-----+-----+  +-----+----+
| PageRed  |  | PageGreen |  | PageBlue |
|  with    |  |   with    |  +----------+
| Logging* |  |  Logging* |
+----------+  +-----------+
```

```js
// defining the Mixin
export const LoggingMixin = superclass =>
  class LoggingMixin extends superclass {
    // logging logic
  };

class Page {}
// applying a Mixin
class PageRed extends LoggingMixin(Page) {}
class PageGreen extends LoggingMixin(Page) {}
class PageBlue extends Page {}
```

With that approach we can extract logic into a separate code pieces we can use where needed.

For a more in depth technical explanation please read [Real Mixins with JavaScript Classes](https://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/).

## Why is Deduping of Mixins Necessary?

We now want all logging to the Red, Green, and Blue pages.
Easy enough - as we can now apply the LoggingMixin on the Page itself.

```
               +----------+               +----------+
               |   Page   |               | Logging* |
               |   with   |               +----------+
               | Logging* |
               +-+--+--+--+
                 |  |  |
      +----------+  |  +-----------+
      |             |              |
+-----+----+  +-----+-----+  +-----+----+
| PageRed  |  | PageGreen |  | PageBlue |
+----------+  |   with    |  +----------+
              |  Logging* |
              +-----------+
```

However, Team Green were eager to launch, so they already applied `LoggingMixin` to their Page class. When we apply it to the base `Page` class, Mixin is now applied twice 😱
Suddenly, the Green page will print each log twice - not what we originally had in mind.

What we need to do is make sure that each Mixin is attached only once even if we try to apply it multiple times.

Generally the more generic a mixin is, the higher the chance becomes that is gets applied more than once. As a mixin author you can't control how it is used, and can't always predict it. So as a safety measure it is always recommended to create deduping mixins.

```js
import { dedupeMixin } from '@open-wc/dedupe-mixin';

export const MyMixin = dedupeMixin(
  superclass =>
    class MyMixin extends superclass {
      // your mixin code goes here
    },
);
```

You can see exactly this situation in the demo.

By applying dedupeMixin to the mixin function, before we export it, we can be sure that our mixin class will only take effect once, even if it is mixed in to multiple base classes in the inheritance chain.

- [no-dedupe](/dedupe-mixin/demo/no-dedupe/) "fails" by logging Green two times
- [with-dedupe](/dedupe-mixin/demo/with-dedupe/) "succeeds" by logging Green one time as well

You can check the source code for both on [github](https://github.com/open-wc/open-wc/tree/master/packages/dedupe-mixin/demo-typed).

### Nested examples

You may think that the above example is too simple and can be solved by aligning on when to do changes.
However in most real live scenarios the situation is much more complicated 🙈
Mixins can be extended and just because you import a class it does not meant that this class has some Mixins pre applied.

Consider this example:

```
               +----------+               +----------+      +----------+
               |   Page   |               | Logging* |      | Feature  |
               |   with   |               +----+-----+      |   with   |
               | Logging* |                    |            | Metrics* |
               +-+--+--+--+               +----+-----+      +----+--+--+
                 |  |  |                  | Metrics* |           |  |
      +----------+  |  +-----------+      +----------+           |  +------
      |             |              |                             |
+-----+----+  +-----+-----+  +-----+----+                 +------+-------+
| PageRed  |  | PageGreen |  | PageBlue |                 | WaterFeature |
+----------+  +-----------+  |   with   |                 +--------------+
                             | Metrics* |
                             +----------+
```

- Pages generally only need Logging
- There is however also more advanced Metrics System which extends Logging
- Metrics was separately developed for Features
- When we now want to get the same Metrics on Page Blue we get duplicate logging without consciously applying logging even once (we do `class PageBlue extends MetricsMixin(Page) {}`)
- Only deduping can help in these scenarios

_Ascii Graphics made with [AsciiFlow](http://asciiflow.com/)_
