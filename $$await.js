(function() {
  var $rootScope;
  /* eslint-disable no-empty */
  /* globals window document angular */
  function $$await(v) {
    if (!$rootScope && typeof angular !== 'undefined') {
      var $el = angular.element(document.body);
      var $injector = $el.injector;
      if (typeof $injector === 'function') {
        $rootScope = $injector.call($el).get('$rootScope');
      }
    }

    $rootScope && $rootScope.$$phase == null && $rootScope.$applyAsync();
    return v;
  }

  window.$$await = $$await;
})();