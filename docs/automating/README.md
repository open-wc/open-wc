# Automating

Having continuous integration in your project can provide valuable insights, and we consider it an essential in your projects.

## Circle ci
If you use the default generator you will already have CircleCi setup with a .circleci folder.
It also contains a config that takes care of linting and testing.

::: tip Info
This is part of the default [open-wc](https://open-wc.org/) recommendation.
:::

## Setup
```bash
npm i -g yo
npm i -g generator-open-wc

yo open-wc:automating
npm i
```

### Manual Setup
- copy [.circleci/config.yml](https://github.com/open-wc/open-wc/blob/master/packages/generator-open-wc/generators/tools-circleci/templates/static/.circleci/config.yml) to  `.circleci/config.yml`


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
- Add Variable: BROWSER_STACK_USERNAME + ${username from url above}
- Add Variable: BROWSER_STACK_ACCESS_KEY + ${key from url above}
