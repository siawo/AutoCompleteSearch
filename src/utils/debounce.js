
export default (func, delay, argumentPicker = x => x) => {
    let inDebounce
    return function () {
      const context = this,
        args = argumentPicker(arguments);
      clearTimeout(inDebounce);
      inDebounce = setTimeout(() => func.apply(context, args), delay);
    }
  }