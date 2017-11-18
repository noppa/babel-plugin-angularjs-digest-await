
function $$await(v) {
  var $rootScope = $$await.$rootScope || ($$await.$rootScope = angular.element(document.body).injector().get("$rootScope"));
  $rootScope.$$phase == null && $rootScope.$applyAsync();
  return v;
}

async function foo(third) {
  const first = $$await((await getData(async function (second) {
    return $$await((await second));
  })));
  return $$await((await third));
}