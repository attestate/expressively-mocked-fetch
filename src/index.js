// @format
const { writeFileSync, unlinkSync, existsSync } = require("fs");
const { fork } = require("child_process");
const uuidv4 = require("uuid").v4;

const { once } = require("events");
const express = require("express");

const template = fn => `
const express = require('express');
const app = express();
app.use(function(req, res, next) {
  next();
  process.exit();
});
${fn}
let server = app.listen(0, function () {
  process.send("PORT:"+server.address().port);
})
`;

async function createWorker(fn) {
  const fileName = `.${uuidv4()}`;
  let worker = {};

  writeFileSync(fileName, template(fn));

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
