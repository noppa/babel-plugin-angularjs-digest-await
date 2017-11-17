module.exports.default = function() {

  return {
    visitor: {
      AwaitExpression: function(a, b) {
        console.log('woop', a, b);
      }
    }
  };
};