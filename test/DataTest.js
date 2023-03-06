import fs from "fs";
import vm from "vm";
import { JSDOM } from 'jsdom';
vm.runInThisContext(fs.readFileSync("../dist/duice.js"));
let jdom = new JSDOM('<!DOCTYPE html>');
global.window = jdom.window;
global.document = jdom.window.document;

// create
let myData = duice.Data.create({
    name: 'Apple'
});
console.log(myData);


// fromJson
myData.fromJson({
    name: 'Orange'
});
console.log(myData);


// toJson
let json = myData.toJson();
console.log('json:', json);


