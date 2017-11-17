
function $$await(v) {
  var $q = $$await.$q || angular.injector("ng").get("$q");
  return $q.when(v);
}

async function foo(third) {
  const first = await $$await(getData(async function (second) {
    return await $$await(second);
  }));
  return await $$await(third);
}