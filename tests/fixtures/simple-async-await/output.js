function $$await(v) {
  var $q = $$await.$q || ($$await.$q = angular.injector("ng").get("$q"));
  return $q.when(v);
}

async function foo() {
  return await $$await(getData());
}