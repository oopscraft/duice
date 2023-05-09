import fs from "fs";
import vm from "vm";
import {JSDOM} from "jsdom";
let jdom = new JSDOM('<!DOCTYPE html>');
global.window = jdom.window;
global.document = jdom.window.document;
global.HTMLElement = jdom.window.HTMLElement;
global.customElements = jdom.window.customElements
vm.runInThisContext(fs.readFileSync("../../dist/duice.js"));

let dateFormat = new duice.format.DateFormat("yyyy-MM-dd HH:mm:ss");
console.log(dateFormat.format('1981-02-22T09:00+09:00'));
console.log(dateFormat.parse('1981-02-22 09:00'));



