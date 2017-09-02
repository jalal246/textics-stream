/* eslint-env mocha */

import chai from 'chai';
import fs from 'fs';
import path from 'path';

import TStream from '../src';

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

const fileStatTest = path.join(__dirname, 'oneType.txt');


describe('One line-ending', () => {
  it('init file with one type of line-ending \r\n', () => {
    txt = '';
    for (let i = 0; i < LOOP1; i += 1) {
      txt += `${p}\r\n`;
    }
    const wr = fs.createWriteStream(fileStatTest);
    for (let i = 0; i < LOOP2; i += 1) wr.write(txt);
    wr.end();
  });
  it('returns correct stats', (done) => {
    const rStream = fs.createReadStream(fileStatTest, { highWaterMark: 65 * 1024 });
    const ts = new TStream();
    rStream.pipe(ts);
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
  it('init file with one type of line-ending: \r', () => {
    txt = '';
    for (let i = 0; i < LOOP1; i += 1) {
      txt += `${p}\r`;
    }
    const wr = fs.createWriteStream(fileStatTest);
    for (let i = 0; i < LOOP2; i += 1) wr.write(txt);
    wr.end();
  });
  it('returns correct stats', (done) => {
    const rStream = fs.createReadStream(fileStatTest, { highWaterMark: 65 * 1024 });
    const ts = new TStream();
    rStream.pipe(ts);
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
  it('delete test-file', () => {
    fs.unlinkSync(fileStatTest);
  });
});
