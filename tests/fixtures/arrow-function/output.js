function $$await(v) {
  var $rootScope;

  try {
    $rootScope = $$await.$rootScope || ($$await.$rootScope = angular.element(document.body).injector().get("$rootScope"));
  } catch (e) {}

  $rootScope && $rootScope.$$phase == null && $rootScope.$applyAsync();
  return v;
}

const foo = async () => $$await((await getData()));