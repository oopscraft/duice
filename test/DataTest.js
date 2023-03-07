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
let myData = duice.Data.create({
    name: 'Apple'
});
console.log(myData);
console.assert(myData.name === 'Apple');

/**
 * assign
 */
duice.Data.assign(myData, {
    name: 'Orange'
});
console.log(myData);
console.assert(myData.name === 'Orange');

/**
 * setReadonly
 */
console.log('setReadonly');
duice.Data.setReadonly(myData, 'name', true);
console.assert(duice.Data.isReadonly(myData, 'name') === true);
duice.Data.setReadonly(myData, 'name', false);
console.assert(duice.Data.isReadonly(myData,'name') === false);

/**
 * setReadonlyAll
 */
console.log('setReadonlyAll');
duice.Data.setReadonlyAll(myData, true);
console.assert(duice.Data.isReadonly(myData, 'name') === true);
duice.Data.setReadonlyAll(myData, false);
console.assert(duice.Data.isReadonly(myData, 'name') === false);

/**
 * event listener - negative
 */
duice.Data.onBeforeChange(myData, (property, value) => {
    console.log("property,value:", property, value);
    return false;
});
myData.name = 'Kitty';
console.assert(myData.name !== 'Kitty');

/**
 * event listener - positive
 */
duice.Data.onBeforeChange(myData, (property, value) => {
    console.log("property,value:", property, value);
    return true;
});
myData.name = 'Kitty';
console.assert(myData.name === 'Kitty');


