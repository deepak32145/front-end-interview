
const testFiles = Object.keys((globalThis as any).__webpack_modules__)
  .filter((path) => /\.spec\.ts$/.test(path));

testFiles.forEach((file) => __webpack_require__(file));
