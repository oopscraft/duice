import fs from "fs";
import vm from "vm";
import { JSDOM } from 'jsdom';
vm.runInThisContext(fs.readFileSync("../dist/duice.js"));
let jdom = new JSDOM('<!DOCTYPE html>');
global.window = jdom.window;
global.document = jdom.window.document;

// create
let myDataSet = duice.DataSet.create([
    { name: 'Apple' }
]);
console.log(myDataSet);

// fromJson
myDataSet.fromJson([
    { name: 'Orange' }
]);
console.log(myDataSet);

// toJson
let json = myDataSet.toJson();
console.log('json:', json);