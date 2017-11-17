
function __angularjsDigestAwait(v) {
  var $q = __angularjsDigestAwait.$q || angular.injector("ng").get("$q");
  return $q.when(v);
}

async function foo(third) {
  const first = await __angularjsDigestAwait(getData(async function (second) {
    return await __angularjsDigestAwait(second);
  }));
  return await __angularjsDigestAwait(third);
}