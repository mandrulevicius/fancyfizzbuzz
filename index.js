'use strict';

import featureFlags from './featureFlags.js';
import importer from './importer.js';
import tester from './tester.js';
// REMINDER - COMMIT MORE OFTEN

// instead of just extracting code into functions, maybe should extract the function into setup?

// if a function is calling another function without it having been passed in, that is not ideal
// but not sure what would gain from passing around all functions.

await init();

async function init() {
  const results = await run(featureFlags.get());
  if (results.pass) return;
  console.log('Some tests failed, isolating passing features');
  const isolatedFeatureFlags = featureFlags.extractIsolated(results);
  console.log('isolatedFeatureFlags', isolatedFeatureFlags)
  const isolatedResults = run(isolatedFeatureFlags);
  if (!isolatedResults.pass) return console.log('ISOLATED FEATURES DID NOT PASS TESTS!');
}

async function run(featureFlags) {
  const features = await importer.importFeatures(featureFlags);
  logAllFunctions(features);
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

// logger - doesnt work, need to get functions separately. probably from features.
function logAllFunctions(features) {
  // if logger goes through all functions, and tester goes through all functions
  // maybe should extract logic for going through all functions...
  for (const name in features) {
    for (const fileName in features[name]) {
      for (const functionName in features[name][fileName]) {
        // if readonly is the issue, should just move to another object...
        // maybe should be doing this when importing?
        features[name][fileName][functionName] = function (...args) {
          console.log(`Calling ${key} with arguments:`, args);
          // TODO keep in array, async flush
          // or not keep at all, depending on what logging level is enabled?
          // should functions themselves declare what logging level they should be using?
          const result = originalFunction.apply(this, args);
          console.log(`${key} result:`, result);
          return result;
        };
      }
    }
  }
}