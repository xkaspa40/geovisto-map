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

export const isEmpty = (obj) => {
  return typeof obj === 'object' && obj !== null && Object.keys(obj).length === 0;
};

export const sortReverseAlpha = (a, b) => {
  if (a < b) return 1;
  if (a > b) return -1;
  return 0;
};
