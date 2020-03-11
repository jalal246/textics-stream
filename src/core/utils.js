/**
 * Finds last end location in a given string. If not found, function will return
 * the whole string length.
 *
 * @param {string} str
 * @returns {number}
 */
function getLastLineCharNum(str) {
  const { length } = str;

  let sliceAt = length;

  for (let i = length; i > 0; i -= 1) {
    const code = str.charCodeAt(i);

    if (code === 10) {
      sliceAt = i;

      break;
    }

    /**
     * CR /\r/
     * Code: 13
     */
    if (code === 13) {
      /**
       * LF /\n/
       * Code: 10
       */
      if (str.charCodeAt(i - 1) === 10) {
        sliceAt = i - 1;

        break;
      }

      sliceAt = i;

      break;
    }
  }

  return sliceAt;
}

export default getLastLineCharNum;
