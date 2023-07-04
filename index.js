'use strict';

import importer from './importer.js';
import tester from './tester.js';
// REMINDER - COMMIT MORE OFTEN

// instead of just extracting code into functions, maybe should extract the function into setup?

// if a function is calling another function without it having been passed in, that is not ideal
// not sure what would gain from passing around all functions.

const featureFlags = {
  main: true,
  customInputs: true
};

const results = await init(featureFlags);
if (results.pass) return;
console.log('Some tests failed, isolating passing features');
const isolatedFeatureFlags = extractIsolatedFeatureFlags(results);
const isolatedResults = init(isolatedFeatureFlags);
if (!isolatedResults.pass) return console.log('ISOLATED FEATURES DID NOT PASS TESTS!');

async function init(featureFlags) {
  const features = await importer.importFeatures(featureFlags);
  const results = await tester.runPrelaunchTests(features);
  console.log('TestResults:', results); // log results
  if (results.pass) launch(features);
  return results.pass;
}
// will need to deal with console logs

function launch(features) {
  const SIZE = 100;
  const DIV1 = 3;
  const DIV2 = 5;
  outputFizzBuzz(features.main.fizzBuzz.solveFizzBuzz(SIZE, DIV1, DIV2));
  // will need to deal with dots
}

// IO function - output to user!
function outputFizzBuzz(outputList) {
  console.log(outputList);
}

function extractIsolatedFeatureFlags(results) {
  delete results.pass;
  // should check if results.pass is false or null before deleting.
  // or will do nothing if no features anyway?
  const isolatedFeatureFlags = {};
  for (const featureName in results) isolatedFeatureFlags[featureName] = results[featureName].pass;
  return isolatedFeatureFlags;
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