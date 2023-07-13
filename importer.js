'use strict';

import fs from 'fs';
import logger from './logger.js';

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
    const fileName = truncExtension(jsFileName, '.js');
    feature[fileName] = logger.attach(jsFile, fileName, name);
  }
  return feature;
}

function truncExtension(fileName, extension) {
  return fileName.slice(0, fileName.length - extension.length);
}

export default { importFeatures };
