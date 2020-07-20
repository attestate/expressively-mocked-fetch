// @format
const { writeFileSync, unlinkSync } = require("fs");
const fork = require("child_process").fork;
const express = require("express");

const fileName = ".expressively-mocked-fetch-tmp";

async function createWorker(fn) {
  writeFileSync(fileName, fn);

  const child = fork(fileName, [], {
    cwd: process.cwd(),
    detached: true,
    stdio: "inherit"
  });
  child.unref();

  // TODO: Find a way to get notified by the child process about it's status
  // instead of blocking arbitrarily here
  await new Promise(r => setTimeout(r, 100));
  unlinkSync(fileName);

  return child;
}

module.exports = createWorker;
