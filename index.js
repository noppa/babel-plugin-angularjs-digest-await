module.exports.default = function(babel) {
  var t = babel.types;

  return {
    visitor: {
      AwaitExpression: function(path) {
        path.parentPath.replaceWith(
          t.identifier('test')
        );
      }
    }
  };
};