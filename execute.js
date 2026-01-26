function showText(text, time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(text);
    }, time);
  });
}


const prom = showText("deepak" , 5000);

prom.then((val) =>{
    console.log(val);
})