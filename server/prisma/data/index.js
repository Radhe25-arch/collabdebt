const { javascriptMastery } = require('./javascript.js');
const { pythonMastery } = require('./python.js');
const { systemDesignMastery } = require('./system-design.js');

// Aggregation of all deep, curriculum-grade courses to seed
const expertCourses = [
  javascriptMastery,
  pythonMastery,
  systemDesignMastery
];

module.exports = { expertCourses };
