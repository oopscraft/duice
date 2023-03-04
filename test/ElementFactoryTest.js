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
let template = document.createElement('template');
template.innerHTML = '<span duice:bind="object" duice:property="name"></span>';
let htmlElement = template.content.firstChild;
console.log(htmlElement);

// create element
let context = {
    object: object
}
let element = duice.ElementFactory.createElement(htmlElement, context);
console.log('element:', element);


// test 1
console.log("== Test change object value");
object.name = 'test';
console.log("== element:", element.getHtmlElement());




