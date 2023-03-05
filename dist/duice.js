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
    class Observable {
        constructor() {
            this.observers = [];
        }
        addObserver(observer) {
            this.observers.push(observer);
        }
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
            this.dataHandler = Object.getOwnPropertyDescriptor(dataObject, '_handler_').value;
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
        }
        /**
         * update
         * @param dataHandler
         * @param detail
         */
        update(dataHandler, detail) {
            let data = this.dataHandler.getData();
            this.doUpdate(data, detail);
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
            globalThis.Object.defineProperty(dataSet, "_handler_", {
                value: dataSetHandler,
                writable: true
            });
            return new Proxy(dataSet, dataSetHandler);
        }
        /**
         * constructor
         * @param array
         */
        constructor(json) {
            super();
            this.fromJson(json);
        }
        /**
         * fromJson
         * @param array
         */
        fromJson(array) {
            for (let i = 0, size = array.length; i < size; i++) {
                let object = duice.Data.create(array[i]);
                this.push(new Proxy(object, new duice.DataHandler(object)));
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
            globalThis.Object.defineProperty(data, "_handler_", {
                value: dataHandler,
                writable: true
            });
            return new Proxy(data, dataHandler);
        }
        /**
         * constructor
         * @param object
         */
        constructor(object) {
            super();
            for (let property in object) {
                let value = object[property];
                this[property] = value;
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
            console.log("Data.update", element, detail);
            let property = element.getProperty();
            if (property) {
                let value = element.getValue();
                this.setPropertyValue(property, value);
            }
            this.notifyObservers(detail);
        }
        /**
         * getPropertyValue
         * @param property
         */
        getPropertyValue(property) {
            console.assert(property);
            property = property.replace('.', '?.');
            return new Function(`return this.${property};`).call(this.getData());
        }
        /**
         * setPropertyValue
         * @param property
         * @param value
         */
        setPropertyValue(property, value) {
            new Function(`this.${property} = arguments[0];`).call(this.getData(), value);
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
            // defines value
            let value = data[this.getProperty()];
            value = this.getMask() ? this.getMask().encode(value) : value;
            // clears text node
            if (this.textNode) {
                this.getHtmlElement().removeChild(this.textNode);
            }
            // appends text node
            this.textNode = document.createTextNode(value);
            this.getHtmlElement().insertBefore(this.textNode, this.getHtmlElement().firstChild);
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
            this.htmlElement = htmlElement;
            this.context = context;
            this.id = duice.generateUuid();
            duice.setAttribute(this.htmlElement, 'id', this.id);
            // replace with slot element
            this.slotElement = document.createElement('slot');
            this.htmlElement.replaceWith(this.slotElement);
        }
        /**
         * setDataSet
         * @param dataSet
         */
        setDataSet(dataSet) {
            let dataSetObject = duice.findObject(this.context, dataSet);
            this.dataSetHandler = Object.getOwnPropertyDescriptor(dataSetObject, '_handler_').value;
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
            var _a;
            let dataSet = this.dataSetHandler.getDataSet();
            if (this.loop) {
                let loopArgs = this.loop.split(',');
                let itemName = loopArgs[0].trim();
                let statusName = (_a = loopArgs[1]) === null || _a === void 0 ? void 0 : _a.trim();
                for (let index = 0; index < dataSet.length; index++) {
                    let data = dataSet[index];
                    let context = {};
                    context[itemName] = data;
                    context[statusName] = {
                        index: index
                    };
                    let rowHtmlElement = this.htmlElement.cloneNode(true);
                    duice.initialize(rowHtmlElement, context);
                    this.slotElement.appendChild(rowHtmlElement);
                }
            }
        }
        /**
         * update
         * @param observable
         * @param detail
         */
        update(observable, detail) {
            throw new Error("Method not implemented.");
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
                // defines value
                let value = data[this.getProperty()];
                value = this.getMask() ? this.getMask().encode(value) : value;
                // set value
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
        class InputCheckboxElement extends element.InputElement {
            /**
             * constructor
             * @param htmlElement
             * @param context
             */
            constructor(htmlElement, context) {
                super(htmlElement, context);
            }
            doRender(data) {
            }
            doUpdate(data, detail) {
            }
        }
        element.InputCheckboxElement = InputCheckboxElement;
        // export class InputCheckbox extends Input {
        //
        //     /**
        //      * constructor
        //      * @param element
        //      */
        //     constructor(element: HTMLInputElement, context: object) {
        //         super(element, context);
        //     }
        //
        //     /**
        //      * render
        //      */
        //     override doRender(): void {
        //         let value = this.handler.getPropertyValue(this.getProperty());
        //         if(value === true){
        //             this.element.checked = true;
        //         }else{
        //             this.element.checked = false;
        //         }
        //     }
        //
        //     /**
        //      * update
        //      * @param detail
        //      */
        //     override doUpdate(detail: object): void {
        //         this.doRender();
        //     }
        //
        //     /**
        //      * getValue
        //      */
        //     override getValue(): any {
        //         return this.element.checked;
        //     }
        //
        // }
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
                // key press event
                this.htmlElement.removeAttribute('type');
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
//# sourceMappingURL=duice.js.map