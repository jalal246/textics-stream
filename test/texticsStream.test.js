import { expect } from "chai";
import fs from "fs";
import path from "path";

import TexticsStream from "../src";

const paragraph = "Hello world!";

const LOOP = 100;

const expectedLines = LOOP;
const expectedWords = 2 * LOOP;
const expectedChars = 11 * LOOP;
const expectedSpaces = 1 * LOOP;

const fileStatTest = path.join(__dirname, "txtStreamFileSample.txt");

describe("Testing simple samples", () => {
  it("Creates file to test", () => {
    const wr = fs.createWriteStream(fileStatTest);

    for (let i = 0; i < LOOP; i += 1) {
      wr.write(`${paragraph}\n`);
    }

    wr.end();
  });

  it("Gets all data once calculates it correctly", done => {
    const rStream = fs.createReadStream(fileStatTest);

    const txtStream = new TexticsStream();

    rStream.pipe(txtStream);

    rStream.on("end", () => {
      const result = txtStream.getStat();

      expect(result).to.deep.equal({
        lines: expectedLines + 1,
        words: expectedWords,
        chars: expectedChars,
        spaces: expectedSpaces
      });
      done();
    });
  });

  it("Gets small chunks correctly", done => {
    const rStream = fs.createReadStream(fileStatTest, {
      highWaterMark: 10
    });

    const txtStream = new TexticsStream();

    rStream.pipe(txtStream);

    txtStream.on("latChunkStat", result => {
      expect(result).to.have.all.keys("lines", "words", "chars", "spaces");
    });

    rStream.on("end", () => {
      const result = txtStream.getStat();

      expect(result).to.deep.equal({
        lines: expectedLines + 1,
        words: expectedWords,
        chars: expectedChars,
        spaces: expectedSpaces
      });
      done();
    });
  });

  it("Deletes test-file", () => {
    fs.unlinkSync(fileStatTest);
  });
});
