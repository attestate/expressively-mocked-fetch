const { existsSync } = require("fs");
const spawnSync = require("child_process").spawnSync;

const test = require('ava');
const fetch = require('cross-fetch');

const createWorker = require("../src/index.js");

const fileName = ".expressively-mocked-fetch-tmp";

test("if module is loaded and executed", async t => {
  const worker = await createWorker(`
app.get('/', function (req, res) {
  res.send("OK");
});
  `);

  const res = await fetch(`http://localhost:${worker.port}`);
  const text = await res.text()

  t.assert(text === "OK");
  t.assert(res.status === 200);
  t.assert(!existsSync(fileName));
  const processes = spawnSync("ps", ["-ax"]);
  t.assert(!processes.stdout.toString().includes(fileName));
});
