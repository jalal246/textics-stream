const service = 'textics-stream';
const warnLevels = [
  `${service} faild to detect new-line in the stream`,
  `${service} may have lines-count issues in final results`,
];

const warn = warnIndex => process.emitWarning(`\x1b[33m${warnLevels[warnIndex]}\x1b[0m`);

export default warn;
