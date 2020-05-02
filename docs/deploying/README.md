---
permalink: 'deploying/index.html'
title: Deploying
section: guides
tags:
  - guides
---

# Deploying

To deploy your Web Component we recommend [netlify](https://www.netlify.com/).

- It's free
- It's easy
- It provides previews for every PR
- It supports custom domains

## Manual Setup

Head over to [netlify](https://www.netlify.com/) and register.
Select your github account and repository.
If you follow these recommendations all you need to do is

- Build command: `npm run build`
- Publish directory: `dist`

And you're all set up.

## Example

The [Set-Game Example](https://github.com/open-wc/example-vanilla-set-game/) deploys its storybook to netlify in this way.
You can see the finished page here: [https://example-set-game-open-wc.netlify.com/](https://example-set-game-open-wc.netlify.com/).

## Serving With Apache HTTP Server

If you're using our [build configuration](http://open-wc.org/building), the `dist` directory created by the `npm run build` command can be deployed on any local web server. These directions are for the [Apache HTTP Server](http://httpd.apache.org/) specifically, but should be adaptable to other web servers.

- Build command: `npm run build`
- Copy the `dist` directory to your desired location: `sudo cp -R dist /Library/WebServer/Documents/myapp`
- Add a `<VirtualHost>` directive to `httpd.conf`, either directly or by an `Include` directive:

```
<VirtualHost *:80>
    DocumentRoot "/Library/WebServer/Documents/myapp"
    ServerName mypwa.localhost
    Alias "/mypwa" "/Library/WebServer/Documents/myapp"
    <Directory "/Library/WebServer/Documents/myapp">
      Options -Indexes
      AllowOverride None
      Require all granted
    </Directory>
</VirtualHost>
```

- Restart Apache: `sudo /usr/sbin/apachectl restart`
- Open the page in your browser using the URL `http://mypwa.localhost/`

If the app was built to support [legacy browsers](https://open-wc.org/building/building-rollup.html#supporting-older-browsers), the `dist` directory will include the subdirectories `legacy` and `polyfills`, and legacy browsers such as Internet Explorer 11 will be served suitable content.
