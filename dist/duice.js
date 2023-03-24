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
     * ArrayProxy
     */
    class ArrayProxy extends globalThis.Array {
        /**
         * constructor
         */
        constructor(array) {
            super();
            // array handler
            let arrayHandler = new duice.ArrayProxyHandler();
            // copy array elements
            if (globalThis.Array.isArray(array)) {
                array.forEach((object, index) => {
                    let objectProxy = new duice.ObjectProxy(object);
                    duice.ObjectProxy.getHandler(objectProxy).addObserver(arrayHandler);
                    this[index] = objectProxy;
                });
            }
            // create proxy
            let arrayProxy = new Proxy(this, arrayHandler);
            arrayHandler.setTarget(arrayProxy);
            // set property
            ArrayProxy.setHandler(arrayProxy, arrayHandler);
            ArrayProxy.setTarget(arrayProxy, this);
            // returns
            return arrayProxy;
        }
        /**
         * assign
         * @param arrayProxy
         * @param array
         */
        static assign(arrayProxy, array) {
            console.log('ArrayProxy.assign', arrayProxy, array);
            let arrayHandler = this.getHandler(arrayProxy);
            try {
                // suspend
                arrayHandler.suspendListener();
                arrayHandler.suspendNotify();
                // clears elements
                arrayProxy.length = 0;
                // creates elements
                array.forEach((object, index) => {
                    let objectProxy = new duice.ObjectProxy(object);
                    duice.ObjectProxy.getHandler(objectProxy).addObserver(arrayHandler);
                    arrayProxy[index] = objectProxy;
                    // add listener
                    duice.ObjectProxy.onPropertyChanging(objectProxy, arrayHandler.propertyChangingListener);
                    duice.ObjectProxy.onPropertyChanged(objectProxy, arrayHandler.propertyChangedListener);
                });
            }
            finally {
                // resume
                arrayHandler.resumeListener();
                arrayHandler.resumeNotify();
            }
            // notify observers
            arrayHandler.notifyObservers(new duice.Event(this));
        }
        /**
         * setTarget
         * @param arrayProxy
         * @param target
         */
        static setTarget(arrayProxy, target) {
            globalThis.Object.defineProperty(arrayProxy, '_target_', {
                value: target,
                writable: true
            });
        }
        /**
         * getTarget
         * @param arrayProxy
         */
        static getTarget(arrayProxy) {
            return globalThis.Object.getOwnPropertyDescriptor(arrayProxy, '_target_').value;
        }
        /**
         * setHandler
         * @param arrayProxy
         * @param arrayHandler
         */
        static setHandler(arrayProxy, arrayHandler) {
            globalThis.Object.defineProperty(arrayProxy, '_handler_', {
                value: arrayHandler,
                writable: true
            });
        }
        /**
         * getHandler
         * @param arrayProxy
         */
        static getHandler(arrayProxy) {
            let handler = globalThis.Object.getOwnPropertyDescriptor(arrayProxy, '_handler_').value;
            duice.assert(handler, 'handler is not found');
            return handler;
        }
        /**
         * onPropertyChanging
         * @param arrayProxy
         * @param listener
         */
        static onPropertyChanging(arrayProxy, listener) {
            this.getHandler(arrayProxy).propertyChangingListener = listener;
            arrayProxy.forEach(objectProxy => {
                duice.ObjectProxy.getHandler(objectProxy).propertyChangingListener = listener;
            });
        }
        /**
         * onPropertyChanged
         * @param arrayProxy
         * @param listener
         */
        static onPropertyChanged(arrayProxy, listener) {
            this.getHandler(arrayProxy).propertyChangedListener = listener;
            arrayProxy.forEach(objectProxy => {
                duice.ObjectProxy.getHandler(objectProxy).propertyChangedListener = listener;
            });
        }
        /**
         * onRowInserting
         * @param arrayProxy
         * @param listener
         */
        static onRowInserting(arrayProxy, listener) {
            this.getHandler(arrayProxy).rowInsertingListener = listener;
        }
        /**
         * onRowInserted
         * @param arrayProxy
         * @param listener
         */
        static onRowInserted(arrayProxy, listener) {
            this.getHandler(arrayProxy).rowInsertedListener = listener;
        }
        /**
         * onRowDeleting
         * @param arrayProxy
         * @param listener
         */
        static onRowDeleting(arrayProxy, listener) {
            this.getHandler(arrayProxy).rowDeletingListener = listener;
        }
        /**
         * onRowDeleted
         * @param arrayProxy
         * @param listener
         */
        static onRowDeleted(arrayProxy, listener) {
            this.getHandler(arrayProxy).rowDeletedListener = listener;
        }
        /**
         * setReadonly
         * @param arrayProxy
         * @param property
         * @param readonly
         */
        static setReadonly(arrayProxy, property, readonly) {
            this.getHandler(arrayProxy).setReadonly(property, readonly);
        }
        /**
         * isReadonly
         * @param arrayProxy
         * @param property
         */
        static isReadonly(arrayProxy, property) {
            return this.getHandler(arrayProxy).isReadonly(property);
        }
        /**
         * setReadonlyAll
         * @param arrayProxy
         * @param readonly
         */
        static setReadonlyAll(arrayProxy, readonly) {
            this.getHandler(arrayProxy).setReadonlyAll(readonly);
            for (let index = 0; index >= this.length; index++) {
                duice.ObjectProxy.setReadonlyAll(this[index], readonly);
            }
        }
        /**
         * insertRow
         * @param index
         * @param rows
         */
        insertRow(index, ...rows) {
            return __awaiter(this, void 0, void 0, function* () {
                let arrayHandler = ArrayProxy.getHandler(this);
                let proxyTarget = ArrayProxy.getTarget(this);
                rows.forEach((object, index) => {
                    rows[index] = new duice.ObjectProxy(object);
                });
                let event = new duice.RowInsertEvent(this, index, rows);
                if (yield arrayHandler.checkListener(arrayHandler.rowInsertingListener, event)) {
                    proxyTarget.splice(index, 0, ...rows);
                    yield arrayHandler.checkListener(arrayHandler.rowInsertedListener, event);
                    arrayHandler.notifyObservers(event);
                }
            });
        }
        /**
         * deleteRow
         * @param index
         * @param size
         */
        deleteRow(index, size) {
            return __awaiter(this, void 0, void 0, function* () {
                let arrayHandler = ArrayProxy.getHandler(this);
                let proxyTarget = ArrayProxy.getTarget(this);
                let sliceBegin = index;
                let sliceEnd = (size ? index + size : index + 1);
                let rows = proxyTarget.slice(sliceBegin, sliceEnd);
                let event = new duice.RowDeleteEvent(this, index, rows);
                if (yield arrayHandler.checkListener(arrayHandler.rowDeletingListener, event)) {
                    let spliceStart = index;
                    let spliceDeleteCount = (size ? size : 1);
                    proxyTarget.splice(spliceStart, spliceDeleteCount);
                    yield arrayHandler.checkListener(arrayHandler.rowDeletedListener, event);
                    arrayHandler.notifyObservers(event);
                }
            });
        }
        /**
         * appendRow
         * @param rows
         */
        appendRow(...rows) {
            return __awaiter(this, void 0, void 0, function* () {
                let index = this.length;
                return this.insertRow(index, ...rows);
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
            // object handler
            let objectHandler = new duice.ObjectProxyHandler();
            // copy property
            for (let name in object) {
                let value = object[name];
                // value is array
                if (Array.isArray(value)) {
                    let arrayProxy = new duice.ArrayProxy(value);
                    duice.ArrayProxy.getHandler(arrayProxy).addObserver(objectHandler);
                    this[name] = arrayProxy;
                    continue;
                }
                // value is object
                if (value != null && typeof value === 'object') {
                    let objectProxy = new ObjectProxy(value);
                    ObjectProxy.getHandler(objectProxy).addObserver(objectHandler);
                    this[name] = objectProxy;
                    continue;
                }
                // value is primitive
                this[name] = value;
            }
            // delete not exists property
            for (let name in this) {
                if (!Object.keys(object).includes(name)) {
                    delete this[name];
                }
            }
            // creates proxy
            let objectProxy = new Proxy(this, objectHandler);
            objectHandler.setTarget(objectProxy);
            // set property
            ObjectProxy.setHandler(objectProxy, objectHandler);
            ObjectProxy.setTarget(objectProxy, this);
            // returns
            return objectProxy;
        }
        /**
         * assign
         * @param objectProxy
         * @param object
         */
        static assign(objectProxy, object) {
            let objectHandler = this.getHandler(objectProxy);
            try {
                // suspend
                objectHandler.suspendListener();
                objectHandler.suspendNotify();
                // loop object properties
                for (let name in object) {
                    let value = object[name];
                    // source value is array
                    if (Array.isArray(value)) {
                        if (Array.isArray(objectProxy[name])) {
                            duice.ArrayProxy.assign(objectProxy[name], value);
                        }
                        else {
                            objectProxy[name] = new duice.ArrayProxy(value);
                        }
                        continue;
                    }
                    // source value is object
                    if (typeof value === 'object') {
                        if (typeof objectProxy[name] === 'object') {
                            ObjectProxy.assign(objectProxy[name], value);
                        }
                        else {
                            let objectProxy = new ObjectProxy(value);
                            ObjectProxy.getHandler(objectProxy).addObserver(objectHandler);
                            objectProxy[name] = objectProxy;
                        }
                        continue;
                    }
                    // source value is primitive
                    objectProxy[name] = value;
                }
            }
            finally {
                // resume
                objectHandler.resumeListener();
                objectHandler.resumeNotify();
            }
            // notify observers
            objectHandler.notifyObservers(new duice.Event(this));
        }
        /**
         * setTarget
         * @param objectProxy
         * @param target
         */
        static setTarget(objectProxy, target) {
            globalThis.Object.defineProperty(objectProxy, '_target_', {
                value: target,
                writable: true
            });
        }
        /**
         * getTarget
         * @param objectProxy
         */
        static getTarget(objectProxy) {
            return globalThis.Object.getOwnPropertyDescriptor(objectProxy, '_target_').value;
        }
        /**
         * setHandler
         * @param objectProxy
         * @param objectHandler
         */
        static setHandler(objectProxy, objectHandler) {
            globalThis.Object.defineProperty(objectProxy, '_handler_', {
                value: objectHandler,
                writable: true
            });
        }
        /**
         * getHandler
         * @param objectProxy
         */
        static getHandler(objectProxy) {
            let handler = globalThis.Object.getOwnPropertyDescriptor(objectProxy, '_handler_').value;
            duice.assert(handler, 'handler is not found');
            return handler;
        }
        /**
         * onPropertyChanging
         * @param objectProxy
         * @param listener
         */
        static onPropertyChanging(objectProxy, listener) {
            this.getHandler(objectProxy).propertyChangingListener = listener;
        }
        /**
         * onPropertyChanged
         * @param objectProxy
         * @param listener
         */
        static onPropertyChanged(objectProxy, listener) {
            this.getHandler(objectProxy).propertyChangedListener = listener;
        }
        /**
         * setReadonly
         * @param objectProxy
         * @param property
         * @param readonly
         */
        static setReadonly(objectProxy, property, readonly) {
            this.getHandler(objectProxy).setReadonly(property, readonly);
        }
        /**
         * isReadonly
         * @param objectProxy
         * @param property
         */
        static isReadonly(objectProxy, property) {
            return this.getHandler(objectProxy).isReadonly(property);
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
    }
    duice.ObjectProxy = ObjectProxy;
})(duice || (duice = {}));
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
         * @param event
         */
        notifyObservers(event) {
            if (this.notifyEnabled) {
                this.observers.forEach(observer => {
                    observer.update(this, event);
                });
            }
        }
    }
    duice.Observable = Observable;
})(duice || (duice = {}));
var duice;
(function (duice) {
    class ComponentControlFactory {
        /**
         * constructor
         * @param tagName
         */
        constructor(tagName) {
            this.tagName = tagName;
        }
        /**
         * register component factory
         * @param componentControlFactory
         */
        static registerComponentFactory(componentControlFactory) {
            this.componentControlFactoryRegistry.push(componentControlFactory);
        }
        /**
         * getQuerySelectors
         */
        static getQuerySelectors() {
            let querySelectors = [];
            this.componentControlFactoryRegistry.forEach(componentControlFactory => {
                let tagName = componentControlFactory.getTagName();
                let querySelector = `${tagName}:not([${duice.getNamespace()}\\:id])`;
                querySelectors.push(querySelector);
            });
            return querySelectors;
        }
        /**
         * return instance
         * @param htmlElement
         */
        static getInstance(htmlElement) {
            let instance;
            this.componentControlFactoryRegistry.forEach(componentControlFactory => {
                if (componentControlFactory.support(htmlElement)) {
                    instance = componentControlFactory;
                }
            });
            return instance;
        }
        /**
         * getTagName
         */
        getTagName() {
            return this.tagName;
        }
        /**
         * creates element
         * @param element
         * @param context
         */
        createComponentControl(element, context) {
            // creates instance
            let componentControl = new duice.ComponentControl(element, context);
            // set object
            let objectName = duice.getAttribute(element, 'object');
            if (objectName) {
                componentControl.setObject(objectName);
            }
            // set array
            let arrayName = duice.getAttribute(element, 'array');
            if (arrayName) {
                componentControl.setArray(arrayName);
            }
            // returns
            return componentControl;
        }
        /**
         * support
         * @param element
         */
        support(element) {
            return (element.tagName.toLowerCase() === this.tagName);
        }
    }
    ComponentControlFactory.componentControlFactoryRegistry = [];
    duice.ComponentControlFactory = ComponentControlFactory;
})(duice || (duice = {}));
///<reference path="ComponentControlFactory.ts"/>
var duice;
(function (duice) {
    let namespace = 'duice';
    /**
     * sets namespace
     * @param value
     */
    function setNamespace(value) {
        namespace = value;
    }
    duice.setNamespace = setNamespace;
    /**
     * returns alias of namespace
     */
    function getNamespace() {
        return namespace;
    }
    duice.getNamespace = getNamespace;
    /**
     * returns query selector expression
     */
    function getQuerySelectors() {
        let querySelectors = [];
        querySelectors.push(...duice.ComponentControlFactory.getQuerySelectors());
        querySelectors.push(...duice.LoopControlFactory.getQuerySelectors());
        querySelectors.push(...duice.ElementControlFactory.getQuerySelectors());
        return querySelectors.join(',');
    }
    duice.getQuerySelectors = getQuerySelectors;
    /**
     * initializes
     * @param container
     * @param context
     */
    function initialize(container, context) {
        // initialize elementSet, element (order is important)
        container.querySelectorAll(getQuerySelectors()).forEach(element => {
            if (!hasAttribute(element, 'id')) {
                try {
                    if (duice.ComponentControlFactory.getInstance(element)) {
                        let componentControlFactory = duice.ComponentControlFactory.getInstance(element);
                        let componentControl = componentControlFactory.createComponentControl(element, context);
                        componentControl.render();
                    }
                    else if (hasAttribute(element, 'array')) {
                        let loopControlFactory = duice.LoopControlFactory.getInstance(element);
                        let loopControl = loopControlFactory.createLoopControl(element, context);
                        loopControl.render();
                    }
                    else if (hasAttribute(element, 'object')) {
                        let controlFactory = duice.ElementControlFactory.getInstance(element);
                        let control = controlFactory.createElementControl(element, context);
                        control.render();
                    }
                }
                catch (e) {
                    console.error(e, element, container, JSON.stringify(context));
                }
            }
        });
    }
    duice.initialize = initialize;
    /**
     * markInitialized
     * @param container
     */
    function markInitialized(container) {
        container.querySelectorAll(getQuerySelectors()).forEach(htmlElement => {
            setAttribute(htmlElement, 'id', generateId());
        });
    }
    duice.markInitialized = markInitialized;
    /**
     * findObject
     * @param context
     * @param name
     */
    function findObject(context, name) {
        // find in context
        try {
            let object = new Function(`return this.${name};`).call(context);
            if (object) {
                return object;
            }
        }
        catch (ignore) { }
        // find in global
        try {
            let object = new Function(`return ${name};`).call(null);
            if (object) {
                return object;
            }
        }
        catch (ignore) { }
        // throw error
        console.warn(`Object[${name}] is not found`);
        return undefined;
    }
    duice.findObject = findObject;
    /**
     * Generates component ID
     */
    function generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    duice.generateId = generateId;
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
     * @param element
     * @param name
     */
    function hasAttribute(element, name) {
        return element.hasAttribute(`${getNamespace()}:${name}`);
    }
    duice.hasAttribute = hasAttribute;
    /**
     * getAttribute
     * @param element
     * @param name
     */
    function getAttribute(element, name) {
        return element.getAttribute(`${getNamespace()}:${name}`);
    }
    duice.getAttribute = getAttribute;
    /**
     * setAttribute
     * @param element
     * @param name
     * @param value
     */
    function setAttribute(element, name, value) {
        element.setAttribute(`${getNamespace()}:${name}`, value);
    }
    duice.setAttribute = setAttribute;
    /**
     * removeChildNodes
     * @param node
     */
    function removeChildNodes(node) {
        // Remove element nodes and prevent memory leaks
        let childNode, childNodes = node.childNodes, i = 0;
        while (childNode = childNodes[i++]) {
            if (childNode.nodeType === 1) {
                node.removeChild(childNode);
            }
        }
        // Remove any remaining nodes
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
        // If this is a select, ensure that it displays empty
        if (node instanceof HTMLSelectElement) {
            node.options.length = 0;
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
     * Gets cookie value
     * @param name
     */
    function getCookie(name) {
        let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return value ? value[2] : null;
    }
    duice.getCookie = getCookie;
    /**
     * Sets cookie value
     * @param name
     * @param value
     * @param day
     */
    function setCookie(name, value, day) {
        let date = new Date();
        date.setTime(date.getTime() + day * 60 * 60 * 24 * 1000);
        document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
    }
    duice.setCookie = setCookie;
    /**
     * Deletes cookie
     * @param name
     */
    function deleteCookie(name) {
        setCookie(name, '', -1);
    }
    duice.deleteCookie = deleteCookie;
    /**
     * fetch
     * @param url
     * @param options
     * @param _bypass
     */
    function fetch(url, options, _bypass) {
        if (!options) {
            options = {};
        }
        if (!options.headers) {
            options.headers = {};
        }
        // csrf token
        ['XSRF-TOKEN', 'CSRF-TOKEN'].forEach(tokenName => {
            let tokenValue = getCookie(tokenName);
            if (tokenValue) {
                options.headers[`X-${tokenName}`] = tokenValue;
            }
        });
        options.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        options.headers['Pragma'] = 'no-cache';
        options.headers['Expires'] = '0';
        return globalThis.fetch(url, options)
            .then(function (response) {
            return __awaiter(this, void 0, void 0, function* () {
                console.debug(response);
                // bypass
                if (_bypass) {
                    return response;
                }
                // checks response
                if (response.ok) {
                    return response;
                }
                else {
                    let responseJson = yield response.json();
                    console.warn(responseJson);
                    let message = responseJson.message;
                    alert(message).then();
                    throw Error(message);
                }
            });
        })
            .catch((error) => {
            throw Error(error);
        });
    }
    duice.fetch = fetch;
    /**
     * defineComponent
     * @param tagName
     * @param constructor
     */
    function defineComponent(tagName, constructor) {
        customElements.define(tagName, constructor);
        duice.ComponentControlFactory.registerComponentFactory(new duice.ComponentControlFactory(tagName));
    }
    duice.defineComponent = defineComponent;
    /**
     * listens DOMContentLoaded event
     */
    if (globalThis.document) {
        // initialize elements
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
            this.dialogElement.style.borderStyle = 'solid';
            this.dialogElement.style.borderWidth = '1px';
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
            this.dialogElement.style.top = Math.max(0, window.innerHeight / 3 - computedHeight / 3) + scrollY + 'px';
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
            window.document.body.appendChild(this.dialogElement);
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
     * Event
     */
    class Event {
        /**
         * constructor
         * @param source
         */
        constructor(source) {
            this.source = source;
        }
    }
    duice.Event = Event;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * PropertyChangeEvent
     */
    class PropertyChangeEvent extends duice.Event {
        /**
         * constructor
         * @param source
         * @param property
         * @param value
         */
        constructor(source, property, value, index) {
            super(source);
            this.property = property;
            this.value = value;
            this.index = index;
        }
        /**
         * getProperty
         */
        getProperty() {
            return this.property;
        }
        /**
         * getValue
         */
        getValue() {
            return this.value;
        }
        /**
         * getIndex
         */
        getIndex() {
            return this.index;
        }
    }
    duice.PropertyChangeEvent = PropertyChangeEvent;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * RowInsertEvent
     */
    class RowInsertEvent extends duice.Event {
        /**
         * constructor
         * @param source
         * @param index
         */
        constructor(source, index, rows) {
            super(source);
            this.rows = [];
            this.index = index;
            this.rows = rows;
        }
        /**
         * return index
         */
        getIndex() {
            return this.index;
        }
        /**
         * getRows
         */
        getRows() {
            return this.rows;
        }
    }
    duice.RowInsertEvent = RowInsertEvent;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * RowDeleteEvent
     */
    class RowDeleteEvent extends duice.Event {
        /**
         * constructor
         * @param source
         * @param index
         */
        constructor(source, index, rows) {
            super(source);
            this.rows = [];
            this.index = index;
            this.rows = rows;
        }
        /**
         * return index
         */
        getIndex() {
            return this.index;
        }
        /**
         * getRows
         */
        getRows() {
            return this.rows;
        }
    }
    duice.RowDeleteEvent = RowDeleteEvent;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * RowMoveEvent
     */
    class RowMoveEvent extends duice.Event {
        /**
         * constructor
         * @param source
         * @param fromIndex
         * @param toIndex
         */
        constructor(source, fromIndex, toIndex) {
            super(source);
            this.fromIndex = fromIndex;
            this.toIndex = toIndex;
        }
        /**
         * getFromIndex
         */
        getFromIndex() {
            return this.fromIndex;
        }
        /**
         * getToIndex
         */
        getToIndex() {
            return this.toIndex;
        }
    }
    duice.RowMoveEvent = RowMoveEvent;
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
     * Component
     */
    class Component extends HTMLElement {
        /**
         * constructor
         * @protected
         */
        constructor() {
            super();
        }
        /**
         * return style literal
         * @param data
         */
        doStyle(data) {
            return null;
        }
    }
    duice.Component = Component;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * ComponentControl
     */
    class ComponentControl extends duice.Observable {
        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element, context) {
            super();
            this.element = element;
            this.context = context;
        }
        /**
         * setData
         * @param objectName
         */
        setObject(objectName) {
            this.data = duice.findObject(this.context, objectName);
            if (!this.data) {
                console.warn(`ObjectProxy[${objectName}] is not found.`, this.data);
                this.data = new duice.ObjectProxy({});
            }
            let objectHandler = duice.ObjectProxy.getHandler(this.data);
            this.addObserver(objectHandler);
            objectHandler.addObserver(this);
        }
        /**
         * setArray
         * @param arrayName
         */
        setArray(arrayName) {
            this.data = duice.findObject(this.context, arrayName);
            if (!this.data) {
                console.warn(`ArrayProxy[${arrayName}] is not found.`, this.data);
                this.data = new duice.ArrayProxy([]);
            }
            let arrayHandler = duice.ArrayProxy.getHandler(this.data);
            this.addObserver(arrayHandler);
            arrayHandler.addObserver(this);
        }
        /**
         * check shadow DOM
         */
        isShadowDom() {
            return (!!this.element.shadowRoot);
        }
        /**
         * render
         */
        render() {
            this.doRender(this.data);
            this.executeScript();
        }
        /**
         * doRender
         * @param data
         */
        doRender(data) {
            // removes child
            if (this.isShadowDom()) {
                duice.removeChildNodes(this.element.shadowRoot);
            }
            else {
                duice.removeChildNodes(this.element);
            }
            // create template element
            let templateLiteral = this.element.doRender(data).trim();
            let templateElement = document.createElement('template');
            templateElement.innerHTML = templateLiteral;
            let htmlElement = templateElement.content.firstChild.cloneNode(true);
            if (this.element.shadowRoot) {
                this.element.shadowRoot.appendChild(htmlElement);
            }
            else {
                this.element.appendChild(htmlElement);
            }
            // add style if exists
            let styleLiteral = this.element.doStyle(data);
            if (styleLiteral) {
                let style = document.createElement('style');
                style.textContent = styleLiteral.trim();
                if (this.isShadowDom()) {
                    this.element.shadowRoot.appendChild(style);
                }
                else {
                    this.element.appendChild(style);
                }
            }
            // initializes shadow root
            let context = {
                object: this.data,
                array: this.data
            };
            if (this.isShadowDom()) {
                duice.initialize(this.element.shadowRoot, context);
            }
            else {
                duice.initialize(this.element, context);
            }
        }
        /**
         * update
         * @param observable
         * @param event
         */
        update(observable, event) {
            console.log("ComponentControl.update", observable, event);
            if (observable instanceof duice.ProxyHandler) {
                this.doRender(observable.getTarget());
                this.executeScript();
            }
        }
        /**
         * executes script
         */
        executeScript() {
            let script = duice.getAttribute(this.element, 'script');
            if (script) {
                duice.executeScript(script, this.element, this.context);
            }
        }
    }
    duice.ComponentControl = ComponentControl;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * LoopControl
     */
    class LoopControl extends duice.Observable {
        /**
         * constructor
         * @param element
         */
        constructor(element, context) {
            super();
            this.slot = document.createElement('slot');
            this.editable = false;
            this.rowElements = [];
            // clone html element template
            this.element = element.cloneNode(true);
            duice.setAttribute(this.element, 'id', duice.generateId());
            duice.markInitialized(element);
            // replace slot element
            element.replaceWith(this.slot);
            // set context
            this.context = context;
        }
        /**
         * setArray
         * @param arrayName
         */
        setArray(arrayName) {
            this.arrayProxy = duice.findObject(this.context, arrayName);
            if (!this.arrayProxy) {
                console.warn(`ArrayProxy[${arrayName}] is not found.`, this.arrayProxy);
                this.arrayProxy = new duice.ArrayProxy([]);
            }
            let arrayHandler = duice.ArrayProxy.getHandler(this.arrayProxy);
            this.addObserver(arrayHandler);
            arrayHandler.addObserver(this);
        }
        /**
         * setLoop
         * @param loop
         */
        setLoop(loop) {
            this.loop = loop;
        }
        /**
         * setEditable
         * @param editable
         */
        setEditable(editable) {
            this.editable = editable;
        }
        /**
         * render
         */
        render() {
            // do render
            this.doRender(this.arrayProxy);
            // executes script
            this.executeScript();
        }
        /**
         * doRender
         * @param arrayProxy
         */
        doRender(arrayProxy) {
            var _a;
            let _this = this;
            // reset row elements
            this.rowElements.forEach(rowElement => {
                this.slot.parentNode.removeChild(rowElement);
            });
            this.rowElements.length = 0;
            // loop
            if (this.loop) {
                let loopArgs = this.loop.split(',');
                let itemName = loopArgs[0].trim();
                let statusName = (_a = loopArgs[1]) === null || _a === void 0 ? void 0 : _a.trim();
                for (let index = 0; index < arrayProxy.length; index++) {
                    // context
                    let context = Object.assign({}, this.context);
                    context[itemName] = arrayProxy[index];
                    context[statusName] = new duice.ObjectProxy({
                        index: index,
                        count: index + 1,
                        size: arrayProxy.length,
                        first: (index === 0),
                        last: (arrayProxy.length == index + 1)
                    });
                    // clones row elements
                    let rowElement = this.element.cloneNode(true);
                    duice.setAttribute(rowElement, 'index', index.toString());
                    // editable
                    if (this.editable) {
                        rowElement.setAttribute('draggable', 'true');
                        rowElement.addEventListener('dragstart', function (event) {
                            let fromIndex = duice.getAttribute(this, 'index');
                            event.dataTransfer.setData("text", fromIndex);
                        });
                        rowElement.addEventListener('dragover', function (event) {
                            event.preventDefault();
                            event.stopPropagation();
                        });
                        rowElement.addEventListener('drop', function (event) {
                            return __awaiter(this, void 0, void 0, function* () {
                                event.preventDefault();
                                event.stopPropagation();
                                let fromIndex = parseInt(event.dataTransfer.getData('text'));
                                let toIndex = parseInt(duice.getAttribute(this, 'index'));
                                let rowIndexChangeEvent = new duice.RowMoveEvent(_this, fromIndex, toIndex);
                                _this.notifyObservers(rowIndexChangeEvent);
                            });
                        });
                    }
                    // initializes row element
                    duice.initialize(rowElement, context);
                    this.slot.parentNode.insertBefore(rowElement, this.slot);
                    this.rowElements.push(rowElement);
                }
            }
        }
        /**
         * update
         * @param observable
         * @param event
         */
        update(observable, event) {
            console.log('ElementSet.update', observable, event);
            // ArrayHandler
            if (observable instanceof duice.ArrayProxyHandler) {
                let array = observable.getTarget();
                this.doRender(array);
                // executes script
                this.executeScript();
            }
        }
        /**
         * executes script
         */
        executeScript() {
            let script = duice.getAttribute(this.element, 'script');
            if (script) {
                duice.executeScript(script, this.element, this.context);
            }
        }
    }
    duice.LoopControl = LoopControl;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * ElementFactory
     */
    class LoopControlFactory {
        /**
         * getSelectors
         */
        static getQuerySelectors() {
            return [`*[${duice.getNamespace()}\\:array]:not([${duice.getNamespace()}\\:id])`];
        }
        /**
         * get instance
         * @param element
         */
        static getInstance(element) {
            return new LoopControlFactory();
        }
        /**
         * creates loop control
         * @param element
         */
        createLoopControl(element, context) {
            // creates element set
            let loopControl = new duice.LoopControl(element, context);
            // find data set
            let array = duice.getAttribute(element, 'array');
            loopControl.setArray(array);
            // loop
            let loop = duice.getAttribute(element, 'loop');
            if (loop) {
                loopControl.setLoop(loop);
            }
            // editable
            let editable = duice.getAttribute(element, 'editable');
            if (editable) {
                loopControl.setEditable(editable.toLowerCase() === 'true');
            }
            // returns
            return loopControl;
        }
    }
    duice.LoopControlFactory = LoopControlFactory;
})(duice || (duice = {}));
/**
 * DuicePagination
 */
var duice;
(function (duice) {
    class PaginationComponent extends duice.Component {
        constructor() {
            super();
        }
        doRender(data) {
            return `
                <div>TEST</div>
                `;
        }
    }
    duice.PaginationComponent = PaginationComponent;
    // defines component
    duice.defineComponent(`${duice.getNamespace()}-pagination`, PaginationComponent);
})(duice || (duice = {}));
///<reference path="Observable.ts"/>
///<reference path="./mask/MaskFactory.ts"/>
var duice;
(function (duice) {
    /**
     * ElementControl
     */
    class ElementControl extends duice.Observable {
        /**
         * constructor
         * @param element
         * @protected
         */
        constructor(element, context) {
            super();
            this.slot = document.createElement('slot');
            // clone html element template
            this.element = element;
            duice.setAttribute(this.element, 'id', duice.generateId());
            duice.markInitialized(this.element);
            // replace slot element
            element.replaceWith(this.slot);
            // set context
            this.context = context;
        }
        /**
         * set object
         * @param objectName
         */
        setObject(objectName) {
            this.objectProxy = duice.findObject(this.context, objectName);
            if (!this.objectProxy) {
                console.warn(`ObjectProxy[${objectName}] is not found.`, this.objectProxy);
                this.objectProxy = new duice.ObjectProxy({});
            }
            let objectHandler = duice.ObjectProxy.getHandler(this.objectProxy);
            this.addObserver(objectHandler);
            objectHandler.addObserver(this);
        }
        /**
         * returns element
         */
        getElement() {
            return this.element;
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
                let objectHandler = duice.ObjectProxy.getHandler(this.objectProxy);
                // set value
                let value = objectHandler.getValue(this.property);
                this.setValue(value);
                // set readonly
                let readonly = objectHandler.isReadonly(this.property);
                this.setReadonly(readonly);
            }
            // executes script
            this.executeScript();
            // replace to slot element
            this.slot.replaceWith(this.element);
        }
        /**
         * update
         * @param observable
         * @param event
         */
        update(observable, event) {
            console.log('Element.update', observable, event);
            // ObjectHandler
            if (observable instanceof duice.ObjectProxyHandler) {
                if (this.property) {
                    // set value
                    this.setValue(observable.getValue(this.property));
                    // set readonly
                    this.setReadonly(observable.isReadonly(this.property));
                }
                // executes script
                this.executeScript();
            }
        }
        /**
         * executes script
         */
        executeScript() {
            let script = duice.getAttribute(this.getElement(), 'script');
            if (script) {
                duice.executeScript(script, this.getElement(), this.context);
            }
        }
        /**
         * getIndex
         */
        getIndex() {
            let index = duice.getAttribute(this.element, 'index');
            if (index) {
                return Number(index);
            }
        }
    }
    duice.ElementControl = ElementControl;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * ElementControlFactory
     */
    class ElementControlFactory {
        /**
         * register control factory
         * @param controlFactory
         */
        static registerControlFactory(controlFactory) {
            this.controlFactoryRegistry.push(controlFactory);
        }
        /**
         * getSelectors
         */
        static getQuerySelectors() {
            return [`*[${duice.getNamespace()}\\:object]:not([${duice.getNamespace()}\\:id])`];
        }
        /**
         * get instance
         * @param element
         */
        static getInstance(element) {
            let instance;
            this.controlFactoryRegistry.forEach(controlFactory => {
                if (controlFactory.support(element)) {
                    instance = controlFactory;
                }
            });
            if (instance) {
                return instance;
            }
            else {
                return new duice.GenericElementControlFactory();
            }
        }
        /**
         * creates element control
         * @param element
         * @param context
         */
        createElementControl(element, context) {
            // creates element
            let control = this.doCreateControl(element, context);
            // object
            let object = duice.getAttribute(element, 'object');
            control.setObject(object);
            // property
            let property = duice.getAttribute(element, 'property');
            if (property) {
                control.setProperty(property);
            }
            // mask
            let mask = duice.getAttribute(element, 'mask');
            if (mask) {
                control.setMask(mask);
            }
            // returns
            return control;
        }
    }
    ElementControlFactory.controlFactoryRegistry = [];
    duice.ElementControlFactory = ElementControlFactory;
})(duice || (duice = {}));
///<reference path="../ElementControl.ts"/>
var duice;
(function (duice) {
    /**
     * GenericElementControl
     */
    class GenericElementControl extends duice.ElementControl {
        /**
         * constructor
         * @param element
         */
        constructor(element, context) {
            super(element, context);
            // appends text node
            this.textNode = document.createTextNode('');
            this.getElement().insertBefore(this.textNode, this.getElement().firstChild);
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
    duice.GenericElementControl = GenericElementControl;
})(duice || (duice = {}));
///<reference path="../ElementControlFactory.ts"/>
var duice;
(function (duice) {
    /**
     * GenericElementControlFactory
     */
    class GenericElementControlFactory extends duice.ElementControlFactory {
        /**
         * doCreateElement
         * @param element
         * @param context
         */
        doCreateControl(element, context) {
            return new duice.GenericElementControl(element, context);
        }
        /**
         * support
         * @param element
         */
        support(element) {
            return true;
        }
    }
    duice.GenericElementControlFactory = GenericElementControlFactory;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * InputElementControl
     */
    class InputElementControl extends duice.ElementControl {
        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element, context) {
            super(element, context);
            // adds change listener
            this.getElement().addEventListener('change', e => {
                let event = new duice.PropertyChangeEvent(this, this.getProperty(), this.getValue(), this.getIndex());
                this.notifyObservers(event);
            }, true);
        }
        /**
         * setValue
         * @param value
         */
        setValue(value) {
            if (value) {
                value = this.getMask() ? this.getMask().encode(value) : value;
            }
            else {
                value = '';
            }
            this.getElement().value = value;
        }
        /**
         * getValue
         */
        getValue() {
            let value = this.getElement().value;
            if (value) {
                value = this.getMask() ? this.getMask().decode(value) : value;
            }
            else {
                value = null;
            }
            return value;
        }
        /**
         * setReadonly
         * @param readonly
         */
        setReadonly(readonly) {
            this.getElement().readOnly = readonly;
        }
    }
    duice.InputElementControl = InputElementControl;
})(duice || (duice = {}));
///<reference path="../mask/NumberMask.ts"/>
///<reference path="InputElementControl.ts"/>
var duice;
(function (duice) {
    /**
     * InputNumberElementControl
     */
    class InputNumberElementControl extends duice.InputElementControl {
        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element, context) {
            super(element, context);
            // changes type and style
            this.getElement().removeAttribute('type');
            this.getElement().style.textAlign = 'right';
            // prevents invalid key press
            this.getElement().addEventListener('keypress', event => {
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
    duice.InputNumberElementControl = InputNumberElementControl;
})(duice || (duice = {}));
///<reference path="InputElementControl.ts"/>
var duice;
(function (duice) {
    /**
     * InputCheckboxElementControl
     */
    class InputCheckboxElementControl extends duice.InputElementControl {
        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element, context) {
            super(element, context);
            this.trueValue = true;
            this.falseValue = false;
            // true false value
            let trueValue = duice.getAttribute(this.getElement(), 'true-value');
            this.trueValue = trueValue ? trueValue : this.trueValue;
            let falseValue = duice.getAttribute(this.getElement(), 'false-value');
            this.falseValue = falseValue ? falseValue : this.falseValue;
        }
        /**
         * setValue
         * @param value
         */
        setValue(value) {
            if (value === this.trueValue) {
                this.getElement().checked = true;
            }
            else {
                this.element.checked = false;
            }
        }
        /**
         * getValue
         */
        getValue() {
            if (this.element.checked) {
                return this.trueValue;
            }
            else {
                return this.falseValue;
            }
        }
        /**
         * setReadonly
         * @param readonly
         */
        setReadonly(readonly) {
            if (readonly) {
                this.getElement().style.pointerEvents = 'none';
            }
            else {
                this.getElement().style.pointerEvents = '';
            }
        }
    }
    duice.InputCheckboxElementControl = InputCheckboxElementControl;
})(duice || (duice = {}));
///<reference path="InputElementControl.ts"/>
var duice;
(function (duice) {
    /**
     * InputRadioElementControl
     */
    class InputRadioElementControl extends duice.InputElementControl {
        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element, context) {
            super(element, context);
        }
        /**
         * setValue
         * @param value
         */
        setValue(value) {
            if (this.getElement().value === value) {
                this.getElement().checked = true;
            }
            else {
                this.getElement().checked = false;
            }
        }
        /**
         * getValue
         */
        getValue() {
            return this.getElement().value;
        }
        /**
         * setReadonly
         * @param readonly
         */
        setReadonly(readonly) {
            if (readonly) {
                this.getElement().style.pointerEvents = 'none';
            }
            else {
                this.getElement().style.pointerEvents = '';
            }
        }
    }
    duice.InputRadioElementControl = InputRadioElementControl;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * SelectElementControl
     */
    class SelectElementControl extends duice.ElementControl {
        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element, context) {
            super(element, context);
            // adds event listener
            this.getElement().addEventListener('change', (e) => {
                let event = new duice.PropertyChangeEvent(this, this.getProperty(), this.getValue(), this.getIndex());
                this.notifyObservers(event);
            }, true);
        }
        /**
         * setValue
         * @param value
         */
        setValue(value) {
            this.getElement().value = value;
            // force select option
            if (!value) {
                for (let i = 0; i < this.getElement().options.length; i++) {
                    let option = this.getElement().options[i];
                    if (!option.nodeValue) {
                        option.selected = true;
                        break;
                    }
                }
            }
        }
        /**
         * getValue
         */
        getValue() {
            return this.getElement().value;
        }
        /**
         * setReadonly
         * @param readonly
         */
        setReadonly(readonly) {
            if (readonly) {
                console.warn("==ok");
                this.getElement().style.pointerEvents = 'none';
            }
            else {
                this.getElement().style.pointerEvents = '';
            }
        }
    }
    duice.SelectElementControl = SelectElementControl;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * TextareaElementControl
     */
    class TextareaElementControl extends duice.ElementControl {
        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element, context) {
            super(element, context);
            // adds change event listener
            this.getElement().addEventListener('change', e => {
                let event = new duice.PropertyChangeEvent(this, this.getProperty(), this.getValue(), this.getIndex());
                this.notifyObservers(event);
            }, true);
        }
        /**
         * setValue
         * @param value
         */
        setValue(value) {
            this.getElement().value = value;
        }
        /**
         * getValue
         */
        getValue() {
            let value = this.getElement().value;
            return value;
        }
        /**
         * setReadonly
         * @param readonly
         */
        setReadonly(readonly) {
            if (readonly) {
                this.getElement().setAttribute('readonly', 'readonly');
            }
            else {
                this.getElement().removeAttribute('readonly');
            }
        }
    }
    duice.TextareaElementControl = TextareaElementControl;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * TextareaElementControlFactory
     */
    class TextareaElementControlFactory extends duice.ElementControlFactory {
        /**
         * doCreateElement
         * @param element
         * @param context
         */
        doCreateControl(element, context) {
            return new duice.TextareaElementControl(element, context);
        }
        /**
         * support
         * @param element
         */
        support(element) {
            return (element.tagName.toLowerCase() === 'textarea');
        }
    }
    duice.TextareaElementControlFactory = TextareaElementControlFactory;
    // register
    duice.ElementControlFactory.registerControlFactory(new TextareaElementControlFactory());
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * InputElementControlFactory
     */
    class InputElementControlFactory extends duice.ElementControlFactory {
        /**
         * doCreateElement
         * @param element
         * @param context
         */
        doCreateControl(element, context) {
            let type = element.getAttribute('type');
            switch (type) {
                case 'number':
                    return new duice.InputNumberElementControl(element, context);
                case 'checkbox':
                    return new duice.InputCheckboxElementControl(element, context);
                case 'radio':
                    return new duice.InputRadioElementControl(element, context);
                default:
                    return new duice.InputElementControl(element, context);
            }
        }
        /**
         * support
         * @param element
         */
        support(element) {
            if (element.tagName.toLowerCase() === 'input') {
                return true;
            }
            else {
                return false;
            }
        }
    }
    duice.InputElementControlFactory = InputElementControlFactory;
    // register
    duice.ElementControlFactory.registerControlFactory(new InputElementControlFactory());
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * SelectElementControlFactory
     */
    class SelectElementControlFactory extends duice.ElementControlFactory {
        /**
         * doCreateElement
         * @param element
         * @param context
         */
        doCreateControl(element, context) {
            return new duice.SelectElementControl(element, context);
        }
        /**
         * support
         * @param element
         */
        support(element) {
            return (element.tagName.toLowerCase() === 'select');
        }
    }
    duice.SelectElementControlFactory = SelectElementControlFactory;
    // register
    duice.ElementControlFactory.registerControlFactory(new SelectElementControlFactory());
})(duice || (duice = {}));
///<Reference path="Observable.ts"/>
///<Reference path="Observer.ts"/>
var duice;
(function (duice) {
    class ProxyHandler extends duice.Observable {
        /**
         * constructor
         * @protected
         */
        constructor() {
            super();
            this.readonlyAll = false;
            this.readonly = new Set();
            this.listenerEnabled = true;
        }
        /**
         * setTarget
         * @param target
         */
        setTarget(target) {
            this.target = target;
        }
        /**
         * getTarget
         */
        getTarget() {
            return this.target;
        }
        /**
         * setReadonlyAll
         * @param readonly
         */
        setReadonlyAll(readonly) {
            this.readonlyAll = readonly;
            if (readonly === false) {
                this.readonly.clear();
            }
            this.notifyObservers(new duice.Event(this));
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
            this.notifyObservers(new duice.Event(this));
        }
        /**
         * isReadonly
         * @param property
         */
        isReadonly(property) {
            return this.readonlyAll || this.readonly.has(property);
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
         * checkListener
         * @param listener
         * @param event
         */
        checkListener(listener, event) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.listenerEnabled && listener) {
                    let result = yield listener.call(this.getTarget(), event);
                    if (result == false) {
                        return false;
                    }
                }
                return true;
            });
        }
    }
    duice.ProxyHandler = ProxyHandler;
})(duice || (duice = {}));
///<reference path="Observable.ts"/>
///<reference path="Observer.ts"/>
///<reference path="ProxyHandler.ts"/>
var duice;
(function (duice) {
    /**
     * ObjectHandler
     */
    class ObjectProxyHandler extends duice.ProxyHandler {
        /**
         * constructor
         */
        constructor() {
            super();
        }
        /**
         * get
         * @param target
         * @param property
         * @param receiver
         */
        get(target, property, receiver) {
            console.debug("ObjectHandler.get", target, property, receiver);
            return Reflect.get(target, property, receiver);
        }
        /**
         * set
         * @param target
         * @param property
         * @param value
         */
        set(target, property, value) {
            console.debug("ObjectHandler.set", target, property, value);
            // change value
            Reflect.set(target, property, value);
            // notify
            let event = new duice.PropertyChangeEvent(this, property, value);
            this.notifyObservers(event);
            // returns
            return true;
        }
        /**
         * update
         * @param observable
         * @param event
         */
        update(observable, event) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("ObjectHandler.update", observable, event);
                // Element
                if (observable instanceof duice.ElementControl) {
                    let property = observable.getProperty();
                    let value = observable.getValue();
                    if (yield this.checkListener(this.propertyChangingListener, event)) {
                        this.setValue(property, value);
                        yield this.checkListener(this.propertyChangedListener, event);
                    }
                }
                // notify
                this.notifyObservers(event);
            });
        }
        /**
         * getValue
         * @param property
         */
        getValue(property) {
            property = property.replace('.', '?.');
            return new Function(`return this.${property};`).call(this.getTarget());
        }
        /**
         * setValue
         * @param property
         * @param value
         */
        setValue(property, value) {
            new Function('value', `this.${property} = value;`).call(this.getTarget(), value);
        }
    }
    duice.ObjectProxyHandler = ObjectProxyHandler;
})(duice || (duice = {}));
///<reference path="ProxyHandler.ts"/>
var duice;
(function (duice) {
    /**
     * ArrayHandler
     */
    class ArrayProxyHandler extends duice.ProxyHandler {
        /**
         * constructor
         * @param arrayProxy
         */
        constructor() {
            super();
        }
        /**
         * get
         * @param target
         * @param property
         * @param receiver
         */
        get(target, property, receiver) {
            console.debug("ArrayHandler.get", '|', target, '|', property, '|', receiver);
            let _this = this;
            const value = target[property];
            if (typeof value === 'function') {
                // push, unshift
                if (['push', 'unshift'].includes(property)) {
                    return function () {
                        return __awaiter(this, arguments, void 0, function* () {
                            let index;
                            if (property === 'push') {
                                index = receiver['length'];
                            }
                            else if (property === 'unshift') {
                                index = 0;
                            }
                            let rows = [];
                            for (let i in arguments) {
                                rows.push(arguments[i]);
                            }
                            yield target.insertRow(index, ...rows);
                            return _this.target.length;
                        });
                    };
                }
                // splice
                if (['splice'].includes(property)) {
                    return function () {
                        return __awaiter(this, arguments, void 0, function* () {
                            // parse arguments
                            let start = arguments[0];
                            let deleteCount = arguments[1];
                            let deleteRows = [];
                            for (let i = start; i < (start + deleteCount); i++) {
                                deleteRows.push(target[i]);
                            }
                            let insertRows = [];
                            for (let i = 2; i < arguments.length; i++) {
                                insertRows.push(arguments[i]);
                            }
                            // delete rows
                            if (deleteCount > 0) {
                                yield target.deleteRow(start, deleteCount);
                            }
                            // insert rows
                            if (insertRows.length > 0) {
                                yield target.insertRow(start, ...insertRows);
                            }
                            // returns deleted rows
                            return deleteRows;
                        });
                    };
                }
                // pop, shift
                if (['pop', 'shift'].includes(property)) {
                    return function () {
                        return __awaiter(this, void 0, void 0, function* () {
                            let index;
                            if (property === 'pop') {
                                index = receiver['length'] - 1;
                            }
                            else if (property === 'shift') {
                                index = 0;
                            }
                            let rows = [target[index]];
                            yield target.deleteRow(index);
                            return rows;
                        });
                    };
                }
                // bind
                return value.bind(target);
            }
            // return
            return value;
        }
        /**
         * set
         * @param target
         * @param property
         * @param value
         */
        set(target, property, value) {
            console.debug("ArrayHandler.set", '|', target, '|', property, '|', value);
            Reflect.set(target, property, value);
            if (property === 'length') {
                this.notifyObservers(new duice.Event(this));
            }
            return true;
        }
        /**
         * update
         * @param elementSet
         * @param event
         */
        update(observable, event) {
            return __awaiter(this, void 0, void 0, function* () {
                console.debug("ArrayHandler.update", observable, event);
                // ElementSet
                if (observable instanceof duice.LoopControl) {
                    if (event instanceof duice.RowMoveEvent) {
                        let object = this.getTarget().splice(event.getFromIndex(), 1)[0];
                        this.getTarget().splice(event.getToIndex(), 0, object);
                    }
                }
                // notify observers
                this.notifyObservers(event);
            });
        }
    }
    duice.ArrayProxyHandler = ArrayProxyHandler;
})(duice || (duice = {}));
//# sourceMappingURL=duice.js.map