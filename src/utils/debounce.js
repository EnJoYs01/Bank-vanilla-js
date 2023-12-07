export function debounce(func, timer) {
  let timeout;

  return function (...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, timer);
  };
}
