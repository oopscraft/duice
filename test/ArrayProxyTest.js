import fs from "fs";
import vm from "vm";
import { JSDOM } from 'jsdom';
vm.runInThisContext(fs.readFileSync("../dist/duice.js"));
let jdom = new JSDOM('<!DOCTYPE html>');
global.window = jdom.window;
global.document = jdom.window.document;

// create
let myDataSet = new duice.ArrayProxy([
    { name: 'Apple' }
]);
console.log(myDataSet);
duice.assert(myDataSet[0].name === 'Apple');

// assign
duice.ArrayProxy.assign(myDataSet,[
    { name: 'Orange' }
]);
console.log(myDataSet);
duice.assert(myDataSet[0].name === 'Orange');

// setReadonly
duice.ArrayProxy.setReadonly(myDataSet, 'name', true);
duice.assert(duice.Array.isReadonly(myDataSet, 'name') === true);
duice.ArrayProxy.setReadonly(myDataSet, 'name', false);
duice.assert(duice.Array.isReadonly(myDataSet,'name') === false);

// setReadonlyAll
console.log('setReadonlyAll');
duice.ArrayProxy.setReadonlyAll(myDataSet, true);
console.assert(duice.Array.isReadonly(myDataSet, 'name') === true);
duice.ArrayProxy.setReadonlyAll(myDataSet, false);
duice.assert(duice.Array.isReadonly(myDataSet, 'name') === false);



