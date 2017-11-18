function $$await(v) {
  var $rootScope = $$await.$rootScope || ($$await.$rootScope = angular.element(document.body).injector().get("$rootScope"));
  $rootScope.$$phase == null && $rootScope.$applyAsync();
  return v;
}

const foo = async () => $$await((await getData()));