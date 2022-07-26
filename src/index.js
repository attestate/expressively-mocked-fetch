// @format
const { Worker } = require("worker_threads");

const { once } = require("events");

const template = (fn, options) => `
const express = require("express");
const bodyParser = require("body-parser");
const { parentPort } = require('worker_threads');

let app = express();
let count = 0;

if (${options.pauseMilliseconds} > 0) {
  const pause = require('connect-pause');
  app.use(pause(${options.pauseMilliseconds}));
}

app.use(express.text());
app.use(express.json());
// NOTE: Library is adjustable to other Content-Types
app.use(bodyParser.raw({ type: 'text/calendar' }))
app.use(function(req, res, next) {
  count++;
  next();
  if (count === ${options.requestCount}) {
    process.exit();
  }
});
${fn}
let server = app.listen(${options.port}, function () {
  const port = server.address().port;
  parentPort.postMessage("PORT:"+port);
})
`;

const defaultOptions = { requestCount: 1, port: 0, pauseMilliseconds: 0 };
async function createWorker(fn, options) {
  options = { ...defaultOptions, ...options };
  const entry = template(fn, options);
  const worker = new Worker(entry, { eval: true });

  const [data, _] = await once(worker, "message");
  const port = data.match(new RegExp("PORT:(\\d+)"))[1];
  worker.unref();

  return {
    process: worker,
    port,
  };
}

module.exports = createWorker;
