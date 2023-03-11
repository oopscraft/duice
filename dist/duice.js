var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var duice;
(function (duice) {
    /**
     * Observable
     */
    class Observable {
        constructor() {
            this.observers = [];
            this.notifyEnabled = true;
        }
        /**
         * addObserver
         * @param observer
         */
        addObserver(observer) {
            this.observers.push(observer);
        }
        /**
         * removeObserver
         * @param observer
         */
        removeObserver(observer) {
            for (let i = 0, size = this.observers.length; i < size; i++) {
                if (this.observers[i] === observer) {
                    this.observers.splice(i, 1);
                    return;
                }
            }
        }
        /**
         * suspend notify
         */
        suspendNotify() {
            this.notifyEnabled = false;
        }
        /**
         * resume notify
         * @param enable
         */
        resumeNotify() {
            this.notifyEnabled = true;
        }
        /**
         * notifyObservers
         * @param detail
         */
        notifyObservers(detail) {
            if (this.notifyEnabled) {
                this.observers.forEach(observer => {
                    observer.update(this, detail);
                });
            }
        }
    }
    duice.Observable = Observable;
})(duice || (duice = {}));
///<reference path="Observable.ts"/>
var duice;
(function (duice) {
    /**
     * ArrayHandler
     */
    class ArrayHandler extends duice.Observable {
        /**
         * constructor
         * @param arrayProxy
         */
        constructor(arrayProxy) {
            super();
            this.readonlyAll = false;
            this.readonly = new Set();
            this.listenerEnabled = true;
            this.arrayProxy = arrayProxy;
            // setting handler as property
            globalThis.Object.defineProperty(arrayProxy, '_handler_', {
                value: this,
                writable: true
            });
            // creates child object to proxy
            for (let index = 0; index < this.arrayProxy.length; index++) {
                let object = new duice.ObjectProxy(this.arrayProxy[index]);
                this.arrayProxy[index] = object;
                let objectHandler = duice.ObjectProxy.getHandler(object);
                objectHandler.addObserver(this);
            }
        }
        /**
         * getArrayProxy
         */
        getArrayProxy() {
            return this.arrayProxy;
        }
        /**
         * set
         * @param target
         * @param property
         * @param value
         */
        set(target, property, value) {
            console.log("- Array.set", target, property, value);
            Reflect.set(target, property, value);
            if (property === 'length') {
                this.notifyObservers({});
            }
            return true;
        }
        /**
         * assign
         * @param array
         */
        assign(array) {
            try {
                // suspend
                this.suspendNotify();
                // deletes
                this.arrayProxy.length = 0;
                // assign
                for (let index = 0, size = array.length; index < size; index++) {
                    let objectProxy = new duice.ObjectProxy(array[index]);
                    let objectHandler = duice.ObjectProxy.getHandler(objectProxy);
                    objectHandler.setBeforeChangeListener(this.beforeChangeListener);
                    objectHandler.setAfterChangeListener(this.afterChangeListener);
                    objectHandler.addObserver(this);
                    this.arrayProxy[index] = objectProxy;
                }
            }
            finally {
                // resume
                this.resumeNotify();
            }
            // notify observers
            this.notifyObservers({});
        }
        /**
         * update
         * @param elementSet
         * @param detail
         */
        update(elementSet, detail) {
            console.log("DataSetHandler", elementSet, detail);
            if (detail.name === 'changeIndex') {
                let data = this.arrayProxy.splice(detail.fromIndex, 1)[0];
                this.arrayProxy.splice(detail.toIndex, 0, data);
            }
            this.notifyObservers(detail);
        }
        /**
         * setReadonlyAll
         * @param readonly
         */
        setReadonlyAll(readonly) {
            this.readonlyAll = readonly;
        }
        /**
         * setReadonly
         * @param property
         * @param readonly
         */
        setReadonly(property, readonly) {
            if (readonly) {
                this.readonly.add(property);
            }
            else {
                this.readonly.delete(property);
            }
        }
        /**
         * isReadonly
         * @param property
         */
        isReadonly(property) {
            return this.readonlyAll || this.readonly.has(property);
        }
        /**
         * setBeforeChangeListener
         * @param listener
         */
        setBeforeChangeListener(listener) {
            this.beforeChangeListener = listener;
        }
        /**
         * setAfterChangeListener
         * @param listener
         */
        setAfterChangeListener(listener) {
            this.afterChangeListener = listener;
        }
    }
    duice.ArrayHandler = ArrayHandler;
})(duice || (duice = {}));
var duice;
(function (duice) {
    class MaskFactory {
        /**
         * getMask
         * @param mask
         */
        static getMask(mask) {
            if (mask.startsWith('string')) {
                mask = mask.replace('string', 'StringMask');
            }
            if (mask.startsWith('number')) {
                mask = mask.replace('number', 'NumberMask');
            }
            if (mask.startsWith('date')) {
                mask = mask.replace('date', 'DateMask');
            }
            return Function(`return new duice.${mask};`).call(null);
        }
    }
    duice.MaskFactory = MaskFactory;
})(duice || (duice = {}));
///<reference path="Observable.ts"/>
///<reference path="mask/MaskFactory.ts"/>
var duice;
(function (duice) {
    /**
     * Element
     */
    class Element extends duice.Observable {
        /**
         * constructor
         * @param htmlElement
         * @protected
         */
        constructor(htmlElement, context) {
            super();
            this.htmlElement = htmlElement;
            this.context = context;
            this.id = duice.generateUuid();
            duice.setAttribute(this.htmlElement, 'id', this.id);
        }
        /**
         * setData
         * @param objectName
         */
        setObject(objectName) {
            let object = duice.findObject(this.context, objectName);
            duice.assert(object, `ObjectProxy[${objectName}] is not found.`);
            this.objectHandler = duice.ObjectProxy.getHandler(object);
            this.addObserver(this.objectHandler);
            this.objectHandler.addObserver(this);
        }
        /**
         * returns object handler
         */
        getObjectHandler() {
            return this.objectHandler;
        }
        /**
         * gets html element
         */
        getHtmlElement() {
            return this.htmlElement;
        }
        /**
         * set property
         * @param property
         */
        setProperty(property) {
            this.property = property;
        }
        /**
         * get property
         */
        getProperty() {
            return this.property;
        }
        /**
         * set mask
         * @param mask string from html mask attribute
         */
        setMask(mask) {
            this.mask = duice.MaskFactory.getMask(mask);
        }
        /**
         * returns mask
         */
        getMask() {
            return this.mask;
        }
        /**
         * render
         */
        render() {
            if (this.property) {
                // set value
                this.setValue(this.objectHandler.getValue(this.property));
                // set readonly
                let readonly = this.objectHandler.isReadonly(this.property);
                this.setReadonly(readonly);
            }
            // executes script
            this.executeScript();
        }
        /**
         * update
         * @param objectHandler
         * @param detail
         */
        update(objectHandler, detail) {
            if (this.property) {
                // set value
                this.setValue(objectHandler.getValue(this.property));
                // set readonly
                let readonly = this.objectHandler.isReadonly(this.property);
                this.setReadonly(readonly);
            }
            // executes script
            this.executeScript();
        }
        /**
         * executes script
         */
        executeScript() {
            let script = duice.getAttribute(this.getHtmlElement(), 'script');
            if (script) {
                duice.executeScript(script, this.getHtmlElement(), this.context);
            }
        }
    }
    duice.Element = Element;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * ElementFactory
     */
    class ElementFactory {
        /**
         * registerElementFactory
         * @param elementFactory
         */
        static registerElementFactory(elementFactory) {
            this.elementFactoryRegistry.push(elementFactory);
        }
        /**
         * get instance
         * @param htmlElement
         */
        static getInstance(htmlElement) {
            let instance;
            this.elementFactoryRegistry.forEach(elementFactory => {
                if (elementFactory.support(htmlElement)) {
                    instance = elementFactory;
                }
            });
            if (instance) {
                return instance;
            }
            else {
                return new duice.GenericElementFactory();
            }
        }
        /**
         * creates element
         * @param htmlElement
         * @param context
         */
        createElement(htmlElement, context) {
            // creates element
            let element = this.doCreateElement(htmlElement, context);
            // object
            let object = duice.getAttribute(htmlElement, 'object');
            element.setObject(object);
            // property
            let property = duice.getAttribute(htmlElement, 'property');
            if (property) {
                element.setProperty(property);
            }
            // mask
            let mask = duice.getAttribute(htmlElement, 'mask');
            if (mask) {
                element.setMask(mask);
            }
            // returns
            return element;
        }
    }
    ElementFactory.elementFactoryRegistry = [];
    duice.ElementFactory = ElementFactory;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * ArrayElement
     */
    class ElementSet extends duice.Observable {
        /**
         * constructor
         * @param htmlElement
         */
        constructor(htmlElement, context) {
            super();
            this.editable = false;
            this.htmlElement = htmlElement;
            this.context = context;
            this.id = duice.generateUuid();
            duice.setAttribute(this.htmlElement, 'id', this.id);
            // replace with slot element
            this.slotElement = document.createElement('slot');
            this.htmlElement.replaceWith(this.slotElement);
            // editable
            let editable = duice.getAttribute(this.htmlElement, 'editable');
            if (editable) {
                this.editable = (editable.toLowerCase() === 'true');
            }
        }
        /**
         * setDataSet
         * @param arrayName
         */
        setArray(arrayName) {
            let array = duice.findObject(this.context, arrayName);
            duice.assert(array, `ArrayProxy[${arrayName}] is not found.`);
            this.arrayHandler = duice.ArrayProxy.getHandler(array);
            duice.assert(this.arrayHandler, `[${arrayName}] is not ArrayProxy.`);
            this.addObserver(this.arrayHandler);
            this.arrayHandler.addObserver(this);
        }
        /**
         * setLoop
         * @param loop
         */
        setLoop(loop) {
            this.loop = loop;
        }
        /**
         * render
         */
        render() {
            let dataSet = this.arrayHandler.getArrayProxy();
            this.doRender(dataSet);
            // executes script
            this.executeScript();
        }
        /**
         * doRender
         * @param array
         */
        doRender(array) {
            var _a;
            let _this = this;
            duice.removeChildNodes(this.slotElement);
            if (this.loop) {
                let loopArgs = this.loop.split(',');
                let itemName = loopArgs[0].trim();
                let statusName = (_a = loopArgs[1]) === null || _a === void 0 ? void 0 : _a.trim();
                for (let index = 0; index < array.length; index++) {
                    let data = array[index];
                    let context = {};
                    context[itemName] = data;
                    context[statusName] = new duice.ObjectProxy({
                        index: index,
                        count: index + 1,
                        size: array.length,
                        first: (index === 0),
                        last: (array.length == index + 1)
                    });
                    let rowHtmlElement = this.htmlElement.cloneNode(true);
                    duice.setAttribute(rowHtmlElement, 'index', index.toString());
                    // editable
                    if (this.editable) {
                        rowHtmlElement.setAttribute('draggable', 'true');
                        rowHtmlElement.addEventListener('dragstart', function (event) {
                            let fromIndex = duice.getAttribute(this, 'index');
                            event.dataTransfer.setData("text", fromIndex);
                        });
                        rowHtmlElement.addEventListener('dragover', function (event) {
                            event.preventDefault();
                            event.stopPropagation();
                        });
                        rowHtmlElement.addEventListener('drop', function (event) {
                            return __awaiter(this, void 0, void 0, function* () {
                                event.preventDefault();
                                event.stopPropagation();
                                let fromIndex = parseInt(event.dataTransfer.getData('text'));
                                let toIndex = parseInt(duice.getAttribute(this, 'index'));
                                let detail = {
                                    name: 'changeIndex',
                                    fromIndex: fromIndex,
                                    toIndex: toIndex
                                };
                                //await dataSet.moveRow(fromIndex, toIndex);
                                _this.notifyObservers(detail);
                            });
                        });
                    }
                    // initializes row element
                    duice.initialize(rowHtmlElement, context);
                    this.slotElement.appendChild(rowHtmlElement);
                }
            }
            else {
                this.slotElement.appendChild(this.htmlElement);
            }
        }
        /**
         * update
         * @param observable
         * @param detail
         */
        update(arrayHandler, detail) {
            let array = arrayHandler.getArrayProxy();
            this.doUpdate(array);
            // executes script
            this.executeScript();
        }
        /**
         * doUpdate
         * @param array
         */
        doUpdate(array) {
            this.doRender(array);
        }
        /**
         * executes script
         */
        executeScript() {
            let script = duice.getAttribute(this.htmlElement, 'script');
            if (script) {
                duice.executeScript(script, this.htmlElement, this.context);
            }
        }
    }
    duice.ElementSet = ElementSet;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * ElementFactory
     */
    class ElementSetFactory {
        /**
         * get instance
         * @param htmlElement
         */
        static getInstance(htmlElement) {
            return new ElementSetFactory();
        }
        /**
         * createElementSet
         * @param htmlElement
         */
        createElementSet(htmlElement, context) {
            // creates element set
            let elementSet = new duice.ElementSet(htmlElement, context);
            // find data set
            let array = duice.getAttribute(htmlElement, 'array');
            elementSet.setArray(array);
            // loop
            let loop = duice.getAttribute(htmlElement, 'loop');
            if (loop) {
                elementSet.setLoop(loop);
            }
            // returns
            return elementSet;
        }
    }
    duice.ElementSetFactory = ElementSetFactory;
})(duice || (duice = {}));
///<reference path="Observable.ts"/>
var duice;
(function (duice) {
    /**
     * ObjectHandler
     */
    class ObjectHandler extends duice.Observable {
        /**
         * constructor
         * @param objectProxy
         */
        constructor(objectProxy) {
            super();
            this.readonlyAll = false;
            this.readonly = new Set();
            this.listenerEnabled = true;
            this.objectProxy = objectProxy;
            this.save();
            globalThis.Object.defineProperty(objectProxy, "_handler_", {
                value: this,
                writable: true
            });
        }
        /**
         * getObjectProxy
         */
        getObjectProxy() {
            return this.objectProxy;
        }
        /**
         * get
         * @param target
         * @param property
         * @param receiver
         */
        get(target, property, receiver) {
            console.log("- Object.get", target, property, receiver);
            return Reflect.get(target, property, receiver);
        }
        /**
         * set
         * @param target
         * @param property
         * @param value
         */
        set(target, property, value) {
            console.log("- Object.set", target, property, value);
            // checks before change listener
            this.callBeforeChange(property, value).then((result) => {
                if (result) {
                    // change property value
                    Reflect.set(target, property, value);
                    // calls after change listener
                    this.callAfterChange(property, value).then();
                    // notify
                    this.notifyObservers({});
                }
            });
            // returns
            return true;
        }
        /**
         * assign
         * @param object
         */
        assign(object) {
            try {
                // suspend
                this.suspendListener();
                this.suspendNotify();
                // deletes
                for (let property in this.objectProxy) {
                    delete this.objectProxy[property];
                }
                // assign
                for (let property in object) {
                    this.objectProxy[property] = object[property];
                }
                // saves origin object
                this.save();
            }
            finally {
                // resume
                this.resumeListener();
                this.resumeNotify();
            }
            // notify observers
            this.notifyObservers({});
        }
        /**
         * save
         */
        save() {
            this.originObject = JSON.parse(JSON.stringify(this.objectProxy));
        }
        /**
         * reset
         */
        reset() {
            this.assign(this.originObject);
        }
        /**
         * isDirty
         */
        isDirty() {
            return JSON.stringify(this.objectProxy) !== JSON.stringify(this.originObject);
        }
        /**
         * getValue
         * @param property
         */
        getValue(property) {
            console.assert(property);
            property = property.replace('.', '?.');
            return new Function(`return this.${property};`).call(this.getObjectProxy());
        }
        /**
         * setValue
         * @param property
         * @param value
         */
        setValue(property, value) {
            new Function('value', `this.${property} = value;`).call(this.getObjectProxy(), value);
        }
        /**
         * update
         * @param element
         * @param detail
         */
        update(element, detail) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("DataHandler.update", element, detail);
                let property = element.getProperty();
                if (property) {
                    let value = element.getValue();
                    // calls before change listener
                    if (yield this.callBeforeChange(property, value)) {
                        // change property value
                        this.setValue(property, value);
                        // calls after change listener
                        yield this.callAfterChange(property, value);
                    }
                }
                // notify
                this.notifyObservers(detail);
            });
        }
        /**
         * setReadonlyAll
         * @param readonly
         */
        setReadonlyAll(readonly) {
            this.readonlyAll = readonly;
            this.notifyObservers({});
        }
        /**
         * setReadonly
         * @param property
         * @param readonly
         */
        setReadonly(property, readonly) {
            if (readonly) {
                this.readonly.add(property);
            }
            else {
                this.readonly.delete(property);
            }
            this.notifyObservers({});
        }
        /**
         * isReadonly
         * @param property
         */
        isReadonly(property) {
            return this.readonlyAll || this.readonly.has(property);
        }
        /**
         * setBeforeChangeListener
         * @param listener
         */
        setBeforeChangeListener(listener) {
            this.beforeChangeListener = listener;
        }
        /**
         * setAfterChangeListener
         * @param listener
         */
        setAfterChangeListener(listener) {
            this.afterChangeListener = listener;
        }
        /**
         * suspends listener
         */
        suspendListener() {
            this.listenerEnabled = false;
        }
        /**
         * resumes listener
         */
        resumeListener() {
            this.listenerEnabled = true;
        }
        /**
         * callBeforeChange
         * @param property
         * @param value
         */
        callBeforeChange(property, value) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.listenerEnabled && this.beforeChangeListener) {
                    let result = yield this.beforeChangeListener.call(this.getObjectProxy(), property, value);
                    if (result === false) {
                        return false;
                    }
                }
                return true;
            });
        }
        /**
         * callAfterChange
         * @param property
         * @param value
         */
        callAfterChange(property, value) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.listenerEnabled && this.afterChangeListener) {
                    yield this.afterChangeListener.call(this.getObjectProxy(), property, value);
                }
            });
        }
    }
    duice.ObjectHandler = ObjectHandler;
})(duice || (duice = {}));
/* =============================================================================
 * DUICE (Data-oriented UI Component Engine)
 * - Anyone can use it freely.
 * - Modify the source or allow re-creation. However, you must state that you have the original creator.
 * - However, we can not grant patents or licenses for re-productives. (Modifications or reproductions must be shared with the public.)
 * Licence: LGPL(GNU Lesser General Public License version 3)
 * Copyright (C) 2016 chomookun@gmail.com
 * ============================================================================= */
