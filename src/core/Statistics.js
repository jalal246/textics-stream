import getSliceCharNumber from "./utils";

const { textics } = require("textics");

class Statistics {
  constructor() {
    this.lines = 0;
    this.words = 0;
    this.chars = 0;
    this.spaces = 0;

    this.pool = "";
  }

  count(str) {
    const { lines, words, chars, spaces } = textics(str);

    this.lines += lines;
    this.words += words;
    this.chars += chars;
    this.spaces += spaces;
  }

  slicePoolAt(i) {
    const toBeCount = this.pool.slice(0, i);
    this.count(toBeCount);

    this.pool = this.pool.slice(i, this.pool.length);
  }

  start(chunk) {
    this.pool += chunk.toString();

    const sliceAtNum = getSliceCharNumber(this.pool);

    this.slicePoolAt(sliceAtNum);
  }

  getResults() {
    return {
      lines: this.lines,
      words: this.words,
      chars: this.chars,
      spaces: this.spaces
    };
  }
}

export default Statistics;
