# expressively-mocked-fetch

[![npm version](https://badge.fury.io/js/expressively-mocked-fetch.svg)](https://badge.fury.io/js/expressively-mocked-fetch)

> A fetch mock that launches express as a child_process to help testing.

## Installation

```bash
$ npm i -D expressively-mocked-fetch
```

## Why

[Mocking fetch is annoying](https://kentcdodds.com/blog/stop-mocking-fetch).  I
saw [msw](https://github.com/mswjs/msw). But it was [too
static](https://github.com/mswjs/msw/issues/287) for me. Also: Why reimplement
a whole API (express.js), when you can just use it...

## Develop

1. Download this repo and install the dependencies
2. Run `npm run test`

## Usage

See [test file](./test/index.test.js).

## Changelog

### 0.0.1

- Initial release

## LICENSE

[WIP]
