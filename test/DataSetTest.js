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
console.assert(myDataSet[0].name === 'Apple');

// assign
duice.DataSet.assign(myDataSet,[
    { name: 'Orange' }
]);
console.log(myDataSet);
console.assert(myDataSet[0].name === 'Orange');


