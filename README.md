# babel-plugin-angularjs-digest-await

Babel plugin for applying `$digest` loop after `await` expressions in AngularJS apps.

ES7 `async` functions are supported by most modern browsers, so why transpile them to some
obscure ES5-compatible monstrosity? At least in development, leaving `await` expressions
intact will result in shorter compile-times and better debuggability.  
For AngularJS (v 1.x) users, though, this creates a problem because angular's `$digest` loop
doesn't automatically run after `await` expressions.

This plugin makes *very* lightweight transformations to `await` expressions so that `$digest`
will be called after them.

**Note:** The plugin is mainly intended for development purposes and does not make
the code compatible with older browsers that don't natively support `async/await`.  
Instead, it aims to keep changes to the original source as minimal as possible.

Example input:
```javascript
async function foo() {
  const data = await getData();
  console.log(data);
}
```

Output:
```javascript
function $$await(v) {
  var $rootScope;

  try {
    $rootScope = $$await.$rootScope || ($$await.$rootScope = angular.element(document.body).injector().get("$rootScope"));
  } catch (e) {}

  $rootScope && $rootScope.$$phase == null && $rootScope.$applyAsync();
  return v;
}

async function foo() {
  const data = $$await((await getData()));
  console.log(data);
}
```

### Available plugin options

* `helperFunctionName`. Name of the helper function that gets added to
the top of the file.  
   Default: `$$await`.
* `$rootScope`. JavaScript expression to get `$rootScope`, which is needed
to invoke the `$digest` cycle. The provided value here will be evaluated
as code when the build output is run.  
   Default: `angular.element(document.body).injector().get("$rootScope")`.