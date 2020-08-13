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

```js
// with ava
const test = require("ava");
const createWorker = require("expressively-mocked-fetch");

test("if module is loaded and executed", async t => {
  const worker = await createWorker(`
// regular express.js code
app.get('/', function (req, res) {
  res.send("hello world");
});
  `);

  const res = await fetch(`http://localhost:${worker.port}`);
  const text = await res.text();
  t.assert(test === "hello world");
});
```

## Changelog

### 0.1.0

- Allow accepting `text/plain` and `application/json`

### 0.0.3

- Allow `defaultCount` option allows a worker to exist for more than 1 request.

### 0.0.2

- Bug fix: Create new module file for each worker to allow running in parallel

### 0.0.1

- Initial release

## LICENSE

[WIP]
