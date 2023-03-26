import fs from "fs";
import vm from "vm";
import { JSDOM } from 'jsdom';
vm.runInThisContext(fs.readFileSync("../dist/duice.js"));
let jdom = new JSDOM('<!DOCTYPE html>');
global.window = jdom.window;
global.document = jdom.window.document;

// create
let myArray = new duice.Array([
    { name: 'Apple' }
]);
console.log(myArray);
duice.assert(myArray[0].name === 'Apple');

// assign
duice.Array.assign(myArray,[
    { name: 'Orange' }
]);
console.log(myArray);
duice.assert(myArray[0].name === 'Orange');

// setReadonly
duice.Array.setReadonly(myArray, 'name', true);
duice.assert(duice.Array.isReadonly(myArray, 'name') === true);
duice.Array.setReadonly(myArray, 'name', false);
duice.assert(duice.Array.isReadonly(myArray,'name') === false);

// setReadonlyAll
console.log('setReadonlyAll');
duice.Array.setReadonlyAll(myArray, true);
console.assert(duice.Array.isReadonly(myArray, 'name') === true);
duice.Array.setReadonlyAll(myArray, false);
duice.assert(duice.Array.isReadonly(myArray, 'name') === false);