var duice;
(function (duice) {
    let alias = 'duice';
    /**
     * sets alias of namespace
     * @param value
     */
    function setAlias(value) {
        alias = value;
    }
    duice.setAlias = setAlias;
    /**
     * returns alias of namespace
     */
    function getAlias() {
        return alias;
    }
    duice.getAlias = getAlias;
    /**
     * initializes
     * @param container
     * @param context
     */
    function initialize(container, context) {
        // initializes element set
        container.querySelectorAll(`*[${getAlias()}\\:array]:not([${getAlias()}\\:id])`).forEach(htmlElement => {
            let elementSetFactory = duice.ElementSetFactory.getInstance(htmlElement);
            let elementSet = elementSetFactory.createElementSet(htmlElement, context);
            elementSet.render();
        });
        // initializes element
        container.querySelectorAll(`*[${getAlias()}\\:object]:not([${getAlias()}\\:id])`).forEach(htmlElement => {
            let elementFactory = duice.ElementFactory.getInstance(htmlElement);
            let element = elementFactory.createElement(htmlElement, context);
            element.render();
        });
    }
    duice.initialize = initialize;
    /**
     * findObject
     * @param context
     * @param name
     */
    function findObject(context, name) {
        if (context[name]) {
            return context[name];
        }
        if (window.hasOwnProperty(name)) {
            return window[name];
        }
        return eval.call(context, name);
    }
    duice.findObject = findObject;
    /**
     * Generates component ID
     */
    function generateUuid() {
        let dt = new Date().getTime();
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
    duice.generateUuid = generateUuid;
    /**
     * assert
     * @param condition
     * @param message
     */
    function assert(condition, message) {
        console.assert(condition, message);
        if (!condition) {
            throw new Error(message || 'Assertion Failed');
        }
    }
    duice.assert = assert;
    /**
     * hasAttribute
     * @param htmlElement
     * @param name
     */
    function hasAttribute(htmlElement, name) {
        return htmlElement.hasAttribute(`${getAlias()}:${name}`);
    }
    duice.hasAttribute = hasAttribute;
    /**
     * getAttribute
     * @param htmlElement
     * @param name
     */
    function getAttribute(htmlElement, name) {
        return htmlElement.getAttribute(`${getAlias()}:${name}`);
    }
    duice.getAttribute = getAttribute;
    /**
     * setAttribute
     * @param htmlElement
     * @param name
     * @param value
     */
    function setAttribute(htmlElement, name, value) {
        htmlElement.setAttribute(`${getAlias()}:${name}`, value);
    }
    duice.setAttribute = setAttribute;
    /**
     * getCurrentWindow
     * @private
     */
    function getCurrentWindow() {
        if (window.frameElement) {
            return window.parent;
        }
        else {
            return window;
        }
    }
    duice.getCurrentWindow = getCurrentWindow;
    /**
     * moveToCenterPosition
     */
    function moveToCenterPosition(htmlElement) {
        let currentWindow = getCurrentWindow();
        let computedStyle = currentWindow.getComputedStyle(this.dialog);
        let computedWidth = parseInt(computedStyle.getPropertyValue('width').replace(/px/gi, ''));
        let computedHeight = parseInt(computedStyle.getPropertyValue('height').replace(/px/gi, ''));
        htmlElement.style.left = Math.max(0, currentWindow.innerWidth / 2 - computedWidth / 2) + 'px';
        htmlElement.style.top = Math.max(0, currentWindow.innerHeight / 2 - computedHeight / 2) + 'px';
    }
    duice.moveToCenterPosition = moveToCenterPosition;
    /**
     * removeChildNodes
     * @param element
     */
    function removeChildNodes(element) {
        // Remove element nodes and prevent memory leaks
        let node, nodes = element.childNodes, i = 0;
        while (node = nodes[i++]) {
            if (node.nodeType === 1) {
                element.removeChild(node);
            }
        }
        // Remove any remaining nodes
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        // If this is a select, ensure that it displays empty
        if (element instanceof HTMLSelectElement) {
            element.options.length = 0;
        }
    }
    duice.removeChildNodes = removeChildNodes;
    /**
     * execute script
     * @param script
     * @param thisArg
     * @param context
     */
    function executeScript(script, thisArg, context) {
        try {
            let args = [];
            let values = [];
            for (let property in context) {
                args.push(property);
                values.push(context[property]);
            }
            return Function(...args, script).call(thisArg, ...values);
        }
        catch (e) {
            console.error(script, e);
            throw e;
        }
    }
    duice.executeScript = executeScript;
    /**
     * alert
     * @param message
     */
    function alert(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new duice.AlertDialog(message).open();
        });
    }
    duice.alert = alert;
    /**
     * confirm
     * @param message
     */
    function confirm(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new duice.ConfirmDialog(message).open();
        });
    }
    duice.confirm = confirm;
    /**
     * prompt
     * @param message
     */
    function prompt(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new duice.PromptDialog(message).open();
        });
    }
    duice.prompt = prompt;
    /**
     * dialog
     * @param dialogElement
     */
    function dialog(dialogElement) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new duice.Dialog(dialogElement).open();
        });
    }
    duice.dialog = dialog;
    /**
     * listens DOMContentLoaded event
     */
    if (globalThis.document) {
        document.addEventListener("DOMContentLoaded", event => {
            initialize(document.documentElement, {});
        });
    }
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * Dialog
     */
    class Dialog {
        /**
         * constructor
         * @param contentDiv
         */
        constructor(dialogElement) {
            this.dialogElement = dialogElement;
            let _this = this;
            // dialog fixed style
            this.dialogElement.style.position = 'absolute';
            this.dialogElement.style.left = '0';
            this.dialogElement.style.right = '0';
            this.dialogElement.style.margin = 'auto';
            this.dialogElement.style.height = 'fit-content';
            // header
            this.header = document.createElement('span');
            this.dialogElement.appendChild(this.header);
            this.header.style.display = 'block';
            this.header.style.position = 'absolute';
            this.header.style.left = '0';
            this.header.style.top = '0';
            this.header.style.width = '100%';
            this.header.style.height = '1rem';
            this.header.style.cursor = 'pointer';
            // drag
            this.dialogElement.style.margin = '0px';
            this.header.onmousedown = function (event) {
                let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                pos3 = event.clientX;
                pos4 = event.clientY;
                window.document.onmouseup = function (event) {
                    window.document.onmousemove = null;
                    window.document.onmouseup = null;
                };
                window.document.onmousemove = function (event) {
                    pos1 = pos3 - event.clientX;
                    pos2 = pos4 - event.clientY;
                    pos3 = event.clientX;
                    pos4 = event.clientY;
                    _this.dialogElement.style.left = (_this.dialogElement.offsetLeft - pos1) + 'px';
                    _this.dialogElement.style.top = (_this.dialogElement.offsetTop - pos2) + 'px';
                };
            };
            // creates close button
            this.closeButton = document.createElement('span');
            this.closeButton.style.position = 'absolute';
            this.closeButton.style.top = '0';
            this.closeButton.style.right = '0';
            this.closeButton.style.cursor = 'pointer';
            this.closeButton.style.width = '1rem';
            this.closeButton.style.height = '1rem';
            this.closeButton.style.lineHeight = '1rem';
            this.closeButton.style.margin = '1px';
            this.closeButton.style.textAlign = 'center';
            this.closeButton.style.fontFamily = 'sans-serif';
            this.closeButton.style.fontSize = '0.75rem';
            this.closeButton.appendChild(document.createTextNode('X'));
            this.closeButton.addEventListener('click', event => {
                _this.close();
            });
            this.dialogElement.appendChild(this.closeButton);
            // on resize event
            window.addEventListener('resize', function (event) {
                _this.moveToCenterPosition();
            });
        }
        /**
         * moveToCenterPosition
         */
        moveToCenterPosition() {
            let computedStyle = window.getComputedStyle(this.dialogElement);
            let computedWidth = parseInt(computedStyle.getPropertyValue('width').replace(/px/gi, ''));
            let computedHeight = parseInt(computedStyle.getPropertyValue('height').replace(/px/gi, ''));
            let scrollX = window.scrollX;
            let scrollY = window.scrollY;
            this.dialogElement.style.left = Math.max(0, window.innerWidth / 2 - computedWidth / 2) + scrollX + 'px';
            this.dialogElement.style.top = Math.max(0, window.innerHeight / 2 - computedHeight / 2) + scrollY + 'px';
        }
        /**
         * getDialogElement
         */
        getDialogElement() {
            return this.dialogElement;
        }
        /**
         * Shows modal
         */
        show() {
            // saves current scroll position
            let scrollX = window.scrollX;
            let scrollY = window.scrollY;
            // show dialog modal
            duice.getCurrentWindow().document.body.appendChild(this.dialogElement);
            this.dialogElement.showModal();
            // restore previous scroll position
            window.scrollTo(scrollX, scrollY);
            // adjusting position
            this.moveToCenterPosition();
        }
        /**
         * Hides modal
         */
        hide() {
            // closes modal
            this.dialogElement.close();
        }
        /**
         * open
         */
        open() {
            return __awaiter(this, void 0, void 0, function* () {
                // show modal
                this.show();
                // creates promise
                let _this = this;
                this.promise = new Promise(function (resolve, reject) {
                    _this.promiseResolve = resolve;
                    _this.promiseReject = reject;
                });
                return this.promise;
            });
        }
        /**
         * close
         */
        close() {
            this.reject();
        }
        /**
         * confirm
         * @param args
         */
        resolve(...args) {
            this.hide();
            this.promiseResolve(...args);
        }
        /**
         * close
         * @param args
         */
        reject(...args) {
            this.hide();
            this.promiseReject(...args);
        }
    }
    duice.Dialog = Dialog;
})(duice || (duice = {}));
///<reference path="Dialog.ts"/>
var duice;
(function (duice) {
    /**
     * AlertDialog
     */
    class AlertDialog extends duice.Dialog {
        /**
         * constructor
         * @param message
         */
        constructor(message) {
            super(document.createElement('dialog'));
            this.getDialogElement().style.padding = '1rem';
            this.getDialogElement().style.minWidth = '15rem';
            this.getDialogElement().style.textAlign = 'center';
            // message pre
            this.messagePre = document.createElement('pre');
            this.messagePre.innerHTML = message;
            this.getDialogElement().appendChild(this.messagePre);
            // confirm button
            this.confirmButton = document.createElement('button');
            this.confirmButton.appendChild(document.createTextNode('Yes'));
            this.confirmButton.style.width = '3rem';
            this.confirmButton.addEventListener('click', event => {
                this.confirm();
            });
            this.getDialogElement().appendChild(this.confirmButton);
        }
        /**
         * open
         */
        open() {
            let promise = super.open();
            this.confirmButton.focus();
            return promise;
        }
        /**
         * confirm
         */
        confirm() {
            this.resolve();
        }
        /**
         * close
         */
        close() {
            this.resolve();
        }
    }
    duice.AlertDialog = AlertDialog;
})(duice || (duice = {}));
///<reference path="Dialog.ts"/>
var duice;
(function (duice) {
    /**
     * Confirm
     */
    class ConfirmDialog extends duice.Dialog {
        /**
         * constructor
         * @param message
         */
        constructor(message) {
            super(document.createElement('dialog'));
            this.getDialogElement().style.padding = '1rem';
            this.getDialogElement().style.minWidth = '15rem';
            this.getDialogElement().style.textAlign = 'center';
            // message pre
            this.messagePre = document.createElement('pre');
            this.messagePre.innerHTML = message;
            this.getDialogElement().appendChild(this.messagePre);
            // confirm button
            this.confirmButton = document.createElement('button');
            this.confirmButton.appendChild(document.createTextNode('Yes'));
            this.confirmButton.style.width = '3rem';
            this.confirmButton.addEventListener('click', event => {
                this.confirm();
            });
            this.getDialogElement().appendChild(this.confirmButton);
            // cancel button
            this.cancelButton = document.createElement('button');
            this.cancelButton.appendChild(document.createTextNode('No'));
            this.cancelButton.style.width = '3rem';
            this.cancelButton.addEventListener('click', event => {
                this.cancel();
            });
            this.getDialogElement().appendChild(this.cancelButton);
        }
        /**
         * open
         */
        open() {
            let promise = super.open();
            this.confirmButton.focus();
            return promise;
        }
        /**
         * confirm
         */
        confirm() {
            this.resolve(true);
        }
        /**
         * cancel
         */
        cancel() {
            this.resolve(false);
        }
        /**
         * close
         */
        close() {
            this.resolve(false);
        }
    }
    duice.ConfirmDialog = ConfirmDialog;
})(duice || (duice = {}));
///<reference path="Dialog.ts"/>
var duice;
(function (duice) {
    /**
     * PromptDialog
     */
    class PromptDialog extends duice.Dialog {
        /**
         * constructor
         * @param message
         */
        constructor(message) {
            super(document.createElement('dialog'));
            this.getDialogElement().style.padding = '1rem';
            this.getDialogElement().style.minWidth = '15rem';
            this.getDialogElement().style.textAlign = 'center';
            // message pre
            this.messagePre = document.createElement('pre');
            this.messagePre.innerHTML = message;
            this.getDialogElement().appendChild(this.messagePre);
            // prompt input
            this.promptInput = document.createElement('input');
            this.promptInput.style.display = 'block';
            this.promptInput.style.textAlign = 'center';
            this.promptInput.style.margin = '0.75rem 0';
            this.promptInput.style.width = '100%';
            this.getDialogElement().appendChild(this.promptInput);
            // confirm button
            this.confirmButton = document.createElement('button');
            this.confirmButton.appendChild(document.createTextNode('Yes'));
            this.confirmButton.style.width = '3rem';
            this.confirmButton.addEventListener('click', event => {
                this.resolve(this.promptInput.value);
            });
            this.getDialogElement().appendChild(this.confirmButton);
            // cancel button
            this.cancelButton = document.createElement('button');
            this.cancelButton.appendChild(document.createTextNode('No'));
            this.cancelButton.style.width = '3rem';
            this.cancelButton.addEventListener('click', event => {
                this.resolve();
            });
            this.getDialogElement().appendChild(this.cancelButton);
        }
        /**
         * open
         */
        open() {
            let promise = super.open();
            this.promptInput.focus();
            return promise;
        }
    }
    duice.PromptDialog = PromptDialog;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * GenericElement
     */
    class GenericElement extends duice.Element {
        /**
         * constructor
         * @param htmlElement
         */
        constructor(htmlElement, context) {
            super(htmlElement, context);
            // appends text node
            this.textNode = document.createTextNode('');
            this.getHtmlElement().insertBefore(this.textNode, this.getHtmlElement().firstChild);
        }
        /**
         * setValue
         * @param value
         */
        setValue(value) {
            value = this.getMask() ? this.getMask().encode(value) : value;
            this.textNode.textContent = value;
        }
        /**
         * getValue
         */
        getValue() {
            let value = this.textNode.textContent;
            value = this.getMask() ? this.getMask().decode(value) : value;
            return value;
        }
        /**
         * setReadonly
         * @param readonly
         */
        setReadonly(readonly) {
            // no-op
        }
    }
    duice.GenericElement = GenericElement;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * GenericElementFactory
     */
    class GenericElementFactory extends duice.ElementFactory {
        /**
         * doCreateElement
         * @param htmlElement
         * @param context
         */
        doCreateElement(htmlElement, context) {
            return new duice.GenericElement(htmlElement, context);
        }
        /**
         * support
         * @param htmlElement
         */
        support(htmlElement) {
            return true;
        }
    }
    duice.GenericElementFactory = GenericElementFactory;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * InputElement
     */
    class InputElement extends duice.Element {
        /**
         * constructor
         * @param htmlElement
         * @param context
         */
        constructor(htmlElement, context) {
            super(htmlElement, context);
            // adds change listener
            this.getHtmlElement().addEventListener('change', event => {
                this.notifyObservers({});
            }, true);
        }
        /**
         * setValue
         * @param value
         */
        setValue(value) {
            value = this.getMask() ? this.getMask().encode(value) : value;
            this.getHtmlElement().value = value;
        }
        /**
         * getValue
         */
        getValue() {
            let value = this.getHtmlElement().value;
            value = this.getMask() ? this.getMask().decode(value) : value;
            return value;
        }
        /**
         * setReadonly
         * @param readonly
         */
        setReadonly(readonly) {
            this.getHtmlElement().readOnly = readonly;
        }
    }
    duice.InputElement = InputElement;
})(duice || (duice = {}));
///<reference path="InputElement.ts"/>
var duice;
(function (duice) {
    /**
     * InputCheckboxElement
     */
    class InputCheckboxElement extends duice.InputElement {
        /**
         * constructor
         * @param htmlElement
         * @param context
         */
        constructor(htmlElement, context) {
            super(htmlElement, context);
            this.trueValue = true;
            this.falseValue = false;
            // true false value
            let trueValue = duice.getAttribute(this.getHtmlElement(), 'true-value');
            this.trueValue = trueValue ? trueValue : this.trueValue;
            let falseValue = duice.getAttribute(this.getHtmlElement(), 'false-value');
            this.falseValue = falseValue ? falseValue : this.falseValue;
        }
        /**
         * setValue
         * @param value
         */
        setValue(value) {
            if (value === this.trueValue) {
                this.getHtmlElement().checked = true;
            }
            else {
                this.htmlElement.checked = false;
            }
        }
        /**
         * getValue
         */
        getValue() {
            if (this.htmlElement.checked) {
                return this.trueValue;
            }
            else {
                return this.falseValue;
            }
        }
    }
    duice.InputCheckboxElement = InputCheckboxElement;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * InputElementFactory
     */
    class InputElementFactory extends duice.ElementFactory {
        /**
         * doCreateElement
         * @param htmlElement
         * @param context
         */
        doCreateElement(htmlElement, context) {
            let type = htmlElement.getAttribute('type');
            switch (type) {
                case 'number':
                    return new duice.InputNumberElement(htmlElement, context);
                case 'checkbox':
                    return new duice.InputCheckboxElement(htmlElement, context);
                default:
                    return new duice.InputElement(htmlElement, context);
            }
        }
        /**
         * support
         * @param htmlElement
         */
        support(htmlElement) {
            if (htmlElement.tagName.toLowerCase() === 'input') {
                return true;
            }
            else {
                return false;
            }
        }
    }
    duice.InputElementFactory = InputElementFactory;
    // register
    duice.ElementFactory.registerElementFactory(new InputElementFactory());
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * NumberFormat
     * @param scale number
     */
    class NumberMask {
        /**
         * Constructor
         * @param scale
         */
        constructor(scale) {
            this.scale = 0;
            this.scale = scale;
        }
        /**
         * Encodes number as format
         * @param number
         */
        encode(number) {
            if (!number || isNaN(Number(number))) {
                return '';
            }
            number = Number(number);
            let string = String(number.toFixed(this.scale));
            let reg = /(^[+-]?\d+)(\d{3})/;
            while (reg.test(string)) {
                string = string.replace(reg, '$1' + ',' + '$2');
            }
            return string;
        }
        /**
         * Decodes formatted value as original value
         * @param string
         */
        decode(string) {
            if (!string) {
                return null;
            }
            if (string.length === 1 && /[+-]/.test(string)) {
                string += '0';
            }
            string = string.replace(/,/gi, '');
            if (isNaN(Number(string))) {
                throw 'NaN';
            }
            let number = Number(string);
            number = Number(number.toFixed(this.scale));
            return number;
        }
    }
    duice.NumberMask = NumberMask;
})(duice || (duice = {}));
///<reference path="../mask/NumberMask.ts"/>
var duice;
(function (duice) {
    /**
     * InputNumberElement
     */
    class InputNumberElement extends duice.InputElement {
        /**
         * constructor
         * @param htmlElement
         * @param context
         */
        constructor(htmlElement, context) {
            super(htmlElement, context);
            // changes type and style
            this.getHtmlElement().removeAttribute('type');
            this.getHtmlElement().style.textAlign = 'right';
            // prevents invalid key press
            this.getHtmlElement().addEventListener('keypress', event => {
                if (/[\d|\.|,]/.test(event.key) === false) {
                    event.preventDefault();
                }
            });
        }
        /**
         * getValue
         */
        getValue() {
            let value = super.getValue();
            return Number(value);
        }
    }
    duice.InputNumberElement = InputNumberElement;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * SelectElement
     */
    class SelectElement extends duice.Element {
        /**
         * constructor
         * @param htmlElement
         * @param context
         */
        constructor(htmlElement, context) {
            super(htmlElement, context);
            // adds event listener
            this.getHtmlElement().addEventListener('change', event => {
                this.notifyObservers({});
            }, true);
        }
        /**
         * setValue
         * @param value
         */
        setValue(value) {
            this.getHtmlElement().value = value;
        }
        /**
         * getValue
         */
        getValue() {
            return this.getHtmlElement().value;
        }
        /**
         * setReadonly
         * @param readonly
         */
        setReadonly(readonly) {
            if (readonly) {
                this.getHtmlElement().style.pointerEvents = 'non';
            }
            else {
                this.getHtmlElement().style.pointerEvents = '';
            }
        }
    }
    duice.SelectElement = SelectElement;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * SelectElementFactory
     */
    class SelectElementFactory extends duice.ElementFactory {
        /**
         * doCreateElement
         * @param htmlElement
         * @param context
         */
        doCreateElement(htmlElement, context) {
            return new duice.SelectElement(htmlElement, context);
        }
        /**
         * support
         * @param htmlElement
         */
        support(htmlElement) {
            return (htmlElement.tagName.toLowerCase() === 'select');
        }
    }
    duice.SelectElementFactory = SelectElementFactory;
    // register
    duice.ElementFactory.registerElementFactory(new SelectElementFactory());
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * Textarea
     */
    class TextareaElement extends duice.Element {
        /**
         * constructor
         * @param htmlElement
         * @param context
         */
        constructor(htmlElement, context) {
            super(htmlElement, context);
            // adds change event listener
            this.getHtmlElement().addEventListener('change', event => {
                this.notifyObservers({});
            }, true);
        }
        /**
         * setValue
         * @param value
         */
        setValue(value) {
            this.getHtmlElement().value = value;
        }
        /**
         * getValue
         */
        getValue() {
            let value = this.getHtmlElement().value;
            return value;
        }
        /**
         * setReadonly
         * @param readonly
         */
        setReadonly(readonly) {
            if (readonly) {
                this.getHtmlElement().setAttribute('readonly', 'readonly');
            }
            else {
                this.getHtmlElement().removeAttribute('readonly');
            }
        }
    }
    duice.TextareaElement = TextareaElement;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * TextareaElementFactory
     */
    class TextareaElementFactory extends duice.ElementFactory {
        /**
         * doCreateElement
         * @param htmlElement
         * @param context
         */
        doCreateElement(htmlElement, context) {
            return new duice.TextareaElement(htmlElement, context);
        }
        /**
         * support
         * @param htmlElement
         */
        support(htmlElement) {
            return (htmlElement.tagName.toLowerCase() === 'textarea');
        }
    }
    duice.TextareaElementFactory = TextareaElementFactory;
    // register
    duice.ElementFactory.registerElementFactory(new TextareaElementFactory());
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * DateFormat
     */
    class DateMask {
        /**
         * Constructor
         * @param pattern
         */
        constructor(pattern) {
            this.patternRex = /yyyy|yy|MM|dd|HH|hh|mm|ss/gi;
            this.pattern = pattern;
        }
        /**
         * Encodes date string
         * @param string
         */
        encode(string) {
            if (!string) {
                return '';
            }
            if (!this.pattern) {
                return new Date(string).toString();
            }
            let date = new Date(string);
            string = this.pattern.replace(this.patternRex, function ($1) {
                switch ($1) {
                    case "yyyy":
                        return date.getFullYear();
                    case "yy":
                        return String(date.getFullYear() % 1000).padStart(2, '0');
                    case "MM":
                        return String(date.getMonth() + 1).padStart(2, '0');
                    case "dd":
                        return String(date.getDate()).padStart(2, '0');
                    case "HH":
                        return String(date.getHours()).padStart(2, '0');
                    case "hh":
                        return String(date.getHours() <= 12 ? date.getHours() : date.getHours() % 12).padStart(2, '0');
                    case "mm":
                        return String(date.getMinutes()).padStart(2, '0');
                    case "ss":
                        return String(date.getSeconds()).padStart(2, '0');
                    default:
                        return $1;
                }
            });
            return string;
        }
        /**
         * Decodes formatted date string to ISO date string.
         * @param string
         */
        decode(string) {
            if (!string) {
                return null;
            }
            if (!this.pattern) {
                return new Date(string).toISOString();
            }
            let date = new Date(0, 0, 0, 0, 0, 0);
            let match;
            while ((match = this.patternRex.exec(this.pattern)) != null) {
                let formatString = match[0];
                let formatIndex = match.index;
                let formatLength = formatString.length;
                let matchValue = string.substr(formatIndex, formatLength);
                matchValue = matchValue.padEnd(formatLength, '0');
                switch (formatString) {
                    case 'yyyy': {
                        let fullYear = parseInt(matchValue);
                        date.setFullYear(fullYear);
                        break;
                    }
                    case 'yy': {
                        let yyValue = parseInt(matchValue);
                        let yearPrefix = Math.floor(new Date().getFullYear() / 100);
                        let fullYear = yearPrefix * 100 + yyValue;
                        date.setFullYear(fullYear);
                        break;
                    }
                    case 'MM': {
                        let monthValue = parseInt(matchValue);
                        date.setMonth(monthValue - 1);
                        break;
                    }
                    case 'dd': {
                        let dateValue = parseInt(matchValue);
                        date.setDate(dateValue);
                        break;
                    }
                    case 'HH': {
                        let hoursValue = parseInt(matchValue);
                        date.setHours(hoursValue);
                        break;
                    }
                    case 'hh': {
                        let hoursValue = parseInt(matchValue);
                        date.setHours(hoursValue > 12 ? (hoursValue + 12) : hoursValue);
                        break;
                    }
                    case 'mm': {
                        let minutesValue = parseInt(matchValue);
                        date.setMinutes(minutesValue);
                        break;
                    }
                    case 'ss': {
                        let secondsValue = parseInt(matchValue);
                        date.setSeconds(secondsValue);
                        break;
                    }
                }
            }
            return date.toISOString();
        }
    }
    duice.DateMask = DateMask;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * StringFormat
     * @param string format
     */
    class StringMask {
        /**
         * Constructor
         * @param pattern
         */
        constructor(pattern) {
            this.pattern = pattern;
        }
        /**
         * encode string as format
         * @param value
         */
        encode(value) {
            if (!value) {
                return value;
            }
            let encodedValue = '';
            let patternChars = this.pattern.split('');
            let valueChars = value.split('');
            let valueCharsPosition = 0;
            for (let i = 0, size = patternChars.length; i < size; i++) {
                let patternChar = patternChars[i];
                if (patternChar === '#') {
                    encodedValue += valueChars[valueCharsPosition++] || '';
                }
                else {
                    encodedValue += patternChar;
                }
                if (valueCharsPosition >= valueChars.length) {
                    break;
                }
            }
            return encodedValue;
        }
        /**
         * decodes string as format
         * @param value
         */
        decode(value) {
            if (!value) {
                return value;
            }
            let decodedValue = '';
            let patternChars = this.pattern.split('');
            let valueChars = value.split('');
            let valueCharsPosition = 0;
            for (let i = 0, size = patternChars.length; i < size; i++) {
                let patternChar = patternChars[i];
                if (patternChar === '#') {
                    decodedValue += valueChars[valueCharsPosition++] || '';
                }
                else {
                    valueCharsPosition++;
                }
            }
            return decodedValue;
        }
    }
    duice.StringMask = StringMask;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * Array
     */
    class ArrayProxy extends globalThis.Array {
        /**
         * constructor
         */
        constructor(array) {
            super();
            // copy array elements
            if (globalThis.Array.isArray(array)) {
                array.forEach(object => {
                    this.push(object);
                });
            }
            // returns proxy instance
            let arrayHandler = new duice.ArrayHandler(this);
            return new Proxy(this, arrayHandler);
        }
        /**
         * getHandler
         * @param array
         */
        static getHandler(array) {
            var _a;
            let handler = (_a = globalThis.Object.getOwnPropertyDescriptor(array, '_handler_')) === null || _a === void 0 ? void 0 : _a.value;
            duice.assert(handler, 'arrayHandler is not found');
            return handler;
        }
        /**
         * assign
         * @param arrayProxy
         * @param array
         */
        static assign(arrayProxy, array) {
            let handler = this.getHandler(arrayProxy);
            handler.assign(array);
            handler.notifyObservers({});
        }
        /**
         * setReadonly
         * @param array
         * @param property
         * @param readonly
         */
        static setReadonly(array, property, readonly) {
            let handler = this.getHandler(array);
            handler.setReadonly(property, readonly);
        }
        /**
         * isReadonly
         * @param array
         * @param property
         */
        static isReadonly(array, property) {
            let handler = this.getHandler(array);
            return handler.isReadonly(property);
        }
        /**
         * setReadonlyAll
         * @param array
         * @param readonly
         */
        static setReadonlyAll(array, readonly) {
            let handler = this.getHandler(array);
            handler.setReadonlyAll(readonly);
            for (let index = 0; index >= array.length; index++) {
                duice.ObjectProxy.setReadonlyAll(array[index], readonly);
            }
        }
        /**
         * setBeforeChangeListener
         * @param array
         * @param listener
         */
        static setBeforeChangeListener(array, listener) {
            this.getHandler(array).setBeforeChangeListener(listener);
            array.forEach(object => {
                duice.ObjectProxy.setBeforeChangeListener(object, listener);
            });
        }
        /**
         * setAfterChangeListener
         * @param array
         * @param listener
         */
        static setAfterChangeListener(array, listener) {
            this.getHandler(array).setAfterChangeListener(listener);
            array.forEach(object => {
                duice.ObjectProxy.setAfterChangeListener(object, listener);
            });
        }
    }
    duice.ArrayProxy = ArrayProxy;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * ObjectProxy
     */
    class ObjectProxy extends globalThis.Object {
        /**
         * constructor
         */
        constructor(object) {
            super();
            // copy property
            if (typeof object === 'object') {
                for (let property in object) {
                    this[property] = object[property];
                }
            }
            // return proxy instance
            let objectHandler = new duice.ObjectHandler(this);
            return new Proxy(this, objectHandler);
        }
        /**
         * getHandler
         * @param objectProxy
         */
        static getHandler(objectProxy) {
            var _a;
            let objectHandler = (_a = globalThis.Object.getOwnPropertyDescriptor(objectProxy, '_handler_')) === null || _a === void 0 ? void 0 : _a.value;
            duice.assert(objectHandler, 'objectHandler is not found');
            return objectHandler;
        }
        /**
         * assign
         * @param objectProxy
         * @param object
         */
        static assign(objectProxy, object) {
            let handler = this.getHandler(objectProxy);
            handler.assign(object);
            handler.notifyObservers({});
        }
        /**
         * setReadonly
         * @param objectProxy
         * @param property
         * @param readonly
         */
        static setReadonly(objectProxy, property, readonly) {
            let objectHandler = this.getHandler(objectProxy);
            objectHandler.setReadonly(property, readonly);
        }
        /**
         * isReadonly
         * @param objectProxy
         * @param property
         */
        static isReadonly(objectProxy, property) {
            let objectHandler = this.getHandler(objectProxy);
            return objectHandler.isReadonly(property);
        }
        /**
         * setReadonlyAll
         * @param objectProxy
         * @param readonly
         */
        static setReadonlyAll(objectProxy, readonly) {
            let objectHandler = this.getHandler(objectProxy);
            objectHandler.setReadonlyAll(readonly);
            for (let property in this) {
                objectHandler.setReadonly(property, readonly);
            }
        }
        /**
         * isDirty
         * @param objectProxy
         */
        static isDirty(objectProxy) {
            return this.getHandler(objectProxy).isDirty();
        }
        /**
         * reset
         * @param objectProxy
         */
        static reset(objectProxy) {
            this.getHandler(objectProxy).reset();
        }
        /**
         * setBeforeChangeListener
         * @param objectProxy
         * @param listener
         */
        static setBeforeChangeListener(objectProxy, listener) {
            this.getHandler(objectProxy).setBeforeChangeListener(listener);
        }
        /**
         * setAfterChangeListener
         * @param objectProxy
         * @param listener
         */
        static setAfterChangeListener(objectProxy, listener) {
            this.getHandler(objectProxy).setAfterChangeListener(listener);
        }
    }
    duice.ObjectProxy = ObjectProxy;
})(duice || (duice = {}));
//# sourceMappingURL=duice.js.map