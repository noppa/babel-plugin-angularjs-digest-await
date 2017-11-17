function __angularjsDigestAwait(v) {
  var $q = __angularjsDigestAwait.$q || angular.injector("ng").get("$q");
  return $q.when(v);
}

const foo = async () => await __angularjsDigestAwait(getData());