#!/usr/bin/env node

/* eslint-disable consistent-return, no-console */
const fs = require('fs');

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const filePath = `${process.cwd()}/README.md`;
const findPattern = escapeRegExp('[//]: # (AUTO INSERT HEADER PREPUBLISH)');
const text = `
> Part of Open Web Components [open-wc](https://github.com/open-wc/open-wc/)

Open Web Components provides a set of defaults, recommendations and tools to help facilitate your web component project. Our recommendations include: developing, linting, testing, building, tooling, demoing, publishing and automating.

[![CircleCI](https://circleci.com/gh/open-wc/open-wc.svg?style=shield)](https://circleci.com/gh/open-wc/open-wc)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)](https://www.browserstack.com/automate/public-build/M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)
`.trim();

fs.readFile(filePath, 'utf8', (readError, data) => {
  if (readError) {
    return console.log(readError);
  }

  const result = data.replace(new RegExp(findPattern), text);
  fs.writeFile(filePath, result, 'utf8', writeError => {
    if (writeError) {
      return console.log(writeError);
    }
  });
});
