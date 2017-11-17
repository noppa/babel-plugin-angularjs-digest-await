module.exports.default = function(babel) {
  var t = babel.types;

  var defaultOptions = {
    helperFunctionName: '__angularjsDigestAwait',
    moduleName: 'ng'
  };
  var options = defaultOptions;
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

        path.replaceWith(newPath);
      }
    }
  };
};