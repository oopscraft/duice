import fs from "fs";
import vm from "vm";
import {JSDOM} from "jsdom";
let jdom = new JSDOM('<!DOCTYPE html>');
global.window = jdom.window;
global.document = jdom.window.document;
global.HTMLElement = jdom.window.HTMLElement;
global.customElements = jdom.window.customElements
vm.runInThisContext(fs.readFileSync("../dist/duice.js"));

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
duice.ObjectProxy.onPropertyChanging(myObject, (property, value) => {
    console.log("property,value:", property, value);
    return false;
});
myObject.name = 'Kitty';
duice.assert(myObject.name !== 'Kitty');

/**
 * event listener - positive
 */
duice.ObjectProxy.onPropertyChanging(myObject, (property, value) => {
    console.log("property,value:", property, value);
    return true;
});
myObject.name = 'Kitty';
duice.assert(myObject.name === 'Kitty');


