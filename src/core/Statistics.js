import getLastLineCharNum from "./utils";

const { textics } = require("textics");

class Statistics {
  constructor() {
    this.lines = 0;
    this.words = 0;
    this.chars = 0;
    this.spaces = 0;

    this.pool = "";
  }

  /**
   * Gets string statistics and add it to class instance.
   *
   * @param {string} str to be counted
   * @memberof Statistics
   */
  count(str) {
    const { lines, words, chars, spaces } = textics(str);

    this.lines += lines;
    this.words += words;
    this.chars += chars;
    this.spaces += spaces;
  }

  /**
   * Slices pool instance to two parts:
   * First one from zero length to given number. The remaining will be stored as
   * pool.
   *
   * @param {number} i
   * @memberof Statistics
   */
  slicePoolAt(i) {
    const toBeCount = this.pool.slice(0, i);
    this.count(toBeCount);

    this.pool = this.pool.slice(i, this.pool.length);
  }

  /**
   * Counts the remaining char and flushes pool.
   *
   * @memberof Statistics
   */
  flush() {
    this.count(this.pool);

    this.pool = "";
  }

  start(chunk) {
    this.pool += chunk.toString();

    const lastLineNum = getLastLineCharNum(this.pool);

    this.slicePoolAt(lastLineNum);
  }

  getStat() {
    return {
      lines: this.lines,
      words: this.words,
      chars: this.chars,
      spaces: this.spaces
    };
  }
}

export default Statistics;
