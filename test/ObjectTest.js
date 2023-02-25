import fs from "fs";
import vm from "vm";
vm.runInThisContext(fs.readFileSync("../build/duice.js"));

// create
let object = new duice.Object({
    name:'james',
    age: 18
});
console.log("object", object);

// handler
console.log("handler", object.name);


