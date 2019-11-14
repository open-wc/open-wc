# Getting Started

First, create a fork of the [open-wc/open-wc](https://github.com/open-wc/open-wc) repo by hitting the `fork` button on the GitHub page.

Next, clone your fork onto your computer with this command (replacing YOUR_USERNAME with your actual GitHub username)

```
git clone git@github.com:YOUR_USERNAME/open-wc.git
```

Once cloning is complete, change directory to the repo.

```
cd open-wc
```

# Preparing Your Local Environment for Development

Now that you have cloned the repository, run the following commands to set up the development environment.

```
yarn install
```

This will download and install all packages needed.

# Making Your Changes

Make your changes to the project. Commits are linted using precommit hooks, meaning that any code that raises linting error cannot be committed. In order to help avoid that, we recommend using an IDE or editor with an eslint plugin in order to streamline the development process. Plugins are available for all the popular editors. For more information see [ESLint Integrations](https://eslint.org/docs/user-guide/integrations)

# Committing Your Changes

Open WC uses [commitlint](https://github.com/marionebl/commitlint) to standardize commit messages in the project. Commit messages must follow the [conventional commit format](https://www.conventionalcommits.org/en/v1.0.0-beta.2/)
Open WC uses package name as scope. So for example if you fix a _terrible bug_ in the package `@open-wc/testing`, the commit message should look like this:

```
fix(testing): fix terrible bug
```
