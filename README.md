# expressively-mocked-fetch

[![npm version](https://badge.fury.io/js/expressively-mocked-fetch.svg)](https://badge.fury.io/js/expressively-mocked-fetch)

> A fetch mock that launches express as a child_process to help testing.

## Installation

```bash
$ npm i -D expressively-mocked-fetch
```

## Why

[Mocking fetch is annoying](https://kentcdodds.com/blog/stop-mocking-fetch).  I
saw [msw](https://github.com/mswjs/msw). But it [didn't fit my use case](https://github.com/mswjs/msw/issues/287). So I ended up writing a wrapper around express.js.

## Develop

1. Download this repo and install the dependencies
2. Run `npm run test`

## Usage

See [test file](./test/index.test.js).

## Changelog

### 0.0.3

- Allow `defaultCount` option allows a worker to exist for more than 1 request.

### 0.0.2

- Bug fix: Create new module file for each worker to allow running in parallel

### 0.0.1

- Initial release

## LICENSE

[WIP]
