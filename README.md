# expressively-mocked-fetch

[![npm version](https://badge.fury.io/js/expressively-mocked-fetch.svg)](https://badge.fury.io/js/expressively-mocked-fetch)

> A fetch mock that launches express as a worker_thread to help testing.

## Installation

**NOTE:** This library uses `worker_threads`, a nodejs builtin that was released
with node v13.

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

### createWorker(string, object)

- `string` needs to be valid Node.js JavaScript
- object is of shape `{ requestCount: Number, port: Number }`, where:
  - `requestCount` (optional, default: 1) is the amount of times a server
    should respond before automatically shutting itself.
  - `port` (optional, default: 0) is the desired port the server should
    launch at. For dynamic allocation by the OS, use the default value `0`.

## Changelog

### 0.2.2

- Allow template's `app` to be overwritten by using `let`.

### 0.2.1

- (Bug fix): `options` allows now to set individual keys without forgetting
  all default options.

### 0.2.0

- Refactor `createWorker` function signature to allow an options object.
- Add `port` to `options` that allows a user to define a port before
  launching a worker.

### 0.1.2

- Using node.js's `worker_threads` now allows expressively-mocked-fetch to
  spawn threads without the usage of temporary files. Interface remains the
  same.

### 0.1.1

- Add support for `Content-Type: text/calendar` and potentially other types.

### 0.1.0

- Allow accepting `text/plain` and `application/json`.

### 0.0.3

- Allow `defaultCount` option allows a worker to exist for more than 1 request.

### 0.0.2

- Bug fix: Create new module file for each worker to allow running in parallel.

### 0.0.1

- Initial release

## LICENSE

[WIP]
