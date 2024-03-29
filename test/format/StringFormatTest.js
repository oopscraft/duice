import fs from "fs";
import vm from "vm";
import {JSDOM} from "jsdom";
let jdom = new JSDOM('<!DOCTYPE html>');
global.window = jdom.window;
global.document = jdom.window.document;
global.HTMLElement = jdom.window.HTMLElement;
global.customElements = jdom.window.customElements
vm.runInThisContext(fs.readFileSync("../../dist/duice.js"));

let stringFormat = new duice.format.StringFormat("###-####-####");
console.log(stringFormat.format('01012345678'));
console.log(stringFormat.format('010'));
console.log(stringFormat.format('010123'));