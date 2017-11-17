async function foo(third) {
  const first = await getData(async function (second) {
    return await second;
  });
  return await third;
}