'use strict';
const conventionalChangelog = require('conventional-changelog-angular/conventional-changelog');
const parserOpts = require('conventional-changelog-angular/parser-opts');
const recommendedBumpOpts = require('./conventional-recommended-bump');
const writerOpts = require('conventional-changelog-angular/writer-opts');

module.exports = Promise.all([
  conventionalChangelog,
  parserOpts,
  recommendedBumpOpts,
  writerOpts,
]).then(
  ([conventionalChangelog, parserOpts, recommendedBumpOpts, writerOpts]) => ({
    conventionalChangelog,
    parserOpts,
    recommendedBumpOpts,
    writerOpts,
  }),
);
