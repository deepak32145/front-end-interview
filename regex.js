function makeCounter() {
    let count = 0;
    return {
      inc: () => ++count,
      dec: () => --count,
      get: () => count
    };
  }
  
  const c1 = makeCounter();
  const c2 = makeCounter();
  
  c1.inc();
  c1.inc();
  c2.inc();
  
  console.log(c1.get(), c2.get());