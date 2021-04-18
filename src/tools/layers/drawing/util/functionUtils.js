export function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
}

/**
 * @brief is array or object empty
 *
 * @param {Object | Array} obj
 * @returns {boolean}
 */
export const isEmpty = (obj) => {
  return typeof obj === 'object' && obj !== null && Object.keys(obj).length === 0;
};

export const sortReverseAlpha = (a, b) => {
  if (a < b) return 1;
  if (a > b) return -1;
  return 0;
};

export const sortAlpha = (a, b) => {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

export const isInt = (n) => Number(n) === n && n % 1 === 0;

export const isFloat = (n) => Number(n) === n && n % 1 !== 0;

export const getIntervalStep = (n) => {
  if (!n) return 0.0;
  let split = String(n).split('.');
  if (split.length === 2) {
    let after = split[1];
    let length = after.length - 1 < 0 ? 0 : after.length;
    let allZeros = [...Array(length)].join('0');

    if (length === 1) return 0.01;
    else if (length === 0) return 0.1;
    else return Number(`0.${allZeros}1`);
  }

  return 0.0;
};
