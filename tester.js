"use strict";

async function runPrelaunchTests(features) {
  const results = { pass: true };
  for (const name in features) {
    results[name] = await testFeature(name, features[name]);
    if (!results[name].pass) results.pass = false;
  }
  return results;
}

// very similar functions. might be able to reduce duplicate code.
// before doing that, see if cannot move to setup
async function testFeature(name, feature) {
  const results = { pass: true };
  for (const fileName in feature) {
    results[fileName] = await testFile(name, fileName, feature[fileName]);
    if (!results[fileName].pass) results.pass = false;
  }
  return results;
}

async function testFile(featureName, name, file) {
  const results = { pass: true };
  const fileTests = await import(`./features/${featureName}/tests/${name}.test.js`);
  for (const functionName in file) {
    results[functionName] = testFunction(file[functionName], fileTests.tests[functionName]);
    if (!results[functionName].pass) results.pass = false;
  }
  return results;
}

function testFunction(func, tests) {
  const results = tests.map((test) => runTest(func, test.args, test.expectedResult));
  const pass = !results.some(result => result.pass === false);
  return { pass, results };
}

function runTest(func, inputArray, expectedOutput) {
  const actualOutput = func(...inputArray);
  return {
    pass: isEqual(expectedOutput, actualOutput),
    args: inputArray,
    expectedResult: expectedOutput,
    actualResult: actualOutput
  };
}

function isEqual(value1, value2) {
  // TODO move to setup, remove branches
  const PRIMITIVES = ['string', 'number', 'boolean', 'bigint', 'undefined', 'symbol'];
  if (typeof value1 !== typeof value2) return false;
  if (value1 === null || value2 === null) return value1 === value2;
  // null is considered primitive, but typeof is 'object'
  if (PRIMITIVES.includes(typeof value1)) return value1 === value2;
  if (typeof value1 === 'function') return value1.toString() === value2.toString();
  if (typeof value1 === 'object') return areObjectsDeepEqual(value1, value2); // RECURSION!
  // if here, something is very wrong and should break?
}

function areObjectsDeepEqual(object1, object2) {
  if (Array.isArray(object1) && Array.isArray(object2)) {
    if (object1.length !== object2.length) return false;
  } else if (!Array.isArray(object1) && !Array.isArray(object2)) {
    if (Object.keys(object1).length !== Object.keys(object2).length) return false;
  } else return false;
  
  for (const i in object1) if (!isEqual(object1[i], object2[i])) return false;
  return true;
}

export default { runPrelaunchTests };

// how to deal with internal functions?
// expose internal functions for testing, or import testRunner in each file?
// or testRunner reads files as text, build text into functions.
