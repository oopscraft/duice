import fs from "fs";
import vm from "vm";
import { JSDOM } from 'jsdom';
vm.runInThisContext(fs.readFileSync("../dist/duice.js"));
let jdom = new JSDOM('<!DOCTYPE html>');
global.window = jdom.window;
global.document = jdom.window.document;

/**
 * create
 */
let myObject = new duice.ObjectProxy({
    name: 'Apple'
});
console.log(myObject);
duice.assert(myObject.name === 'Apple');

/**
 * assign
 */
duice.ObjectProxy.assign(myObject, {
    name: 'Orange'
});
console.log(myObject);
duice.assert(myObject.name === 'Orange');

/**
 * setReadonly
 */
console.log('setReadonly');
duice.ObjectProxy.setReadonly(myObject, 'name', true);
duice.assert(duice.ObjectProxy.isReadonly(myObject, 'name') === true);
duice.ObjectProxy.setReadonly(myObject, 'name', false);
duice.assert(duice.ObjectProxy.isReadonly(myObject,'name') === false);

/**
 * setReadonlyAll
 */
console.log('setReadonlyAll');
duice.ObjectProxy.setReadonlyAll(myObject, true);
duice.assert(duice.ObjectProxy.isReadonly(myObject, 'name') === true);
duice.ObjectProxy.setReadonlyAll(myObject, false);
duice.assert(duice.ObjectProxy.isReadonly(myObject, 'name') === false);

/**
 * event listener - negative
 */
duice.ObjectProxy.onBeforeChange(myObject, (property, value) => {
    console.log("property,value:", property, value);
    return false;
});
myObject.name = 'Kitty';
duice.assert(myObject.name !== 'Kitty');

/**
 * event listener - positive
 */
duice.ObjectProxy.onBeforeChange(myObject, (property, value) => {
    console.log("property,value:", property, value);
    return true;
});
myObject.name = 'Kitty';
duice.assert(myObject.name === 'Kitty');


