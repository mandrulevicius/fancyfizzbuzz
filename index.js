'use strict';

import importer from './importer.js';
import tester from './tester.js';
// REMINDER - COMMIT MORE OFTEN

// instead of just extracting code into functions, maybe should extract the function into setup?
// if a function is calling another function without it having been passed in, that is a side effect

// first, test when customInputs feature is missing.
//  should work fine since the flag is off
// if customInputs: true, but no tests have been found - report issue
// if customInputs: true, but some tests fail - report issue, turn off flag

const featureFlags = {
  main: true,
  customInputs: false
};
const features = await importer.importFeatures(featureFlags);
const results = await tester.runPrelaunchTests(features);
console.log('testResults:', results);
if (results.pass) launch();
// turn off failing features, run tests again

function launch() {
  const SIZE = 100;
  const DIV1 = 3;
  const DIV2 = 5;
  outputFizzBuzz(features.main.fizzBuzz.solveFizzBuzz(SIZE, DIV1, DIV2));
}

// IO function - output to user!
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