'use strict';

// only logs public functions
// to log all, might want to try metaprogramming

const logs = [
//  { main: { fizzBuzz: { solveFizzBuzz: { args: [100, 3, 5], result: 'res'}}}},
//  { main: { fizzBuzz: { solveFizzBuzz: { toFizzBuzz: { args:[100, 3, 5], result: 'ok'}}}} },
]; // this seems ugly. see what others have already done regarding this.
// what if solveFizzBuzz calls a function from another file? - caller is different than feature path
// have to choose how to structure logs - either by file structure or call stack

function attach(jsFile, fileName, featureName) {
  const jsFileWithLogger = {};
  for (const funcName in jsFile) jsFileWithLogger[funcName] = addLogger(jsFile[funcName], fileName, featureName);
  return jsFileWithLogger;
}

function addLogger(func, fileName, featureName) {
  if (func.constructor.name === 'AsyncFunction') return async function(...args) {
    const result = await func.apply(this, args);
    logs.push({[featureName]:{[fileName]:{[func.name]:{args, result}}}});
    return result;
  }
  return function(...args) {
    const result = func.apply(this, args);
    logs.push({[featureName]:{[fileName]:{[func.name]:{args, result}}}});
    return result;
  }
      // TODO keep in array, async flush
      // or not keep at all, depending on what logging level is enabled?
      // should functions themselves declare what logging level they should be using?
}

function getLogs() {
  return logs;
}

// how to determine function depth?
// should determine at run time - if one log function is not finished running
// how about async calls?

export default { attach, getLogs };