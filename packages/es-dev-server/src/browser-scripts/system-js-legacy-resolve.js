export default `
<script nomodule>
  // appends a query param to each systemjs request to trigger es5 compilation
  var originalResolve = System.constructor.prototype.resolve;
  System.constructor.prototype.resolve = function () {
    return Promise.resolve(originalResolve.apply(this, arguments))
      .then(function (url) {
        return url + '?legacy=true';
      });
  };
</script>
`;
