# GymSystems

[![Greenkeeper badge](https://badges.greenkeeper.io/OysteinAmundsen/gymsystems.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/OysteinAmundsen/gymsystems.svg?branch=master)](https://travis-ci.org/OysteinAmundsen/gymsystems)
[![Dependency Status](https://david-dm.org/OysteinAmundsen/gymsystems.svg)](https://david-dm.org/OysteinAmundsen/gymsystems)
[![devDependency Status](https://david-dm.org/OysteinAmundsen/gymsystems/dev-status.svg)](https://david-dm.org/OysteinAmundsen/gymsystems#info=devDependencies)
[![Known Vulnerabilities](https://snyk.io/test/github/OysteinAmundsen/gymsystems/badge.svg?targetFile=package.json)](https://snyk.io/test/github/OysteinAmundsen/gymsystems?targetFile=package.json)
[![GitHub issues](https://img.shields.io/github/issues/OysteinAmundsen/gymsystems.svg)](https://github.com/OysteinAmundsen/gymsystems/issues)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/OysteinAmundsen/gymsystems.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2FOysteinAmundsen%2Fgymsystems)

This is a complete web based system for managing the secretariat for Team Gymnastic sports. There are not many proffesional scoring or managing systems available, and therefore we saw the need for creating one. And since these minority sports are typically not funded, and therefore prone to voluntary work, we wanted this system to be a community open-source project as well. We will therefore never ask for money for this system, but instead wecome improvements through pull-requests.

We have no host for this system, as we do not have enough funds for it. You are welcome to host this yourself. Please read the [installation guide](#installation) below for detailed instructions on how to set this up.

We've developed a comprehensive users manual over at our [wiki](../../wiki). This should describe in depth how the system is to be used. If you feel that the manual is missing some information, feel free to open a new [issue](../../issues), and we will add or clarify.

## Table of contents

* [Installation](#installation)
* [User manual (own wiki space)](../../wiki)
* [Development](#development)
  - [Server](./server)
  - [Client](./client)
  - [Database](#database)

## Installation

This system is written entirely in Typescript. It is intended to be run in a docker container, but it is flexible enough to setup any which way you want.
Install on your own docker-cloud container stack using this button, or follow the manual installation guide below.

In order to install and setup the system manually, you need to install the following first:

* [NodeJS](https://nodejs.org/) v11 or higher
* [Docker](https://www.docker.com/)

We are also using `yarn` as the package manager for this system. This is optional, but highly recommended.
For a production ready deployment, do this:

```bash
yarn install
yarn start:docker
```

The [`start:docker`](./orchestration/docker-compose.yaml) script will setup both the application docker container and the database container.

* **gymsystems/client** - built from [gymsystems/client](./client/Dockerfile) docker image
* **gymsystems/server** - built from [gymsystems/server](./server/Dockerfile) docker image
* **gymsystems_db** - built from [stock dockerhub mysql](https://hub.docker.com/_/mysql/) image

They're put together using `docker-compose` and should be available on port 80 of you docker-machine.

If all you want to do is startup this project, your pretty much done now. The application should be available on `http://[docker-machine]` <- which usually is [localhost](http://localhost)


## Development

We welcome pull-requests to our system. We therefore want you to be able to setup a development environment quickly and easily. The information below should be all you as a developer require to get up and running quickly, and make all the changes you want.

As a contributer, you should study our [Contribution guidelines](./CONTRIBUTING.md) before making pull-requests.

This repository is a monorepo workspace, which means that we've split the server/client parts into completelly separate systems. You can control them from this root folder, but they can also run standalone from their own subfolder.

### Server

```bash
yarn build:server
yarn start:server
```

**OR** take a look at the instructions under [./server](./server/README.md) for details on i.e. debugging.

### Client

```bash
yarn build:client
yarn start:client
```

**OR** take a look at the instructions under [./client](./client/README.md) for details on i.e. debugging.

### Database

For development, you don't need a docker container for the application. You only need a database. The following will build out a docker container for your database:

```bash
yarn start:db
```
The docker container shoud be setup with a volume mounted from your local file system, so that data will be persisted even if the docker container goes down, is rebuilt or, for whatever other reason, dissapears.

`TypeORM` is inspired by large scale ORM solutions like `Hibernate`, which means it supports both schema synchronisation and migrations. This is great as we keep all our structure in code instead of relying on `sql` scripts for setup.

![DB Model](docs/images/db_model.png)

For a detailed explanation of the different models, please refer to JS Docs inline in the actual [server/model](./server/model) files.
