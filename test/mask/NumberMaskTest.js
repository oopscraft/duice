import fs from "fs";
import vm from "vm";
vm.runInThisContext(fs.readFileSync("../../dist/duice.js"));


let numberMask = new duice.NumberMask(2);

console.log(numberMask.encode(1234));
console.log(numberMask.decode("1,234.00"));