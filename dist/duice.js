var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        container.querySelectorAll(`*[${getAlias()}\\:data-set]:not([${getAlias()}\\:id])`).forEach(htmlElement => {
            let elementSetFactory = duice.ElementSetFactory.getInstance(htmlElement);
            let elementSet = elementSetFactory.createElementSet(htmlElement, context);
            elementSet.render();
        });
        // initializes element
        container.querySelectorAll(`*[${getAlias()}\\:data]:not([${getAlias()}\\:id])`).forEach(htmlElement => {
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
     * getPropertyValue
     * @param data
     * @param property
     */
    function getPropertyValue(data, property) {
        console.assert(property);
        property = property.replace('.', '?.');
        return new Function(`return this.${property};`).call(data);
    }
    duice.getPropertyValue = getPropertyValue;
    /**
     * setPropertyValue
     * @param data
     * @param property
     * @param value
     */
    function setPropertyValue(data, property, value) {
        new Function('value', `this.${property} = value;`).call(data, value);
    }
    duice.setPropertyValue = setPropertyValue;
    /**
     * execute script
     * @param script
     * @param thisArg
     * @param context
     */
    function executeScript(script, thisArg, context) {
        let args = [];
        let values = [];
        for (let property in context) {
            args.push(property);
            values.push(context[property]);
        }
        return Function(...args, script).call(thisArg, ...values);
    }
    duice.executeScript = executeScript;
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
    var mask;
    (function (mask) {
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
        mask.DateMask = DateMask;
    })(mask = duice.mask || (duice.mask = {}));
})(duice || (duice = {}));
var duice;
(function (duice) {
    var mask;
    (function (mask_1) {
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
                return Function(`return new duice.mask.${mask};`).call(null);
            }
        }
        mask_1.MaskFactory = MaskFactory;
    })(mask = duice.mask || (duice.mask = {}));
})(duice || (duice = {}));
var duice;
(function (duice) {
    var mask;
    (function (mask) {
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
        mask.NumberMask = NumberMask;
    })(mask = duice.mask || (duice.mask = {}));
})(duice || (duice = {}));
var duice;
(function (duice) {
    var mask;
    (function (mask) {
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
        mask.StringMask = StringMask;
    })(mask = duice.mask || (duice.mask = {}));
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * Observable
     */
    class Observable {
        constructor() {
            this.observers = [];
        }
        /**
         * addObserver
         * @param observer
         */
        addObserver(observer) {
            this.observers.push(observer);
        }
        /**
         * notifyObservers
         * @param detail
         */
        notifyObservers(detail) {
            this.observers.forEach(observer => {
                observer.update(this, detail);
            });
        }
    }
    duice.Observable = Observable;
})(duice || (duice = {}));
///<reference path="Observable.ts"/>
var duice;
(function (duice) {
    var MaskFactory = duice.mask.MaskFactory;
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
         * @param data
         */
        setData(data) {
            let dataObject = duice.findObject(this.context, data);
            this.dataHandler = duice.Data.getHandler(dataObject);
            console.assert(this.dataHandler);
            this.addObserver(this.dataHandler);
            this.dataHandler.addObserver(this);
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
         * setMask
         * @param mask
         */
        setMask(mask) {
            this.mask = MaskFactory.getMask(mask);
        }
        /**
         * getMask
         */
        getMask() {
            return this.mask;
        }
        /**
         * render
         */
        render() {
            let data = this.dataHandler.getData();
            this.doRender(data);
            // executes script
            this.executeScript();
        }
        /**
         * update
         * @param dataHandler
         * @param detail
         */
        update(dataHandler, detail) {
            let data = this.dataHandler.getData();
            this.doUpdate(data, detail);
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
     * DataSet
     */
    class DataSet extends globalThis.Array {
        /**
         * create
         * @param json
         */
        static create(array) {
            let dataSet = new DataSet(array);
            let dataSetHandler = new duice.DataSetHandler(dataSet);
            // _handler_
            Object.defineProperty(dataSet, '_handler_', {
                value: dataSetHandler,
                writable: true
            });
            // _meta_
            let dataSetMeta = new duice.DataSetMeta();
            Object.defineProperty(dataSet, '_meta_', {
                value: dataSetMeta,
                writable: true
            });
            // return this as proxy instance
            return new Proxy(dataSet, dataSetHandler);
        }
        /**
         * constructor
         * @param array
         */
        constructor(array) {
            super();
            DataSet.internalAssign(this, array);
        }
        /**
         * getHandler
         * @param dataSet
         */
        static getHandler(dataSet) {
            return Object.getOwnPropertyDescriptor(dataSet, '_handler_').value;
        }
        /**
         * getMeta
         * @param data
         */
        static getMeta(data) {
            return Object.getOwnPropertyDescriptor(data, '_meta_').value;
        }
        /**
         * internalAssign
         * @param dataSet
         * @param array
         */
        static internalAssign(dataSet, array) {
            dataSet.length = 0;
            for (let i = 0, size = array.length; i < size; i++) {
                dataSet[i] = duice.Data.create(array[i]);
            }
            return dataSet;
        }
        /**
         * assign
         * @param dataSet
         * @param array
         */
        static assign(dataSet, array) {
            DataSet.internalAssign(dataSet, array);
            DataSet.notify(dataSet);
            return dataSet;
        }
        /**
         * notify
         * @param dataSet
         */
        static notify(dataSet) {
            let handler = this.getHandler(dataSet);
            handler.notifyObservers({});
        }
        /**
         * setReadonly
         * @param dataSet
         * @param property
         * @param readonly
         */
        static setReadonly(dataSet, property, readonly) {
            let meta = this.getMeta(dataSet);
            meta.setReadonly(property, readonly);
        }
        /**
         * isReadonly
         * @param dataSet
         * @param property
         */
        static isReadonly(dataSet, property) {
            let meta = this.getMeta(dataSet);
            return meta.isReadonly(property);
        }
        /**
         * setReadonlyAll
         * @param dataSet
         * @param readonly
         */
        static setReadonlyAll(dataSet, readonly) {
            let meta = this.getMeta(dataSet);
            meta.setReadonlyAll(readonly);
            for (let index = 0; index >= dataSet.length; index++) {
                DataSet.setReadonlyAll(dataSet[index], readonly);
            }
        }
    }
    duice.DataSet = DataSet;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * Data
     */
    class Data extends globalThis.Object {
        /**
         * create
         * @param object
         */
        static create(object) {
            let data = new Data(object);
            let dataHandler = new duice.DataHandler(data);
            // _handler_
            globalThis.Object.defineProperty(data, "_handler_", {
                value: dataHandler,
                writable: true
            });
            // _meta_
            let dataMeta = new duice.DataMeta();
            globalThis.Object.defineProperty(data, "_meta_", {
                value: dataMeta,
                writable: true
            });
            // return this as proxy instance
            return new Proxy(data, dataHandler);
        }
        /**
         * constructor
         * @param object
         */
        constructor(object) {
            super();
            Data.internalAssign(this, object);
        }
        /**
         * getHandler
         * @param data
         */
        static getHandler(data) {
            return Object.getOwnPropertyDescriptor(data, '_handler_').value;
        }
        /**
         * getMeta
         * @param data
         */
        static getMeta(data) {
            return Object.getOwnPropertyDescriptor(data, '_meta_').value;
        }
        /**
         * internalAssign
         * @param object
         * @param data
         */
        static internalAssign(data, object) {
            for (let property in data) {
                Reflect.deleteProperty(data, property);
            }
            for (let property in object) {
                let value = Reflect.get(object, property);
                Reflect.set(data, property, value);
            }
            return data;
        }
        /**
         * assign
         * @param data
         * @param object
         */
        static assign(data, object) {
            Data.internalAssign(data, object);
            Data.notify(data);
            return data;
        }
        /**
         * notify
         * @param data
         */
        static notify(data) {
            let handler = this.getHandler(data);
            handler.notifyObservers({});
        }
        /**
         * setReadonly
         * @param data
         * @param property
         * @param readonly
         */
        static setReadonly(data, property, readonly) {
            let meta = this.getMeta(data);
            meta.setReadonly(property, readonly);
        }
        /**
         * isReadonly
         * @param data
         * @param property
         */
        static isReadonly(data, property) {
            let meta = this.getMeta(data);
            return meta.isReadonly(property);
        }
        /**
         * setReadonlyAll
         * @param data
         * @param readonly
         */
        static setReadonlyAll(data, readonly) {
            let meta = this.getMeta(data);
            meta.setReadonlyAll(readonly);
            for (let property in this) {
                meta.setReadonly(property, readonly);
            }
        }
    }
    duice.Data = Data;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * DataHandler
     */
    class DataHandler extends duice.Observable {
        /**
         * constructor
         * @param data
         */
        constructor(data) {
            super();
            this.data = data;
        }
        /**
         * getData
         */
        getData() {
            return this.data;
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
            Reflect.set(target, property, value);
            this.notifyObservers({});
            return true;
        }
        /**
         * update
         * @param element
         * @param detail
         */
        update(element, detail) {
            console.log("DataHandler.update", element, detail);
            let property = element.getProperty();
            if (property) {
                let value = element.getValue();
                duice.setPropertyValue(this.getData(), property, value);
            }
            this.notifyObservers(detail);
        }
    }
    duice.DataHandler = DataHandler;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * DataSetHandler
     */
    class DataSetHandler extends duice.Observable {
        /**
         * constructor
         * @param dataSet
         */
        constructor(dataSet) {
            super();
            this.dataSet = dataSet;
        }
        /**
         * getDataSet
         */
        getDataSet() {
            return this.dataSet;
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
         * update
         * @param elementSet
         * @param detail
         */
        update(elementSet, detail) {
            console.log("DataSetHandler", duice.element, detail);
            if (detail.name === 'changeIndex') {
                let data = this.dataSet.splice(detail.fromIndex, 1)[0];
                this.dataSet.splice(detail.toIndex, 0, data);
            }
            this.notifyObservers(detail);
        }
    }
    duice.DataSetHandler = DataSetHandler;
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
        }
        /**
         * doRender
         * @param data
         */
        doRender(data) {
            // if element has property
            if (this.getProperty()) {
                let value = duice.getPropertyValue(data, this.getProperty());
                value = this.getMask() ? this.getMask().encode(value) : value;
                // clears text node
                if (this.textNode) {
                    this.getHtmlElement().removeChild(this.textNode);
                }
                // appends text node
                this.textNode = document.createTextNode(value);
                this.getHtmlElement().insertBefore(this.textNode, this.getHtmlElement().firstChild);
            }
        }
        /**
         * doUpdate
         * @param data
         * @param detail
         */
        doUpdate(data, detail) {
            this.doRender(data);
        }
        /**
         * getValue
         */
        getValue() {
            return this.textNode.textContent;
        }
    }
    duice.GenericElement = GenericElement;
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
         * @param dataSet
         */
        setDataSet(dataSet) {
            let dataSetObject = duice.findObject(this.context, dataSet);
            this.dataSetHandler = duice.DataSet.getHandler(dataSetObject);
            console.assert(this.dataSetHandler);
            this.addObserver(this.dataSetHandler);
            this.dataSetHandler.addObserver(this);
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
            let dataSet = this.dataSetHandler.getDataSet();
            this.doRender(dataSet);
            // executes script
            this.executeScript();
        }
        /**
         * doRender
         * @param dataSet
         */
        doRender(dataSet) {
            var _a;
            let _this = this;
            duice.removeChildNodes(this.slotElement);
            if (this.loop) {
                let loopArgs = this.loop.split(',');
                let itemName = loopArgs[0].trim();
                let statusName = (_a = loopArgs[1]) === null || _a === void 0 ? void 0 : _a.trim();
                for (let index = 0; index < dataSet.length; index++) {
                    let data = dataSet[index];
                    let context = {};
                    context[itemName] = data;
                    context[statusName] = duice.Data.create({
                        index: index,
                        count: index + 1,
                        size: dataSet.length,
                        first: (index === 0),
                        last: (dataSet.length == index + 1)
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
        update(dataSetHandler, detail) {
            let dataSet = dataSetHandler.getDataSet();
            this.doUpdate(dataSet);
            // executes script
            this.executeScript();
        }
        /**
         * doUpdate
         * @param dataSet
         */
        doUpdate(dataSet) {
            this.doRender(dataSet);
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
            let dataSet = duice.getAttribute(htmlElement, 'data-set');
            elementSet.setDataSet(dataSet);
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
                return new duice.element.GenericElementFactory();
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
            // data
            let data = duice.getAttribute(htmlElement, 'data');
            element.setData(data);
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
    var element;
    (function (element) {
        class InputElement extends duice.Element {
            /**
             * constructor
             * @param htmlElement
             * @param context
             */
            constructor(htmlElement, context) {
                super(htmlElement, context);
                // adds change event listener
                let _this = this;
                this.getHtmlElement().addEventListener('change', function (event) {
                    _this.notifyObservers({});
                }, true);
            }
            /**
             * doRender
             * @param data
             */
            doRender(data) {
                let value = duice.getPropertyValue(data, this.getProperty());
                value = this.getMask() ? this.getMask().encode(value) : value;
                this.htmlElement.value = value;
            }
            /**
             * doUpdate
             * @param data
             * @param detail
             */
            doUpdate(data, detail) {
                this.doRender(data);
            }
            /**
             * getValue
             */
            getValue() {
                let value = this.htmlElement.value;
                return this.getMask() ? this.getMask().decode(value) : value;
            }
        }
        element.InputElement = InputElement;
    })(element = duice.element || (duice.element = {}));
})(duice || (duice = {}));
var duice;
(function (duice) {
    var element;
    (function (element) {
        /**
         * InputCheckboxElement
         */
        class InputCheckboxElement extends element.InputElement {
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
                // add change event listener
                let _this = this;
                this.getHtmlElement().addEventListener('change', event => {
                    _this.notifyObservers({});
                }, true);
            }
            /**
             * doRender
             * @param data
             */
            doRender(data) {
                let value = data[this.getProperty()];
                if (value === this.trueValue) {
                    this.getHtmlElement().checked = true;
                }
                else {
                    this.htmlElement.checked = false;
                }
            }
            /**
             * doUpdate
             * @param data
             * @param detail
             */
            doUpdate(data, detail) {
                this.doRender(data);
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
        element.InputCheckboxElement = InputCheckboxElement;
    })(element = duice.element || (duice.element = {}));
})(duice || (duice = {}));
var duice;
(function (duice) {
    var element;
    (function (element) {
        var NumberMask = duice.mask.NumberMask;
        /**
         * InputNumberElement
         */
        class InputNumberElement extends element.InputElement {
            /**
             * constructor
             * @param htmlElement
             * @param context
             */
            constructor(htmlElement, context) {
                super(htmlElement, context);
                this.mask = new NumberMask();
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
             * doRender
             * @param data
             */
            doRender(data) {
                super.doRender(data);
            }
            /**
             * doUpdate
             * @param data
             * @param detail
             */
            doUpdate(data, detail) {
                this.doRender(data);
            }
            /**
             * getValue
             */
            getValue() {
                let value = super.getValue();
                return Number(value);
            }
        }
        element.InputNumberElement = InputNumberElement;
    })(element = duice.element || (duice.element = {}));
})(duice || (duice = {}));
var duice;
(function (duice) {
    var element;
    (function (element) {
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
                let _this = this;
                this.getHtmlElement().addEventListener('change', event => {
                    _this.notifyObservers({});
                }, true);
            }
            /**
             * doRender
             * @param data
             */
            doRender(data) {
                let value = duice.getPropertyValue(data, this.getProperty());
                this.getHtmlElement().value = value;
            }
            /**
             * doUpdate
             * @param data
             * @param detail
             */
            doUpdate(data, detail) {
                this.doRender(data);
            }
            /**
             * getValue
             */
            getValue() {
                return this.getHtmlElement().value;
            }
        }
        element.SelectElement = SelectElement;
    })(element = duice.element || (duice.element = {}));
})(duice || (duice = {}));
var duice;
(function (duice) {
    var element;
    (function (element) {
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
                let _this = this;
                this.getHtmlElement().addEventListener('change', event => {
                    _this.notifyObservers({});
                }, true);
            }
            /**
             * doRender
             * @param data
             */
            doRender(data) {
                let value = duice.getPropertyValue(data, this.getProperty());
                this.getHtmlElement().value = value;
            }
            /**
             * doUpdate
             * @param data
             * @param detail
             */
            doUpdate(data, detail) {
                this.doRender(data);
            }
            /**
             * getValue
             */
            getValue() {
                let value = this.getHtmlElement().value;
                return value;
            }
        }
        element.TextareaElement = TextareaElement;
    })(element = duice.element || (duice.element = {}));
})(duice || (duice = {}));
var duice;
(function (duice) {
    var element;
    (function (element) {
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
        element.GenericElementFactory = GenericElementFactory;
    })(element = duice.element || (duice.element = {}));
})(duice || (duice = {}));
var duice;
(function (duice) {
    var element;
    (function (element) {
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
                        return new element.InputNumberElement(htmlElement, context);
                    case 'checkbox':
                        return new element.InputCheckboxElement(htmlElement, context);
                    default:
                        return new element.InputElement(htmlElement, context);
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
        element.InputElementFactory = InputElementFactory;
        // register
        duice.ElementFactory.registerElementFactory(new InputElementFactory());
    })(element = duice.element || (duice.element = {}));
})(duice || (duice = {}));
var duice;
(function (duice) {
    var element;
    (function (element) {
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
                return new element.SelectElement(htmlElement, context);
            }
            /**
             * support
             * @param htmlElement
             */
            support(htmlElement) {
                return (htmlElement.tagName.toLowerCase() === 'select');
            }
        }
        element.SelectElementFactory = SelectElementFactory;
        // register
        duice.ElementFactory.registerElementFactory(new SelectElementFactory());
    })(element = duice.element || (duice.element = {}));
})(duice || (duice = {}));
var duice;
(function (duice) {
    var element;
    (function (element) {
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
                return new element.TextareaElement(htmlElement, context);
            }
            /**
             * support
             * @param htmlElement
             */
            support(htmlElement) {
                return (htmlElement.tagName.toLowerCase() === 'textarea');
            }
        }
        element.TextareaElementFactory = TextareaElementFactory;
        // register
        duice.ElementFactory.registerElementFactory(new TextareaElementFactory());
    })(element = duice.element || (duice.element = {}));
})(duice || (duice = {}));
var duice;
(function (duice) {
    class DataMeta {
        constructor() {
            this.readonlyAll = false;
            this.readonly = new Set();
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
            if (this.readonlyAll || this.readonly.has(property)) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    duice.DataMeta = DataMeta;
})(duice || (duice = {}));
var duice;
(function (duice) {
    class DataSetMeta {
        constructor() {
            this.readonlyAll = false;
            this.readonly = new Set();
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
            if (this.readonlyAll || this.readonly.has(property)) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    duice.DataSetMeta = DataSetMeta;
})(duice || (duice = {}));
//# sourceMappingURL=duice.js.map