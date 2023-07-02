'use strict';

import fs from 'fs';
import tester from './tester.js';
// REMINDER - COMMIT MORE OFTEN

// first, test when customInputs feature is missing.
//  should work fine since the flag is off
// if customInputs: true, but no tests have been found - report issue
// if customInputs: true, but some tests fail - report issue, turn off flag

const featureFlags = {
  main: true,
  customInputs: true
};
const features = {};
// TODO extract into function:
for (const name in featureFlags) if (featureFlags[name] === true) features[name] = {};
for (const name in features) {
  const fileNames = fs.readdirSync(`./features/${name}`);
  const jsFileNames = fileNames.filter(fileName => fileName.endsWith('.js'));
  for (const jsFileName of jsFileNames) {
    features[name][jsFileName.slice(0, jsFileName.length - 3)] = await import(`./features/${name}/${jsFileName}`);
  }
}

const results = await tester.runPrelaunchTests(features);
console.log('testResults:', results);
if (results.pass) launch();

function launch() {
  const SIZE = 100;
  const DIV1 = 3;
  const DIV2 = 5;
  outputFizzBuzz(features.main.fizzBuzz.solveFizzBuzz(SIZE, DIV1, DIV2));
}

// IO function!
function outputFizzBuzz(outputList) {
  console.log(outputList);
}

// logger
function logAllFunctions() {
  for (const key in window) {
    if (typeof window[key] !== "function") continue;
    const originalFunction = window[key];
    window[key] = function (...args) {
      console.log(`Calling ${key} with arguments:`, args); // TODO keep in array, async flush
      return originalFunction.apply(this, args);
    };
  }
}