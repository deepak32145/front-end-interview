// observable.js
const { Observable } = require("rxjs");

const myObservable = new Observable((observer) => {
  let count = 1;

  const intervalId = setInterval(() => {
    observer.next(count);   
    count++;

    if (count > 5) {
      observer.complete();  
      clearInterval(intervalId);
    }
  }, 1000);

 
  return () => {
    clearInterval(intervalId);
    console.log("Observable unsubscribed");
  };
});


const subscription = myObservable.subscribe({
  next: (value) => console.log("Value:", value),
  error: (err) => console.error("Error:", err),
  complete: () => console.log("Completed"),
});


 setTimeout(() => subscription.unsubscribe(), 3000);
