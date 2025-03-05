async function importAllTests() {
  const testFiles = Object.keys((globalThis as any).__webpack_modules__).filter((path) =>
    /\.spec\.ts$/.test(path)
  );

  for (const file of testFiles) {
    await import(/* @vite-ignore */ file);
  }
}

importAllTests();


module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    files: [
      { pattern: 'src/test.ts', watched: false }
    ],
    preprocessors: {
      'src/test.ts': ['webpack']
    },
    webpack: {
      mode: 'development',
      resolve: {
        fallback: {
          "fs": false,
          "path": false
        }
      }
    },
    browsers: ['Chrome'],
    singleRun: false
  });
};
