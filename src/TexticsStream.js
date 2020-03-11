/* eslint-disable no-underscore-dangle */
import stream from "stream";
import EventEmitter from "events";
import Statistics from "./Statistics";

const { Transform } = stream;

class TexticsStream extends Transform {
  constructor(args) {
    super(args);

    this.statistics = new Statistics();
    this.emitter = new EventEmitter();
  }

  _transform(chunk, encoding, cb) {
    const { start, getStat } = this.statistics;
    /**
     * Handling chunk
     */
    start(chunk);

    this.emitter("textics", getStat());

    /**
     * Push it to readable.
     */
    this.push(chunk);

    cb();
  }

  _flush(cb) {
    const { flush, getStat } = this.statistics;

    flush();
    this.textics.emit("textics", getStat());
    cb();
  }
}

export default TexticsStream;
