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

### Step 3. Create Feathers Server

_From Feathers guide <https://docs.feathersjs.com/guides/chat/readme.html> with changes for TypeScript and Feathers+ generator. Also see <https://medium.com/feathers-plus/feathers-plus-cli-5c7ba0015e8e> ._

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
? Data mutating tests and seeding may run when NODE_ENV is one of (optional) development,test
? Seed data records on startup when command line includes --seed? Yes
```

Notes:

1. Feathers-plus requires NodeJS v10. However, there is some unresolved bug in feathers-plus dependencies - it hangs under Node 10 on Windows 7 & 10 ([see the issue](https://github.com/feathers-plus/generator-feathers-plus/issues/103)). Install node 8 (e.g. node-v8.11.2-x64.msi) and use [nvm-windows](https://github.com/coreybutler/nvm-windows) to switch to Node 8 for feathers-plus until the issue is resolved.
2. feathers-plus has an [issue](https://github.com/feathers-plus/cli/issues/38) with changing source files folder from the default 'src' - some entries remain 'src'. So we won't change the default.
3. app.configure() has been removed in express 4 (actually, kept until 4.16.0 and deleted in 4.16.6 of @types/express-serve-static-core), see [issue](https://github.com/feathersjs/feathers/issues/1090). Further, feathersjs app.configure() polyfill calls the callback with two arguments instead of one. That causes some issues with TypeScript compilation:

   a. Right after first ```feathers-plus generate app``` command ```npm start``` fails in TypeScript compilation (App declaration without services does not compile with error TS2345 in src/app.ts / tried with node-v10.15.3-x64.msi and node-v8.11.2-x64.msi). Adding first service seems to rectify that problem.

   b. Adding 'todos' service resolves #a, but command ```npm start``` still fails, now in TypeScript compilation of todos.service configure call (this, app) vs. (app) function types. Pinning express and express-serve-static-core versions to 4.16.0 helps:

Until the [Feathers+ issue #37](https://github.com/feathers-plus/cli/issues/37) is resolved, pin older version of express:

```bash
npm i -D @types/express-serve-static-core@4.16.0
```

Note that this is purely masking the underlying problem of incompatible types in FeathersJS typings that TypeScript compiler finds, so it's a dirty fix. Hopefully the underlying issues will be resolved cleanly and then the fix should be removed.

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

Let's refactor todos service - move Feathers client into a new service, so a single service / API connection is used by all various services we will need from Feathers backend.

```bash
cd client/ionic4-feathersjsplus-starter
ionic generate service services/Feathers
```

See code on Github for the edits of generated src/app/services/feathers.service.ts file and changes to existing files:

 - src/app/app.module.ts (added service / ionic generate does not inject it for us)
 - src/app/services/todo/todo.service.ts (refactored to use FeathersService)

## END
