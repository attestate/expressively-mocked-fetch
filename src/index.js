// @format
const { writeFileSync, unlinkSync, existsSync } = require("fs");
const { fork } = require("child_process");
const uuidv4 = require("uuid").v4;

const { once } = require("events");
const express = require("express");

const template = (fn, defaultCount) => `
const express = require('express');
const app = express();
let count = 0;

app.use(express.text());
app.use(express.json());
app.use(function(req, res, next) {
  count++;
  next();
  if (count === ${defaultCount}) {
    process.exit();
  }
});
${fn}
let server = app.listen(0, function () {
  const port = server.address().port;
  process.send("PORT:"+port);
})
`;

async function createWorker(fn, defaultCount = 1) {
  const fileName = `.${uuidv4()}`;
  let worker = {};

  const file = template(fn, defaultCount);
  writeFileSync(fileName, file);

  const child = fork(fileName, {
    cwd: process.cwd(),
    detached: true,
    stdio: [null, null, null, "ipc"]
  });

  const [data, _] = await once(child, "message");
  const port = data.match(new RegExp("PORT:(\\d+)"))[1];
  child.unref();
  existsSync(fileName) && unlinkSync(fileName);

  return {
    process: child,
    port,
    fileName
  };
}

module.exports = createWorker;
