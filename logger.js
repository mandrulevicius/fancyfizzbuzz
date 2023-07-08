'use strict';

// only logs public functions
// to log all, might want to try metaprogramming

const logs = [
  { main: { fizzBuzz: { solveFizzBuzz: { args: [100, 3, 5], result: 'res'}}}},
  { main: { fizzBuzz: { solveFizzBuzz: { toFizzBuzz: { args:[100, 3, 5], result: 'ok'}}}} },
]; // this seems ugly. see what others have already done regarding this.
// what if solveFizzBuzz calls a function from another file?
// have to choose how to structure logs - either by file structure or call stack

function attach(jsFile, fileName, featureName) {
  const jsFileWithLogger = {};
  for (const funcName in jsFile) jsFileWithLogger[funcName] = addLogger(jsFile[funcName]);
  return jsFileWithLogger;
}

function addLogger(func, fileName, featureName) {
  if (func.constructor.name === 'AsyncFunction') return async function(...args) {
    logs.push([featureName][fileName][func.name].args = args);
    // TODO FIX
    console.log(`Calling ${func.name} with arguments:`, args);
    const result = await func.apply(this, args);
    console.log(`${func.name} result:`, result);
    return result;
  }
  return function(...args) {
    console.log(`Calling ${func.name} with arguments:`, args);
    const result = func.apply(this, args);
    console.log(`${func.name} result:`, result);
    return result;
  }
      // TODO keep in array, async flush
      // or not keep at all, depending on what logging level is enabled?
      // should functions themselves declare what logging level they should be using?
}

// how to determine function depth?
// maybe easier if not outputting directly to console
// should determine at run time - if one log function is not finished running
// how about async calls?

// TODO log which feature the function belongs to

export default { attach };