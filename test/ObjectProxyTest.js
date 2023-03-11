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
let myData = new duice.ObjectProxy({
    name: 'Apple'
});
console.log(myData);
duice.assert(myData.name === 'Apple');

/**
 * assign
 */
duice.ObjectProxy.assign(myData, {
    name: 'Orange'
});
console.log(myData);
duice.assert(myData.name === 'Orange');

/**
 * setReadonly
 */
console.log('setReadonly');
duice.ObjectProxy.setReadonly(myData, 'name', true);
duice.assert(duice.ObjectProxy.isReadonly(myData, 'name') === true);
duice.ObjectProxy.setReadonly(myData, 'name', false);
duice.assert(duice.ObjectProxy.isReadonly(myData,'name') === false);

/**
 * setReadonlyAll
 */
console.log('setReadonlyAll');
duice.ObjectProxy.setReadonlyAll(myData, true);
duice.assert(duice.ObjectProxy.isReadonly(myData, 'name') === true);
duice.ObjectProxy.setReadonlyAll(myData, false);
duice.assert(duice.ObjectProxy.isReadonly(myData, 'name') === false);

/**
 * event listener - negative
 */
duice.ObjectProxy.onBeforeChange(myData, (property, value) => {
    console.log("property,value:", property, value);
    return false;
});
myData.name = 'Kitty';
duice.assert(myData.name !== 'Kitty');

/**
 * event listener - positive
 */
duice.ObjectProxy.onBeforeChange(myData, (property, value) => {
    console.log("property,value:", property, value);
    return true;
});
myData.name = 'Kitty';
duice.assert(myData.name === 'Kitty');


