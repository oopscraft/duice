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

// setReadonly
duice.DataSet.setReadonly(myDataSet, 'name', true);
console.assert(duice.DataSet.isReadonly(myDataSet, 'name') === true);
duice.DataSet.setReadonly(myDataSet, 'name', false);
console.assert(duice.DataSet.isReadonly(myDataSet,'name') === false);

// setReadonlyAll
console.log('setReadonlyAll');
duice.DataSet.setReadonlyAll(myDataSet, true);
console.assert(duice.DataSet.isReadonly(myDataSet, 'name') === true);
duice.DataSet.setReadonlyAll(myDataSet, false);
console.assert(duice.DataSet.isReadonly(myDataSet, 'name') === false);



