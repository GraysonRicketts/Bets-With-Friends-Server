## Description


## Installation

1. Postgres v14
2. nvm

## Running the app

Complete the pre-requisites
```bash
# development
$ yarn start

# watch mode
$ yarn run start:dev
```

### Pre-requisites
https://docs.microsoft.com/en-us/windows/wsl/tutorials/wsl-database
```bash
sudo service postgresql start
```
Connect: `sudo -u postgres psql`

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
## Migrations
```bash
yarn prisma migrate dev --name <name>
```

