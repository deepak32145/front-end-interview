async function importAllTests() {
  const modules = import.meta.glob('./**/*.spec.ts');
  for (const path in modules) {
    await modules[path]();
  }
}
importAllTests();
