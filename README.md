# graphql-api
API with GraphQL, Node.js, MongoDB, TypeScript, DataLoader, AST, Mocha, Chai, Nyc


## Setup
```bash
$ git clone https://github.com/elsangedy/graphql-api.git
$ cd graphql-api
$ yarn install
```

## Run
```bash
# run mongodb with docker
# need create graphql database
$ docker-compose up -d

# need two terminal tabs
# one: watch all changes and build .ts
$ yarn run watch
# two: nodemon watch all changes in ./dist and refesh application
$ yarn run dev
```

## Test
```bash
# only tests
$ yarn run test
# tests and code coverage with nyc
$ yarn run coverage
```
