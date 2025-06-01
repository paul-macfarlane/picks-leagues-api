## Description

Picks Leagues API. A NestJS API made for the Picks League Clients.

## Project setup

```bash
$ npm install
```

## Compile and run the project

Set the environment variables in the .env file.

```bash
$ cp .env.example .env
```

Install Node.js and Docker.

Next run the database locally with docker compose.

```bash
$ docker compose up -d
```

Next run the application.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
