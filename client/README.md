# [Gymsystems](../)/Client

This project is using [Angular Framework](https://angular.io/). We use [angular-cli](https://cli.angular.io/) for both scaffolding and building our project. This seems to be the best and most efficient way of reaching our goal.

## Install

```bash
yarn install
```

## Run

```bash
yarn client
```

This will run a continuous build and browsersync session for the frontend. Use this if you are developing the client. This starts up a small development server on [localhost:4200](http://localhost:4200), with a proxy to the backend so all api calls will work seamlessly.

## Debug

You can debug this project using VsCode. There's a launch configuration `Client` attached which will pull up a detached Chrome instance, and breakpoints can be set directly in VsCode.
You can also debug the unit tests using a launch configuration called `Client Test`.

### Tests

#### Unit tests

The project contains unit tests for every component, directive, pipe and service. We run the unit tests on every github push, so we don't break anything before a deploy - which is also triggered by a github push. In order to run them manually:

```
yarn test
```

#### E2E tests

We've also added end to end integration tests served using protractor and a separate database structure. The following will setup a docker container with a clean mysql database setup with default data. It will start up a server with a minimum of logging, so as not to clutter test output, and finally it will run the selenium driven protractor tests in a chrome instance.

```
yarn e2e
```

The database will be dropped when the tests complete. If it for any reason should still persist (you can check using `docker ps`), you can clean up using

```
yarn poste2e
```
