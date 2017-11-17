module.exports.default = function(babel) {
  var t = babel.types;

  var defaultOptions = {
    helperFunctionName: '__angularjsDigestAwait',
    moduleName: 'ng'
  };
  var options = defaultOptions;

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

  return {
    visitor: {
      AwaitExpression: function(path) {
        if (noWrappingNeeded(path)) return;
        
        var args = [
          path.node.argument
        ];

        if (options.moduleName !== defaultOptions.moduleName) {
          args.push(defaultOptions.moduleName);
        }

        var newPath = t.awaitExpression(
          t.callExpression(t.identifier(options.helperFunctionName), args)
        );

        if (!path.scope.hasBinding(options.helperFunctionName)) {
          var ast = buildHelperFunction({
            HELPER_FUNCTION_NAME: t.identifier(options.helperFunctionName),
            MODULE_NAME: t.stringLiteral(options.moduleName)
          });

          // console.log(path.getFunctionParent().get('body'));
          path.getFunctionParent().get('body').pushContainer('body', ast);
        }

        path.replaceWith(newPath);
      }
    }
  };
};