/* eslint-env mocha */

import chai from 'chai';
import fs from 'fs';
import path from 'path';

import TStream from '../src';

const expect = chai.expect;

const p = 'you got the   power ';
let txt = '';
const LOOP1 = 102;
const LOOP2 = 8200;


const fileStatTest = path.join(__dirname, 'one.line.txt');


describe('No line ending for the stream', () => {
  it('re-init file with no lines-breaking', () => {
    for (let i = 0; i < LOOP1; i += 1) txt += `${p} `;
    const wr = fs.createWriteStream(fileStatTest);
    for (let i = 0; i < LOOP2; i += 1) {
      wr.write(`${txt}`);
    }
    wr.end();
  });
  it('tests pool limits and warnings', () => {
    const rStream = fs.createReadStream(fileStatTest, { highWaterMark: 512 });
    const ts = TStream();
    rStream.pipe(ts);
    ts.textics.once('getAll', (r) => {
      // console.log('all: ', r);
      expect(r).to.be.an('object');
    });
  });
  it('delete test-file', () => {
    fs.unlinkSync(fileStatTest);
  });
});
