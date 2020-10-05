// @format
const { writeFileSync, unlinkSync, existsSync } = require("fs");
const { fork } = require("child_process");
const uuidv4 = require("uuid").v4;

const { once } = require("events");
const express = require("express");

const template = async (fn, defaultCount) => {
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

  return new Promise(resolve => {
    let server = app.listen(0, function() {
      const port = server.address().port;
      console.log("PORT:" + port);
      return resolve(port);
    });
  });
};

async function createWorker(fn, defaultCount = 1) {
  let worker = {};

  const port = await template(fn, defaultCount);

  return {
    port
  };
}

module.exports = createWorker;
