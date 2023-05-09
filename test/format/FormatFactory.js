import fs from "fs";
import vm from "vm";
import {JSDOM} from "jsdom";
let jdom = new JSDOM('<!DOCTYPE html>');
global.window = jdom.window;
global.document = jdom.window.document;
global.HTMLElement = jdom.window.HTMLElement;
global.customElements = jdom.window.customElements
vm.runInThisContext(fs.readFileSync("../../dist/duice.js"));


// string mask
let format = duice.format.FormatFactory.getFormat("string('###-###-###')");
console.log(format);
duice.assert(format instanceof duice.format.StringFormat);
