# [Gymsystems](../README.md)/Server

[![Known Vulnerabilities](https://snyk.io/test/github/OysteinAmundsen/gymsystems/badge.svg?targetFile=server%2Fpackage.json)](https://snyk.io/test/github/OysteinAmundsen/gymsystems?targetFile=server%2Fpackage.json)

This project is using the brilliant [`NestJS Framework`](https://nestjs.com/), which is based on Node Express and is greatly inspired by Angular. The database connection is handled by [`TypeORM`](https://typeorm.github.io), and we are utilizing both REST controllers and GraphQL for our API.

## Installation

```
yarn install
```

Nothing more to it. :-)

## Run

You can start the server bit of this project up in three ways:

1. Build once and serve

  ```bash
  yarn build
  yarn start
  ```

  This will build the backend, and start up the server on [localhost:3000](http://localhost:3000).

2. Build continously and serve

  ```bash
  yarn start:dev
  ```
  This command will continuously build the backend while you develop, and restart the Node Express server when build is done.

3. Build continously and **debug**

  ```bash
  yarn start:debug
  ```
  This command will continously build the backend while you develop. It will not start the server though. We like to use VSCode, and have included VSCode launch settings in this repository for you. Choose to debug `Server` in VSCode, and you are up. When you do changes to the code, the server will rebuild and your debugging session will restart automatically.

  You can also launch the project in debug using VsCode. Enter the debugger, choose `Server` and press run. We've also included a couple of launch configurations for debugging `Server Test`, which will run through the entire test suite in debug mode, or a `Server Test Current File`, which will run any unit test currently active in VsCode's editor window.

