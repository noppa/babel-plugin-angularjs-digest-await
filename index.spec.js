const pluginTester = require('babel-plugin-tester').default;
const plugin = require('./index.js');

pluginTester({
  plugin,
  snapshot: true,
  tests: [
    { code: 'hello', snapshot: true }
  ]
});