import fs from "fs";
import vm from "vm";
import {JSDOM} from "jsdom";
let jdom = new JSDOM('<!DOCTYPE html>');
global.window = jdom.window;
global.document = jdom.window.document;
global.HTMLElement = jdom.window.HTMLElement;
vm.runInThisContext(fs.readFileSync("../../dist/duice.js"));


let numberFormat = new duice.format.NumberFormat(2);
console.log(numberFormat.encode(1234));
console.log(numberFormat.decode("1,234.00"));
