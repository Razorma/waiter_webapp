export default function helpers() {
     function capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    function eq(a, b, options) {
      return a === b ? options.fn(this) : options.inverse(this);
    }
    function ifCond(v1, operator, v2, options) {
      switch (operator) {
          case '===':
              return (v1 === v2) ? options.fn(this) : options.inverse(this);
          default:
              return options.inverse(this);
      }
  }

  return{
    capitalize,
    eq,
    ifCond
  }
  }