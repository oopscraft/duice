import fs from "fs";
import vm from "vm";
vm.runInThisContext(fs.readFileSync("../../dist/duice.js"));

// string mask
let mask = duice.mask.MaskFactory.getMask("string('###-###-###')");
console.log(mask);
console.assert(mask instanceof duice.mask.StringMask);
