[![Build Status](https://travis-ci.org/garage-it/SmartHouse-backend.svg?branch=master)](https://travis-ci.org/garage-it/SmartHouse-backend)
[![codecov.io](https://codecov.io/github/garage-it/SmartHouse-backend/coverage.svg?branch=master)](https://codecov.io/github/garage-it/SmartHouse-backend?branch=master)
[![dependencies Status](https://david-dm.org/garage-it/SmartHouse-backend/status.svg)](https://david-dm.org/garage-it/SmartHouse-backend)
[![devDependencies Status](https://david-dm.org/garage-it/SmartHouse-backend/dev-status.svg)](https://david-dm.org/garage-it/SmartHouse-backend?type=dev)
[![npm version](https://badge.fury.io/js/smart-house-backend.svg)](https://badge.fury.io/js/smart-house-backend)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)


## Commands

Install dependencies:
```sh
npm install
```

### Start server:
```sh
# set DEBUG env variable to get debug logs
DEBUG=express-mongoose-es6-rest-api:* npm start

# or without debug
npm start
```

### Start server in production mode:
```sh
# will run api backend
npm run api
```

### Execute tests:
```sh
# run tests
npm test

# run tests with coverage
npm run test-coverage
```

### Other tasks:
```sh
# Lint code with ESLint
npm run lint
```

## Logging

Universal logging library [winston](https://www.npmjs.com/package/winston) is used for logging. It has support for multiple transports.  A transport is essentially a storage device for your logs. Each instance of a winston logger can have multiple transports configured at different levels. For example, one may want error logs to be stored in a persistent remote location (like a database), but all logs output to the console or a local file. We just log to the console for simplicity, you can configure more transports as per your requirement.

#### API logging
Logs detailed info about each api request to console during development.
![Detailed API logging](https://cloud.githubusercontent.com/assets/4172932/12563354/f0a4b558-c3cf-11e5-9d8c-66f7ca323eac.JPG)

#### Error logging
Logs stacktrace of error to console along with other details. You should ideally store all error messages persistently.
![Error logging](https://cloud.githubusercontent.com/assets/4172932/12563361/fb9ef108-c3cf-11e5-9a58-3c5c4936ae3e.JPG)

## Code Coverage
Get code coverage summary on executing `npm test`
![Code Coverage Text Summary](https://cloud.githubusercontent.com/assets/4172932/12827832/a0531e70-cba7-11e5-9b7c-9e7f833d8f9f.JPG)

`npm test` also generates HTML code coverage report in `coverage/` directory. Open `lcov-report/index.html` to view it.
![Code coverage HTML report](https://cloud.githubusercontent.com/assets/4172932/12625331/571a48fe-c559-11e5-8aa0-f9aacfb8c1cb.jpg)
