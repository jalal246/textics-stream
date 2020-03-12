/* eslint-disable no-underscore-dangle */
import { textics } from "textics";

import stream from "stream";

import EventEmitter from "events";
import getLastLineCharNum from "./utils";

const { Transform } = stream;

class Statistics extends Transform {
  constructor() {
    super();

    this.lines = 0;
    this.words = 0;
    this.chars = 0;
    this.spaces = 0;

    this.pool = "";

    this.emitter = new EventEmitter();
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

  _transform(chunk, encoding, cb) {
    /**
     * Handling chunk
     */
    this.start(chunk);

    /**
     * Push it to readable.
     */
    this.push(chunk);

    console.log("Statistics -> _transform -> this.emitter", this.emitter);
    this.emitter.emit("getStat", this.getStat());

    cb();
  }

  _flush(cb) {
    this.count(this.pool);

    this.pool = "";

    this.emitter("getStat", this.getStat());

    cb();
  }
}

export default Statistics;
