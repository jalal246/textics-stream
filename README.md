[![NPM](https://nodei.co/npm/textics-stream.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/textics-stream/)

[![Travis](https://img.shields.io/travis/rust-lang/rust.svg?style=flat-square)](travis-ci.org/Jimmy02020/textics-stream)
[![Codecov](https://img.shields.io/codecov/c/github/codecov/example-python.svg?style=flat-square)](https://codecov.io/gh/Jimmy02020/textics-stream)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://github.com/Jimmy02020/textics-stream/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/Jimmy02020/textics-stream/pulls)


> Node Text Statistics For Streams

`textics-stream` is [textics](https://github.com/Jimmy02020/textics) which counts lines, words, chars and spaces for [stream](https://nodejs.org/api/stream.html).

Getting Started
---------------

GIT:
```sh
git clone git@github.com:jimmy02020/textics-stream.git
cd textics-stream
```

NPM
```sh
npm install textics-stream
```

Using textics-stream
--------------------

```javascript
import TStream from 'textics-stream';

const ts = new TStream()

readStream.pipe(ts);

ts.textics.on('getLast', (lastChunkStat) => {
  console.log(lastChunkStat);
});
ts.textics.once('getAll', (allStat) => {
  console.log(allStat);
  //
  {
    lines: 1830,
    words: 4483,
    chars: 12584,
    spaces: 3004,
  }
  //
});
```
For pushing the stream to another pipe, pass `{ isPush: true }` to `TStream` constructor.
```javascript
const ts = new TStream({isPush: true})

readStream
  .pipe(ts)
  .pipe(..)
```

Tests
-----

```sh
npm test
```


License
-------

This project is licensed under the [MIT License](https://github.com/Jimmy02020/textics-stream/blob/master/LICENSE)
