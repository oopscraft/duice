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
    // export const componentDefinitions: ComponentDefinition[] = [];
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
    // /**
    //  * defines component
    //  * @param componentType
    //  * @param tagName
    //  * @param isAttribute
    //  */
    // export function defineComponent(componentType: any, tagName: string) {
    //     console.debug("defineComponent", componentType, tagName);
    //     let componentDefinition = new ComponentDefinition(componentType, tagName);
    //     componentDefinitions.push(componentDefinition);
    // }
    //
    // /**
    //  * creates component
    //  * @param componentType
    //  * @param element
    //  * @param context
    //  */
    // export function createComponent(componentType: any, element: HTMLElement, context: object): Component<any> {
    //     componentDefinitions.forEach(componentDefinition => {
    //         if(componentDefinition.tagName.toLowerCase() === element.tagName.toLowerCase()){
    //             return componentDefinition.componentType.create(element, context);
    //         }
    //     });
    //     if(componentType === ArrayComponent) {
    //         return ArrayComponent.create(element, context);
    //     }
    //     if(componentType === ObjectComponent) {
    //         return ObjectComponent.create(element, context);
    //     }
    //     throw new Error('Invalid element');
    // }
    //
    // /**
    //  * initializes component
    //  * @param container
    //  * @param context
    //  */
    // export function initializeComponent(container: any, context: object): void {
    //     container.querySelectorAll(`*[${getAlias()}\\:array]:not([${getAlias()}\\:id])`).forEach(arrayElement => {
    //         if(!arrayElement.hasAttribute(`${getAlias()}:id`)) {
    //             let arrayComponent = createComponent(ArrayComponent, arrayElement, context);
    //             arrayComponent.render();
    //         }
    //     });
    //     container.querySelectorAll(`*[${getAlias()}\\:object]:not([${getAlias()}\\:id])`).forEach(objectElement => {
    //         if(!objectElement.hasAttribute(`${getAlias()}:id`)) {
    //             let objectComponent = createComponent(ObjectComponent, objectElement, context);
    //             if(objectElement.tagName.toLowerCase() === 'input'){
    //                 console.warn('objectElement:', objectElement);
    //                 console.warn('objectComponent:', objectComponent);
    //             }
    //             objectComponent.render();
    //         }
    //     });
    // }
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
    class Object {
        /**
         * create
         * @param json
         */
        static create(json) {
            let object = new Object(json);
            let handler = new duice.ObjectHandler(object);
            return new Proxy(object, handler);
        }
        /**
         * constructor
         * @param json
         */
        constructor(json) {
            for (let property in json) {
                let value = json[property];
                this[property] = value;
            }
        }
    }
    duice.Object = Object;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * ArrayProxy
     */
    class Array extends globalThis.Array {
        /**
         * create
         * @param json
         */
        static create(target) {
            let array = new Array(target);
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
                let object = duice.Object.create(json[i]);
                this.push(new Proxy(object, new duice.ObjectHandler(object)));
            }
        }
    }
    duice.Array = Array;
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
///<reference path="Handler.ts"/>
var duice;
(function (duice) {
    class ObjectHandler extends duice.Handler {
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
        doUpdate(element, detail) {
            // TODO
        }
    }
    duice.ObjectHandler = ObjectHandler;
})(duice || (duice = {}));
///<reference path="Observable.ts"/>
var duice;
(function (duice) {
    class Element extends duice.Observable {
        constructor(htmlElement) {
            super();
            this.htmlElement = htmlElement;
            this.id = this.generateId();
            this.setAttribute('id', this.id);
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
        setProperty(property) {
            this.property = property;
        }
        getProperty() {
            return this.property;
        }
        /**
         * render
         */
        render() {
            // array handler
            if (this.handler instanceof duice.ArrayHandler) {
                this.handler.getTarget().forEach(object => {
                    this.doRender(object);
                });
            }
            // object handler
            if (this.handler instanceof duice.ObjectHandler) {
                this.doRender(this.handler.getTarget());
            }
        }
        /**
         * doRender
         * @param object
         */
        doRender(object) {
            console.warn('== handler', this.handler.getTarget());
            console.log('object', object);
            let value = object[this.getProperty()];
            let textNode = document.createTextNode(value);
            console.warn('textNode', textNode);
            this.htmlElement.insertBefore(textNode, this.htmlElement.firstChild);
        }
        /**
         * update
         * @param handler
         * @param detail
         */
        update(handler, detail) {
            console.log("Element.update", handler, detail);
            this.render();
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
         * hasAttribute
         * @param name
         */
        hasAttribute(name) {
            return this.htmlElement.hasAttribute(`${duice.getAlias()}:${name}`);
        }
        /**
         * getAttribute
         * @param name
         */
        getAttribute(name) {
            return this.htmlElement.getAttribute(`${duice.getAlias()}:${name}`);
        }
        /**
         * setAttribute
         * @param name
         * @param value
         */
        setAttribute(name, value) {
            this.htmlElement.setAttribute(`${duice.getAlias()}:${name}`, value);
        }
    }
    duice.Element = Element;
})(duice || (duice = {}));
var duice;
(function (duice) {
    class ElementFactory {
        /**
         * adds element definition
         * @param tagName
         * @param elementType
         */
        static addElementDefinition(tagName, elementType) {
            let elementDefinition = new duice.ElementDefinition(tagName, elementType);
            this.elementDefinitions.push(elementDefinition);
        }
        /**
         * creates element
         * @param htmlElement
         * @param context
         */
        static createElement(htmlElement, context) {
            // creates element instance
            let tagName = htmlElement.tagName;
            let element = null;
            this.elementDefinitions.forEach(elementDefinition => {
                if (tagName === elementDefinition.getTagName()) {
                    let elementType = elementDefinition.getElementType();
                    element = Reflect.construct(elementType, [htmlElement]);
                }
            });
            if (element === null) {
                element = new duice.Element(htmlElement);
            }
            // bind
            let bindAttribute = htmlElement.getAttribute(`${duice.getAlias()}:bind`);
            let bindObject = this.findObject(context, bindAttribute);
            console.assert(bindObject, `bind object[${bindAttribute}] is not found`);
            element.bind(bindObject);
            // property
            let propertyAttribute = htmlElement.getAttribute(`${duice.getAlias()}:property`);
            element.setProperty(propertyAttribute);
            // returns
            return element;
        }
        /**
         * findObject
         * @param context
         * @param name
         */
        static findObject(context, name) {
            if (context[name]) {
                return context[name];
            }
            if (window.hasOwnProperty(name)) {
                return window[name];
            }
            return eval.call(context, name);
        }
    }
    ElementFactory.elementDefinitions = [];
    duice.ElementFactory = ElementFactory;
})(duice || (duice = {}));
var duice;
(function (duice) {
    class ElementInitializer {
        static initializeElement(container, context) {
            container.querySelectorAll(`*[${duice.getAlias()}\\:bind]:not([${duice.getAlias()}\\:id])`).forEach(htmlElement => {
                if (!htmlElement.hasAttribute(`${duice.getAlias()}:id`)) {
                    let element = duice.ElementFactory.createElement(htmlElement, context);
                    element.render();
                }
            });
        }
    }
    duice.ElementInitializer = ElementInitializer;
})(duice || (duice = {}));
var duice;
(function (duice) {
    class ElementDefinition {
        constructor(tagName, elementType) {
            this.tagName = tagName;
            this.elementType = elementType;
        }
        getTagName() {
            return this.tagName;
        }
        getElementType() {
            return this.elementType;
        }
    }
    duice.ElementDefinition = ElementDefinition;
})(duice || (duice = {}));
//# sourceMappingURL=duice.js.map