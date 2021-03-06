# ionic4-feathersjsplus-starter app Tutorial

Tutorial / step-by-step building of Ionic 4 app with FeathersJS+ backend services.

A bit of a warning: this tutorial is very dense and maybe not suitable for beginners. It does not direct you to each and every edit in the source files, but instead expects you to review code edits on Github (if you clone the repo, you can open the log and review the edits step-by-step).

Also, some issues are encountered and resolved along the way. Only cursory explanation is given and links to the issue are given if available. By no means these will be the only issues, as all used packages and projects evolve rapidly, some issues are fixed and other are created.

## Get Started - Step-by-Step Instructions

Create an app from scratch following these steps. See source code edits as you go on Github: [github.com/iva2k/ionic4-feathersjsplus-starter](https://github.com/iva2k/ionic4-feathersjsplus-starter)

### Step 1. Blank Ionic 4 App

_From <https://ionicframework.com/getting-started> ._

First, install [NodeJS](http://nodejs.org/). Alternatively, install nvm (or nvm-windows) and use ```nvm install latest``` command to download and install latest NodeJS version. nvm can switch between multiple node versions.

Then in a terminal / command line:

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

(Note: You can start and leave 2 instances of VSCode - one for the client, and one for the server, shown later)

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
npm i -g native-run
```

To avoid issues in Cordova plugins (e.g. <https://github.com/EddyVerbruggen/cordova-plugin-googleplus/issues/478>),
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

Note: If issue in Ionic native-run is encountered, add to the configuration "Run android on device" in launch.json:

```json
      ...
      "runArguments": [ "--no-native-run" ]
```

Once the server is working (done in the ubsequent steps), you will notice that the app running on Android 9 won't connect to the server running on another host (which is most likely will be the case). The error is net::ERR_CLEARTEXT_NOT_PERMITTED, which means that <http://> is not allowed, must use <https://>.

Though it is possible to move Feathers server to https (see later sections), for debugging we need something simpler.

Edit the file "./resources/android/xml/network_security_config.xml" and change it to:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
</network-security-config>

```

Which will be setting security very low, like it was prior to Android 9.

Note that this edit is intended only for develeopment / debugging and should be reverted for production.

(see <https://developer.android.com/training/articles/security-config> for more details)

##### IOS Device

```bash
npm i -g cordova-res
ionic cordova platform add ios
```

See <https://moduscreate.com/blog/ionic-cordova-debug-device-visual-studio-code/>

##### Browser / PWA App

Install cordova browser platform, it will let run many cordova plugins on the browser.

```bash
ionic cordova platform add browser
ionic build --cordova --platform=browser
```

#### Desktop App (Electron)

Electron supports Desktop platforms (Windows, MacOS, Linux), and can be added as a wrapper to Ionic/Cordova apps.

Before Cordova v8.x Electron had to be added on top of cordova browser platform. Cordova 8.x includes Electron platform, which does all necessary integration.

Notice: If using Cordova CLI prior to version 9.x, you will need to use the "cordova-electron" argument instead of "electron" for any command that requires the platform's name. Conversely, for Cordova CLI version 9.x and later, use "electron" platform instead of "cordova-electron".

```bash
ionic cordova platform add electron
ionic cordova build electron
```

The resulting executable and installer is at ./platforms/electron/build/.

For more details see <https://github.com/apache/cordova-electron/blob/master/DOCUMENTATION.md>.

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

### Step 3. Create Feathers Server

_From Feathers guide <https://docs.feathersjs.com/guides/chat/readme.html> with changes for TypeScript and Feathers+ generator. Also see <https://medium.com/feathers-plus/feathers-plus-cli-5c7ba0015e8e> ._

We will use Feathers+ generator, see <https://generator.feathers-plus.com:> instead of ```feathers generate ...``` we will do ```feathers-plus generate ...```, so any existing tutorials for FeathersJS can be used. BTW, according to the [FeathersJS blog](https://blog.feathersjs.com/feathers-2019-new-years-news-f478d5f2c8cd), Feathers+ is scheduled to move into mainline FeathersJS in Crow release.

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
? Data mutating tests and seeding may run when NODE_ENV is one of (optional) development,test
? Seed data records on startup when command line includes --seed? Yes
```

Notes:

1. Feathers-plus requires NodeJS v10. However, there is some unresolved bug in feathers-plus dependencies - it hangs under Node 10 on Windows 7 & 10 ([see the issue](https://github.com/feathers-plus/generator-feathers-plus/issues/103)). Install node 8 (e.g. node-v8.11.2-x64.msi) and use [nvm-windows](https://github.com/coreybutler/nvm-windows) to switch to Node 8 for feathers-plus until the issue is resolved.
2. Feathers-plus has [cli issue#38](https://github.com/feathers-plus/cli/issues/38) with changing source files folder from the default 'src' - some entries remain 'src'. So we won't change the default.
3. Feathers-plus has [generator issue#276](https://github.com/feathers-plus/generator-feathers-plus/issues/276) - TypeScript compilation error TS2345 in src/app.ts and error in todos.service configure call (this, app) vs. (app) function types.

Edit server/api/src/app.interface.ts to fix it:

```js
-import { Application } from '@feathersjs/express';
+import { Application } from '@feathersjs/feathers';
```

(Note that re-running the ```feathers-plus generate``` will erase the edit).

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

Also ts-node had lost ```--inspect-brk``` parameter, and "start" script generated by Feathers+ in package.json does not work with debugger.

```bash
cd server/api
code .
```

(Note: You can start and leave 2 instances of VSCode - one for the client, shown above, and one for the server)

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
    "test:all"        : "npm run tslint && cross-env NODE_ENV=test npm run mocha",
    "test:debug"      : "npm run test:clean && cross-env NODE_ENV=test npm run mocha -- --recursive",
    "test:clean": "",
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
            "timeout": 20000
        },
```

Mocha does not have the hiccup on the appended "--inspect-brk" parameter, so no "args" trick is needed.

Note that ts-mocha returns an error code when running under VSCode debugger, even when tests all pass - something annoying, but cursory searches did not reveal any known issues.

#### Step 3 Summary

With the api project in place, we have server running. With all the added source code, the app fetches some todo items from the server. The list on the server is empty - we will need to seed some auto-generated data, which will do in the next sections.

### Step 4. Improve Server Tests and Add Data Seeder

#### Test Coverage

Let's implement measurement of test coverage using nyc/istanbul.

```bash
npm install shx nyc source-map-support @istanbuljs/nyc-config-typescript --save-dev
```

We need to wipe out test data and call nyc to measure coverage. Add to "scripts" section in package.json:

```json
    "test:clean": "shx rm -rf test/data",
    "coverage": "npm run test:clean && cross-env NODE_ENV=test nyc npm run mocha && nyc report --reporter=html",
```

Add new section to package.json:

```json
  "nyc": {
    "extends": "@istanbuljs/nyc-config-typescript",
    "check-coverage": false,
    "watermarks": {
      "lines": [70, 95],
      "functions": [70, 95],
      "branches": [70, 95],
      "statements": [70, 95]
    }
  },
```

(Configuration is extending recommended nyc TypeScript settings that can be reviewed at <https://github.com/istanbuljs/istanbuljs/blob/master/packages/nyc-config-typescript/index.json>)

We can change "check-coverage" to "true" later, when coverage is improved, so we can keep enforcing good coverage.

Let's run coverage to see where we are before any more tests are added:

```bash
npm run coverage
```

Open the report file [server/api/coverage/index.html](./server/api/coverage/index.html) in a browser to see nicely formatted results.

#### Setup Environment

Let's add proper production, test and development environments.

If not done already, add "development" and "test" environments to allow data seeding, to do so regenerate the app and enter "development,test" as environments where data mutating and seeding is allowed, also choose "yes" for --seed:

```bash
feathers-plus generate app
 ? Which package manager are you using
   (has to be installed globally)? npm
 ? What type of API are you making?
  REST, Realtime via Socket.io
 ? Data mutating tests and seeding may run when NODE_ENV is one of (optional) development,test
 ? Seed data records on startup when command line includes --seed? Yes
```

It will change feathers-gen-specs.json and modify relevant files:

```json
  "app": {
    "environmentsAllowingSeedData": "development,test",
    "seedData": true,
```

Add / modify "scripts" section in package.json:

```json
    "dev"             : "cross-env NODE_ENV=development nodemon src/index.ts",
    "dev:seed"        : "cross-env NODE_ENV=development nodemon src/index.ts --seed",
    "start"           : "cross-env NODE_ENV=production  ts-node --files src/",
    "start:seed"      : "cross-env NODE_ENV=development ts-node --files src/ --seed",
    "start:dev"       : "cross-env NODE_ENV=development ts-node --files src/",
    "start:test"      : "cross-env NODE_ENV=test        ts-node --files src/",
    "start:test:seed" : "cross-env NODE_ENV=test        ts-node --files src/ --seed",
```

Make sure all config files exist in server/api/config/: development.json, test.json, production.json (see their contents on Github).

#### More Tests

Let's implement some additional tests and improve how tests are performed.

The referenced guide provides unit tests, expanding the tests created by the generator. Though they are good to test individual isolated hooks, the effort is almost wasted on unit tests, as there are hook inter-dependencies and hook insertion that is not tested, so we will need integration tests. It will drastically increase code coverage and make more robust regression tests.

The feathers+ generator can generate unit tests and integration tests, which we will use. There are also some great articles on testing:

  1. <https://medium.com/feathers-plus/fake-data-with-feathers-plus-cli-e668b0e16a8>
  2. <https://medium.com/feathers-plus/automatically-seeding-data-with-feathers-plus-cli-336302adfe3>
  3. <https://medium.com/feathers-plus/automatic-tests-with-feathers-plus-cli-4844721a29cf>
  4. <https://blog.usejournal.com/use-decision-tables-to-write-better-tests-faster-835b18906cf8?sk=d464c55af3b7bb4be795794afaa86247>

Making system/integration hook tests is chosen here as most practical and high ROI change. Also we'll fix some issues between feathers-plus generate and Mocha.

Use in-memory DB to improve test runtime preformance:

```bash
npm install feathers-memory --save-dev
```

See in-memory DB use in: <https://docs.feathersjs.com/guides/chat/testing.html>

Note: feathers-memory service uses 'id' field name by default, while database-backed services typically use '_id' field name. It creates bugs in tests with in-memory services. Good practice is to force all services to use the same id field, '_id' is preferred in this project.

We will also create integration tests:

```bash
feathers-plus generate test
  ? Which kind of test is required? hook - integration (tested using a fake service)
  ? Which hook is being tested? todos/hooks/process-todo.ts
       skip test\services\todos\hooks\process-todo.integ.test.ts
     create test\services\todos\hooks\process-todo.integ.test.ts
```

See code edits on Github. In the edits notice how we made few improvement compared to the generated code. beforeEach() and it() tests should be either async, call done(), or promises can be returned. Generator does not always do that, so we have to manually fix those.

#### Data Seeder

Let's add data seeder for tests and development.

Add properties to server/api/src/services/todos/todos.schema.ts (see code on Github).

See all possible faker data patterns: <https://github.com/marak/Faker.js>

Finally regenerate faker data:

```bash
feathers-plus generate fakes
```

Look at the generated fake data in server/api/seeds/fake-data.js (not saved to Github as it is always regenerated).

#### Step 4 Summary

With all the added source code in place, the app fetches some todo items from the server. These items are auto-generated by the seeder, which will be changed in the next sections.

### Step 5. Create User Registration and Authentication on the Server Side

_From the Feathers guide <https://docs.feathersjs.com/guides/chat/authentication.html> ._

Now let's create a backend authentication service using Feathers+ to respond to the client in the Ionic app. Call the command and answer some questions:

```bash
$ feathers-plus generate authentication
  ? What authentication providers do you want to use? Other PassportJS strategies not in this list can still be configured manually. Username + Password (Local), Google, Facebook
  ? What is the name of the user (entity) service? users
    We are adding the new service users in dir api
  ? What would you call one row in the users database? user
  ? What kind of service is it? NeDB
  ? Place service code in which nested folder, e.g. `v1/blog`? (optional)
  ? Which path should the service be registered on? /users
  ? Should this be served by GraphQL? Yes
```

Start the server in one terminal:

```bash
npm run start:dev
```

If you get a TS2339 error on ```app.service('authentication').hooks({...``` in authentication.ts, add an import statement at the top and change the line with the error to:

```js
import { Service } from '@feathersjs/feathers';

...

  let service: Service<any> = app.service('authentication');
  service.hooks({
    ...
```

(There is an ongoing issue in TypeScript on type refinements, e.g. <https://github.com/Microsoft/TypeScript/issues/12176>, <https://github.com/microsoft/TypeScript/issues/11498>, <https://github.com/microsoft/TypeScript/issues/24445>).

In another terminal create the user:

```bash
curl "http://localhost:3030/users/" -H "Content-Type: application/json" --data-binary "{ \"email\": \"feathers@example.com\", \"password\": \"secret\" }"
```

Then get JWT token:

```bash
curl "http://localhost:3030/authentication/" -H "Content-Type: application/json" --data-binary "{ \"strategy\": \"local\", \"email\": \"feathers@example.com\", \"password\": \"secret\" }"
```

The server will respond with "accessToken". It is just a demo of how it works.

Now we need to secure existing services (e.g. 'todos'). In server/api/src/services/todos/todos.hooks.js add/change these lines:

```js
import { hooks } from '@feathersjs/authentication';

module.exports = {
  before: {
    all: [ hooks.authenticate('jwt') ],
```

All sources are provided on Github, see below summary of changes at the end of this section.

#### Add a user avatar (using Gravatar)

_From the Feathers guide <https://docs.feathersjs.com/guides/chat/processing.html>._

```bash
$ feathers-plus generate hook
  ? What is the name of the hook? gravatar
  ? The hook will be used with  One service (src/services/*/hooks/)
  ? Which service will this hook be used with? users
```

We will also create integration tests for the hook:

```bash
feathers-plus generate test
  ? Which kind of test is required? hook - integration (tested using a fake service)
  ? Which hook is being tested? users/hooks/gravatar.ts
```

Copy the code from Github to server/api/src/services/users/hooks/gravatar.ts, server/api/test/services/user/hooks/gravatar.unit.test.ts and server/api/test/services/user/hooks/gravatar.integ.test.ts

#### Populate the Todo Creator

```bash
$ feathers-plus generate hook
  ? What is the name of the hook? populate-user
  ? The hook will be used with  One service (src/services/*/hooks/)
  ? Which service will this hook be used with? todos
```

We will also create integration tests for the hook:

```bash
feathers-plus generate test
  ? Which kind of test is required? hook - integration (tested using a fake service)
  ? Which hook is being tested? todos/hooks/populate-user.ts
```

Copy the code from Github to server/api/src/services/todos/hooks/populate-user.ts, server/api/test/services/todos/hooks/populate-user.unit.test.ts and server/api/test/services/todos/hooks/populate-user.integ.test.ts

#### Fix / Add More Tests

See the sources on Github. The changes add test cases and improve generated code.

#### Code Summary

There are a lot of small edits and some new files that the generator does, and code is edited throughout:

- server/api/feathers-gen-spec.json
- server/api/package.json
- server/api/config/default.json
- server/api/src/app.ts
- server/api/src/authentication.ts
- server/api/src/channels.ts
- server/api/src/logger.ts
- server/api/src/models/users.model.ts
- server/api/src/services/index.js
- server/api/src/services/todos/todos.{hooks|interface|mongo|mongoose|schema|service|sequelize|validate}.ts
- server/api/src/services/todos/hooks/populate-user.ts
- server/api/src/services/todos/hooks/process-todo.js
- server/api/src/services/users/users.{hooks|interface|mongo|mongoose|schema|service|sequelize|validate}.ts
- server/api/src/services/users/hooks/gravatar.js
- server/api/tests/services/todos.test.js
- server/api/tests/services/users.test.ts
- server/api/tests/services/todos/hooks/populate-user.{unit|integ}.test.js
- server/api/tests/services/todos/hooks/process-todo.{unit|integ}.test.js
- server/api/tests/services/users/hooks/gravatar.{unit|integ}.test.js

### Step 5 Summary

With all the added source code in place, the server now has authentication service, covered by automatic tests. Some users are auto-generated by the seeder. The app is refused connection due to lack of authentication (though it will show a list of dummy todos). The services will be connected to the app in the next sections.

### Step 6. Create User Login in the App

Let's refactor todos service - move Feathers client into a new service, so the client has a single service / API connection for all various data services we will need from Feathers backend.

```bash
cd client/ionic4-feathersjsplus-starter
ionic generate service services/Feathers
```

See code on Github for the edits of generated src/app/services/feathers.service.ts file and changes to existing files:

- src/app/app.module.ts (added service / ionic generate does not inject it for us)
- src/app/services/todo/todo.service.ts (refactored to use FeathersService)

Ionic 4 uses Angular routing with route guards, which make the app authentication logic quite simple.

We will need 2 services for route guards:

- AuthGuard - when not logged in, redirect from app pages to a login page
- NonauthGuard - when logged in, redirect from the login page to app pages

```bash
ionic generate service services/auth-guard
ionic generate service services/nonauth-guard
```

When redirecting to the login page in the AuthGuard the path is saved into query parameter retUrl, which the login page will redirect to after login/registration.

See code on Github for the edits of generated src/app/services/{non}auth-guard.service.ts files.

We also need to refactor menu page to allow items with commands (e.g. "logout"), as well as page url's on the menu. See code on Github for the edits.

Next, we will create login/registration page and use Feathers client authentication.
We will also add some guards to redirect pages that require auth to the login page.

```bash
ionic generate page pages/login
```

See code on Github for the edits of generated src/app/pages/login/ files and changes to existing files:

- src/app/app.module.ts (added guard services / ionic generate does not inject it for us)
- src/app/app-routing.module.ts (added guards to routes)
- config.xml (added \<preference name="KeyboardDisplayRequiresUserAction" value="false" /\> to allow keyboard)
- src/app/pages/menu/menu.ts (logout implementation)
- src/app/services/feathers.service.ts (login and registration functionality)

#### Step 6 Summary

With all the added source code in place, the app is using the backend authentication service - login and registration functions. The app will show all todos by all users. The todos create and edit functions will be added to the app in the next sections.

### Step 7. Create Todo Items from the App and Update Todos List Dynamically

First we will refactor a bit:

 1. Rename 'HomePage' to 'TodosListPage' class and file names and all related strings in the code.
 2. Rename src/app/components/todos/todos.* files and move to src/app/components/todos-list/todos-list.* (use component-todos-list selector to avoid conflict with app-todos-list selector in TodosListPage).

Next we will implement new features to view, edit and add todo items:

```bash
npm install --save clone-deep deep-object-diff
ionic generate component components/TodoItem
ionic generate page pages/TodoDetail
```

Note: TypeScript definitions for clone-deep exist in '@types/clone-deep', but fail compilation with "has no default export".

See code on Github for the edits of generated src/app/components/todo-item and src/app/pages/todo-detail/ files and changes to existing files:

- src/app/components/todos-list/todos-list.component.html, src/app/components/todos-list/todos-list.component.ts ("Edit" button)
- src/app/pages/todos-list/todos-list.page.html, src/app/pages/todos-list/todos-list.page.ts ("Add" button and "Edit" button click)
- src/app/services/feathers/feathers.service.ts (Implemented DataSubscriber)

#### DataSubscriber

DataSubscriber is added to FeathersService - it is a very powerful wrapper on top of Feathers client. It makes a breeze to use Feathers in list and detail components and views.

To showcase DataSubscriber, we will refactor TodosListComponent to use DataSubscriber instead of TodoService. It will illustrate how much simpler the code becomes, mostly due to no need to generate more custom services like TodoService for each data service, instead using in essence a service factory. See the below code snippet and full code of DataSubscriber in src/app/services/feathers.service.ts on Github.

First, we will remove TodoService, and avoid all further individual services that we might need if we continue using the pattern like TodoService.

Next we will modify TodosListComponent code to look like this:

```ts
  ...
  public ngOnInit(): void {
    this.subscription = this.feathersService.subscribe<Todo>('todos', {
        $sort: {createdAt: -1},
        $limit: 25
      },
      (todos: Todo[]) => { // cbData
        this.todos = todos;
        this.ref.markForCheck();
      },
      err => { // cbErr
        console.error('Error in FeathersService.subscribe(): ', err);
      });
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
```

FeathersService.subscribe() takes:

- data model type, e.g. \<Todo\>,
- the name of the data service (e.g. 'todos'), and
- a query object (anything that Feathers accepts),
  
and it creates:

- a service on the fly,
- subscribes to its observable, and
- connects it to our callbacks (cbData and cbErr),

All that is done in few lines of code in ```ngOnInit()```.

And ```ngOnDestroy()``` makes sure that subscription is properly removed.

List views and detail views can both use this simple pattern. Though we still
have individual components for todos-list and todo-detail, it is possible to
create two universal components (list and detail) based on this pattern, and
customize them for any data table / service through their parameters. This is left as an exercise to keep this project small.

#### Performance

We should be always mindful about the app performance. We already use Ionic's lazy loading, so only smaller chunks of the app are downloaded from the server as needed.

We also utilized "ChangeDetectionStrategy.OnPush" with explicit calls to ChangeDetectorRef.markForCheck() in the components, so we instruct Angular engine that it does not need to scan for changes upon every network activity, but instead each component issues data update calls only when necessary.

These performance improvements are cumulative and will be more noticeable as the app grows in size.

#### Wrapping up

We only wired few command buttons so far, but did not complete the worker code. We will wrap up few things, like saving updated and created todo items, and deleting them. See the code on Github for final changes.

#### Step 7 Summary

With all the added source code in place, the app has all functions to create, edit and delete todo items, once the user registers or logs in.

### Step 8. Improvements

We can make a lot of small and big improvements. Not in any particular order...

(Check Github commits for changesets)

- [UX] Convert "Add" button on TodosListPage to material style FAB (floating action button)
- [UX] Add "Delete" button to TodosListPage items
- [UX] Implement Toast for completed actions/commands
- [UX] Move buttons on TodosListPage into slide drawers / swipe
- [UX] Show created date/time on TasksListPage
- [UX] TasksListPage - show avatar, improve layout
- [UX] TaskDetailPage - show avatar, improve layout
- [UX] Update button on TodoDetailsPage returns to the list if entries are unchanged
- [UX] Annotate input fields for keyboard domain (e.g. type="email", "password", "tel", "date", etc.)
- [Misc] Create User model, cleanup LoginPage
- [UX] Focus on first form field upon entry (LoginPage, TodoDetailPage: added #entryFocus)
- [Misc] Add extended fields to user & todo models
- [UX] LoginPage validators (FormBuilder example), styling, field icons
- [UX] TodoDetailPage validators (Template example), styling, form buttons
- [UX] Form default/submit button on LoginPage, TodoDetailPage (workaround for Ionic4 issue <https://github.com/ionic-team/ionic/issues/15682>)
- [Server] Reorganize config files, use dotenv to load server/api/config/private.env (copy and customize private.env.template, do not store private.env in git!), see <https://codingsans.com/blog/node-config-best-practices>
- [Server] Add Gravatar configuration parameters
- [Server] Server writes local IP address to client/.../www/assets/server.json file, and client app reads it for finding server on local netowrk.
- [Client] routerLink fixes and improvements
- [Client] Catch-all default routes
- [Server] Compact NeDB (periodic - autocompaction setting in config or startup only).

### Step 9. GraphQL Service

With Feathers+ CLI it is easy to add GraphQL endpoint
(see <https://medium.com/@mattchewone/graphql-with-feathersjs-4cc67e785bd>).

Some edits in {service}.schema.ts files may be necessary, especially 'add' section should show foreign keys:

```js
...
let extensions = {
  // GraphQL generation.
  graphql: {
    ...
    add: {
      // !code: graphql_add
      ...
      todos: { type: '[Todo!]', args: false, relation: { ourTable: '_id', otherTable: 'userId' } },
      // !end
    },

```

After filling in {user|todo}.schema.ts files (see code on Github), run the following command and answer some questions:

```bash
feathers-plus generate graphql
 ? How should Queries be completed? Using BatchLoaders.
 ? Which path should the service be registered on? /graphql
 ? Does the service require authentication? Yes
 ? Will you be using only the fgraphql hook, not the service? No
```

Note: We chose "BatchLoaders" for completing the queries, which speeds up performance significantly over the "Using standalone Feathers service calls." option, though "standalone Feathers service calls" are also possible. It is easier to implement standalone service calls and you could start wth that, and later switch to batch loaderrs, or even SQL statements when performance improvements are needed.

To try it out, start the server:

```bash
npm start
```

If you get a TS2339 error on ```service.hooks({...``` in graphql.service.ts, similar to one in Step 5, add an import statement at the top and change the line with the error to:

```js
// !code: imports
import { Service } from '@feathersjs/feathers';
// !end

...

  let service: Service<any> = app.service('/graphql');
  service.hooks({
    ...
```

The above import stays, but the code edit, unfortunately, is removed each time you re-generate graphql or the app, so it has to be re-enetered.

If you get few TS2339 errors in batchloader.resolvers.ts "Property 'find/get' does not exist on type 'never'.", edit the file and add ```: Service<any>``` to the service variables, remove "\<DEFAULT>" tag in the comment:

```js
import { Service } from '@feathersjs/feathers';
...
  // !code: services
  let todos: Service<any> = app.service('/todos');
  let users: Service<any> = app.service('/users');
  // !end
```

Unfortunately, this fix hampers the feathers-plus generator ability to automatically add more services when re-generating, but keeping the "\<DEFAULT>" tag will remove the edits upon re-generation.

Another type error (mostly due to TypeScript inability to match complex types) is fixed by an edit that adds ```... as any``` at the end of the statements (and removing "\<DEFAULT> tags):

```js
  let returns: FGraphQLResolverMap = {

    Todo: {

      // user: [User!]
      // !code: resolver-Todo-user
      user: getResult('Todo.user', 'userId', true) as any,
      // !end
    },

    User: {

      // todos: [Todo!]
      // !code: resolver-User-todos
      todos: getResult('User.todos', '_id', true) as any,
      // !end
    },
```

There is an open [issue](https://github.com/feathers-plus/graphql/issues/18) on the
npm warning about peer dependency of graphql-tools in join-monster-graphql-tools-adapter.
This warning can be ignored, as there's no real need for an older graphql-tools version.

Install and run GraphiQL app <https://github.com/skevy/graphiql-app> to browse the GraphQL endpoint at <http://localhost:3030/graphql>, and enter the query:

```GraphQL
{
  getUser(key: "xxx") {
    _id
    email
  }
}
```

You should get an error with "No auth token". We won't spend time now to get through the authentication part and leave it as an exercise.

If you get an error "Schema must be an instance of GraphQLSchema. ...", it may be due to mismatched graphql package versions in the dependency tree. Stop the server, run commands:

```bash
npm install graphql@^0.11.7 --save
npm dedupe
npm start
```

(see the [issue](<https://github.com/feathers-plus/generator-feathers-plus/issues/247>))

With GraphQL we get very useful facility for free - populating relational data. Feathers+ generates *.populate.ts hook file for each service that has GraphQL enabled
(Note that ```feathers-plus generate graphql``` does not write the *.populate.ts files, but ```feathers-plus generate all``` does).  All we need to do is insert each of the populate hooks into service hooks.ts file.
With that, we can remove populate-user hook from todos service.

Note that *.populate.ts always puts relational data into an array, even if it is a single-to- relationship, so todos.user on the client-side and in tests should change to todo.user[0].

See code on Github for the "populate" hook edits.

#### Step 9 Summary

Though we don't use GraphQL in our client app, we now have a GraphQL endpoint that could be usefull for other implementations.

### Step 10. Authentication Management

_Based on <https://blog.feathersjs.com/how-to-setup-email-verification-in-feathersjs-72ce9882e744>._

Modern apps and services require management of user authentication. Some of the necessary features:

- Confirm email
- Reset forgotten password
- Change account information
- Two-factor authentication (2FA)

Just sending emails requires some of the biggest items for any app:

- Email service
- Email sender
- Email formatter
- Email templates system
- Email styling
- Dealing with security restrictions and serious HTML/CSS limitations of all email clients

We will use as much of existing solutions as possible, simplifying the massive job:

- SMTP service (relying on standard protocol to allow widest variety of email services, with Gmail as default)
- Feathers-mailer (Nodemailer based) email sender with SMTP transport
- Pug email template files with pug engine (former Jade)
- Juice for converting CSS to inline (to support variety of email clients)
- Optionally we could use something like ```npm install postcss-css-variables --save-dev``` and setting up build process to convert modern CSS to more compatible older versions

#### Email Transport

First we will setup a feathers service for SMTP email transport on the backend:

```bash
cd server/api/
npm install --save feathers-mailer nodemailer-smtp-transport feathers-hooks-common
npm install --save-dev @types/nodemailer-smtp-transport
feathers-plus generate service
  ? What is the name of the service? emails
  ? What would you call one row in the emails database? email
  ? What kind of service is it? A custom service
  ? Place service code in which nested folder, e.g. `v1/blog`? (optional)
  ? Which path should the service be registered on? /emails
  ? Does the service require authentication? No
  ? Should this be served by GraphQL? No
```

Edit the generated files (see code on Github).

Get app password, e.g. for Gmail see <https://myaccount.google.com/apppasswords>

Enter Gmail login info into server/api/config/private.env file:

```bash
DEV_EMAIL_SERVICE="gmail"
DEV_EMAIL_LOGIN="<youraccount>@gmail.com"
DEV_EMAIL_PASSWORD="<yourapppassword>"
DEV_EMAIL_REPORTS="<youraccount>@gmail.com"
```

(Do the same for PROD_ and TEST_, note that it allows using different accounts while developing and testing)

When the server is started with NODE_ENV=development, server will send an email to DEV_EMAIL_REPORTS, helping to verify email transport, so we won't do any other tests.

#### Backend Authentication Management

Next, let's install and configure backend authentication management:

```bash
npm install --save feathers-authentication-management
feathers-plus generate service
  ? What is the name of the service? authManagement
  ? What would you call one row in the authManagement database? authManagement
  ? What kind of service is it? A custom service
  ? Place service code in which nested folder, e.g. `v1/blog`? (optional)
  ? Which path should the service be registered on? /auth-management
  ? Does the service require authentication? Yes
  ? Should this be served by GraphQL? No
```

Note: path "/authManagement" is hardcoded in feathers-authentication-management client, so we can't use feathers's proposed "/auth-managaement" or any other path.

Modify auth-management code to load feathers-authentication-management, see the code edits on Github, note that user hooks have to be modified to avoid double-hashing of password by authentication-management and existing user hooks.

#### Backend Email Templates

Next, let's implement email templating solution for feathers-authentication-management:

We will add pug email templates and a separate styling CSS file (to keep pug templates clean of styling) in server/api/src/email-templates/account/,
and server/api/src/services/auth-management/notifier.js which ties email sending part to auth-management service.

Layout in emails by CSS is very bad, each client has unique limitations, so the main recommendation is to use HTML tables for layout and CSS only for spacing, colors and fonts. See <https://www.campaignmonitor.com/dev-resources/guides/coding/>

Also, modern CSS (e.g. with variables) won't work in most email clients. We could use CSS processing, but leave it out of this app for now.

```bash
npm install --save pug juice
npm install --save-dev @types/pug
```

We need to add "dom" to compilerOptions/lib in tsconfig.json file for using juice.d.ts:

```json
  "compilerOptions": {
    "lib": [                                  /* Specify library files to be included in the compilation. */
      "dom",                                  /* Fix "error TS2304: Cannot find name 'HTMLElement'" issue in juice.d.ts */
```

See added code on Github.

#### Client Authentication Management

Let's add client side features to use authentication management.

In client app directory install feathers-authentication-management in order to use its lib/client for client side:

```bash
cd client/ionic4-feathersjsplus-starter
npm install --save feathers-authentication-management
```

First use of authentication management is to check if email is already registered.

Though it is possible to just try to create a new account every time a user clicks "Register", and rely on server returning an error, we will explicitly do a check just to demonstrate authentication management client. Also this feature will be useful on client-side in password recovery.

See code on Github for few edits to src/app/services/feathers/feathers.ts and src/pages/login/login.ts.

#### Signup / Login / Reset Password

Next we will implement a "reset password" button on the LoginPage in the app for users who forgot password.

The LoginPage will be modified to have tabs (using Ionic segments) for Sign Up / Sign In / Reset modes, and a bit of animation to transition from one mode to another. We will keep it named "LoginPage" though it gets Signup and Reset features.

Since it is the first page all users will encounter in the app, we will spend a lot of design effort on UX of that page.

For the submit buttons, we will use ion-slides, to have slide-in animations for buttons when form changes modes. There's code-driven change of form builder model behind mode changes to allow validators on fields that are not used in all modes.

Form will have non-standard styling with rounded inputs and buttons, using .invalid class and custom css instead of .ion-invalid.

Animation of submit buttons slide-in is done using Ionic slides. An arrow pointing to the mode is animated using CSS. All fields transition animations are done using Angular, delays are staged to sequence the appearance and disappearance of the fields. It is simple with desired effect, however the resulting card/box height change is a bit jerky due to jumps between the fields, and the delay in the reverse direction is noticeable.

We will add a "show / hide" password button and style it, but won't connect it yet.

Reset code will only send request for password reset email, but no hookup to actually reset the password yet (it will need a separate page and a new route).

We will also add code for displaying buttons for external login, so we can style the page, but no implementation yet.

```bash
npm i -s @angular/animations
```

See the code on Github for few edits:

- src/pages/login/login.* files (Sign Up / Sign In / Reset, Login with ...)
- src/app/services/feathers.service.ts (using feathers-authentication-management client)
- app.module.ts (use Angular animations)
- src/models/user.ts (couple fields added to the user model)

#### Show Password

Let's implement a show/hide button for the password field. It is much better UX than a second password field that forses users to re-enter the password, which is very annoying way in the age of password managers and fingerprint logins. We will use a directive.

```bash
ionic generate directive directives/showHidePass
ionic generate module directives
```

See the code on Github for directive and edits of LoginPage.

#### Set New Password Page

To complete the password reset, we need one last piece - a deep-linked page that
will take the token from email URL and provide a form to enter a new password.

We will start with a separate page, so it can be deep-linked from email URL.

```bash
ionic generate page pages/ResetPassword
```

Though name "New Password" seem better, for URL links "reset-password" sounds more clear. We strive for user trust to click on the link in reset password email.

The ResetPasswordPage is very similar to the LoginPage, though it does not
need ion-segments to select different modes and animations to transition between
modes, and the fields are slightly different (no Email but Verification Code).

We will use Angular router parameter to deliver the token to the page in the app
from URL link in an email. There is no other way to navigate to that page in
the app, which may be needed to deal with situations when links are not
working.

In the process, we added some refinements to the LoginPage.

See the code on Github for the edits of generated src/pages/reset-password/ files.

#### Step 10 Summary

With all the added source code in place, the app has all functions, including minimal account management.

Some thoughts on the features developed in this step:

- Error handling on ResetPasswordPage could be smoother for UX, e.g. navigating to login/reset if verification code was rejected.
- It is tempting to make ResetPasswordPage a part of LoginPage under a separate segment/mode from code perspective, but good UX is against it.
- Typically there's a separate "change password" form elsewhere, which uses old password and takes new password. This feature is easily replaced by "reset" request followed by emai with "reset password" link, which does additional protection using email confirmation, so is much more secure against compromised passwords. Current design however, blocks access to the LoginPage unless user logs out, so another method will be needed.

### Step 11. Login With X

"Login With X" (a.k.a. "Social Login") is a must of modern apps. Setting aside invasive tracking and data collection practices done by the Auth providers, even in cases when other login is used, many users prefer to have single login with one password to remember, and use it across many websites and apps.

See this link for a good general overview of the process: <https://github.com/feathersjs/docs/blob/master/guides/auth/recipe.oauth-basic.md>
(as well as for steps to implement method #1 below).

There are few methods to implement login with OAuth providers:

 1. Use FeathersJS backend support (need a plugin for each login provider, opens in Webview and limited to currently implemented Google, Facebook, Github)
 2. Use custom clients, like @ionic-native/google-plus (limited to what is implemented, but more smooth native UI)
 3. Use client library like Hello.js (unlimited OAuth2 providers, even can do OAuth1)

Each method has its own pluses and minuses.

Methods 1 and 3 use Webview, and recently Google stopped allowing OAuth login using Webview on mobile devices (it insists on using native methods).

We will use Hello.js in web browser versions, as it works well and gives us most flexibility. On mobile, we have to use native, so we will have to mix both methods as needed.

In the end, we will want to have server-side list of providers, so app does not have to be re-released when adding providers. Hello.js supports that goal well (we can implement loading it from CDN, to always have recent updates).

#### Hello.js Method

_From <https://medium.com/@jacobgoh101/social-login-with-feathersjs-back-end-f834e5017230>._

```bash
cd client/ionic4-feathersjsplus-starter
npm install --save hellojs
npm install --save-dev @types/hellojs
cd ../../server/api
npm install --save feathers-authentication-custom passport-custom axios feathers-errors
npm install --save-dev @types/axios
```

For using HelloJS module without default import in TypeScript, add ```"allowSyntheticDefaultImports": true;``` to compilerOptions section of client/ionic4-feathersjsplus-starter/tsconfig.json.

On the server side we will create new auth strategy 'social_token'.

On the client side we expand src/app/services/feathers.service.ts, add buttons and click handlers to
the LoginPage, add Events to feathers.service.ts and app.component.ts for the app to react to
login/logout by navigating to appropriate page. We need Events as HelloJS issues login event upon
reload of the app, when the app itself has no way of knowing to set up a call and wait for an async
callback. Route guards, however, perform bad using events, and returning url from angular router
guards works much better.

You will need to get CLIENT_ID for each social login provider, see section "Providers" below to get them.

Copy your CLIENT_ID and CLIENT_SECRET into server/api/config/private.env for server side and into relevant files on client side:

```bash
DEV_GOOGLE_OAUTH_CLIENT_ID="987654321012-1234adf1234adf1234adf1234adf1234.apps.googleusercontent.com"
DEV_GOOGLE_OAUTH_CLIENT_SECRET="abcdefghijk-lmnopqrstuvw"
```

See the code on Github for few edits:

- server/api/src/utility/verifySocialToken.js
- server/api/src/authentication.js
- src/pages/login/login.* files
- src/app/app.component.ts (Events use for login/logout and guards)
- src/app/services/feathers/feathers.ts

#### Native Method

##### Google: @ionic-native/google-plus

_See <https://ionicframework.com/docs/native/google-plus/>._

Get client ID's for Google (see section "Providers" below).

```bash
ionic cordova plugin add cordova-plugin-googleplus --variable REVERSED_CLIENT_ID=<your iOS ID> --variable WEB_APPLICATION_CLIENT_ID=<your Web application ID>
npm install --save @ionic-native/google-plus
```

We will use backend (```social_token``` strategy) from section on Hello.js method (above).

See the code on Github for few edits:

- src/app/services/feathers/feathers.ts
- src/pages/login/login.ts
- src/app/app.module.ts
- config.xml

#### Providers

This section captures some notes on getting through each provider's setup.

##### Google

_See <https://developers.google.com/identity/sign-in/web/sign-in>._

Short summary:

With google developer account, visit <https://console.developers.google.com/> and create a project, name it "ionic4-feathersjsplus-starter" (or any name you plan to use it as), optionally give it custom project id.
Configure OAuth consent screen:

- Application name: ionic4-feathersjsplus-starter
- Scopes: email profile openid
- Authorized domains: (none)

Then open credentials page and create clients (for each click "Create credentials" on Google console for the project, choose "OAuth client ID", and choose application type) and get their client IDs:

- ```WEB_CLIENT_ID``` - "Web application" type
- ```REVERSED_ID``` - "iOS" type
- ```ANDROID_CLIENT_ID``` - "Android" type

```bash
WEB_CLIENT_ID=<your_WEB_CLIENT_ID>
REVERSED_CLIENT_ID=<your_REVERSED_CLIENT_ID>
ANDROID_CLIENT_ID=<your_ANDROID_CLIENT_ID>
```

Copy your web client id and client secret into relevant configuration files (client/ionic4-feathersjsplus-starter/config.xml and client/ionic4-feathersjsplus-starter/package.json).

Add domain names for the app (both request and redirect) into allowed lists: <http://localhost:8100>

For iOS type use bundle from config.xml for Package name and download .plist file, copy reversed ID from .plist.

For Android type, use bundle from config.xml (note that no hyphens in bundle id). For debug or production app, run keystore command, on linux:

```bash
keytool -exportcert -list -v -alias androiddebugkey -keystore ~/.android/debug.keystore
keytool -exportcert -list -v -alias <your-key-name> -keystore <path-to-production-keystore>
```

on Windows:

```bash
keytool -exportcert -list -v -alias androiddebugkey -keystore %USERPROFILE%\.android\debug.keystore
keytool -exportcert -list -v -alias <your-key-name> -keystore <path-to-production-keystore>
```

Enter the password, by default for "debug.keystore" is "android". Copy SHA1 value and paste into signing certifiacte fingerprint field.

#### Step 11 Summary

With all the added source code in place, the app is quite complete, including "Login With X" for wide user acceptance.

### Step 12 Backend-Driven Login With X

We created "Login With X" with a table of providers in the client app. It makes all client ID's stored in the app, and any updates to the service requires releasing app revision, and ensuring all users update the app, which is far from being optimal.

A better approach is to store the table on the server and retrieve it from the client when needed. We will create a feathers service for that.

Of course using native plugins will still require updating the app when plugin needs to be added (or updated), but HelloJS method will not need that.

```bash
feathers-plus generate service
  ? What is the name of the service? loginProviders
  ? What would you call one row in the loginProviders database? loginProvider
  ? What kind of service is it? A custom service
  ? Place service code in which nested folder, e.g. `v1/blog`? (optional)
  ? Which path should the service be registered on? /login-providers
  ? Does the service require authentication? No
  ? Should this be served by GraphQL? No
```

Edit the generated files to send data table (see code on Github).

On the client side we need to modify FeathersService method getSocialLogins() to return a Promise that gets data from the backend, and all its users to get data in .then() of getSocialLogins().

See the edits on Github.

#### Step 12 Summary

"Login With X" list of providers is now server-defined, with client ID and client Secret maintained on the server.

### Step 13 CI / Continuous Integration

We will add TravisCI so our tests and coverage will run automatically.

First enable TravisCI:

1. Go to <https://travis-ci.org> and create an account (can login with Github, so your account is linked).
2. Add .travis.yml file to your Github repo.
3. Enable your repo on <https://travis-ci.org/account/repositories>.
4. Configure your repo - add "AUTH_SECRET" environment variable.

Next enable coverall.io:

1. Go to <https://coveralls.io> and create an account (can login with Github, so your account is linked)
2. Add your repo at <https://coveralls.io/repos/new> (if the repo isn't listed, yet, then "Sync GitHub Repos").
3. install npm package with ```npm i -D coveralls```
4. Add coveralls script to serer/api/package.json "nyc report --reporter=text-lcov | coveralls"
5. For private repo: Add server/api/.coveralls.yml file with repo_token from coveralls.io (alternatively can use COVERALLS_REPO_TOKEN oenvironment variable in TravisCI)

Also add build and coverage badges to README.md file

Push all changes to Github.

#### Step 13 Summary

With this step complete we will have automated testing of server/api running every time changes are pushed to Github.

(More steps to come for testing)

### Step 17. App preferences, Themes & Dark Mode

Dark mode is becoming a very desirable feature, as many phones with OLED display can have much better battery life.

We will add dark theme CSS file, include it in src/theme/variables.scss file, and implement user preferences which allow switching dark theme in a menu item with a toggle.

Later (e.g. for a bigger app), preferences can be moved to a separate page.

```bash
npm install --save @ionic/storage
ionic cordova plugin add cordova-sqlite-storage --save
ionic g service services/preferences
```

### Step 18. App config in json files

See <https://devblogs.microsoft.com/premier-developer/angular-how-to-editable-config-files/>.

## END
