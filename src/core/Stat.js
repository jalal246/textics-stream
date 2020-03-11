import warn from "../err";

const textics = require("textics");

const MAX_WARN_ALLOWED = 2;

class Statistics {
  getResults() {}
  add() {}
  flush() {}
  slicePool() {}
  count() {}
}

export default Statistics;
function Stat() {
  this.allLines = 0;
  this.allWords = 0;
  this.allChars = 0;
  this.allSpaces = 0;
  // last
  this.lastln = 0;
  this.lastWrd = 0;
  this.lastChr = 0;
  this.lastSps = 0;
  //
  this.rounds = 0; // number of chunks dosent have newline, be hold in pool.
  this.warnSent = 0;
  this.isSliced = false;
  this.pool = ""; // for handling chunks
}

Stat.prototype.getResults = function(type) {
  return type === "last"
    ? {
        lines: this.lastln,
        words: this.lastWrd,
        chars: this.lastChr,
        spaces: this.lastSps
      }
    : {
        lines: this.allLines,
        words: this.allWords,
        chars: this.allChars,
        spaces: this.allSpaces
      };
};

Stat.prototype.add = function(str, lastCall = false) {
  const statics = textics(str);

  this.lastln = lastCall ? 0 : statics.lines;
  this.lastWrd = statics.words;
  this.lastChr = statics.chars;
  this.lastSps = statics.spaces;
  //
  this.allLines += this.lastln;
  this.allWords += this.lastWrd;
  this.allChars += this.lastChr;
  this.allSpaces += this.lastSps;
};

// fushing pool.
Stat.prototype.flush = function(isLastChunk = true) {
  this.add(this.pool, isLastChunk);
  if (isLastChunk) this.pool = undefined;
  else this.pool = "";
};

Stat.prototype.slicePool = function(i, CRLF) {
  this.add(this.pool.slice(0, CRLF ? i - 1 : i));
  this.pool = this.pool.slice(i, this.pool.length);
  this.isSliced = true;
  if (this.rounds >= 0) this.rounds -= 1;
};

Stat.prototype.count = function(chunk) {
  // reset isSliced
  this.isSliced = false;
  this.pool += chunk.toString();
  // looking for new line
  if (/\n\r/.test(this.pool) || /\n/.test(this.pool) || /\r/.test(this.pool)) {
    for (let i = this.pool.length; i > 0; i -= 1) {
      const code = this.pool.charCodeAt(i);
      // check if \r\n
      if (code === 10) {
        if (this.pool.charCodeAt(i - 1) === 13) {
          // CRLF, \r\n
          this.slicePool(i, true);
        } else {
          this.slicePool(i, false);
        }
        break;
      } else if (code === 13) {
        this.slicePool(i, false);
        break;
      }
    }
  }
  if (!this.isSliced) {
    this.rounds += 1;
    if (this.warnSent < MAX_WARN_ALLOWED) {
      if (this.rounds === 1) {
        warn(0);
        this.warnSent += 1;
      } else {
        warn(1);
        this.warnSent += 1;
      }
    } else {
      this.rounds = 0;
      this.flush(false);
    }
  }
};

export default Stat;
