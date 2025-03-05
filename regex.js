async function importAllTests() {
  const testModules = import.meta.glob('./**/*.spec.ts', { eager: true });

  Object.values(testModules).forEach((module) => {
    // Execute the test module
    if (typeof module === 'function') {
      module();
    }
  });
}

importAllTests();
