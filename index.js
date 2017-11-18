module.exports = function(babel) {
  var t = babel.types;

  var defaultOptions = {
    helperFunctionName: '$$await',
    $rootScope: 'angular.element(document.body).injector().get("$rootScope")'
  };
    
  // Key that marks that a $$await helper function has been
  // added to the topmost scope already.
  var HELPERS_DECLARED_KEY = 'angularjsDigestAwait/helpers-declared';
  
  // Template for the $$await helper function.
  // Function name and the expression to get $rootScope are configurable.
  /* eslint-disable */
  var buildHelperFunction = babel.template((function HELPER_FUNCTION_NAME(v) {
    var $rootScope;
    try {
      $rootScope = HELPER_FUNCTION_NAME.$rootScope ||
        (HELPER_FUNCTION_NAME.$rootScope = ROOT_SCOPE);
    } catch(e) {}
    $rootScope && $rootScope.$$phase == null && $rootScope.$applyAsync();
    return v;
  }).toString());
  /* eslint-enable */

  function getOption(opts, key) {
    return opts && opts.hasOwnProperty(key) ? opts[key] : defaultOptions[key];
  }
  
  // Checks if an AwaitExpression path has already been
  // wrapped by this plugin.
  function noWrappingNeeded(path, helperFunctionName) {
    var parent = path.parentPath;
    var isGeneratedExpression =
      !!parent
      && t.isCallExpression(parent)
      && t.isIdentifier(parent.node.callee, { name: helperFunctionName });

    return isGeneratedExpression;
  }

  function getTopScope(path) {
    var p = path, parent;
    while((parent = p.parentPath)) p = parent;
    return p;
  }

  // If the default template for $rootScope is used,
  // we can cache the result of babel.template() call.
  var cachedRootScopeTemplate;

  return {
    visitor: {
      AwaitExpression: function(path, state) {
        var opts = state.opts;
        var helperFunctionName = getOption(opts, 'helperFunctionName');
        if (noWrappingNeeded(path, helperFunctionName)) return;

        // Generate $$await helper function to the top of the file.
        var topScope = getTopScope(path);
        var helpersDeclared = topScope.getData(HELPERS_DECLARED_KEY);
        if (!helpersDeclared) {
          var rootScopeTemplate = getOption(opts, '$rootScope');
          var rootScopeExpression;
          try {
            if (rootScopeTemplate === defaultOptions.$rootScope) {
              if (!cachedRootScopeTemplate) {
                cachedRootScopeTemplate = babel.template(defaultOptions.$rootScope);
              }
              rootScopeExpression = cachedRootScopeTemplate();
            } else {
              rootScopeExpression = babel.template(rootScopeTemplate)();
            }
          } catch (err) {
            var errorMsg = 'Building $rootScope expression '
              + rootScopeTemplate
              + ' failed with error:\n'
              + err;
            throw new Error(errorMsg);
          }

          var ast = buildHelperFunction({
            ROOT_SCOPE: rootScopeExpression,
            HELPER_FUNCTION_NAME: t.identifier(helperFunctionName)
          });
          topScope.unshiftContainer('body', ast);
          topScope.setData(HELPERS_DECLARED_KEY, true);
        }
        
        var newPath = t.callExpression(
          t.identifier(helperFunctionName),
          [path.node]
        );

        path.replaceWith(newPath);
      }
    }
  };
};