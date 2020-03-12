/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line max-classes-per-file
import stream from "stream";
import EventEmitter from "events";
import Statistics from "./Statistics";

const { Transform } = stream;

const statistics = new Statistics();

class TexticsStream extends Transform {
  constructor(args) {
    super(args);

    this.emitter = new EventEmitter();
    this.statistics = statistics;
  }

  _transform(chunk, encoding, cb) {
    const { start, getStat } = this.statistics;
    /**
     * Handling chunk
     */
    start(chunk);

    /**
     * Push it to readable.
     */
    this.push(chunk);

    this.emitter("getStat", getStat());

    cb();
  }

  _flush(cb) {
    const { flush, getStat } = this.statistics;

    flush();
    this.emitter("getStat", getStat());
    cb();
  }
}

export default TexticsStream;
