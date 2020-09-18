---
permalink: 'automating/index.html'
title: Automating
section: guides
tags:
  - guides
---

# Automating

Having continuous integration in your project can provide valuable insights, and we consider it an essential in your projects.

## Circle ci

If you use the default generator you will already have CircleCi setup with a .circleci folder.
It also contains a config that takes care of linting and testing.

<div class="custom-block tip"><p class="custom-block-title">Info</p> <p>This is part of the default <a href="https://open-wc.org/" target="_blank" rel="noopener noreferrer">open-wc<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15" class="icon outbound"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path> <polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg></a> recommendation.</p></div>
## Setup

```bash
npm init @open-wc automating
```

### Manual Setup

- copy [.circleci/config.yml](https://github.com/open-wc/open-wc/blob/master/packages/create/src/generators/tools-circleci/templates/static/.circleci/config.yml) to `.circleci/config.yml`

## Usage

- Register via [https://circleci.com/signup/](https://circleci.com/signup/)
- Use Sign Up with Github and select your user
- If you already have an account, simply login
- In the sidebar click "Add Projects"
- Click "Set up Project"
- Config is already present so you can simply click "Start building"

## Run Tests via Browserstack

- If you do not have an account yet, please create a Browserstack account
- For open source projects you can request a sponsorhip (like we have for open-wc) => You only need to add the logo + link to browserstack and write an E-Mail.
- Go to [https://www.browserstack.com/accounts/settings](https://www.browserstack.com/accounts/settings)
- Look for "Automate", and write down the "Access Key" and "Username"
- Open your [circleci App](https://circleci.com/dashboard) or direclty via https://circleci.com/gh/{groupname}/{reponame}/edit
- Go to the project settings -> Environment Variables
- Add Variable: BROWSER_STACK_USERNAME + \${username from url above}
- Add Variable: BROWSER_STACK_ACCESS_KEY + \${key from url above}
