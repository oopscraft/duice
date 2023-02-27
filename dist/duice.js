var duice;
(function (duice) {
    /**
     * Handler
     */
    class Handler {
        /**
         * constructor
         * @param target
         * @protected
         */
        constructor(target) {
            this.components = [];
            console.log("target:", target);
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
         * addObserver
         * @param component
         */
        addComponent(component) {
            this.components.push(component);
        }
        /**
         * notifyObservers
         */
        notifyComponents(detail) {
            this.components.forEach(observer => {
                observer.update(this, detail);
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
         * @param target
         */
        constructor(array) {
            super(array);
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
                this.notifyComponents({});
            }
            return true;
        }
        /**
         * update
         * @param component
         * @param detail
         */
        update(component, detail) {
            console.debug("ArrayHandler.update:", component, detail);
        }
    }
    duice.ArrayHandler = ArrayHandler;
})(duice || (duice = {}));
///<reference path="ArrayHandler.ts"/>
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
        static create(json) {
            let array = new Array(json);
            let arrayHandler = new duice.ArrayHandler(array);
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
                let object = new duice.Object(json[i]);
                this.push(new Proxy(object, new duice.ObjectHandler(object)));
            }
        }
    }
    duice.Array = Array;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * Component
     */
    class Component {
        /**
         * constructor
         * @param element
         * @protected
         */
        constructor(element) {
            this.handlers = [];
            this.element = element;
            this.id = duice.generateUuid();
            this.setAttribute("id", this.id);
        }
        /**
         * initialize
         * @param context
         */
        initialize(context) {
            // bind
            let bind = duice.findObject(context, this.getAttribute('bind'));
            let handler = bind._handler_;
            this.addHandler(handler);
            handler.addComponent(this);
            // initialize
            let data = handler.getTarget();
            this.doInitialize(data);
        }
        /**
         * update
         * @param handler
         * @param detail
         */
        update(handler, detail) {
            console.log("Component.update", handler, detail);
            let data = handler.getTarget();
            this.doUpdate(data, detail);
        }
        /**
         * addHandler
         * @param observer
         */
        addHandler(observer) {
            this.handlers.push(observer);
        }
        /**
         * notifyHandlers
         */
        notifyHandlers(detail) {
            for (let i = 0; i < this.handlers.length; i++) {
                this.handlers[i].update(this, detail);
            }
        }
        /**
         * hasAttribute
         * @param name
         */
        hasAttribute(name) {
            return this.element.hasAttribute(`${duice.getAlias()}:${name}`);
        }
        /**
         * getAttribute
         * @param name
         */
        getAttribute(name) {
            return this.element.getAttribute(`${duice.getAlias()}:${name}`);
        }
        /**
         * setAttribute
         * @param name
         * @param value
         */
        setAttribute(name, value) {
            this.element.setAttribute(`${duice.getAlias()}:${name}`, value);
        }
    }
    duice.Component = Component;
})(duice || (duice = {}));
///<reference path="Component.ts"/>
var duice;
(function (duice) {
    /**
     * ArrayComponent
     */
    class ArrayComponent extends duice.Component {
        /**
         * constructor
         * @param element
         * @param context
         * @protected
         */
        constructor(element) {
            console.debug("ArrayComponent.constructor", element);
            super(element);
            this.var = this.getAttribute("var");
            this.status = this.getAttribute("status");
        }
        /**
         * getVar
         */
        getVar() {
            return this.var;
        }
        /**
         * getStatus
         */
        getStatus() {
            return this.status;
        }
    }
    duice.ArrayComponent = ArrayComponent;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * ComponentDefinition
     */
    class ComponentDefinition {
        /**
         * constructor
         * @param componentType
         * @param tagName
         * @param isAttribute
         * @protected
         */
        constructor(componentType, tagName, isAttribute) {
            this.componentType = componentType;
            this.tagName = tagName;
            this.isAttribute = isAttribute;
        }
        /**
         * getSelector
         */
        getSelector() {
            return `${this.tagName}`
                + (this.isAttribute ? `[is="${this.isAttribute}"]` : '')
                + `:not([${duice.getAlias()}\\:id])`;
        }
    }
    duice.ComponentDefinition = ComponentDefinition;
})(duice || (duice = {}));
/* =============================================================================
 * DUICE (Data-oriented UI Component Engine)
 * - Anyone can use it freely.
 * - Modify the source or allow re-creation. However, you must state that you have the original creator.
 * - However, we can not grant patents or licenses for reproductives. (Modifications or reproductions must be shared with the public.)
 * Licence: LGPL(GNU Lesser General Public License version 3)
 * Copyright (C) 2016 chomookun@gmail.com
 * ============================================================================= */
