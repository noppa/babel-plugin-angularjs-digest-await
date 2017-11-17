module.exports.default = function(babel) {
  var t = babel.types;

  var defaultOptions = {
    helperFunctionName: '__angularjsDigestAwait',
    moduleName: 'ng'
  };
  var options = defaultOptions;
  
  var DATA_KEY = 'angularjsDigestAwait/';
  var HELPERS_DECLARED_KEY = DATA_KEY + 'helpers-declared';

  /* eslint-disable */
  var buildHelperFunction = babel.template((function HELPER_FUNCTION_NAME(v) {
    var $q = HELPER_FUNCTION_NAME.$q || angular.injector(MODULE_NAME).get("$q");
    return $q.when(v);
  }).toString());
  /* eslint-enable */
  // var safety = 3;
  
  function noWrappingNeeded(path) {
    // if (--safety <= 0) return true;
    var argument = path.get('argument');
    var isGeneratedExpression =
      !!argument
      && t.isCallExpression(argument)
      && t.isIdentifier(argument.node.callee, { name: options.helperFunctionName });

    return isGeneratedExpression;
  }

  function getTopScope(path) {
    var p = path, parent;
    while((parent = p.parentPath)) {
      p = parent;
    }
    return p;
  }

  return {
    visitor: {
      AwaitExpression: function(path) {
        if (noWrappingNeeded(path)) return;

        var topScope = getTopScope(path);
        var helpersDeclared = topScope.getData(HELPERS_DECLARED_KEY);
        if (!helpersDeclared) {
          var ast = buildHelperFunction({
            HELPER_FUNCTION_NAME: t.identifier(options.helperFunctionName),
            MODULE_NAME: t.stringLiteral(options.moduleName)
          });
          topScope.unshiftContainer('body', ast);
          topScope.setData(HELPERS_DECLARED_KEY, true);
        }
        
        var newPath = t.awaitExpression(
          t.callExpression(
            t.identifier(options.helperFunctionName),
            [path.node.argument]
          )
        );

        path.replaceWith(newPath);
      }
    }
  };
};