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
///<Reference path="Observable.ts"/>
///<Reference path="Observer.ts"/>
var duice;
(function (duice) {
    class Handler extends duice.Observable {
        constructor(target) {
            super();
            this.readonlyAll = false;
            this.readonly = new Set();
            this.listenerEnabled = true;
            this.target = target;
            // set handler
            globalThis.Object.defineProperty(target, '_handler_', {
                value: this,
                writable: true
            });
        }
        /**
         * getHandler
         * @param proxy
         */
        static getHandler(proxy) {
            let handler = globalThis.Object.getOwnPropertyDescriptor(proxy, '_handler_').value;
            duice.assert(handler, 'handler is not found');
            return handler;
        }
        getTarget() {
            return this.target;
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
    duice.Handler = Handler;
})(duice || (duice = {}));
///<reference path="Handler.ts"/>
var duice;
(function (duice) {
    /**
     * ArrayHandler
     */
    class ArrayHandler extends duice.Handler {
        /**
         * constructor
         * @param arrayProxy
         */
        constructor(arrayProxy) {
            super(arrayProxy);
        }
        /**
         * get
         * @param target
         * @param property
         * @param receiver
         */
        get(target, property, receiver) {
            console.log("ArrayHandler.get", '|', target, '|', property, '|', receiver);
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
                            yield _this.insertRow(index, ...rows);
                            return _this.getTarget().length;
                        });
                    };
                }
                // splice
                if (['splice'].includes(property)) {
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
                            yield _this.deleteRow(index);
                            return rows;
                        });
                    };
                }
                // // insert element at last,end
                // if (['push', 'unshift'].includes(property)) {
                //     return async function() {
                //
                //         // creates row insert event
                //         let index = -1;
                //         if(property === 'push'){
                //             index = receiver['length'];
                //         }else if(property == 'unshift'){
                //             index = 0;
                //         }
                //         let rows = [];
                //         for(let i in arguments){
                //             rows.push(arguments[i]);
                //         }
                //         let event = new RowInsertEvent(_this, index, rows);
                //         console.debug("RowInsertEvent", event);
                //
                //         // calls RowInsertingListener
                //         let length = -1;
                //         if(await _this.checkListener(_this.rowInsertingListener, event)) {
                //
                //             // apply
                //             length = Array.prototype[property].apply(target, arguments);
                //
                //             // call RowInsertedListener
                //             await _this.checkListener(_this.rowInsertedListener, event);
                //
                //             // notify observer
                //             _this.notifyObservers(event);
                //         }
                //
                //         // returns
                //         return length;
                //     }
                // }
                //
                // // insert element at position
                // if(['splice'].includes(property)){
                //     return async function() {
                //
                //         // parse arguments
                //         let start = arguments[0];
                //         let deleteCount = arguments[1];
                //         let deleteRows = [];
                //         for(let i = start; i < (start + deleteCount); i ++) {
                //             deleteRows.push(target[i]);
                //         }
                //         let insertRows = [];
                //         for(let i = 2; i < arguments.length; i ++) {
                //             insertRows.push(arguments[i]);
                //         }
                //
                //         // delete rows
                //         if(deleteCount > 0){
                //             let rowDeleteEvent = new RowDeleteEvent(_this, start, deleteRows);
                //             if(await _this.checkListener(_this.rowDeletingListener, rowDeleteEvent)){
                //
                //             }
                //
                //         }
                //
                //
                //
                //         let result = Array.prototype[property].apply(target, arguments);
                //         _this.notifyObservers(new Event(_this));
                //         return result;
                //     }
                // }
                //
                // // removes last,first element
                // if (['pop', 'shift'].includes(property)) {
                //     return async function() {
                //
                //         // creates row delete event
                //         let index = -1;
                //         if(property === 'pop'){
                //             index = receiver['length']-1;
                //         }else if(property === 'shift'){
                //             index = 0;
                //         }
                //         let rows = [target[index]];
                //         let event = new RowDeleteEvent(_this, index, rows);
                //         console.debug("RowDeleteEvent", event);
                //
                //         // call RowDeletingListener
                //         let deletedRows;
                //         if(await _this.checkListener(_this.rowDeletingListener, event)){
                //
                //             // apply
                //             deletedRows = Array.prototype[property].apply(target, arguments);
                //
                //             // call RowDeletedListener
                //             await _this.checkListener(_this.rowDeletedListener, event);
                //
                //             // notify observers
                //             _this.notifyObservers(event);
                //         }
                //
                //         // return
                //         return deletedRows
                //     }
                // }
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
            console.log("ArrayHandler.set", '|', target, '|', property, '|', value);
            Reflect.set(target, property, value);
            if (property === 'length') {
                this.notifyObservers(new duice.Event(this));
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
                this.getTarget().length = 0;
                // assign
                for (let index = 0, size = array.length; index < size; index++) {
                    let objectProxy = new duice.ObjectProxy(array[index]);
                    this.getTarget()[index] = objectProxy;
                    let objectHandler = duice.ObjectProxy.getHandler(objectProxy);
                    objectHandler.setPropertyChangingListener(this.propertyChangingListener);
                    objectHandler.setPropertyChangedListener(this.propertyChangedListener);
                    objectHandler.addObserver(this);
                }
            }
            finally {
                // resume
                this.resumeNotify();
            }
            // notify observers
            this.notifyObservers(new duice.Event(this));
        }
        /**
         * insertRow
         * @param index
         * @param rows
         */
        insertRow(index, ...rows) {
            return __awaiter(this, void 0, void 0, function* () {
                let event = new duice.RowInsertEvent(this, index, rows);
                if (yield this.checkListener(this.rowInsertingListener, event)) {
                    this.getTarget().splice(index, 0, ...rows);
                    yield this.checkListener(this.rowInsertedListener, event);
                    this.notifyObservers(event);
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
                let sliceBegin = index;
                let sliceEnd = (size ? index + size : index + 1);
                let rows = this.getTarget().slice(sliceBegin, sliceEnd);
                let event = new duice.RowDeleteEvent(this, index, rows);
                if (yield this.checkListener(this.rowDeletingListener, event)) {
                    let spliceStart = index;
                    let spliceDeleteCount = (size ? size : 1);
                    this.getTarget().splice(spliceStart, spliceDeleteCount);
                    yield this.checkListener(this.rowDeletedListener, event);
                    this.notifyObservers(event);
                }
            });
        }
        /**
         * appendRow
         * @param rows
         */
        appendRow(...rows) {
            return __awaiter(this, void 0, void 0, function* () {
                let index = this.getTarget().length;
                return this.insertRow(index, ...rows);
            });
        }
        /**
         * update
         * @param elementSet
         * @param event
         */
        update(elementSet, event) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("DataSetHandler", elementSet, event);
                // RowModeEvent
                if (event instanceof duice.RowMoveEvent) {
                    let object = this.getTarget().splice(event.getFromIndex(), 1)[0];
                    this.getTarget().splice(event.getToIndex(), 0, object);
                }
                // notify observers
                this.notifyObservers(event);
            });
        }
        /**
         * set property changing event listener
         * @param listener
         */
        setPropertyChangingListener(listener) {
            this.propertyChangingListener = listener;
            this.getTarget().forEach(objectProxy => {
                duice.ObjectProxy.getHandler(objectProxy).setPropertyChangingListener(listener);
            });
        }
        /**
         * set property changed event listener
         * @param listener
         */
        setPropertyChangedListener(listener) {
            this.propertyChangedListener = listener;
            this.getTarget().forEach(objectProxy => {
                duice.ObjectProxy.getHandler(objectProxy).setPropertyChangedListener(listener);
            });
        }
        /**
         * setRowInsertingListener
         * @param listener
         */
        setRowInsertingListener(listener) {
            this.rowInsertingListener = listener;
        }
        /**
         * setRowInsertedListener
         * @param listener
         */
        setRowInsertedListener(listener) {
            this.rowInsertedListener = listener;
        }
        /**
         * setRowDeletingListener
         * @param listener
         */
        setRowDeletingListener(listener) {
            this.rowDeletingListener = listener;
        }
        /**
         * setRowDeletedListener
         * @param listener
         */
        setRowDeletedListener(listener) {
            this.rowDeletedListener = listener;
        }
    }
    duice.ArrayHandler = ArrayHandler;
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
            // creates handler
            let handler = new duice.ArrayHandler(this);
            // copy array elements
            if (globalThis.Array.isArray(array)) {
                array.forEach(object => {
                    let objectProxy = new duice.ObjectProxy(object);
                    this.push(objectProxy);
                    duice.ObjectProxy.getHandler(objectProxy).addObserver(handler);
                });
            }
            // returns proxy instance
            return new Proxy(this, handler);
        }
        /**
         * getHandler
         */
        getHandler() {
            return duice.Handler.getHandler(this);
        }
        /**
         * assign
         * @param arrayProxy
         * @param array
         */
        assign(array) {
            this.getHandler().assign(array);
        }
        /**
         * insertRow
         * @param index
         * @param rows
         */
        insertRow(index, ...rows) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.getHandler().insertRow(index, ...rows);
            });
        }
        deleteRow(index, size) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.getHandler().deleteRow(index, size);
            });
        }
        /**
         * appendRows
         * @param rows
         */
        appendRow(...rows) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.getHandler().appendRow(...rows);
            });
        }
        /**
         * setReadonly
         * @param property
         * @param readonly
         */
        setReadonly(property, readonly) {
            this.getHandler().setReadonly(property, readonly);
        }
        /**
         * isReadonly
         * @param property
         */
        isReadonly(property) {
            return this.getHandler().isReadonly(property);
        }
        /**
         * setReadonlyAll
         * @param readonly
         */
        setReadonlyAll(readonly) {
            this.getHandler().setReadonlyAll(readonly);
            for (let index = 0; index >= this.length; index++) {
                duice.ObjectProxy.setReadonlyAll(this[index], readonly);
            }
        }
        /**
         * onPropertyChanging
         * @param listener
         */
        onPropertyChanging(listener) {
            this.getHandler().setPropertyChangingListener(listener);
        }
        /**
         * onPropertyChanged
         * @param listener
         */
        onPropertyChanged(listener) {
            this.getHandler().setPropertyChangedListener(listener);
        }
        /**
         * onRowInserting
         * @param listener
         */
        onRowInserting(listener) {
            this.getHandler().setRowInsertingListener(listener);
        }
        /**
         * onRowInserted
         * @param listener
         */
        onRowInserted(listener) {
            this.getHandler().setRowInsertedListener(listener);
        }
        /**
         * onRowDeleting
         * @param listener
         */
        onRowDeleting(listener) {
            this.getHandler().setRowDeletingListener(listener);
        }
        /**
         * onRowDeleted
         * @param listener
         */
        onRowDeleted(listener) {
            this.getHandler().setRowDeletedListener(listener);
        }
    }
    duice.ArrayProxy = ArrayProxy;
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
         * getIndex
         */
        getIndex() {
            let index = duice.getAttribute(this.htmlElement, 'index');
            if (index) {
                return Number(index);
            }
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
         * setArray
         * @param arrayName
         */
        setArray(arrayName) {
            let arrayProxy = duice.findObject(this.context, arrayName);
            duice.assert(arrayProxy, `ArrayProxy[${arrayName}] is not found.`);
            this.arrayHandler = arrayProxy.getHandler();
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
            let dataSet = this.arrayHandler.getTarget();
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
                                let rowIndexChangeEvent = new duice.RowMoveEvent(_this, fromIndex, toIndex);
                                _this.notifyObservers(rowIndexChangeEvent);
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
            let array = arrayHandler.getTarget();
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
///<reference path="Observer.ts"/>
var duice;
(function (duice) {
    /**
     * ObjectHandler
     */
    class ObjectHandler extends duice.Handler {
        /**
         * constructor
         * @param objectProxy
         */
        constructor(objectProxy) {
            super(objectProxy);
            // save
            this.save();
        }
        /**
         * get
         * @param target
         * @param property
         * @param receiver
         */
        get(target, property, receiver) {
            console.log("ObjectHandler.get", target, property, receiver);
            return Reflect.get(target, property, receiver);
        }
        /**
         * set
         * @param target
         * @param property
         * @param value
         */
        set(target, property, value) {
            console.log("ObjectHandler.set", target, property, value);
            // try to change property value
            let event = new duice.PropertyChangeEvent(this, property, value);
            this.checkListener(this.propertyChangingListener, event).then(result => {
                if (result) {
                    // change value
                    Reflect.set(target, property, value);
                    // calls property changed listener
                    this.checkListener(this.propertyChangedListener, event).then(() => {
                        this.notifyObservers(event);
                    });
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
                for (let property in this.getTarget()) {
                    delete this.getTarget()[property];
                }
                // assign
                for (let property in object) {
                    this.getTarget()[property] = object[property];
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
            this.notifyObservers(new duice.Event(this));
        }
        /**
         * update
         * @param element
         * @param event
         */
        update(element, event) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("ObjectHandler.update", element, event);
                // if property change event
                if (event instanceof duice.PropertyChangeEvent) {
                    let property = element.getProperty();
                    let value = element.getValue();
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
         * save
         */
        save() {
            this.originObject = JSON.parse(JSON.stringify(this.getTarget()));
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
            return JSON.stringify(this.getTarget()) !== JSON.stringify(this.originObject);
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
        /**
         * sets property changing event listener
         * @param listener
         */
        setPropertyChangingListener(listener) {
            this.propertyChangingListener = listener;
        }
        /**
         * sets property changed event listener
         * @param listener
         */
        setPropertyChangedListener(listener) {
            this.propertyChangedListener = listener;
        }
    }
    duice.ObjectHandler = ObjectHandler;
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
            let handler = new duice.ObjectHandler(this);
            return new Proxy(this, handler);
        }
        /**
         * getHandler
         * @param objectProxy
         */
        static getHandler(objectProxy) {
            return duice.Handler.getHandler(objectProxy);
        }
        /**
         * assign
         * @param objectProxy
         * @param object
         */
        static assign(objectProxy, object) {
            this.getHandler(objectProxy).assign(object);
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
         * onPropertyChanging
         * @param objectProxy
         * @param listener
         */
        static onPropertyChanging(objectProxy, listener) {
            this.getHandler(objectProxy).setPropertyChangingListener(listener);
        }
        /**
         * onPropertyChanged
         * @param objectProxy
         * @param listener
         */
        static onPropertyChanged(objectProxy, listener) {
            this.getHandler(objectProxy).setPropertyChangedListener(listener);
        }
    }
    duice.ObjectProxy = ObjectProxy;
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
            this.getHtmlElement().addEventListener('change', e => {
                let event = new duice.PropertyChangeEvent(this, this.getProperty(), this.getValue(), this.getIndex());
                this.notifyObservers(event);
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
            this.getHtmlElement().addEventListener('change', (e) => {
                let event = new duice.PropertyChangeEvent(this, this.getProperty(), this.getValue(), this.getIndex());
                this.notifyObservers(event);
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
            this.getHtmlElement().addEventListener('change', e => {
                let event = new duice.PropertyChangeEvent(this, this.getProperty(), this.getValue(), this.getIndex());
                this.notifyObservers(event);
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
//# sourceMappingURL=duice.js.map