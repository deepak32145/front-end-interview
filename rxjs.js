import { observable } from "rxjs";

function AsyncStream(observer) {
  var t1 = setInterval(() => {
    observer.next(Math.random());
  }, 1000);
}

var obser = observable;
