import fs from "fs";
import vm from "vm";
import { JSDOM } from 'jsdom';
vm.runInThisContext(fs.readFileSync("../dist/duice.js"));
let jdom = new JSDOM('<!DOCTYPE html>');
global.window = jdom.window;
global.document = jdom.window.document;

// data
let data = duice.Data.create({
    name:'james'
});
console.log("data:", data);

// element
let htmlElement = document.createElement('span');
let element = new duice.element.GenericElement(htmlElement, context);

element.bindData(data);


let element = new duice.Element(htmlSpanElement);
element.bind(object);
element.setProperty('name');
console.log('element:', element);


// test 1
console.log("== Test change object value");
object.name = 'test';
console.log("== element:", element.getHtmlElement());




