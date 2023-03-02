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
                observer.update(detail);
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
        constructor(element, context) {
            this.element = element;
            this.context = context;
            this.id = this.generateId();
            this.setAttribute(element, "id", this.id);
            this.script = this.getAttribute(element, 'script');
        }
        /**
         * render
         */
        render() {
            // calls template method
            this.doRender();
            // executes script
            if (this.script) {
                this.executeScript(this.script);
            }
        }
        /**
         * update
         * @param detail
         */
        update(detail) {
            // calls template method
            this.doUpdate(detail);
            // executes script
            if (this.script) {
                this.executeScript(this.script);
            }
        }
        /**
         * notifyHandlers
         */
        notifyHandler(detail) {
            this.handler.update(this, detail);
        }
        /**
         * Generates component ID
         * @return id
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
         * findObject
         * @param name
         */
        findObject(name) {
            if (this.context[name]) {
                return this.context[name];
            }
            if (window.hasOwnProperty(name)) {
                return window[name];
            }
            return eval.call(this.context, name);
        }
        /**
         * hasAttribute
         * @param element
         * @param name
         */
        hasAttribute(element, name) {
            return element.hasAttribute(`${duice.getAlias()}:${name}`);
        }
        /**
         * getAttribute
         * @param element
         * @param name
         */
        getAttribute(element, name) {
            return element.getAttribute(`${duice.getAlias()}:${name}`);
        }
        /**
         * setAttribute
         * @param element
         * @param name
         * @param value
         */
        setAttribute(element, name, value) {
            element.setAttribute(`${duice.getAlias()}:${name}`, value);
        }
        /**
         * removeChildNodes
         * @param element
         */
        removeChildNodes(element) {
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
        /**
         * executes script
         * @param code
         * @param context
         */
        executeScript(script) {
            try {
                return Function(script).call(this.element, this.context);
            }
            catch (e) {
                console.error(script);
                throw e;
            }
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
        constructor(element, context) {
            console.debug("ArrayComponent.constructor", element, context);
            super(element, context);
            this.loopTemplates = [];
            this.loopSlots = [];
            this.emptyTemplates = [];
            this.emptySlots = [];
            // array handler
            let arrayName = this.getAttribute(this.element, 'array');
            let array = this.findObject(arrayName);
            this.handler = array._handler_;
            this.handler.addComponent(this);
            // loop template and slot
            let loopElements = this.element.querySelectorAll(`*[${duice.getAlias()}\\:loop]`);
            for (let i = 0; i < loopElements.length; i++) {
                let loopElement = loopElements[i];
                let loopTemplate = loopElement;
                let loopSlot = document.createElement('slot');
                this.loopTemplates.push(loopTemplate);
                this.loopSlots.push(loopSlot);
                loopElement.replaceWith(loopSlot);
            }
            console.debug("loopTemplates:", this.loopTemplates);
            console.debug("loopSlots:", this.loopSlots);
            // empty template and slot
            let emptyElements = this.element.querySelectorAll(`*[${duice.getAlias()}\\:empty]`);
            for (let i = 0; i < emptyElements.length; i++) {
                let emptyElement = emptyElements[i];
                let emptyTemplate = emptyElement;
                let emptySlot = document.createElement('slot');
                this.emptyTemplates.push(emptyTemplate);
                this.emptySlots.push(emptySlot);
                emptyElement.replaceWith(emptySlot);
            }
            console.debug("loopTemplates:", this.loopTemplates);
            console.debug("loopSlots:", this.loopSlots);
        }
        /**
         * create
         * @param element
         * @param context
         */
        static create(element, context) {
            return new ArrayComponent(element, context);
        }
        /**
          * render
          * @param detail
          */
        doRender() {
            console.log("ArrayComponent.render");
            // defines
            let array = this.handler.getTarget();
            // renders loop templates
            for (let i = 0; i < this.loopTemplates.length; i++) {
                let loopTemplate = this.loopTemplates[i];
                let loopSlot = this.loopSlots[i];
                let loopAttribute = this.getAttribute(loopTemplate, 'loop');
                // clear
                this.removeChildNodes(loopSlot);
                // create row
                let loopArgs = loopAttribute.split(',');
                let objectName = loopArgs[0];
                let statusName = loopArgs[1];
                for (let index = 0, size = array.length; index < size; index++) {
                    let item = array[index];
                    console.log('== item:', item);
                    let rowElement = loopTemplate.cloneNode(true);
                    let context = {};
                    context[objectName] = item;
                    context[statusName] = duice.Object.create({
                        index: index,
                        number: index + 1,
                        count: array.length,
                        first: (index === 0),
                        last: (index + 1 === array.length)
                    });
                    duice.initializeComponent(rowElement, context);
                    loopSlot.appendChild(rowElement);
                }
            }
            // renders empty templates
            for (let i = 0; i < this.emptyTemplates.length; i++) {
                let emptyTemplate = this.emptyTemplates[i];
                let emptySlot = this.emptySlots[i];
                let emptyAttribute = this.getAttribute(emptyTemplate, 'empty');
                let empty = (emptyAttribute.toLowerCase() === 'true');
                this.removeChildNodes(emptySlot);
                if ((array.length === 0) === empty) {
                    let emptyElement = emptyTemplate.cloneNode(true);
                    duice.initializeComponent(emptyElement, this.context);
                    emptySlot.appendChild(emptyElement);
                }
            }
        }
        /**
         * update
         * @param detail
         */
        doUpdate(detail) {
            console.log("ArrayComponent.update", detail);
            this.doRender();
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
         * @param tagName
         * @param componentType
         * @protected
         */
        constructor(componentType, tagName) {
            this.componentType = componentType;
            this.tagName = tagName;
        }
    }
    duice.ComponentDefinition = ComponentDefinition;
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
     * ObjectComponent
     */
    class ObjectComponent extends duice.Component {
        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element, context) {
            super(element, context);
            // object handler
            let objectName = this.getAttribute(this.element, 'object');
            let object = this.findObject(objectName);
            this.handler = object._handler_;
            this.handler.addComponent(this);
            // mask
            if (this.hasAttribute(this.element, 'mask')) {
                let mask = this.getAttribute(this.element, 'mask');
                this.mask = duice.mask.MaskFactory.getMask(mask);
            }
        }
        /**
         * create
         * @param element
         * @param context
         */
        static create(element, context) {
            return new ObjectComponent(element, context);
        }
        /**
         * getProperty
         */
        getProperty() {
            return this.getAttribute(this.element, 'property');
        }
        /**
         * render
         */
        doRender() {
            let value = this.handler.getPropertyValue(this.getProperty());
            value = this.mask ? this.mask.encode(value) : value;
            let textNode = document.createTextNode(value);
            this.element.insertBefore(textNode, this.element.firstChild);
        }
        /**
          * update
          * @param detail
          */
        doUpdate(detail) {
            this.doRender();
        }
        /**
         * getValue
         */
        getValue() {
            let value = this.element.firstChild.textContent;
            return this.mask ? this.mask.decode(value) : value;
        }
    }
    duice.ObjectComponent = ObjectComponent;
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
            this.setPropertyValue(property, value);
        }
        /**
         * getPropertyValue
         * @param property
         */
        getPropertyValue(property) {
            console.assert(property);
            property = property.replace('.', '?.');
            return new Function(`return this.${property};`).call(this.getTarget());
        }
        /**
         * setPropertyValue
         * @param property
         * @param value
         */
        setPropertyValue(property, value) {
            new Function(`this.${property} = arguments[0];`).call(this.getTarget(), value);
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
    const componentDefinitions = [];
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
     * defines component
     * @param componentType
     * @param tagName
     * @param isAttribute
     */
    function defineComponent(componentType, tagName) {
        console.debug("defineComponent", componentType, tagName);
        let componentDefinition = new duice.ComponentDefinition(componentType, tagName);
        componentDefinitions.push(componentDefinition);
    }
    duice.defineComponent = defineComponent;
    /**
     * creates component
     * @param componentType
     * @param element
     * @param context
     */
    function createComponent(componentType, element, context) {
        componentDefinitions.forEach(componentDefinition => {
            if (componentDefinition.tagName === element.tagName) {
                return componentDefinition.componentType.create(element, context);
            }
        });
        if (componentType === duice.ArrayComponent) {
            return duice.ArrayComponent.create(element, context);
        }
        if (componentType === duice.ObjectComponent) {
            return duice.ObjectComponent.create(element, context);
        }
        throw new Error('Invalid element');
    }
    duice.createComponent = createComponent;
    /**
     * initializes component
     * @param container
     * @param context
     */
    function initializeComponent(container, context) {
        container.querySelectorAll(`*[${getAlias()}\\:array]:not([${getAlias()}\\:id])`).forEach(arrayElement => {
            if (!arrayElement.hasAttribute(`${getAlias()}:id`)) {
                let arrayComponent = createComponent(duice.ArrayComponent, arrayElement, context);
                arrayComponent.render();
            }
            else {
                alert(arrayElement);
            }
        });
        container.querySelectorAll(`*[${getAlias()}\\:object]:not([${getAlias()}\\:id])`).forEach(objectElement => {
            if (!objectElement.hasAttribute(`${getAlias()}:id`)) {
                let objectComponent = createComponent(duice.ObjectComponent, objectElement, context);
                objectComponent.render();
            }
            else {
                alert(objectElement);
            }
        });
    }
    duice.initializeComponent = initializeComponent;
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
///<reference path="../ObjectComponent.ts"/>
///<reference path="../mask/StringMask.ts"/>
var duice;
(function (duice) {
    var element;
    (function (element_1) {
        /**
         * Input
         */
        class Input extends duice.ObjectComponent {
            /**
             * constructor
             * @param element
             * @param context
             */
            constructor(element, context) {
                super(element, context);
                // set mask
                if (this.hasAttribute(this.element, 'mask')) {
                    let pattern = this.getAttribute(this.element, 'mask');
                    this.mask = new duice.mask.StringMask(pattern);
                }
                // adds change event listener
                let _this = this;
                this.element.addEventListener('change', function (event) {
                    _this.notifyHandler({});
                }, true);
            }
            /**
             * create
             * @param element
             */
            static create(element, context) {
                let type = element.getAttribute('type');
                switch (type) {
                    case 'number':
                        return new element_1.InputNumber(element, context);
                    case 'checkbox':
                        return new element_1.InputCheckbox(element, context);
                    default:
                        return new Input(element, context);
                }
            }
            /**
             * render
             * @param detail
             */
            doRender() {
                let value = this.handler.getPropertyValue(this.property);
                this.element.value = this.mask ? this.mask.encode(value) : value;
            }
            /**
             * update
             * @param detail
             */
            doUpdate(detail) {
                this.doRender();
            }
            /**
             * getValue
             */
            getValue() {
                let value = this.element.value;
                return this.mask ? this.mask.decode(value) : value;
            }
        }
        element_1.Input = Input;
        // defines component
        duice.defineComponent(Input, "input");
    })(element = duice.element || (duice.element = {}));
})(duice || (duice = {}));
var duice;
(function (duice) {
    var element;
    (function (element_2) {
        class InputCheckbox extends element_2.Input {
            /**
             * constructor
             * @param element
             */
            constructor(element, context) {
                super(element, context);
            }
            /**
             * render
             */
            doRender() {
                let value = this.handler.getPropertyValue(this.getProperty());
                if (value === true) {
                    this.element.checked = true;
                }
                else {
                    this.element.checked = false;
                }
            }
            /**
             * update
             * @param detail
             */
            doUpdate(detail) {
                this.doRender();
            }
            /**
             * getValue
             */
            getValue() {
                return this.element.checked;
            }
        }
        element_2.InputCheckbox = InputCheckbox;
    })(element = duice.element || (duice.element = {}));
})(duice || (duice = {}));
var duice;
(function (duice) {
    var element;
    (function (element_3) {
        class InputNumber extends element_3.Input {
            /**
             * constructor
             * @param element
             */
            constructor(element, context) {
                super(element, context);
            }
            /**
             * render
             */
            doRender() {
                let value = this.handler.getPropertyValue(this.getProperty());
                this.element.value = value;
            }
            /**
             * update
             * @param detail
             */
            doUpdate(detail) {
                this.doRender();
            }
            /**
             * getValue
             */
            getValue() {
                let value = super.getValue();
                return Number(value);
            }
        }
        element_3.InputNumber = InputNumber;
    })(element = duice.element || (duice.element = {}));
})(duice || (duice = {}));
var duice;
(function (duice) {
    var element;
    (function (element_4) {
        class Select extends duice.ObjectComponent {
            /**
             * constructor
             * @param element
             * @param context
             */
            constructor(element, context) {
                super(element, context);
                this.defaultOptions = [];
                this.option = this.getAttribute(this.element, 'option');
                // stores default options
                for (let i = 0, size = this.element.options.length; i < size; i++) {
                    this.defaultOptions.push(this.element.options[i]);
                }
                // adds change event listener
                let _this = this;
                this.element.addEventListener('change', function (event) {
                    _this.notifyHandler({});
                }, true);
            }
            /**
             * create
             * @param element
             */
            static create(element, context) {
                return new Select(element, context);
            }
            doRender() {
                // set options
                if (this.option) {
                    let optionParts = this.option.split(',');
                    let options = this.findObject(optionParts[0]);
                    let value = optionParts[1];
                    let text = optionParts[2];
                    this.setOption(options, value, text);
                }
                // set value
                let value = this.handler.getPropertyValue(this.getProperty());
                this.element.value = value;
            }
            /**
             * setOptions
             * @param options
             * @param value
             * @param text
             */
            setOption(options, value, text) {
                // removes
                this.removeChildNodes(this.element);
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
             * update
             * @param detail
             */
            doUpdate(detail) {
                this.doRender();
            }
            /**
             * getValue
             */
            getValue() {
                return this.element.value;
            }
        }
        element_4.Select = Select;
        // defines component
        duice.defineComponent(Select, "select");
    })(element = duice.element || (duice.element = {}));
})(duice || (duice = {}));
///<reference path="../ArrayComponent.ts"/>
///<reference path="../ComponentDefinition.ts"/>
var duice;
(function (duice) {
    var element;
    (function (element_5) {
        /**
         * Table
         */
        class Table extends duice.ArrayComponent {
            /**
             * create
             * @param element
             */
            static create(element, context) {
                return new Table(element, context);
            }
            /**
             * constructor
             * @param element
             */
            constructor(element, context) {
                super(element, context);
            }
            /**
             * render
             */
            doRender() {
                super.doRender();
            }
            /**
             * update
             * @param detail
             */
            doUpdate(detail) {
                this.doRender();
            }
        }
        element_5.Table = Table;
        // defines component
        duice.defineComponent(Table, "table");
    })(element = duice.element || (duice.element = {}));
})(duice || (duice = {}));
var duice;
(function (duice) {
    var element;
    (function (element_6) {
        class Textarea extends duice.ObjectComponent {
            /**
             * constructor
             * @param element
             */
            constructor(element, context) {
                super(element, context);
                // adds change event listener
                let _this = this;
                this.element.addEventListener('change', function (event) {
                    _this.notifyHandler({});
                }, true);
            }
            /**
             * create
             * @param element
             */
            static create(element, context) {
                return new Textarea(element, context);
            }
            /**
             * render
             */
            doRender() {
                let value = this.handler.getPropertyValue(this.getProperty());
                this.element.value = value;
            }
            /**
             * update
             * @param detail
             */
            doUpdate(detail) {
                this.doRender();
            }
            /**
             * getValue
             */
            getValue() {
                return this.element.value;
            }
        }
        element_6.Textarea = Textarea;
        // defines component
        duice.defineComponent(Textarea, "textarea");
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
//# sourceMappingURL=duice.js.map