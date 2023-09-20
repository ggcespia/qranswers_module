const utils = {
  validateInteger: (name, n, defaultVal) => {
    if (!Number.isInteger(n)) {
      if (defaultVal !== undefined) {
        return defaultVal;
      } else {
        throw new Error(`${name} must be an integer`);
      }
    }
    return n;
  },
}
module.exports = utils;