'use strict';
const { sync } = require('conventional-commits-parser');
const preset = require('../index');

function gitCommitObject(commitText) {
  const parsed = sync(commitText);
  return parsed;
}
function gitCommitObjectsArray(commitTextsArray) {
  return commitTextsArray.map(gitCommitObject);
}

const setups = [
  {
    comment:
      'Should return null if commits no contain any of the following types: feat, fix, perf',
    commits: gitCommitObjectsArray([
      'ci: update ci flow',
      'test: fix texts',
      'refactor: change everything',
    ]),
    shouldReturnNull: true,
  },
  {
    comment:
      'Should return 0 if commits contain BREAKING CHANGES disregarding commit type',
    commits: gitCommitObjectsArray([
      `build(npm): edit build script
BREAKING CHANGE: The Change is huge.`,
      `test(*): more tests
BREAKING CHANGE: The Change is huge.`,
    ]),
    expectedBump: 0,
  },
  {
    comment: 'Should treat commits without type as fix',
    commits: gitCommitObjectsArray(['no-type oops', 'ci: update ci flow']),
    expectedBump: 2,
  },
  {
    comment: 'Should return 2 if commits only contain fixes',
    commits: gitCommitObjectsArray(['fix: tiny fix', 'ci: update ci flow']),
    expectedBump: 2,
  },
  {
    comment: 'Should return 2 if commits contain perf type',
    commits: gitCommitObjectsArray([
      'build: first build setup',
      'ci(travis): add TravisCI pipeline',
      'perf(ngOptions): make it faster',
    ]),
    expectedBump: 2,
  },
  {
    comment: 'Should return 1 if commits contains feat type',
    commits: gitCommitObjectsArray([
      'feat(awesome): addresses the issue brought up in #133',
    ]),
    expectedBump: 1,
  },
];

describe('breakproof repo preset', function () {
  setups.forEach(({ comment, commits, expectedBump, shouldReturnNull }) => {
    it(comment, async function () {
      const {
        recommendedBumpOpts: { whatBump },
      } = await preset;

      const bump = whatBump(commits);
      if (shouldReturnNull) {
        expect(bump).toEqual(null);
        return;
      }
      expect(bump.level).toEqual(expectedBump);
    });
  });
});
