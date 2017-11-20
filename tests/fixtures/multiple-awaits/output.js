async function foo(third) {
  const first = $$await((await getData(async function (second) {
    return $$await((await second));
  })));
  return $$await((await third));
}