function $$await(v) {
  var $q = $$await.$q || angular.injector("ng").get("$q");
  return $q.when(v);
}

const foo = async () => await $$await(getData());