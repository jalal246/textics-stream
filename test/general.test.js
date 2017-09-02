/* eslint-env mocha */
/* eslint no-underscore-dangle: ["error", { "allow": ["_transform", "_flush"] }] */
/* eslint func-names: ["error", "never"] */

import chai from 'chai';
import fs from 'fs';
import path from 'path';
import stream from 'stream';
import util from 'util';

// import TStream from '../src';

import TStream from '../lib/tStream';

// console.log(TStream);
const expect = chai.expect;

const p = 'you got the   power ';
let txt = '';
const LOOP1 = 102;
const txtlinesNum = LOOP1;
const txtWordsNum = 4 * LOOP1;
const txtCharNum = 14 * LOOP1;
const txtSpacesNum = 6 * LOOP1;
const LOOP2 = 2200;
const linesNum = LOOP2 * txtlinesNum;
const wordsNum = LOOP2 * txtWordsNum;
const charNum = LOOP2 * txtCharNum;
const spacesNum = LOOP2 * txtSpacesNum;

const fileStatTest = path.join(__dirname, 'general.txt');


describe('General test', () => {
  it('init file with various line-ending', () => {
    let nl = 0;
    for (let i = 0; i < LOOP1; i += 1) {
      nl += 1;
      if (nl === 1) txt += `${p}\r`;
      else if (nl === 2) txt += `${p}\r\n`;
      else txt += `${p}\n`;
      if (nl === 3) nl = 0;
    }
    const wr = fs.createWriteStream(fileStatTest);
    for (let i = 0; i < LOOP2; i += 1) wr.write(txt);
    wr.end();
  });
  it('returns correct stats with different line-endings', (done) => {
    const rStream = fs.createReadStream(fileStatTest, { highWaterMark: 65 * 1024 });
    const ts = new TStream();
    rStream.pipe(ts);
    // ts.textics.on('getLast', (r) => {
    //   console.log(r);
    // });
    ts.textics.once('getAll', (r) => {
      // console.log('all: ', r);
      expect(r).to.deep.equal({
        lines: linesNum,
        words: wordsNum,
        chars: charNum,
        spaces: spacesNum,
      });
      done();
    });
  });
  it('pushes stream to pipe', () => {
    const Transform = stream.Transform;
    function Test() { Transform.call(this); }
    util.inherits(Test, Transform);
    Test.prototype._transform = function (chunk, encoding, cb) {
      expect(chunk).to.be.a('string');
      cb();
    };
    const rStream = fs.createReadStream(fileStatTest);
    const ts = new TStream({ isPush: true });
    rStream.pipe(ts).pipe(new Test());
  });
  it('delete test-file', () => {
    fs.unlinkSync(fileStatTest);
  });
});
