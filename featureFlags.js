'use strict';

function get() {
  return {
    main: true,
    customInputs: true
  };
}

function extractIsolated(results) {
  delete results.pass;
  // should check if results.pass is false or null before deleting.
  // or will do nothing if no features anyway?
  const isolatedFeatureFlags = {};
  for (const featureName in results) isolatedFeatureFlags[featureName] = results[featureName].pass;
  return isolatedFeatureFlags;
}

export default { get, extractIsolated };
