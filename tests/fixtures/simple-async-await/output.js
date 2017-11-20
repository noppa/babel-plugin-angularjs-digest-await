async function foo() {
  const data = $$await((await getData()));
  console.log(data);
}