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
     * listens DOMContentLoaded event
     */
    if (globalThis.document) {
        document.addEventListener("DOMContentLoaded", event => {
            duice.ElementInitializer.initializeElement(document.documentElement, {});
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
    /**
     * Element
     */
    class Element extends duice.Observable {
        /**
         * constructor
         * @param htmlElement
         * @protected
         */
        constructor(htmlElement) {
            super();
            this.htmlElement = htmlElement;
            this.id = this.generateId();
            this.htmlElement.setAttribute(`${duice.getAlias()}:id`, this.id);
        }
        /**
         * Generates component ID
         */
        generateId() {
            let dt = new Date().getTime();
            let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                let r = (dt + Math.random() * 16) % 16 | 0;
                dt = Math.floor(dt / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        }
        /**
         * get id
         */
        getId() {
            return this.id;
        }
        /**
         * gets html element
         */
        getHtmlElement() {
            return this.htmlElement;
        }
        /**
         * bind
         * @param object
         */
        bind(object) {
            this.handler = object._handler_;
            console.assert(this.handler);
            this.addObserver(this.handler);
            this.handler.addObserver(this);
        }
        /**
         * render
         */
        render() {
            let data = this.handler.getTarget();
            this.doRender(data);
        }
        /**
         * update
         * @param handler
         * @param detail
         */
        update(handler, detail) {
            let data = this.handler.getTarget();
            this.doUpdate(data, detail);
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
         * return factory instance
         * @param htmlElement
         * @param context
         */
        static getInstance(htmlElement, context) {
            let bindAttribute = duice.getAttribute(htmlElement, 'bind');
            let bindObject = duice.findObject(context, bindAttribute);
            console.assert(bindObject, `bind[${bindAttribute}] object is null`);
            if (bindObject instanceof duice.DataSet) {
                return new duice.ArrayElementFactory();
            }
            else {
                return new duice.ObjectElementFactory();
            }
        }
    }
    duice.ElementFactory = ElementFactory;
})(duice || (duice = {}));
///<reference path="Observable.ts"/>
var duice;
(function (duice) {
    class Handler extends duice.Observable {
        /**
         * constructor
         * @param target
         * @protected
         */
        constructor(target) {
            super();
            this.target = target;
            globalThis.Object.defineProperty(target, "_handler_", {
                value: this,
                writable: true
            });
        }
        /**
         * getTarget
         */
        getTarget() {
            return this.target;
        }
        /**
         * update
         * @param element
         * @param detail
         */
        update(element, detail) {
            this.doUpdate(element, detail);
        }
    }
    duice.Handler = Handler;
})(duice || (duice = {}));
var duice;
(function (duice) {
    class ElementInitializer {
        /**
         * initializes elements
         * @param container
         * @param context
         */
        static initializeElement(container, context) {
            container.querySelectorAll(`*[${duice.getAlias()}\\:bind]:not([${duice.getAlias()}\\:id])`).forEach(htmlElement => {
                if (!htmlElement.hasAttribute(`${duice.getAlias()}:id`)) {
                    let elementFactory = duice.ElementFactory.getInstance(htmlElement, context);
                    let element = elementFactory.createElement(htmlElement, context);
                    element.render();
                }
            });
        }
    }
    duice.ElementInitializer = ElementInitializer;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * ArrayElement
     */
    class ArrayElement extends duice.Element {
        /**
         * constructor
         * @param htmlElement
         */
        constructor(htmlElement) {
            super(htmlElement);
        }
        /**
         * set loop
         * @param loop
         */
        setLoop(loop) {
            this.loop = loop;
        }
        /**
         * get loop
         */
        getLoop() {
            return this.loop;
        }
        /**
         * doRender
         * @param array
         */
        doRender(array) {
            console.log('ArrayElement.doRender', array);
        }
        /**
         * update
         * @param array
         * @param detail
         */
        doUpdate(array, detail) {
            console.log('ArrayElement.doUpdate', array, detail);
        }
    }
    duice.ArrayElement = ArrayElement;
})(duice || (duice = {}));
///<reference path="Observable.ts"/>
var duice;
(function (duice) {
    /**
     * ObjectElement
     */
    class ObjectElement extends duice.Element {
        constructor(htmlElement) {
            super(htmlElement);
        }
        /**
         * sets property
         * @param property
         */
        setProperty(property) {
            this.property = property;
        }
        /**
         * gets property
         */
        getProperty() {
            return this.property;
        }
        /**
         * doRender
         * @param object
         */
        doRender(object) {
            console.log("ObjectElement.doRender", object);
            let value = object[this.getProperty()];
            // sets value by html element type
            if (this.htmlElement instanceof HTMLInputElement) {
                this.htmlElement.value = value;
            }
            // select
            else if (this.htmlElement instanceof HTMLSelectElement) {
                this.htmlElement.value = value;
            }
            // else
            else {
                if (this.childNode) {
                    this.htmlElement.removeChild(this.childNode);
                }
                this.childNode = document.createTextNode(value);
                this.htmlElement.insertBefore(this.childNode, this.htmlElement.firstChild);
            }
        }
        /**
         * update
         * @param object
         * @param detail
         */
        doUpdate(object, detail) {
            console.log("ObjectElement.doUpdate", object, detail);
            this.doRender(object);
        }
    }
    duice.ObjectElement = ObjectElement;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * ObjectElementFactory
     */
    class ObjectElementFactory extends duice.ElementFactory {
        /**
         * creates element
         * @param htmlElement
         * @param bindObject
         */
        createElement(htmlElement, context) {
            let element = new duice.ObjectElement(htmlElement);
            // bind
            let bindAttribute = duice.getAttribute(htmlElement, 'bind');
            let bindObject = duice.findObject(context, bindAttribute);
            element.bind(bindObject);
            // property
            if (duice.hasAttribute(htmlElement, 'property')) {
                element.setProperty(duice.getAttribute(htmlElement, 'property'));
            }
            // returns
            return element;
        }
    }
    duice.ObjectElementFactory = ObjectElementFactory;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * ArrayElementFactory
     */
    class ArrayElementFactory extends duice.ElementFactory {
        /**
         * creates element
         * @param htmlElement
         * @param context
         */
        createElement(htmlElement, context) {
            let element = new duice.ArrayElement(htmlElement);
            // bind
            let bindAttribute = duice.getAttribute(htmlElement, 'bind');
            let bindObject = duice.findObject(context, bindAttribute);
            element.bind(bindObject);
            // loop
            if (duice.hasAttribute(htmlElement, 'loop')) {
                element.setLoop(duice.getAttribute(htmlElement, 'loop'));
            }
            // returns
            return element;
        }
    }
    duice.ArrayElementFactory = ArrayElementFactory;
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
        static create(target) {
            let array = new DataSet(target);
            let arrayHandler = new duice.ArrayHandler(target);
            return new Proxy(array, arrayHandler);
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
         * @param json
         */
        fromJson(json) {
            for (let i = 0, size = json.length; i < size; i++) {
                let object = duice.Data.create(json[i]);
                this.push(new Proxy(object, new duice.DataHandler(object)));
            }
        }
    }
    duice.DataSet = DataSet;
})(duice || (duice = {}));
var duice;
(function (duice) {
    class Data extends globalThis.Object {
        /**
         * create
         * @param json
         */
        static create(json) {
            let object = new Data(json);
            let handler = new duice.DataHandler(object);
            return new Proxy(object, handler);
        }
        /**
         * constructor
         * @param json
         */
        constructor(json) {
            super();
            for (let property in json) {
                let value = json[property];
                this[property] = value;
            }
        }
    }
    duice.Data = Data;
})(duice || (duice = {}));
///<reference path="Handler.ts"/>
var duice;
(function (duice) {
    class DataHandler extends duice.Observable {
        constructor(target) {
            super(target);
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
         * @param observable
         * @param detail
         */
        update(observable, detail) {
            // TODO
        }
    }
    duice.DataHandler = DataHandler;
})(duice || (duice = {}));
///<reference path="Handler.ts"/>
var duice;
(function (duice) {
    class ArrayHandler extends duice.Handler {
        constructor(target) {
            super(target);
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
        doUpdate(element, detail) {
            // TODO
        }
    }
    duice.ArrayHandler = ArrayHandler;
})(duice || (duice = {}));
//# sourceMappingURL=duice.js.map