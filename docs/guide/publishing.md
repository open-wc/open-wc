# Publishing

To publish your webcomponent we recommend [netlify](https://www.netlify.com/).

- it's free
- it's so easy
- it provides previews for every MR
- it supports custom domain
- ...

## Manual Setup

So just head over to [netlify](https://www.netlify.com/) and register.
Then select your github account and repository.
If you follow these recommendations all you need to do is
- Build command: `npm run site:build`
- Publish directory: `_site`

And you are all set.

## Example
The [Set-Game Example](https://github.com/open-wc/example-vanilla-set-game/) has the default publishing via storybook on netlify.
You can see the finished page here: [https://example-set-game-open-wc.netlify.com/](https://example-set-game-open-wc.netlify.com/).
