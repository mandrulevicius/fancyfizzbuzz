'use strict';

// only logs public functions

function attach(jsFile) {
  const jsFileWithLogger = {};
  for (const funcName in jsFile) jsFileWithLogger[funcName] = addLogger(jsFile[funcName]);
  return jsFileWithLogger;
}

function addLogger(func) {
  if (func.constructor.name === 'AsyncFunction') return async function(...args) {
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

export default { attach };