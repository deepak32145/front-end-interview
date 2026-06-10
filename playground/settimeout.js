

function inner() {
    for (var i = 0; i < 5; i++) {
        setTimeout(function (j) {
            console.log(j);
        }.bind(null, i), i * 1000);
    }
}

inner();