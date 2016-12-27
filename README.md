# Gymsystems #

This is a complete web based system for managing the secretariat for Team Gymnastic sports. There are not many proffesional scoring or managing systems available, and therefore we saw the need for creating one. And since these minority sports are typically not funded, and therefore prone to voluntary work, we wanted this system to be a community open-source project as well. We will therefore never ask for money for this system, but instead wecome improvements through pull-requests.

We've based the system on a NodeJS Express server using MySQL backend over Docker, serving an Angular 2 frontend. 



## How to run ##

### Prerequisites ###

You need to install the following:

* [NodeJS](https://nodejs.org/) 4 or higher (We reccommend the 6 LTS version)
* [Docker](https://www.docker.com/)

### Build and run ###

```bash
npm install
./docker-build
```

After running these commands, you will have two docker containers up and running. 

* **gymsystems** - built from [gymsystems/client](./Dockerfile) docker image
* **gymsystems_db** - build from [gymsystems/db](.docker/db/Dockerfile) docker image

They're put together using [docker-compose](./docker-compose.yml) and should be available on port 3000 of you docker-machine.

#### While deveoping backend ####

`npm run build:server:watch`

This command will continously build the backend while you develop. 

`npm run start:server:watch`

You will need to start a separate shell in order to run the server though, this command uses `nodemon` to watch for changes and restarts the server automatically upon changes. 
In order to run the server, you will require a database. This is provided for you in the `gymsystems_db` docker container.

#### While deveoping frontend ####

`npm run start:client`

This will run a continous build and browsersync session for the frontend. Use this if you are developing the client.



## Three-tier architecture ##
### Server ###

We chose a NodeJS Express backend for this, as it was the easiest to setup and is super-fast. The database connection is handled by [`TypeORM`](https://typeorm.github.io), and the whole server concists basically of CRUD controllers using [`routing-controllers`](https://github.com/pleerock/routing-controllers) and [`typeorm-routing-controllers-extension`](https://github.com/typeorm/typeorm-routing-controllers-extensions). This was super-easy to setup and is feels very similar to Spring for Java.

### Client ###

We use [angular-cli](https://cli.angular.io/) for both scaffolding and building our project. This seems to be the best and most efficient way of reaching our goal.

### Data model ###

`TypeORM` is inspired by large scale ORM solutions like `Hibernate`, which means it supports both schema synchronisation and migrations. This is great as we keep all our structure in code instead of relying on `sql` scripts for setup. 

![DB Model](docs/db_model.png)

