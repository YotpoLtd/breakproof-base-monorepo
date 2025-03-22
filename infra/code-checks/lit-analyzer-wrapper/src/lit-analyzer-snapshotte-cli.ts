#!/usr/bin/env node
import { runSnapshotterCli } from '@repo/code-problem-snapshotter/snapshotter-cli';

import { getCodeProblemListFromLitAnalyzerOutput } from './lit-analyzer-ouput-parser';

const SNAPSHOT_FILENAME = '.lit-problems-snapshot.json';
runSnapshotterCli(getCodeProblemListFromLitAnalyzerOutput, SNAPSHOT_FILENAME);
