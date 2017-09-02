/* eslint func-names: ["error", "never"] */

import {
  util,
  EventEmitter,
} from '../deps';

function TEmitter() {
  EventEmitter.call(this);
}
util.inherits(TEmitter, EventEmitter);

export default TEmitter;
