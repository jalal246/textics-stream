/* eslint no-underscore-dangle: ["error", { "allow": ["_transform", "_flush"] }] */
/* eslint func-names: ["error", "never"] */

import { util, stream } from "../deps";

import Stat from "./Stat";
import TEmitter from "./TEmitter";

const { Transform } = stream;

function TStream(opt) {
  if (!(this instanceof TStream)) {
    return new TStream(opt);
  }
  const opts = opt || {};
  this.isPush = opts.isPush === true;
  this.statis = new Stat();
  this.textics = new TEmitter();
  Transform.call(this, opt);
}
util.inherits(TStream, Transform);

TStream.prototype._transform = function(chunk, encoding, cb) {
  if (this.isPush) this.push(chunk);
  this.statis.count(chunk);
  this.textics.emit("getLast", this.statis.getResults("last"));
  cb();
};

TStream.prototype._flush = function(cb) {
  this.statis.flush();
  this.textics.emit("getAll", this.statis.getResults(""));
  cb();
};

export default TStream;
