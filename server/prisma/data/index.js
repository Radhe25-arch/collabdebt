const { javascriptTracks } = require('./javascript.js');
const { pythonTracks } = require('./python.js');

// Core Programming Languages
const { coreLanguagesMastery } = require('./programming-languages-core.js');
const { webMobileLanguagesMastery } = require('./programming-languages-web-mobile.js');
const { specializedLanguagesMastery } = require('./programming-languages-spec.js');

// Elite Domain Architectures
const { domainArchitectureMastery } = require('./domain-architecture-elite.js');

// Legacy Massive Courses (keeping for volume)
const { massiveCourses } = require('./massive-courses.js');

// Aggregation of all curriculum groups
const expertCourses = [
  ...javascriptTracks,
  ...pythonTracks,
  ...coreLanguagesMastery,
  ...webMobileLanguagesMastery,
  ...specializedLanguagesMastery,
  ...domainArchitectureMastery,
  ...massiveCourses
];

module.exports = { expertCourses };