var duice;
(function (duice) {
    let alias = 'duice';
    const componentDefinitions = [];
    function setAlias(value) {
        alias = value;
    }
    duice.setAlias = setAlias;
    function getAlias() {
        return alias;
    }
    duice.getAlias = getAlias;
    /**
     * defineComponent
     * @param componentType
     * @param tagName
     * @param isAttribute
     */
    function defineComponent(componentType, tagName, isAttribute) {
        console.debug("defineComponent", componentType, tagName, isAttribute);
        let componentDefinition = new duice.ComponentDefinition(componentType, tagName, isAttribute);
        componentDefinitions.push(componentDefinition);
    }
    duice.defineComponent = defineComponent;
    /**
     * initializeComponent
     * @param container
     * @param context
     */
    function initializeComponent(container, context) {
        [duice.ArrayComponent, duice.ObjectComponent].forEach(componentType => {
            componentDefinitions.forEach(componentDefinition => {
                if (componentDefinition.componentType.prototype instanceof componentType) {
                    let selector = componentDefinition.getSelector();
                    let elements = container.querySelectorAll(selector);
                    elements.forEach(element => {
                        console.debug("initializeComponent", element);
                        let component = Reflect.apply(componentDefinition.componentType.create, undefined, [element]);
                        component.initialize(context);
                    });
                }
            });
        });
    }
    duice.initializeComponent = initializeComponent;
    /**
     * Generates random UUID value
     * @return  UUID string
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
     * find object in context
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
     * converts value to left-padded value
     * @param value value
     * @param length to pad
     * @param padChar character
     * @return left-padded value
     */
    function padLeft(value, length, padChar) {
        for (let i = 0, size = (length - value.length); i < size; i++) {
            value = padChar + value;
        }
        return value;
    }
    duice.padLeft = padLeft;
    /**
     * converts value to right-padded value
     * @param value value
     * @param length to pad
     * @param padChar character
     * @return right-padded string
     */
    function padRight(value, length, padChar) {
        for (let i = 0, size = (length - value.length); i < size; i++) {
            value = value + padChar;
        }
        return value;
    }
    duice.padRight = padRight;
    /**
     * listens DOMContentLoaded event
     */
    if (globalThis.document) {
        document.addEventListener("DOMContentLoaded", event => {
            initializeComponent(document, {});
        });
    }
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * ObjectComponent
     */
    class ObjectComponent extends duice.Component {
        /**
         * constructor
         * @param element
         * @param context
         * @protected
         */
        constructor(element) {
            super(element);
            this.property = this.getAttribute("property");
        }
        /**
         * getProperty
         */
        getProperty() {
            return this.property;
        }
    }
    duice.ObjectComponent = ObjectComponent;
})(duice || (duice = {}));
///<reference path="../ObjectComponent.ts"/>
var duice;
(function (duice) {
    var element;
    (function (element_1) {
        class Input extends duice.ObjectComponent {
            /**
             * constructor
             * @param element
             * @param context
             */
            constructor(element) {
                super(element);
            }
            /**
             * create
             * @param element
             */
            static create(element) {
                let type = element.getAttribute('type');
                switch (type) {
                    case 'number':
                        return new element_1.InputNumber(element);
                    case 'checkbox':
                        return new element_1.InputCheckbox(element);
                    default:
                        return new Input(element);
                }
            }
            /**
             * doInitialize
             * @param object
             */
            doInitialize(object) {
                // adds change event listener
                let _this = this;
                this.element.addEventListener('change', function (event) {
                    _this.notifyHandlers({});
                }, true);
                // update
                this.doUpdate(object, {});
            }
            /**
             * doUpdate
             * @param object
             * @param detail
             */
            doUpdate(object, detail) {
                let value = object[this.property];
                this.element.value = value;
            }
            /**
             * getValue
             */
            getValue() {
                return this.element.value;
            }
        }
        element_1.Input = Input;
        // defines component
        duice.defineComponent(Input, "input", `${duice.getAlias()}-input`);
    })(element = duice.element || (duice.element = {}));
})(duice || (duice = {}));
var duice;
(function (duice) {
    var element;
    (function (element_2) {
        class InputNumber extends element_2.Input {
            /**
             * constructor
             * @param element
             */
            constructor(element) {
                super(element);
            }
            /**
             * doUpdate
             * @param object
             * @param detail
             */
            doUpdate(object, detail) {
                let value = object[this.property];
                this.element.value = value;
            }
            /**
             * getValue
             */
            getValue() {
                let value = super.getValue();
                return Number(value);
            }
        }
        element_2.InputNumber = InputNumber;
    })(element = duice.element || (duice.element = {}));
})(duice || (duice = {}));
var duice;
(function (duice) {
    var element;
    (function (element_3) {
        class Select extends duice.ObjectComponent {
            /**
             * constructor
             * @param element
             */
            constructor(element) {
                super(element);
                this.defaultOptions = [];
                this.option = this.getAttribute('option');
            }
            /**
             * create
             * @param element
             */
            static create(element) {
                return new Select(element);
            }
            /**
             * doInitialize
             * @param object
             */
            doInitialize(object) {
                // stores default options
                for (let i = 0, size = this.element.options.length; i < size; i++) {
                    this.defaultOptions.push(this.element.options[i]);
                }
                // set options
                if (this.option) {
                    let optionParts = this.option.split(',');
                    let options = duice.findObject({}, optionParts[0]);
                    let value = optionParts[1];
                    let text = optionParts[2];
                    this.setOption(options, value, text);
                }
                // adds change event listener
                let _this = this;
                this.element.addEventListener('change', function (event) {
                    _this.notifyHandlers({});
                }, true);
                // updates
                this.doUpdate(object, {});
            }
            /**
             * setOptions
             * @param options
             * @param value
             * @param text
             */
            setOption(options, value, text) {
                // removes
                duice.removeChildNodes(this.element);
                // adds default options
                let _this = this;
                this.defaultOptions.forEach(option => {
                    _this.element.appendChild(option);
                });
                // adds additional options
                options.forEach(option => {
                    let optionElement = document.createElement('option');
                    optionElement.value = option[value];
                    optionElement.appendChild(document.createTextNode(option[text]));
                    _this.element.appendChild(optionElement);
                });
            }
            /**
             * doUpdate
             * @param object
             * @param detail
             */
            doUpdate(object, detail) {
                let value = object[this.property];
                this.element.value = value;
            }
            /**
             * getValue
             */
            getValue() {
                return this.element.value;
            }
        }
        element_3.Select = Select;
        // defines component
        duice.defineComponent(Select, "select", `${duice.getAlias()}-select`);
    })(element = duice.element || (duice.element = {}));
})(duice || (duice = {}));
///<reference path="../ArrayComponent.ts"/>
///<reference path="../ComponentDefinition.ts"/>
var duice;
(function (duice) {
    var element;
    (function (element_4) {
        /**
         * Table
         */
        class Table extends duice.ArrayComponent {
            /**
             * constructor
             * @param element
             */
            constructor(element) {
                super(element);
                this.rowElements = [];
            }
            /**
             * create
             * @param element
             */
            static create(element) {
                return new Table(element);
            }
            /**
             * doInitialize
             * @param array
             */
            doInitialize(array) {
                // tbody template
                this.tBodyTemplate = this.element.querySelector("tbody");
                this.element.removeChild(this.tBodyTemplate);
                // update
                this.doUpdate(array, {});
            }
            /**
             * doUpdate
             * @param array
             * @param detail
             */
            doUpdate(array, detail) {
                // clear
                this.rowElements.forEach(rowElement => {
                    this.element.removeChild(rowElement);
                });
                this.rowElements.length = 0;
                // creates row
                for (let index = 0, size = array.length; index < size; index++) {
                    let object = array[index];
                    let status = {
                        index: index,
                        length: array.length
                    };
                    let rowElement = this.createRowElement(object, status);
                    let context = {};
                    context[this.getVar()] = object;
                    context[this.getStatus()] = status;
                    duice.initializeComponent(rowElement, context);
                    this.element.appendChild(rowElement);
                    this.rowElements.push(rowElement);
                }
            }
            /**
             * createRowElement
             * @param object
             * @param status
             */
            createRowElement(object, status) {
                let tBody = this.tBodyTemplate.cloneNode(true);
                return tBody;
            }
        }
        element_4.Table = Table;
        // defines component
        duice.defineComponent(Table, "table", `${duice.getAlias()}-table`);
    })(element = duice.element || (duice.element = {}));
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
                            return duice.padLeft(String(date.getFullYear() % 1000), 2, '0');
                        case "MM":
                            return duice.padLeft(String(date.getMonth() + 1), 2, '0');
                        case "dd":
                            return duice.padLeft(String(date.getDate()), 2, '0');
                        case "HH":
                            return duice.padLeft(String(date.getHours()), 2, '0');
                        case "hh":
                            return duice.padLeft(String(date.getHours() <= 12 ? date.getHours() : date.getHours() % 12), 2, '0');
                        case "mm":
                            return duice.padLeft(String(date.getMinutes()), 2, '0');
                        case "ss":
                            return duice.padLeft(String(date.getSeconds()), 2, '0');
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
                    matchValue = duice.padRight(matchValue, formatLength, '0');
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
                if (!this.pattern) {
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
                if (!this.pattern) {
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
            this.fromJson(json);
        }
        fromJson(json) {
            for (let property in json) {
                this[property] = json[property];
            }
        }
    }
    duice.Object = Object;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * ObjectHandler
     */
    class ObjectHandler extends duice.Handler {
        /**
         * constructor
         * @param target
         */
        constructor(object) {
            super(object);
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
            this.notifyComponents({});
            return true;
        }
        /**
         * update
         * @param component
         * @param detail
         */
        update(component, detail) {
            console.log('ObjectHandler.update', component, detail);
            let property = component.getProperty();
            let value = component.getValue();
            Reflect.set(this.getTarget(), property, value);
        }
    }
    duice.ObjectHandler = ObjectHandler;
})(duice || (duice = {}));
var duice;
(function (duice) {
    var element;
    (function (element_5) {
        class InputCheckbox extends element_5.Input {
            /**
             * constructor
             * @param element
             */
            constructor(element) {
                super(element);
            }
            /**
             * doUpdate
             * @param object
             * @param detail
             */
            doUpdate(object, detail) {
                let value = object[this.property];
                if (value === true) {
                    this.element.checked = true;
                }
                else {
                    this.element.checked = false;
                }
            }
            /**
             * getValue
             */
            getValue() {
                return this.element.checked;
            }
        }
        element_5.InputCheckbox = InputCheckbox;
    })(element = duice.element || (duice.element = {}));
})(duice || (duice = {}));
//# sourceMappingURL=duice.js.map