# Automating

Having a ci running test for you is really helpful as it gives valuable insights especially for merge requests.

## Circle ci
If you use the default generator you will already have a .circleci folder. 
It contains a config that does linting and testing.

::: tip Info
This is part of the default [open-wc](https://open-wc.org/) recommendation
:::

## Setup
```bash
npx -p yo -p generator-open-wc -c 'yo open-wc:tools-circleci'
```

### Manual Setup
- copy [.circleci/config.yml](https://github.com/open-wc/open-wc/blob/master/packages/generator-open-wc/generators/tools-circleci/templates/static/.circleci/config.yml) to  `.circleci/config.yml`


## Usage

- Register via [https://circleci.com/signup/](https://circleci.com/signup/)
- Use Sign Up with Github and select your user
- If you already have an account just login
- In the sidebar click "Add Projects"
- For your repository click "Set up Project"
- Config is already present so you can just click "Start building"

## Run Tests via Browserstack

- If you do not have an account yet create one
- For open source projects you can request a sponsorhip (like we have for open-wc) => You only need to add the logo + link to browserstack and write an E-Mail.
- Go to [https://www.browserstack.com/accounts/settings](https://www.browserstack.com/accounts/settings)
- Look for "Automate" write down "Access Key" and "Username"
- Open your [circleci App](https://circleci.com/dashboard) or direclty via https://circleci.com/gh/{groupname}/{reponame}/edit
- Go to the project settings -> Environment Variables
- Add Variable: BROWSER_STACK_USERNAME + ${username from url above}
- Add Variable: BROWSER_STACK_ACCESS_KEY + ${key from url above}
