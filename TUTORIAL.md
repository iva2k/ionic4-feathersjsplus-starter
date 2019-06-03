# ionic4-feathersjsplus-starter app Tutorial

Tutorial / step-by-step building of Ionic 4 app with FeathersJS+ backend services.

## Get Started - Step-by-Step Instructions

Create an app from scratch following these steps. See source code edits (you can check out commit for the current step) as you go on Github: [github.com/iva2k/ionic4-feathersjsplus-starter](https://github.com/iva2k/ionic4-feathersjsplus-starter)

### Step 1. Blank Ionic 4 app

_From <https://ionicframework.com/getting-started> ._

First, install [NodeJS](http://nodejs.org/). Then in a terminal / command line:

```bash
sudo npm install -g ionic cordova
mkdir ionic4-feathersjsplus-starter
cd ionic4-feathersjsplus-starter ;## Project root
mkdir server
mkdir client
cd client ;## From project root
ionic start ionic4-feathersjsplus-starter blank --type=angular
cd ionic4-feathersjsplus-starter
npm i -D -E @ionic/lab
```

Fix an error when running without cordova, in src/app/app.component.ts add guard ```if (this.platform.is('cordova')) { ... }``` around ```statusBar.styleDefault()``` and ```splashScreen.hide()```.

#### Client VSCode

```bash
cd client/ionic4-feathersjsplus-starter
code .
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
ionic serve -b
```

Alternatively see Github for setup in tasks.json file that launches ionic app.

Next, start debug with "Launch in Chrome" configuration (in launch.json file).

##### Android Device

For debugging in VSCode on Android device, see [this link](https://moduscreate.com/blog/ionic-cordova-debug-device-visual-studio-code/).

For Android emulator, either use Android Studio (latest has HW accelerated emulator) or see [this link](http://www.damirscorner.com/blog/posts/20170113-DebugIonic2AppsInVsEmulatorForAndroid.html),
it uses [Microsoft's Android Emulator](https://visualstudio.microsoft.com/vs/msft-android-emulator/). Windows 7 is not
supported by Hyper-V, "Hyper-V Platform" option is available only in > Windows 8.

Install Android Studio, download SDKs and make sure to install:

- Android SDK Build-Tools
- Android SDK Platform-Tools
- Android SDK Tools
- Google USB Driver (adb)
- Support Repository (Android Support Repository and Google Repository)
- Google Play Services

```bash
ionic cordova platform add android
```

To avoid issues in Cordova plugins (e.g. <https://github.com/EddyVerbruggen/cordova-plugin-googleplus/issues/478),>
patch file node_modules/cordova-android/bin/templates/project/build.gradle with code
(required since [11.2.0](https://developers.google.com/android/guides/releases#august_2017_-_version_1120)
see also [this link](https://developer.android.com/studio/build/dependencies#google-maven)):

```gradle
        maven {
            url "https://maven.google.com"
        }
```

into sections:

- buildscript { repositories { ... } }
- allprojects { repositories { ... } }

Note: this is a package file, will be overwritten upon updates.

To run on Android phone, plug in, and:

```bash
ionic cordova run android
```

Use  "Run android on device" configuration (in launch.json file) for debugging in VSCode.

##### IOS Device

```bash
ionic cordova platform add ios
```

See <https://moduscreate.com/blog/ionic-cordova-debug-device-visual-studio-code/>

#### Add side menu / tabs navigation

Ionic 4 starter "sidemenu" does not have tabs, and starter "tabs" does not have side menu. Both these patterns are needed for good UX, so we will do that.

It differs from Ionic 4 sidemenu starter, which does sidemenu on the app module level - we will use a separate menu module. It will be easier to do pages without side menu.

```bash
ionic g page pages/menu
ionic g page pages/tabs
```

Remove paths we won't need from src/app/app-routing.module.ts:

```js
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'tabs', loadChildren: './pages/tabs/tabs.module#TabsPageModule' },
```

And change default route '' to (we will keep home page for now, but insert it into the tabs):

```js
  { path: '', redirectTo: 'menu/app/home', pathMatch: 'full' },
```

See how to change the generated code of menu and tabs pages in github, and how to edit home.page.html to show a menu icon.

When growing the app, these are the points in code to insert into:

 1. Global and intital app routes (e.g. '', 'menu' and later we will add 'login') should go into Routes[] in src/app/app-routing.module.ts
 2. Routes from the menu (e.g. tabs and about pages) should go into Routes[] in src/app/pages/menu/menu.module.ts. We use routes like 'menu/app/tabs/home' or 'menu/app/about'.
 3. Menu entries should go into MenuPage.pages[] in src/app/pages/menu/menu.page.ts (menu.page.html will automatically show them on the menu).
 4. Routes for tabs that are shown on tabs page should go into Routes[] in src/app/pages/tabs/tabs.module.ts
 5. Tab buttons should be added to src/app/pages/tabs/tabs.page.html

Note: there is some obvious duplication of entries between menu and tabs for all tabbed pages. Perhaps a single module that describes all routes and menus can do a better job, maybe will do it later.

The solution has just one line in the menu and one tab, so it is hard to see how it works. Once we add more pages, it will be clear that it works well - menu and tabs are synchronized, thanks to Angular router.

#### Step 1 Summary

We created minimum functionality Ionic 4 app with side menu and tabs.

### Step 2. Add Feathers Client to Ionic 4

_Inspired by <https://berndsgn.ch/posts/observables-with-angular-and-feathersjs/> ._

```bash
npm install --save @feathersjs/client socket.io-client
npm install --save-dev @types/socket.io-client
npm install --save rxjs@6 rxjs-compat@6
ionic g service services/todos
ionic g module components ;## Common module for all shared components (it should be imported into every page where any of the components are used).
ionic g component components/todos --export --module=/src/app/components/components.module.ts ;## Somehow Ionic 4 and Angular 7 got "--export" broken without "--module" with full path to the file. Argh!
ionic g interface models/todo
```

See code edits in the generated files (see code on Github):

- src/app/components/components.module.ts
- src/app/components/todos/todos.component.html (.component.scss not changed)
- src/app/components/todos/todos.component.ts (.spec.ts not changed)
- src/app/services/todos.service.ts (.spec.ts not changed)
- src/app/models/todo.ts

Modify src/app/app.module.ts to load the service (see code on Github).

Modify src/app/home.module.ts to import components.module and src/app/home.html to use \<app-todos/\> component (see code on Github).

#### Step 2 Summary

With all the source code in place, but no server running, the app fills a few dummy items into the Todo list. This will be changed in the next section.

### Step 3. Create Feathers server

_From Feathers guide <https://docs.feathersjs.com/guides/chat/readme.html> with changes for TypeScript and Feathers+ generator._

We will use Feathers+ generator, see <https://generator.feathers-plus.com:> instead of ```feathers generate ...``` we will do ```feathers-plus generate ...```, so any existing tutorials can be used. BTW, according to the [FeathersJS blog](https://blog.feathersjs.com/feathers-2019-new-years-news-f478d5f2c8cd), Feathers+ is scheduled to move into mainline FeathersJS in Crow release.

```bash
npm i -g @feathers-plus/cli
cd server ;## From project root
mkdir api
cd api
feathers-plus generate options
```

Answer some questions:

```feathers-plus
? Generate TypeScript code? Yes
? Use semicolons? Yes
? View module changes and control replacement (not recommended)? No
```

```bash
feathers-plus generate app
```

Answer some questions:

```feathers-plus
? Project name: api
? Description:  Feathers api server
? What folder should the source files live in? src
? Which package manager are you using (has to be installed globally)? npm
? What type of API are you making? REST, Realtime via Socket.io
? Data mutating tests and seeding may run when NODE_ENV is one of (optional) ()
```

Notes:

1. Feathers-plus requires NodeJS v10. However, there is some unresolved bug in feathers-plus dependencies - it hangs under Node 10 on Windows 7 & 10 ([see the issue](https://github.com/feathers-plus/generator-feathers-plus/issues/103)). Install node 8 (e.g. node-v8.11.2-x64.msi) and use [nvm-windows](https://github.com/coreybutler/nvm-windows) to switch to Node 8 for feathers-plus until the issue is resolved.
2. feathers-plus has an [issue](https://github.com/feathers-plus/cli/issues/38) with changing source files folder from the default 'src' - some entries remain 'src'. So we won't change the default.
3. app.configure() has been removed in express 4 (actually, kept until 4.16.0 and deleted in 4.16.6 of @types/express-serve-static-core), see [issue](https://github.com/feathersjs/feathers/issues/1090). Further, feathersjs app.configure() polyfill calls the callback with two arguments instead of one. That causes some issues with TypeScript compilation:

   a. Right after ```feathers-plus generate app``` command ```npm start``` fails in TypeScript compilation (App declaration without services does not compile with error TS2345 in src/app.ts / tried with node-v10.15.3-x64.msi and node-v8.11.2-x64.msi). Adding first service seems to rectify that problem.

   b. Adding 'todos' service resolves #a, but command ```npm start``` still fails, now in TypeScript compilation of todos.service configure call (this, app) vs. (app) function types. Pinning express and express-serve-static-core versions to 4.16.0 helps:

Until the [Feathers+ issue #37](https://github.com/feathers-plus/cli/issues/37) is resolved, pin older version of express:

```bash
npm i -D @types/express-serve-static-core@4.16.0
```

To start server:

```bash
npm start
```

To run tests:

```bash
npm test
```

Now let's create a backend service using Feathers to respond to the client in the Ionic app. Call the command and answer some questions:

```bash
feathers-plus generate service
  ? What is the name of the service? todos
  ? What would you call one row in the todos database? todo
  ? What kind of service is it? NeDB
  ? Place service code in which nested folder, e.g. `v1/blog`? (optional)
  ? Which path should the service be registered on? /todos
  ? Should this be served by GraphQL? Yes
  ? What is the database connection string? nedb://../data
```

(Skip authentication service in the source guide for now)

Add hooks to check and fulfill the incoming data:

```bash
feathers-plus generate hook
  ? What is the name of the hook? process-todo
  We will be adding the new hook processTodo in file process-todo.
  ? The hook will be used with  One service (src/services/*/hooks/)
  ? Which service will this hook be used with? todos
```

Edit the generated files (see code on Github).

#### Server VSCode

VSCode support for node.js TypeScript debugging has improved (see <https://code.visualstudio.com/docs/nodejs/nodejs-debugging>), so the tricks used in the past are not needed.

Also ts-node has lost ```--inspect-brk``` parameter, and "start" script generated by Feathers+ in package.json does not work with debugger.

```bash
cd server/api
code .
```

Create ```launch.json``` file for VSCode project in the app's server/api directory (use VSCode shortcuts in Debug ribbon):

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch via NPM",
      "type": "node",
      "request": "launch",
      "runtimeArgs": [
        "-r",
        "ts-node/register"
      ],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "stopOnEntry": false,
      "env": {
        "TS_NODE_FILES": "true"
      },
      "args": [
        "${workspaceFolder}/src/index.ts"
      ]
    },

```

To debug mocha tests in VSCode, use the following configuration:

In package.json "scripts" section:

```json
    "test:debug": "npm run clean && cross-env NODE_ENV=test npm run mocha -- --recursive",
    "clean": "",
```

in launch.json:

```json
{
    "version": "0.2.0",
    "configurations": [
    ...
        {
            "name": "Test All",
            "type": "node",
            "request": "launch",
            "runtimeExecutable": "npm",
            "runtimeArgs": [
                "run",
                "test:debug",
                "--"
            ],
            "console": "integratedTerminal",
            "internalConsoleOptions": "neverOpen",
            "stopOnEntry": false,
            "timeout": 120000
        },
```

Mocha does not have the hiccup on the appended "--inspect-brk" parameter, so no "args" trick is needed.

Note that ts-mocha returns an error code when running under VSCode debugger, even when tests all pass - something annoying, but cursory searches did not reveal any known issues.

## END
