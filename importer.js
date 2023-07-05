'use strict';

import fs from 'fs';

// uses IO function
async function importFeatures(featureFlags) {
  const features = {};
  for (const name in featureFlags) if (featureFlags[name] === true) features[name] = {};
  for (const name in features) features[name] = await importFiles(name);
  return features;
}

// IO function - file system!
async function importFiles(name) {
  const feature = {};
  const fileNames = fs.readdirSync(`./features/${name}`);
  const jsFileNames = fileNames.filter(fileName => fileName.endsWith('.js'));
  for (const jsFileName of jsFileNames) {
    const jsFile = await import(`./features/${name}/${jsFileName}`);
    feature[truncExtension(jsFileName, '.js')] = getFileWithLogger(jsFile);
  }
  return feature;
}

function getFileWithLogger(jsFile) {
  const jsFileWithLogger = {};
  for (const funcName in jsFile) jsFileWithLogger[funcName] = addLogger(jsFile[funcName]);
  return jsFileWithLogger;
}

function addLogger(func) {
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

function truncExtension(fileName, extension) {
  return fileName.slice(0, fileName.length - extension.length);
}

export default { importFeatures };
