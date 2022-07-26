// @format
const { existsSync } = require("fs");
const spawnSync = require("child_process").spawnSync;
const proxyquire = require("proxyquire");
const { hrtime } = require("process");

const test = require("ava");
const fetch = require("cross-fetch");

const createWorker = require("../src/index.js");

test("if worker can be paused a while before answering", async (t) => {
  const pauseMilliseconds = 1000;
  const worker = await createWorker(
    `
app.get('/', function (req, res) {
  res.send("OK");
});
  `,
    { pauseMilliseconds }
  );

  const start = hrtime.bigint();
  const res = await fetch(`http://localhost:${worker.port}`);
  const end = hrtime.bigint();
  const diffNanoseconds = end - start;
  const diffMilliseconds = diffNanoseconds / 1000000n;
  t.true(
    diffMilliseconds > pauseMilliseconds,
    `response wasn't delayed enough: ${diffMilliseconds}`
  );
  const text = await res.text();

  t.assert(text === "OK");
  t.assert(res.status === 200);
  t.assert(!existsSync(worker.fileName));
  const processes = spawnSync("ps", ["-ax"]);
  t.assert(!processes.stdout.toString().includes(worker.fileName));
});

test("if module is loaded and executed", async (t) => {
  const worker = await createWorker(`
app.get('/', function (req, res) {
  res.send("OK");
});
  `);

  const res = await fetch(`http://localhost:${worker.port}`);
  const text = await res.text();

  t.assert(text === "OK");
  t.assert(res.status === 200);
  t.assert(!existsSync(worker.fileName));
  const processes = spawnSync("ps", ["-ax"]);
  t.assert(!processes.stdout.toString().includes(worker.fileName));
});

test("if server remains up with overwritten defaultCount option", async (t) => {
  const requestCount = 3;
  const worker = await createWorker(
    `
app.get('/', function (req, res) {
  res.send("OK");
});
  `,
    { requestCount }
  );

  const requests = await Promise.all([
    fetch(`http://localhost:${worker.port}`),
    fetch(`http://localhost:${worker.port}`),
    fetch(`http://localhost:${worker.port}`),
  ]);
  t.assert(requests[0].status === 200);
  t.assert(requests[1].status === 200);
  t.assert(requests[2].status === 200);
  t.assert(!existsSync(worker.fileName));
  const processes = spawnSync("ps", ["-ax"]);
  t.assert(!processes.stdout.toString().includes(worker.fileName));
});

test("reacting to a response text body", async (t) => {
  const worker = await createWorker(
    `
app.post('/', function (req, res) {
  res.send(req.body);
});
  `
  );
  const body = "hello";
  const res = await fetch(`http://localhost:${worker.port}`, {
    method: "POST",
    body,
  });
  const text = await res.text();
  t.assert(text === body);
});

test("reacting to a response json body", async (t) => {
  const worker = await createWorker(
    `
  app.post('/', function (req, res, next) {
      res.json(req.body)
  })
`
  );
  const body = { hello: "world" };
  const res = await fetch(`http://localhost:${worker.port}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const obj = await res.json();
  t.deepEqual(obj, body);
});

test("reacting to a response text/calendar body", async (t) => {
  const worker = await createWorker(
    `
  app.post('/', function (req, res, next) {
      res.send(req.body)
  })
`
  );
  const body = `BEGIN:CALENDAR
    END:CALENDAR`;
  const res = await fetch(`http://localhost:${worker.port}`, {
    method: "POST",
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
    },
    body,
  });
  t.assert(body === (await res.text()));
});

test("if pre-defined port option launched server at port", async (t) => {
  const customPort = 6666;
  const worker = await createWorker(
    `
app.get('/', function (req, res) {
  res.send("OK");
});
  `,
    { port: customPort }
  );

  const res = await fetch(`http://localhost:${customPort}`);
  const text = await res.text();

  t.assert(text === "OK");
  t.assert(res.status === 200);
});

test("make sure that for a fn signature with a default object, all default options are set when a custom option is inserted", async (t) => {
  const requestCount = "requestCount";

  let workerCalled = false;
  const { EventEmitter } = require("events");
  class Worker extends EventEmitter {
    constructor(code, options) {
      super();
      t.assert(code.includes("app.listen(0"));
      t.assert(code.includes(requestCount));
      workerCalled = true;
    }
  }
  const createWorkerMock = proxyquire("../src/index.js", {
    worker_threads: {
      Worker,
    },
  });

  createWorkerMock("", { requestCount });
  t.true(workerCalled);
});
