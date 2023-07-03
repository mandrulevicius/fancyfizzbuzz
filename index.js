'use strict';

import importer from './importer.js';
import tester from './tester.js';
// REMINDER - COMMIT MORE OFTEN

// instead of just extracting code into functions, maybe should extract the function into setup?
// if a function is calling another function without it having been passed in, that is a side effect

const featureFlags = {
  main: true,
  customInputs: true
};
const features = await importer.importFeatures(featureFlags);
const results = await tester.runPrelaunchTests(features);
console.log('TestResults:', results); // log results

// TODO refactor
if (results.pass) launch(features);
else {
  // should check if results.pass is false or null before deleting.
  // will do nothing if no features anyway
  delete results.pass;
  const isolatedFeatureFlags = {};
  for (const featureName in results) isolatedFeatureFlags[featureName] = results[featureName].pass;
  const isolatedFeatures = await importer.importFeatures(isolatedFeatureFlags);
  const isolatedResults = await tester.runPrelaunchTests(isolatedFeatures);
  console.log('IsolatedTestResults:', isolatedResults); // log results
  if (isolatedResults.pass) launch(isolatedFeatures);
  // if isolatedResults fail, should break loudly
}

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