// @format
const { writeFileSync, unlinkSync, existsSync } = require("fs");
const fork = require("child_process").fork;
const { once } = require("events");
const express = require("express");

const fileName = ".expressively-mocked-fetch-tmp";
const template = fn => `
const express = require('express');
const app = express();
${fn}
let server = app.listen(0, function () {
  process.send("PORT:"+server.address().port);
})
`;

async function createWorker(fn) {
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
    port
  };
}

module.exports = createWorker;
