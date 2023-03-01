import fs from "fs";
import vm from "vm";
vm.runInThisContext(fs.readFileSync("../../dist/duice.js"));


let mask = duice.mask.MaskFactory.getMask("string('###-###-###')");
console.log(mask);
