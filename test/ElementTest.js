import fs from "fs";
import vm from "vm";
import { JSDOM } from 'jsdom';
vm.runInThisContext(fs.readFileSync("../dist/duice.js"));
let jdom = new JSDOM('<!DOCTYPE html>');
global.window = jdom.window;
global.document = jdom.window.document;

// object
let object = duice.Object.create({
    name:'james'
});
console.log("object:", object);

// element
let htmlSpanElement = document.createElement('span');
let element = new duice.Element(htmlSpanElement);
element.bind(object);
element.setProperty('name');
console.log('element:', element);


// test 1
console.log("== Test change object value");
object.name = 'test';
console.log("== element:", element.getHtmlElement());




