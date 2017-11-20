module.exports = function(babel) {
  var t = babel.types;

  var defaultOptions = {
    helperFunctionName: '$$await'
  };
    
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

  return {
    visitor: {
      AwaitExpression: function(path, state) {
        var opts = state.opts;
        var helperFunctionName = opts.helperFunctionName || defaultOptions.helperFunctionName;
        if (noWrappingNeeded(path, helperFunctionName)) return;

        var newPath = t.callExpression(
          t.identifier(helperFunctionName),
          [path.node]
        );

        path.replaceWith(newPath);
      }
    }
  };
};