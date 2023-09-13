'use strict';

import logger from './logger.js';
import featureFlagsFile from './featureFlags.js';
import importerFile from './importer.js';
import testerFile from './tester.js';

const featureFlags = logger.attach(featureFlagsFile, 'featureFlags', 'index');
const importer = logger.attach(importerFile, 'featureFlags', 'index');
const tester = logger.attach(testerFile, 'featureFlags', 'index');

// REMINDER - COMMIT MORE OFTEN

// instead of just extracting code into functions, maybe should extract the function into setup?

// if a function is calling another function without it having been passed in, that is not ideal
// but not sure what would gain from passing around all functions.

await init();

async function init() {
  const results = await run(featureFlags.get());
  if (results.pass) return; // dont like this repeating if
  const isolatedFeatureFlags = featureFlags.extractIsolated(results);
  const isolatedResults = await run(isolatedFeatureFlags);
  if (!isolatedResults.pass) return console.log('ISOLATED FEATURES DID NOT PASS TESTS!');
}

async function run(featureFlags) {
  const features = await importer.importFeatures(featureFlags);
  const results = await tester.runPrelaunchTests(features);
  if (results.pass) launch(features); // dont like this repeating if
  return results;
}

function launch(features) {
  const SIZE = 100;
  const DIV1 = 3;
  const DIV2 = 5;
  outputFizzBuzz(features.main.fizzBuzz.solveFizzBuzz(SIZE, DIV1, DIV2));
  console.log(logger.getLogs());
  // will need to deal with dots
}

// IO function - output to user!
function outputFizzBuzz(outputList) {
  // only need to output to user - dev already sees result from logs
  // console.log(outputList);
}

// how would fizzbuzz as a standalone module look like?
// should still use other modules like testframework.