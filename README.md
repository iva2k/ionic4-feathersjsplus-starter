server/api:
[![Build Status server/api](https://travis-ci.org/iva2k/ionic4-feathersjsplus-starter.svg?branch=master)](https://travis-ci.org/iva2k/ionic4-feathersjsplus-starter)
[![Coverage Status server/api](https://coveralls.io/repos/github/iva2k/ionic4-feathersjsplus-starter/badge.svg?branch=master)](https://coveralls.io/github/iva2k/ionic4-feathersjsplus-starter?branch=master)

# ionic4-feathersjsplus-starter app

Demo of Ionic 4 / Angular app with FeathersJS+ backend services.

## Features

- A follow-up for ionic3-feathers app
- A simple list of todo items stored on a backend server
- Uses Ionic 4 / Angular for the app that can be delivered on multiple platforms:
  - Webserver
  - iOS native app
  - Android native app
  - Windows/MacOS/Linux desktop app (with addition of Electron, not covered here)
- Uses FeathersJS+ for a NodeJS backend server and a client in the app
- Client Uses slick DataSubscriber wrapper on top of Feathers that streamlines views and components code
- Debugging in VSCode (both the app and server back-end)
- Automated tests of the server code

There are two ways to get started (Assuming node/npm and git is already installed, if not, google it):

1. Get the complete code from Github
2. Follow step-by-step instructions (and get the relevant code from the Github)

## Get Started - Get complete code

Get complete code from Github: [github.com/iva2k/ionic4-feathersjsplus-starter](https://github.com/iva2k/ionic4-feathersjsplus-starter)

Note: Make sure to setup private info (passwords, API keys, etc.) in file api/config/private.env before starting server ```npm start```.

```bash
sudo npm install -g ionic cordova
git clone https://github.com/iva2k/ionic4-feathersjsplus-starter
cd ionic4-feathersjsplus-starter
npm i
cd api
npm i
cp /config/private.env.template config/private.env
npm start
```

and in a separate terminal run:

```bash
ionic serve
```

## Get Started - Step-by-Step Instructions

Create an app from scratch following steps in [TUTORIAL.md](./TUTORIAL.md).

## Differences from ionic3-feathers app

- Different top-level directory structure
- Use Ionic 4 / Angular instead of outgoing Ionic 3
- Use FeathersJS+ instead of plain FeathersJS

## END
