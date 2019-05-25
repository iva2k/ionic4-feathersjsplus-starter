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

Next, start debug with "Launch in Chrome" configuration (in launch.json file).

#### Android Device

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
$ ionic cordova platform add android
```

To avoid issues in Cordova plugins (e.g. https://github.com/EddyVerbruggen/cordova-plugin-googleplus/issues/478),
patch file node_modules/cordova-android/bin/templates/project/build.gradle with code
(required since [11.2.0](https://developers.google.com/android/guides/releases#august_2017_-_version_1120)
see also [this link](https://developer.android.com/studio/build/dependencies#google-maven)):

```
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
$ ionic cordova run android
```

Use  "Run android on device" configuration (in launch.json file) for debugging in VSCode.


#### IOS Device

```bash
$ ionic cordova platform add ios
```

See https://moduscreate.com/blog/ionic-cordova-debug-device-visual-studio-code/


##END