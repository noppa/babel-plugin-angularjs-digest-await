const foo = async () => {
  return await __angularjsDigestAwait(getData());

  function __angularjsDigestAwait(v) {
    var $q = __angularjsDigestAwait.$q || angular.injector("ng").get("$q");
    return $q.when(v);
  }
};