// @format
const { writeFileSync, unlinkSync, existsSync } = require("fs");
const { fork } = require("child_process");
const uuidv4 = require("uuid").v4;

const { EventEmitter, once } = require("events");
const express = require("express");

const template = (fn, defaultCount) => {
  const emitter = new EventEmitter();
  const express = require("express");
  const bodyParser = require("body-parser");
  const app = express();
  let count = 0;

  app.use(express.text());
  app.use(express.json());
  // NOTE: Library is adjustable to other Content-Types
  app.use(bodyParser.raw({ type: "text/calendar" }));
  app.use(function(req, res, next) {
    count++;
    next();
    if (count === defaultCount) {
      process.exit();
    }
  });

  fn(app);

  const launch = () => {
    let server = app.listen(0, function() {
      const port = server.address().port;
      emitter.emit("port", port);
    });
  };
  return {
    emitter,
    launch
  };
};

async function createWorker(fn, defaultCount = 1) {
  let worker = {};

  const { launch, emitter } = template(fn, defaultCount);
  const portPromise = once(emitter, "port");
  launch();
  const [port] = await portPromise;

  return { port };
}

module.exports = createWorker;
