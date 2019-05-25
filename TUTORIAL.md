# ionic4-feathersjsplus-starter app Tutorial

Tutorial / step-by-step building of Ionic 4 app with FeathersJS+ backend services. 

# Get Started - Step-by-Step Instructions

Create an app from scratch following these steps. See source code edits (you can check out commit for the current step) as you go on Github: [github.com/iva2k/ionic4-feathersjsplus-starter](https://github.com/iva2k/ionic4-feathersjsplus-starter)

## Step 1. Blank Ionic 4 app

_From https://ionicframework.com/getting-started ._

First, install [NodeJS](http://nodejs.org/). Then in a terminal / command line:

```bash
$ sudo npm install -g ionic cordova
$ mkdir ionic4-feathersjsplus-starter
$ cd ionic4-feathersjsplus-starter
$ mkdir server
$ mkdir client
$ cd client
$ ionic start ionic4-feathersjsplus-starter blank --type=angular
$ cd ionic4-feathersjsplus-starter
```

Fix an error when running without cordova, in src/app/app.component.ts add guard ```if (this.platform.is('cordova')) { ... }``` around statusBar.styleDefault() and splashScreen.hide().

### VSCode

```bash
$ cd client/ionic4-feathersjsplus-starter
$ code .
```

To debug Ionic 4 app using **VSCode**, see [this link](http://www.damirscorner.com/blog/posts/20161122-DebuggingIonic2AppsInChromeFromVisualStudioCode.html). 

Create ```launch.json``` file for VSCode project in the client/ionic4-feathersjsplus-starter\.vscode\ directory (can use VSCode shortcuts in Debug ribbon):

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch in Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:8100",
      "sourceMaps": true,
      "webRoot": "${workspaceRoot}/www"
    }
  ]
}
```

For debugging, first, run in the VSCode terminal:

```bash
$ ionic serve -b
```

Alternatively see Github for setup in tasks.json file that launches ionic app.

Next, start debug with "Launch in Chrome" configuration.

##END