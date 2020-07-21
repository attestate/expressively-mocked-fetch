const test = require('ava');
const fetch = require('cross-fetch');

const createWorker = require("../src/index.js");
const PORT = 3000;


test("if module is loaded and executed", async t => {
  const worker = await createWorker(`
app.get('/', function (req, res) {
  res.send("OK");
});
  `);

  const res = await fetch(`http://localhost:${worker.port}`);
  const text = await res.text()
  worker.process.kill("SIGINT");

  t.assert(text === "OK");
  t.assert(res.status === 200);
});
