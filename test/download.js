const { TuringProxy } = require("../dist/createInstance");

const tp = new  TuringProxy()

tp.exec(123, function (n, Turing) {
  return Turing.Version();
}).then((v) => {
  console.log(v);
});