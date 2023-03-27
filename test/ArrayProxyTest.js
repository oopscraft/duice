import fs from "fs";
import vm from "vm";
import {JSDOM} from "jsdom";
let jdom = new JSDOM('<!DOCTYPE html>');
global.window = jdom.window;
global.document = jdom.window.document;
global.HTMLElement = jdom.window.HTMLElement;
vm.runInThisContext(fs.readFileSync("../dist/duice.js"));

// create
let myArray = new duice.ArrayProxy([
    { name: 'Apple' }
]);
console.log(myArray);
duice.assert(myArray[0].name === 'Apple');

// assign
duice.ArrayProxy.assign(myArray,[
    { name: 'Orange' }
]);
console.log(myArray);
duice.assert(myArray[0].name === 'Orange');

// setReadonly
duice.ArrayProxy.setReadonly(myArray, 'name', true);
duice.assert(duice.ArrayProxy.isReadonly(myArray, 'name') === true);
duice.ArrayProxy.setReadonly(myArray, 'name', false);
duice.assert(duice.ArrayProxy.isReadonly(myArray,'name') === false);

// setReadonlyAll
console.log('setReadonlyAll');
duice.ArrayProxy.setReadonlyAll(myArray, true);
console.assert(duice.ArrayProxy.isReadonly(myArray, 'name') === true);
duice.ArrayProxy.setReadonlyAll(myArray, false);
duice.assert(duice.ArrayProxy.isReadonly(myArray, 'name') === false);



