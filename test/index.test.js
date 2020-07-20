const test = require('ava');
const fetch = require('cross-fetch');

const createWorker = require("../src/index.js");
const PORT = 3000;


test("if module is loaded and executed", async t => {
  const worker = await createWorker(`
  var express = require('express');
  var app = express();
  
  app.get('/', function (req, res) {
    res.send("OK");
  });
  
  app.listen(${PORT}, function () {
    console.log("${`Example app listening on port ${PORT}!`}");
  })
  `);

  const res = await fetch(`http://localhost:${PORT}`);
  const text = await res.text()
  worker.kill("SIGINT");

  t.assert(text === "OK");
  t.assert(res.status === 200);
});
