export default `
  // appends a query param to each systemjs request to trigger systemjs transformation
  var originalResolve = System.constructor.prototype.resolve;
  System.constructor.prototype.resolve = function () {
    return Promise.resolve(originalResolve.apply(this, arguments))
      .then(function (url) {
        return url + (url.indexOf('?') > 0 ? '&' : '?') + 'transform-systemjs';
      });
  };
`;
