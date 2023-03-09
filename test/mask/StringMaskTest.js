import fs from "fs";
import vm from "vm";
vm.runInThisContext(fs.readFileSync("../../dist/duice.js"));


let stringMask = new duice.StringMask("###-####-####");

console.log(stringMask.encode('01012345678'));
console.log(stringMask.encode('010'));
console.log(stringMask.encode('010123'));