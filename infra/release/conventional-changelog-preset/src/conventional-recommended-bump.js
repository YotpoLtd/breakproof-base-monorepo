'use strict';

const parserOpts = require('conventional-changelog-angular/parser-opts');

module.exports = {
  parserOpts,

  whatBump: (commits) => {
    let shouldRelease = false;
    let level = 2;
    let breakings = 0;
    let features = 0;

    commits.forEach((commit) => {
      if (commit.notes.length > 0) {
        breakings += commit.notes.length;
        level = 0;
        shouldRelease = true;
        // eslint-disable-next-line sonarjs/elseif-without-else -- migrating package
      } else if (commit.type === 'feat') {
        features += 1;
        if (level === 2) {
          level = 1;
        }
      }
      if (!commit.type || ['feat', 'fix', 'perf'].includes(commit.type)) {
        shouldRelease = true;
      }
    });
    if (!shouldRelease) {
      return null;
    }
    return {
      level: level,
      reason:
        breakings === 1
          ? `There is ${breakings} BREAKING CHANGE and ${features} features`
          : `There are ${breakings} BREAKING CHANGES and ${features} features`,
    };
  },
};
