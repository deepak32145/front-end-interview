var module = (function () {
  function privateMethod() {
    console.log("private");
  }

  return {
    publicMethod: function () {
      console.log("public");
    },
  };
})();

//module.privateMethod();
module.publicMethod();
