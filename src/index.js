// @format
const { Worker } = require("worker_threads");

const { once } = require("events");
const express = require("express");

const template = (fn, options) => `
const express = require("express");
const bodyParser = require("body-parser");
const { parentPort } = require('worker_threads');

const app = express();
let count = 0;

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

async function createWorker(fn, options = { requestCount: 1, port: 0 }) {
  const entry = template(fn, options);
  const worker = new Worker(entry, { eval: true });

  const [data, _] = await once(worker, "message");
  const port = data.match(new RegExp("PORT:(\\d+)"))[1];
  worker.unref();

  return {
    process: worker,
    port
  };
}

module.exports = createWorker;
