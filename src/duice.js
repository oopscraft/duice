"use strict";
/* =============================================================================
 * DUICE (Data-oriented UI Component Engine)
 * - Anyone can use it freely.
 * - Modify the source or allow re-creation. However, you must state that you have the original creator.
 * - However, we can not grant patents or licenses for reproductives. (Modifications or reproductions must be shared with the public.)
 * Licence: LGPL(GNU Lesser General Public License version 3)
 * Copyright (C) 2017 duice.oopscraft.net
 * ============================================================================= */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
/**
 * project package
 */
var duice;
(function (duice) {
    /**
     * Configuration
     */
    duice.Configuration = {
        version: '0.9',
        cssEnable: true
    };
    function initialize() {
        // prints configuration
        console.debug(duice.Configuration);
        // initializes component
        var $context = typeof self !== 'undefined' ? self :
            typeof window !== 'undefined' ? window :
                {};
        // initializes component
        duice.initializeComponent(document, $context);
    }
    duice.initialize = initialize;
    /**
     * Component definition registry
     */
    duice.ComponentDefinitionRegistry = {
        componentDefinitions: new Array(),
        add: function (componentDefinition) {
            this.componentDefinitions.push(componentDefinition);
        },
        getComponentDefinitions: function () {
            return this.componentDefinitions;
        }
    };
    /**
     * Component definition
     */
    var ComponentDefinition = /** @class */ (function () {
        function ComponentDefinition(tagName, isAttribute, factoryClass) {
            this.tagName = tagName;
            this.isAttribute = isAttribute;
            this.factoryClass = factoryClass;
        }
        ComponentDefinition.prototype.getTagName = function () {
            return this.tagName;
        };
        ComponentDefinition.prototype.getIsAttribute = function () {
            return this.isAttribute;
        };
        ComponentDefinition.prototype.getFactoryClass = function () {
            return this.factoryClass;
        };
        return ComponentDefinition;
    }());
    duice.ComponentDefinition = ComponentDefinition;
    /**
     * Initializes component
     * @param container
     * @param $context
     */
    function initializeComponent(container, $context) {
        [ListUiComponentFactory, MapUiComponentFactory]
            .forEach(function (factoryType) {
            duice.ComponentDefinitionRegistry.getComponentDefinitions().forEach(function (componentDefinition) {
                var elements = container.querySelectorAll(componentDefinition.getTagName() + '[is="' + componentDefinition.getIsAttribute() + '"][data-duice-bind]:not([data-duice-id])');
                for (var i = 0, size = elements.length; i < size; i++) {
                    var element = elements[i];
                    if (componentDefinition.getFactoryClass().prototype instanceof factoryType) {
                        var factoryClass = Object.create(componentDefinition.getFactoryClass().prototype);
                        var factoryInstance = factoryClass.constructor.call(factoryClass, $context);
                        factoryInstance.getInstance(element);
                    }
                }
            });
        });
    }
    duice.initializeComponent = initializeComponent;
    /**
     * Loads external style
     * @param href
     */
    function loadExternalStyle(href) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }
    duice.loadExternalStyle = loadExternalStyle;
    /**
     * Loads external script
     * @param src
     */
    function loadExternalScript(src) {
        var script = document.createElement('script');
        script.src = src;
        document.head.appendChild(script);
    }
    duice.loadExternalScript = loadExternalScript;
    /**
     * duice.Observable
     * Observable abstract class of Observer Pattern
     */
    var Observable = /** @class */ (function () {
        function Observable() {
            this.observers = new Array();
            this.changed = false;
            this.notifyEnable = true;
        }
        /**
         * Adds observer instance
         * @param observer
         */
        Observable.prototype.addObserver = function (observer) {
            for (var i = 0, size = this.observers.length; i < size; i++) {
                if (this.observers[i] === observer) {
                    return;
                }
            }
            this.observers.push(observer);
        };
        /**
         * Removes specified observer instance from observer instances
         * @param observer
         */
        Observable.prototype.removeObserver = function (observer) {
            for (var i = 0, size = this.observers.length; i < size; i++) {
                if (this.observers[i] === observer) {
                    this.observers.splice(i, 1);
                    return;
                }
            }
        };
        /**
         * Notifies changes to observers
         * @param obj object to transfer to observer
         */
        Observable.prototype.notifyObservers = function (obj) {
            console.debug('Observable.observers.length', this.observers.length);
            if (this.notifyEnable && this.hasChanged()) {
                this.clearUnavailableObservers();
                for (var i = 0, size = this.observers.length; i < size; i++) {
                    try {
                        this.observers[i].update(this, obj);
                    }
                    catch (e) {
                        console.error(e, this.observers[i]);
                    }
                }
                this.clearChanged();
            }
        };
        /**
         * Suspends notify
         */
        Observable.prototype.suspendNotify = function () {
            this.notifyEnable = false;
        };
        /**
         * Resumes notify
         */
        Observable.prototype.resumeNotify = function () {
            this.notifyEnable = true;
        };
        /**
         * Sets changed flag
         */
        Observable.prototype.setChanged = function () {
            this.changed = true;
        };
        /**
         * Returns changed flag
         */
        Observable.prototype.hasChanged = function () {
            return this.changed;
        };
        /**
         * Clears changed flag
         */
        Observable.prototype.clearChanged = function () {
            this.changed = false;
        };
        /**
         * Clears unavailable observers to prevent memory leak
         */
        Observable.prototype.clearUnavailableObservers = function () {
            for (var i = this.observers.length - 1; i >= 0; i--) {
                try {
                    if (this.observers[i].isAvailable() === false) {
                        this.observers.splice(i, 1);
                    }
                }
                catch (e) {
                    console.error(e, this.observers[i]);
                }
            }
        };
        return Observable;
    }());
    /**
     * Abstract data object
     * extends from Observable and implements Observer interface.
     */
    var DataObject = /** @class */ (function (_super) {
        __extends(DataObject, _super);
        function DataObject() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.available = true;
            _this.disable = false;
            _this.readonly = new Object();
            _this.visible = true;
            return _this;
        }
        /**
         * Returns whether instance is active
         */
        DataObject.prototype.isAvailable = function () {
            return true;
        };
        /**
         * Sets disable
         * @param disable
         */
        DataObject.prototype.setDisable = function (disable) {
            this.disable = disable;
            this.setChanged();
            this.notifyObservers(this);
        };
        /**
         * Returns if disabled
         */
        DataObject.prototype.isDisable = function () {
            return this.disable;
        };
        /**
         * Sets read-only
         * @param name
         */
        DataObject.prototype.setReadonly = function (name, readonly) {
            this.readonly[name] = readonly;
            this.setChanged();
            this.notifyObservers(this);
        };
        /**
         * Returns read-only
         * @param name
         */
        DataObject.prototype.isReadonly = function (name) {
            if (this.readonly[name]) {
                return true;
            }
            else {
                return false;
            }
        };
        /**
         * Sets visible flag
         * @param visible
         */
        DataObject.prototype.setVisible = function (visible) {
            this.visible = visible;
            for (var i = 0, size = this.observers.length; i < size; i++) {
                try {
                    if (this.observers[i] instanceof UiComponent) {
                        var uiComponent = this.observers[i];
                        uiComponent.setVisible(visible);
                    }
                }
                catch (e) {
                    console.error(e, this.observers[i]);
                }
            }
        };
        /**
         * Returns is visible.
         */
        DataObject.prototype.isVisible = function () {
            return this.visible;
        };
        return DataObject;
    }(Observable));
    duice.DataObject = DataObject;
    /**
     * Map data structure
     * @param JSON object
     */
    var Map = /** @class */ (function (_super) {
        __extends(Map, _super);
        /**
         * constructor
         * @param json
         */
        function Map(json) {
            var _this = _super.call(this) || this;
            _this.data = new Object(); // internal data object
            _this.originData = JSON.stringify(_this.data); // original string JSON data
            _this.on = {
                beforeChange: null,
                afterChange: null
            };
            if (json) {
                _this.fromJson(json);
            }
            return _this;
        }
        /**
         * Updates data from observable instance
         * @param UiComponent
         * @param obj
         */
        Map.prototype.update = function (UiComponent, obj) {
            console.debug('Map.update', UiComponent, obj);
            var name = UiComponent.getName();
            var value = UiComponent.getValue();
            this.set(name, value);
        };
        /**
         * Loads data from JSON object.
         * @param json
         */
        Map.prototype.fromJson = function (json) {
            // sets data
            this.data = new Object();
            for (var name in json) {
                this.data[name] = json[name];
            }
            // saves original data.
            this.originData = JSON.stringify(this.toJson());
            // notify to observers
            this.setChanged();
            this.notifyObservers(this);
        };
        /**
         * Convert data to JSON object
         * @return JSON object
         */
        Map.prototype.toJson = function () {
            var json = new Object();
            for (var name in this.data) {
                json[name] = this.data[name];
            }
            return json;
        };
        /**
         * Clears data
         */
        Map.prototype.clear = function () {
            this.data = new Object();
            this.setChanged();
            this.notifyObservers(this);
        };
        /**
         * Checks original data is changed
         * @return whether original data is changed or not
         */
        Map.prototype.isDirty = function () {
            if (JSON.stringify(this.toJson()) === this.originData) {
                return false;
            }
            else {
                return true;
            }
        };
        /**
         * Restores instance as original data
         */
        Map.prototype.reset = function () {
            var originJson = JSON.parse(this.originData);
            this.fromJson(originJson);
        };
        /**
         * Sets property as input value
         * @param name
         * @param value
         */
        Map.prototype.set = function (name, value) {
            // calls beforeChange
            if (this.on.beforeChange) {
                if (this.on.beforeChange.call(this, name, value) === false) {
                    return false;
                }
            }
            // changes value
            this.data[name] = value;
            this.setChanged();
            this.notifyObservers(this);
            // calls 
            if (this.on.afterChange) {
                this.on.afterChange.call(this, name, value);
            }
            // return true
            return true;
        };
        /**
         * Gets specified property value.
         * @param name
         */
        Map.prototype.get = function (name) {
            return this.data[name];
        };
        /**
         * Returns properties names as array.
         * @return array of names
         */
        Map.prototype.getNames = function () {
            var names = new Array();
            for (var name in this.data) {
                names.push(name);
            }
            return names;
        };
        /**
         * Sets focus
         * @param name
         */
        Map.prototype.setFocus = function (name) {
            for (var i = 0, size = this.observers.length; i < size; i++) {
                var observer = this.observers[i];
                if (observer instanceof MapUiComponent) {
                    if (observer.getName() === name && observer.element.focus) {
                        observer.element.focus();
                        break;
                    }
                }
            }
        };
        /**
         * Sets listener before change
         * @param listener
         */
        Map.prototype.onBeforeChange = function (listener) {
            this.on.beforeChange = listener;
        };
        /**
         * Sets listener after change
         * @param listener
         */
        Map.prototype.onAfterChange = function (listener) {
            this.on.afterChange = listener;
        };
        return Map;
    }(DataObject));
    duice.Map = Map;
    /**
     * duice.List
     */
    var List = /** @class */ (function (_super) {
        __extends(List, _super);
        /**
         * constructor
         * @param jsonArray
         */
        function List(jsonArray) {
            var _this = _super.call(this) || this;
            _this.data = new Array();
            _this.originData = JSON.stringify(_this.data);
            _this.index = -1;
            _this.on = {
                beforeChangeIndex: null,
                afterChangeIndex: null,
                beforeChange: null,
                afterChange: null
            };
            if (jsonArray) {
                _this.fromJson(jsonArray);
            }
            return _this;
        }
        List.prototype.update = function (observable, obj) {
            console.debug('List.update', observable, obj);
            this.setChanged();
            this.notifyObservers(obj);
        };
        List.prototype.fromJson = function (jsonArray) {
            this.clear();
            for (var i = 0; i < jsonArray.length; i++) {
                var map = new duice.Map(jsonArray[i]);
                map.disable = this.disable;
                map.readonly = clone(this.readonly);
                map.onBeforeChange(this.on.beforeChange);
                map.onAfterChange(this.on.afterChange);
                map.addObserver(this);
                this.data.push(map);
            }
            this.originData = JSON.stringify(this.toJson());
            this.index = -1;
            this.setChanged();
            this.notifyObservers(this);
        };
        /**
         * toJson
         */
        List.prototype.toJson = function () {
            var jsonArray = new Array();
            for (var i = 0; i < this.data.length; i++) {
                jsonArray.push(this.data[i].toJson());
            }
            return jsonArray;
        };
        /**
         * Clears data
         */
        List.prototype.clear = function () {
            for (var i = 0, size = this.data.length; i < size; i++) {
                this.data[i].removeObserver(this);
            }
            this.data = new Array();
            this.index = -1;
            this.setChanged();
            this.notifyObservers(this);
        };
        /**
         * Returns if changed
         */
        List.prototype.isDirty = function () {
            if (JSON.stringify(this.toJson()) === this.originData) {
                return false;
            }
            else {
                return true;
            }
        };
        /**
         * Resets data from original data.
         */
        List.prototype.reset = function () {
            var originJson = JSON.parse(this.originData);
            this.fromJson(originJson);
        };
        /**
         * Sets index.
         * @param index
         */
        List.prototype.setIndex = function (index) {
            // calls beforeChangeIndex 
            if (this.on.beforeChangeIndex) {
                if (this.on.beforeChangeIndex.call(this, index) === false) {
                    return false;
                }
            }
            // changes index
            this.index = index;
            this.setChanged();
            this.notifyObservers(this);
            // calls 
            if (this.on.afterChangeIndex) {
                this.on.afterChangeIndex.call(this, index);
            }
            // returns true
            return true;
        };
        List.prototype.getIndex = function () {
            return this.index;
        };
        List.prototype.clearIndex = function () {
            this.index = -1;
            this.setChanged();
            this.notifyObservers(this);
        };
        List.prototype.getSize = function () {
            return this.data.length;
        };
        List.prototype.get = function (index) {
            return this.data[index];
        };
        List.prototype.add = function (map) {
            map.disable = this.disable;
            map.readonly = clone(this.readonly);
            map.onBeforeChange(this.on.beforeChange);
            map.onAfterChange(this.on.afterChange);
            map.addObserver(this);
            this.data.push(map);
            this.index = this.getSize() - 1;
            this.setChanged();
            this.notifyObservers(this);
        };
        List.prototype.insert = function (index, map) {
            if (0 <= index && index < this.data.length) {
                map.disable = this.disable;
                map.readonly = clone(this.readonly);
                map.onBeforeChange(this.on.beforeChange);
                map.onAfterChange(this.on.afterChange);
                map.addObserver(this);
                this.data.splice(index, 0, map);
                this.index = index;
                this.setChanged();
                this.notifyObservers(this);
            }
        };
        List.prototype.remove = function (index) {
            if (0 <= index && index < this.data.length) {
                this.data.splice(index, 1);
                this.index = Math.min(this.index, this.data.length - 1);
                this.setChanged();
                this.notifyObservers(this);
            }
        };
        List.prototype.move = function (fromIndex, toIndex) {
            this.index = fromIndex;
            this.data.splice(toIndex, 0, this.data.splice(fromIndex, 1)[0]);
            this.index = toIndex;
            this.setChanged();
            this.notifyObservers(this);
        };
        List.prototype.indexOf = function (handler) {
            for (var i = 0, size = this.data.length; i < size; i++) {
                if (handler.call(this, this.data[i]) === true) {
                    return i;
                }
            }
            return -1;
        };
        List.prototype.contains = function (handler) {
            if (this.indexOf(handler) > -1) {
                return true;
            }
            else {
                return false;
            }
        };
        List.prototype.forEach = function (handler) {
            for (var i = 0, size = this.data.length; i < size; i++) {
                if (handler.call(this, this.data[i], i) === false) {
                    break;
                }
            }
        };
        List.prototype.sort = function (name, ascending) {
            this.data.sort(function (a, b) {
                var aValue = a.get(name);
                var bValue = b.get(name);
                return (aValue > bValue ? 1 : aValue < bValue ? -1 : 0) * (ascending == false ? -1 : 1);
            });
            this.setChanged();
            this.notifyObservers(this);
        };
        List.prototype.setDisable = function (disable) {
            this.data.forEach(function (map) {
                map.setDisable(disable);
            });
            _super.prototype.setDisable.call(this, disable);
        };
        List.prototype.setReadonly = function (name, readonly) {
            this.data.forEach(function (map) {
                map.setReadonly(name, readonly);
            });
            _super.prototype.setReadonly.call(this, name, readonly);
        };
        List.prototype.onBeforeChangeIndex = function (listener) {
            this.on.beforeChangeIndex = listener;
        };
        List.prototype.onAfterChangeIndex = function (listener) {
            this.on.afterChangeIndex = listener;
        };
        List.prototype.onBeforeChange = function (listener) {
            this.on.beforeChange = listener;
        };
        List.prototype.onAfterChange = function (listener) {
            this.on.afterChange = listener;
        };
        return List;
    }(DataObject));
    duice.List = List;
    /**
     * duice.UiComponent
     */
    var UiComponent = /** @class */ (function (_super) {
        __extends(UiComponent, _super);
        function UiComponent(element) {
            var _this = _super.call(this) || this;
            _this.element = element;
            _this.element.dataset.duiceId = generateUuid();
            return _this;
        }
        UiComponent.prototype.isAvailable = function () {
            // contains method not support(IE)
            if (!Node.prototype.contains) {
                Node.prototype.contains = function (el) {
                    while (el = el.parentNode) {
                        if (el === this)
                            return true;
                    }
                    return false;
                };
            }
            // checks contains element
            if (document.contains(this.element)) {
                return true;
            }
            else {
                return false;
            }
        };
        /**
         * Sets element visible
         * @param visible
         */
        UiComponent.prototype.setVisible = function (visible) {
            this.element.style.display = (visible ? '' : 'none');
        };
        return UiComponent;
    }(Observable));
    /**
     * duice.MapUiComponent
     */
    var MapUiComponent = /** @class */ (function (_super) {
        __extends(MapUiComponent, _super);
        function MapUiComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MapUiComponent.prototype.bind = function (map, name) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            this.map = map;
            this.name = name;
            this.map.addObserver(this);
            this.addObserver(this.map);
            this.update(this.map, this.map);
        };
        MapUiComponent.prototype.getMap = function () {
            return this.map;
        };
        MapUiComponent.prototype.getName = function () {
            return this.name;
        };
        return MapUiComponent;
    }(UiComponent));
    duice.MapUiComponent = MapUiComponent;
    /**
     * duice.ListUiComponent
     */
    var ListUiComponent = /** @class */ (function (_super) {
        __extends(ListUiComponent, _super);
        function ListUiComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ListUiComponent.prototype.bind = function (list, item) {
            this.list = list;
            this.item = item;
            this.list.addObserver(this);
            this.addObserver(this.list);
            this.update(this.list, this.list);
        };
        ListUiComponent.prototype.getList = function () {
            return this.list;
        };
        ListUiComponent.prototype.getItem = function () {
            return this.item;
        };
        return ListUiComponent;
    }(UiComponent));
    duice.ListUiComponent = ListUiComponent;
    /**
     * duice.ui.UiComponentFactory
     */
    var UiComponentFactory = /** @class */ (function () {
        function UiComponentFactory(context) {
            if (context) {
                this.setContext(context);
            }
        }
        UiComponentFactory.prototype.setContext = function (context) {
            this.context = context;
        };
        UiComponentFactory.prototype.getContext = function () {
            return this.context;
        };
        UiComponentFactory.prototype.getContextProperty = function (name) {
            if (this.context[name]) {
                return this.context[name];
            }
            if (window.hasOwnProperty(name)) {
                return window[name];
            }
            try {
                return eval.call(this.context, name);
            }
            catch (e) {
                console.error(e, this.context, name);
                throw e;
            }
        };
        return UiComponentFactory;
    }());
    var MapUiComponentFactory = /** @class */ (function (_super) {
        __extends(MapUiComponentFactory, _super);
        function MapUiComponentFactory() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return MapUiComponentFactory;
    }(UiComponentFactory));
    duice.MapUiComponentFactory = MapUiComponentFactory;
    var ListUiComponentFactory = /** @class */ (function (_super) {
        __extends(ListUiComponentFactory, _super);
        function ListUiComponentFactory() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ListUiComponentFactory;
    }(UiComponentFactory));
    duice.ListUiComponentFactory = ListUiComponentFactory;
    /**
     * Generates random UUID value
     * @return  UUID string
     */
    function generateUuid() {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
    /**
     * Adds class
     */
    function addClassNameIfCssEnable(element, className) {
        if (duice.Configuration.cssEnable) {
            element.classList.add(className);
        }
    }
    /**
     * Checks mobile browser
     */
    function isMobile() {
        if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)) {
            return true;
        }
        else {
            return false;
        }
    }
    duice.isMobile = isMobile;
    /**
     * Returns Query Variables
     */
    function getQueryVariables() {
        var queryVariables = new Object();
        var queryString = window.location.search.substring(1);
        var vars = queryString.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            var key = decodeURIComponent(pair[0]);
            var value = decodeURIComponent(pair[1]);
            queryVariables[key] = value;
        }
        return queryVariables;
    }
    duice.getQueryVariables = getQueryVariables;
    /**
     * Check if value is empty
     * @param value
     * @return whether value is empty
     */
    function isEmpty(value) {
        if (value === undefined
            || value === null
            || value === '') {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Check if value is not empty
     * @param value
     * @return whether value is not empty
     */
    function isNotEmpty(value) {
        if (isEmpty(value)) {
            return false;
        }
        else {
            return true;
        }
    }
    /**
     * Checks if value is empty and return specified value as default
     * @param value to check
     * @param default value if value is empty
     */
    function defaultIfEmpty(value, defaultValue) {
        if (isEmpty(value) === true) {
            return defaultValue;
        }
        else {
            return value;
        }
    }
    /**
     * converts value to left-padded value
     * @param original value
     * @param length to pad
     * @param pading character
     * @return left-padded value
     */
    function lpad(value, length, padChar) {
        for (var i = 0, size = (length - value.length); i < size; i++) {
            value = padChar + value;
        }
        return value;
    }
    /**
     * converts value to right-padded value
     * @param original value
     * @param length to pad
     * @param pading character
     * @return right-padded string
     */
    function rpad(value, length, padChar) {
        for (var i = 0, size = (length - value.length); i < size; i++) {
            value = value + padChar;
        }
        return value;
    }
    /**
     * Executes custom expression in HTML element and returns.
     * @param element
     * @param $context
     * @return converted HTML element
     */
    function executeExpression(element, $context) {
        var string = element.outerHTML;
        string = string.replace(/\[\[([\s\S]*?)\]\]/mgi, function (match, command) {
            try {
                command = command.replace('&amp;', '&');
                command = command.replace('&lt;', '<');
                command = command.replace('&gt;', '>');
                var result = eval(command);
                return result;
            }
            catch (e) {
                console.error(e, command);
                throw e;
            }
        });
        try {
            var template = document.createElement('template');
            template.innerHTML = string;
            return template.content.firstChild;
        }
        catch (e) {
            removeChildNodes(element);
            element.innerHTML = string;
            return element;
        }
    }
    /**
     * Escapes HTML tag from string value
     * @param value
     * @return escaped string value
     */
    function escapeHTML(value) {
        // checks value is valid.
        if (!value || typeof value !== 'string') {
            return value;
        }
        // replace tag
        var htmlMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        // replace and returns
        return value.replace(/[&<>"']/g, function (m) {
            return htmlMap[m];
        });
    }
    /**
     * Removes child elements from HTML element.
     * @param element
     */
    function removeChildNodes(element) {
        // Remove element nodes and prevent memory leaks
        var node, nodes = element.childNodes, i = 0;
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
     * Returns current upper window object.
     * @return window object
     */
    function getCurrentWindow() {
        if (window.frameElement) {
            return window.parent;
        }
        else {
            return window;
        }
    }
    /**
     * clones object
     * @param obj
     */
    function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    /**
     * Sets element position to be centered
     * @param element
     */
    function setPositionCentered(element) {
        var win = getCurrentWindow();
        var computedStyle = win.getComputedStyle(element);
        var computedWidth = parseInt(computedStyle.getPropertyValue('width').replace(/px/gi, ''));
        var computedHeight = parseInt(computedStyle.getPropertyValue('height').replace(/px/gi, ''));
        element.style.left = Math.max(0, win.innerWidth / 2 - computedWidth / 2) + win.scrollX + 'px';
        element.style.top = Math.max(0, win.innerHeight / 2 - computedHeight / 2) + win.scrollY + 'px';
    }
    /**
     * Returns position info of specified element
     * @param element
     */
    function getElementPosition(element) {
        var pos = ('absolute relative').indexOf(getComputedStyle(element).position) == -1;
        var rect1 = { top: element.offsetTop * pos, left: element.offsetLeft * pos };
        var rect2 = element.offsetParent ? getElementPosition(element.offsetParent) : { top: 0, left: 0 };
        return {
            top: rect1.top + rect2.top,
            left: rect1.left + rect2.left,
            width: element.offsetWidth,
            height: element.offsetHeight
        };
    }
    /**
     * Delays specified milliseconds and calls specified function
     * @param callback
     */
    function delayCall(millis, callback, $this) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        var interval = setInterval(function () {
            try {
                callback.call.apply(callback, __spreadArrays([$this], args));
            }
            catch (e) {
                throw e;
            }
            finally {
                clearInterval(interval);
            }
        }, millis);
    }
    duice.delayCall = delayCall;
    /**
     * Returns current max z-index value.
     * @return max z-index value
     */
    function getCurrentMaxZIndex() {
        var zIndex, z = 0, all = document.getElementsByTagName('*');
        for (var i = 0, n = all.length; i < n; i++) {
            zIndex = document.defaultView.getComputedStyle(all[i], null).getPropertyValue("z-index");
            zIndex = parseInt(zIndex, 10);
            z = (zIndex) ? Math.max(z, zIndex) : z;
        }
        return z;
    }
    /**
     * duice.StringFormat
     * @param string format
     */
    var StringFormat = /** @class */ (function () {
        /**
         * Constructor
         * @param pattern
         */
        function StringFormat(pattern) {
            if (pattern) {
                this.setPattern(pattern);
            }
        }
        /**
         * Sets format string
         * @param pattern
         */
        StringFormat.prototype.setPattern = function (pattern) {
            this.pattern = pattern;
        };
        /**
         * encode string as format
         * @param value
         */
        StringFormat.prototype.encode = function (value) {
            if (isEmpty(this.pattern)) {
                return value;
            }
            var encodedValue = '';
            var patternChars = this.pattern.split('');
            var valueChars = value.split('');
            var valueCharsPosition = 0;
            for (var i = 0, size = patternChars.length; i < size; i++) {
                var patternChar = patternChars[i];
                if (patternChar === '#') {
                    encodedValue += defaultIfEmpty(valueChars[valueCharsPosition++], '');
                }
                else {
                    encodedValue += patternChar;
                }
            }
            return encodedValue;
        };
        /**
         * decodes string as format
         * @param value
         */
        StringFormat.prototype.decode = function (value) {
            if (isEmpty(this.pattern)) {
                return value;
            }
            var decodedValue = '';
            var patternChars = this.pattern.split('');
            var valueChars = value.split('');
            var valueCharsPosition = 0;
            for (var i = 0, size = patternChars.length; i < size; i++) {
                var patternChar = patternChars[i];
                if (patternChar === '#') {
                    decodedValue += defaultIfEmpty(valueChars[valueCharsPosition++], '');
                }
                else {
                    valueCharsPosition++;
                }
            }
            return decodedValue;
        };
        return StringFormat;
    }());
    duice.StringFormat = StringFormat;
    /**
     * duice.NumberFormat
     * @param scale number
     */
    var NumberFormat = /** @class */ (function () {
        /**
         * Constructor
         * @param scale
         */
        function NumberFormat(scale) {
            this.scale = 0;
            if (scale) {
                this.setScale(scale);
            }
        }
        /**
         * Sets number format scale
         * @param scale
         */
        NumberFormat.prototype.setScale = function (scale) {
            this.scale = scale;
        };
        /**
         * Encodes number as format
         * @param number
         */
        NumberFormat.prototype.encode = function (number) {
            if (isEmpty(number) || isNaN(Number(number))) {
                return '';
            }
            number = Number(number);
            var string = String(number.toFixed(this.scale));
            var reg = /(^[+-]?\d+)(\d{3})/;
            while (reg.test(string)) {
                string = string.replace(reg, '$1' + ',' + '$2');
            }
            return string;
        };
        /**
         * Decodes formatted value as original value
         * @param string
         */
        NumberFormat.prototype.decode = function (string) {
            if (isEmpty(string)) {
                return null;
            }
            if (string.length === 1 && /[+-]/.test(string)) {
                string += '0';
            }
            string = string.replace(/\,/gi, '');
            if (isNaN(Number(string))) {
                throw 'NaN';
            }
            var number = Number(string);
            number = Number(number.toFixed(this.scale));
            return number;
        };
        return NumberFormat;
    }());
    duice.NumberFormat = NumberFormat;
    /**
     * duice.DateFormat
     */
    var DateFormat = /** @class */ (function () {
        /**
         * Constructor
         * @param pattern
         */
        function DateFormat(pattern) {
            this.patternRex = /yyyy|yy|MM|dd|HH|hh|mm|ss/gi;
            if (pattern) {
                this.setPattern(pattern);
            }
        }
        /**
         * Sets format string
         * @param pattern
         */
        DateFormat.prototype.setPattern = function (pattern) {
            this.pattern = pattern;
        };
        /**
         * Encodes date string
         * @param string
         */
        DateFormat.prototype.encode = function (string) {
            if (isEmpty(string)) {
                return '';
            }
            if (isEmpty(this.pattern)) {
                return new Date(string).toString();
            }
            var date = new Date(string);
            string = this.pattern.replace(this.patternRex, function ($1) {
                switch ($1) {
                    case "yyyy": return date.getFullYear();
                    case "yy": return lpad(String(date.getFullYear() % 1000), 2, '0');
                    case "MM": return lpad(String(date.getMonth() + 1), 2, '0');
                    case "dd": return lpad(String(date.getDate()), 2, '0');
                    case "HH": return lpad(String(date.getHours()), 2, '0');
                    case "hh": return lpad(String(date.getHours() <= 12 ? date.getHours() : date.getHours() % 12), 2, '0');
                    case "mm": return lpad(String(date.getMinutes()), 2, '0');
                    case "ss": return lpad(String(date.getSeconds()), 2, '0');
                    default: return $1;
                }
            });
            return string;
        };
        /**
         * Decodes formatted date string to ISO date string.
         * @param string
         */
        DateFormat.prototype.decode = function (string) {
            if (isEmpty(string)) {
                return null;
            }
            if (isEmpty(this.pattern)) {
                return new Date(string).toISOString();
            }
            var date = new Date(0, 0, 0, 0, 0, 0);
            var match;
            while ((match = this.patternRex.exec(this.pattern)) != null) {
                var formatString = match[0];
                var formatIndex = match.index;
                var formatLength = formatString.length;
                var matchValue = string.substr(formatIndex, formatLength);
                matchValue = rpad(matchValue, formatLength, '0');
                switch (formatString) {
                    case 'yyyy':
                        var fullYear = parseInt(matchValue);
                        date.setFullYear(fullYear);
                        break;
                    case 'yy':
                        var yyValue = parseInt(matchValue);
                        var yearPrefix = Math.floor(new Date().getFullYear() / 100);
                        var fullYear = yearPrefix * 100 + yyValue;
                        date.setFullYear(fullYear);
                        break;
                    case 'MM':
                        var monthValue = parseInt(matchValue);
                        date.setMonth(monthValue - 1);
                        break;
                    case 'dd':
                        var dateValue = parseInt(matchValue);
                        date.setDate(dateValue);
                        break;
                    case 'HH':
                        var hoursValue = parseInt(matchValue);
                        date.setHours(hoursValue);
                        break;
                    case 'hh':
                        var hoursValue = parseInt(matchValue);
                        date.setHours(hoursValue > 12 ? (hoursValue + 12) : hoursValue);
                        break;
                    case 'mm':
                        var minutesValue = parseInt(matchValue);
                        date.setMinutes(minutesValue);
                        break;
                    case 'ss':
                        var secondsValue = parseInt(matchValue);
                        date.setSeconds(secondsValue);
                        break;
                }
            }
            return date.toISOString();
        };
        return DateFormat;
    }());
    duice.DateFormat = DateFormat;
    /**
     * duice.ui.Blocker
     */
    var Blocker = /** @class */ (function () {
        function Blocker(element) {
            this.opacity = 0.2;
            this.element = element;
            this.div = document.createElement('div');
            this.div.classList.add('duice-blocker');
        }
        Blocker.prototype.setOpacity = function (opacity) {
            this.opacity = opacity;
        };
        Blocker.prototype.block = function () {
            // adjusting position
            this.div.style.position = 'fixed';
            this.div.style.zIndex = String(getCurrentMaxZIndex() + 1);
            this.div.style.background = 'rgba(0, 0, 0, ' + this.opacity + ')';
            this.takePosition();
            // adds events
            var $this = this;
            getCurrentWindow().addEventListener('scroll', function () {
                $this.takePosition();
            });
            // append
            this.element.appendChild(this.div);
        };
        Blocker.prototype.unblock = function () {
            this.element.removeChild(this.div);
        };
        Blocker.prototype.takePosition = function () {
            // full blocking in case of BODY
            if (this.element.tagName == 'BODY') {
                this.div.style.width = '100%';
                this.div.style.height = '100%';
                this.div.style.top = '0px';
                this.div.style.left = '0px';
            }
            // otherwise adjusting to parent element
            else {
                var boundingClientRect = this.element.getBoundingClientRect();
                var width = boundingClientRect.width;
                var height = boundingClientRect.height;
                var left = boundingClientRect.left;
                var top = boundingClientRect.top;
                this.div.style.width = width + "px";
                this.div.style.height = height + "px";
                this.div.style.top = top + 'px';
                this.div.style.left = left + 'px';
            }
        };
        Blocker.prototype.getBlockDiv = function () {
            return this.div;
        };
        return Blocker;
    }());
    duice.Blocker = Blocker;
    /**
     * duice.ui.Progress
     */
    var Progress = /** @class */ (function () {
        function Progress(element) {
            this.blocker = new Blocker(element);
            this.blocker.setOpacity(0.0);
        }
        Progress.prototype.start = function () {
            this.blocker.block();
            this.div = document.createElement('div');
            this.div.classList.add('duice-progress');
            this.blocker.getBlockDiv().appendChild(this.div);
        };
        Progress.prototype.stop = function () {
            this.blocker.getBlockDiv().removeChild(this.div);
            this.blocker.unblock();
        };
        return Progress;
    }());
    duice.Progress = Progress;
    /**
      * duice.ui.Modal
      */
    var Modal = /** @class */ (function () {
        function Modal() {
            this.on = {};
            var $this = this;
            this.container = document.createElement('div');
            this.container.classList.add('duice-modal');
            this.headerDiv = document.createElement('div');
            this.headerDiv.classList.add('duice-modal__headerDiv');
            this.container.appendChild(this.headerDiv);
            // drag
            this.headerDiv.style.cursor = 'move';
            this.headerDiv.onmousedown = function (ev) {
                var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                pos3 = ev.clientX;
                pos4 = ev.clientY;
                getCurrentWindow().document.onmouseup = function (ev) {
                    getCurrentWindow().document.onmousemove = null;
                    getCurrentWindow().document.onmouseup = null;
                };
                getCurrentWindow().document.onmousemove = function (ev) {
                    pos1 = pos3 - ev.clientX;
                    pos2 = pos4 - ev.clientY;
                    pos3 = ev.clientX;
                    pos4 = ev.clientY;
                    $this.container.style.left = ($this.container.offsetLeft - pos1) + 'px';
                    $this.container.style.top = ($this.container.offsetTop - pos2) + 'px';
                };
            };
            var titleIcon = document.createElement('span');
            titleIcon.classList.add('duice-modal__headerDiv-titleIcon');
            this.headerDiv.appendChild(titleIcon);
            var closeButton = document.createElement('span');
            closeButton.classList.add('duice-modal__headerDiv-closeButton');
            closeButton.addEventListener('click', function (event) {
                $this.close();
            });
            this.headerDiv.appendChild(closeButton);
            // creates body
            this.bodyDiv = document.createElement('div');
            this.container.appendChild(this.bodyDiv);
            // adds blocker
            this.blocker = new Blocker(getCurrentWindow().document.body);
        }
        Modal.prototype.addContent = function (content) {
            this.bodyDiv.appendChild(content);
        };
        Modal.prototype.removeContent = function (content) {
            this.bodyDiv.removeChild(content);
        };
        Modal.prototype.createButton = function (type) {
            var button = document.createElement('button');
            button.classList.add('duice-modal__button--' + type);
            return button;
        };
        Modal.prototype.show = function () {
            // block
            this.blocker.block();
            // opens modal
            this.container.style.display = 'block';
            this.container.style.position = 'absolute';
            this.container.style.zIndex = String(getCurrentMaxZIndex() + 1);
            getCurrentWindow().document.body.appendChild(this.container);
            setPositionCentered(this.container);
        };
        Modal.prototype.hide = function () {
            // closes modal
            this.container.style.display = 'none';
            getCurrentWindow().document.body.removeChild(this.container);
            // unblock
            this.blocker.unblock();
        };
        Modal.prototype.open = function () {
            var _a;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (this.on.beforeOpen) {
                if ((_a = this.on.beforeOpen).call.apply(_a, __spreadArrays([this], args)) === false) {
                    return false;
                }
            }
            this.show();
            if (this.on.afterOpen) {
                delayCall.apply(void 0, __spreadArrays([200, this.on.afterOpen, this], args));
            }
            return true;
        };
        Modal.prototype.onBeforeOpen = function (listener) {
            this.on.beforeOpen = listener;
            return this;
        };
        Modal.prototype.onAfterOpen = function (listener) {
            this.on.afterOpen = listener;
            return this;
        };
        Modal.prototype.close = function () {
            var _a;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (this.on.beforeClose) {
                if ((_a = this.on.beforeClose).call.apply(_a, __spreadArrays([this], args)) === false) {
                    return false;
                }
            }
            this.hide();
            if (this.on.afterClose) {
                delayCall.apply(void 0, __spreadArrays([200, this.on.afterClose, this], args));
            }
            return true;
        };
        Modal.prototype.onBeforeClose = function (listener) {
            this.on.beforeClose = listener;
            return this;
        };
        Modal.prototype.onAfterClose = function (listener) {
            this.on.afterClose = listener;
            return this;
        };
        Modal.prototype.confirm = function () {
            var _a;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (this.on.beforeConfirm) {
                if ((_a = this.on.beforeConfirm).call.apply(_a, __spreadArrays([this], args)) === false) {
                    return false;
                }
            }
            this.hide();
            if (this.on.afterConfirm) {
                delayCall.apply(void 0, __spreadArrays([200, this.on.afterConfirm, this], args));
            }
            return true;
        };
        Modal.prototype.onBeforeConfirm = function (listener) {
            this.on.beforeConfirm = listener;
            return this;
        };
        Modal.prototype.onAfterConfirm = function (listener) {
            this.on.afterConfirm = listener;
            return this;
        };
        return Modal;
    }());
    duice.Modal = Modal;
    /**
     * duice.ui.Alert
     */
    var Alert = /** @class */ (function (_super) {
        __extends(Alert, _super);
        function Alert(message) {
            var _this = _super.call(this) || this;
            _this.message = message;
            var $this = _this;
            _this.iconDiv = document.createElement('div');
            _this.iconDiv.classList.add('duice-alert__iconDiv');
            _this.messageDiv = document.createElement('div');
            _this.messageDiv.classList.add('duice-alert__messageDiv');
            _this.messageDiv.appendChild(document.createTextNode(_this.message));
            _this.buttonDiv = document.createElement('div');
            _this.buttonDiv.classList.add('duice-alert__buttonDiv');
            _this.confirmButton = _this.createButton('confirm');
            _this.confirmButton.addEventListener('click', function (event) {
                $this.close();
            });
            _this.buttonDiv.appendChild(_this.confirmButton);
            // appends parts to bodyDiv
            _this.addContent(_this.iconDiv);
            _this.addContent(_this.messageDiv);
            _this.addContent(_this.buttonDiv);
            return _this;
        }
        Alert.prototype.open = function () {
            if (_super.prototype.open.call(this)) {
                this.confirmButton.focus();
                return true;
            }
            else {
                return false;
            }
        };
        return Alert;
    }(Modal));
    duice.Alert = Alert;
    /**
     * duice.ui.Confirm
     */
    var Confirm = /** @class */ (function (_super) {
        __extends(Confirm, _super);
        function Confirm(message) {
            var _this = _super.call(this) || this;
            _this.message = message;
            var $this = _this;
            _this.iconDiv = document.createElement('div');
            _this.iconDiv.classList.add('duice-confirm__iconDiv');
            _this.messageDiv = document.createElement('div');
            _this.messageDiv.classList.add('duice-confirm__messageDiv');
            _this.messageDiv.appendChild(document.createTextNode(_this.message));
            _this.buttonDiv = document.createElement('div');
            _this.buttonDiv.classList.add('duice-confirm__buttonDiv');
            // confirm button
            _this.confirmButton = _this.createButton('confirm');
            _this.confirmButton.addEventListener('click', function (event) {
                $this.confirm();
            });
            _this.buttonDiv.appendChild(_this.confirmButton);
            // cancel button
            _this.cancelButton = _this.createButton('cancel');
            _this.cancelButton.addEventListener('click', function (event) {
                $this.close();
            });
            _this.buttonDiv.appendChild(_this.cancelButton);
            // appends parts to bodyDiv
            _this.addContent(_this.iconDiv);
            _this.addContent(_this.messageDiv);
            _this.addContent(_this.buttonDiv);
            return _this;
        }
        Confirm.prototype.open = function () {
            if (_super.prototype.open.call(this)) {
                this.confirmButton.focus();
            }
            else {
                return false;
            }
        };
        return Confirm;
    }(Modal));
    duice.Confirm = Confirm;
    /**
     * duice.ui.Prompt
     */
    var Prompt = /** @class */ (function (_super) {
        __extends(Prompt, _super);
        function Prompt(message) {
            var _this = _super.call(this) || this;
            _this.message = message;
            var $this = _this;
            _this.iconDiv = document.createElement('div');
            _this.iconDiv.classList.add('duice-prompt__iconDiv');
            _this.messageDiv = document.createElement('div');
            _this.messageDiv.classList.add('duice-prompt__messageDiv');
            _this.messageDiv.appendChild(document.createTextNode(_this.message));
            _this.inputDiv = document.createElement('div');
            _this.inputDiv.classList.add('duice-prompt__inputDiv');
            _this.input = document.createElement('input');
            _this.input.classList.add('duice-prompt__inputDiv-input');
            _this.inputDiv.appendChild(_this.input);
            _this.buttonDiv = document.createElement('div');
            _this.buttonDiv.classList.add('duice-prompt__buttonDiv');
            // confirm button
            _this.confirmButton = _this.createButton('confirm');
            _this.confirmButton.addEventListener('click', function (event) {
                $this.confirm();
            });
            _this.buttonDiv.appendChild(_this.confirmButton);
            // cancel button
            _this.cancelButton = _this.createButton('cancel');
            _this.cancelButton.addEventListener('click', function (event) {
                $this.close();
            });
            _this.buttonDiv.appendChild(_this.cancelButton);
            // appends parts to bodyDiv
            _this.addContent(_this.iconDiv);
            _this.addContent(_this.messageDiv);
            _this.addContent(_this.inputDiv);
            _this.addContent(_this.buttonDiv);
            return _this;
        }
        Prompt.prototype.open = function () {
            if (_super.prototype.open.call(this)) {
                this.input.focus();
                return true;
            }
            else {
                return false;
            }
        };
        Prompt.prototype.getValue = function () {
            return this.input.value;
        };
        return Prompt;
    }(Modal));
    duice.Prompt = Prompt;
    /**
     * duice.ui.Dialog
     * @param dialog
     */
    var Dialog = /** @class */ (function (_super) {
        __extends(Dialog, _super);
        function Dialog(dialog) {
            var _this = _super.call(this) || this;
            _this.dialog = dialog;
            _this.dialog.classList.add('duice-dialog');
            _this.parentNode = _this.dialog.parentNode;
            return _this;
        }
        Dialog.prototype.open = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.dialog.style.display = 'block';
            this.addContent(this.dialog);
            // opens dialog
            if (_super.prototype.open.apply(this, args)) {
                return true;
            }
            else {
                this.dialog.style.display = 'none';
                this.parentNode.appendChild(this.dialog);
                return false;
            }
        };
        Dialog.prototype.close = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (_super.prototype.close.apply(this, args)) {
                this.dialog.style.display = 'none';
                this.parentNode.appendChild(this.dialog);
                return true;
            }
            else {
                return false;
            }
        };
        Dialog.prototype.confirm = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (_super.prototype.confirm.apply(this, args)) {
                this.dialog.style.display = 'none';
                this.parentNode.appendChild(this.dialog);
                return true;
            }
            else {
                return false;
            }
        };
        return Dialog;
    }(Modal));
    duice.Dialog = Dialog;
    /**
     * duice.ui
     */
    var ui;
    (function (ui) {
        /**
         * duice.ui.ScriptletFactory
         */
        var ScriptletFactory = /** @class */ (function (_super) {
            __extends(ScriptletFactory, _super);
            function ScriptletFactory() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ScriptletFactory.prototype.getInstance = function (element) {
                var scriptlet = new Scriptlet(element);
                var context;
                if (this.getContext() !== window) {
                    context = this.getContext();
                }
                else {
                    context = {};
                }
                if (element.dataset.duiceBind) {
                    var bind = element.dataset.duiceBind.split(',');
                    var $this = this;
                    bind.forEach(function (name) {
                        context[name] = $this.getContextProperty(name);
                    });
                }
                scriptlet.bind(context);
                return scriptlet;
            };
            return ScriptletFactory;
        }(MapUiComponentFactory));
        ui.ScriptletFactory = ScriptletFactory;
        /**
         * duice.ui.Scriptlet
         */
        var Scriptlet = /** @class */ (function (_super) {
            __extends(Scriptlet, _super);
            function Scriptlet(element) {
                var _this = _super.call(this, element) || this;
                _this.expression = element.innerHTML;
                _this.element.classList.add('duice-ui-scriptlet');
                return _this;
            }
            ;
            Scriptlet.prototype.bind = function (context) {
                this.context = context;
                for (var name in this.context) {
                    var obj = this.context[name];
                    if (typeof obj === 'object'
                        && obj instanceof duice.DataObject) {
                        obj.addObserver(this);
                        this.addObserver(obj);
                        this.update(obj, obj);
                    }
                }
            };
            Scriptlet.prototype.update = function (dataObject, obj) {
                var func = Function('$context', '"use strict";' + this.expression + '');
                var result = func(this.context);
                this.element.innerHTML = '';
                this.element.appendChild(document.createTextNode(result));
                this.element.style.display = 'inline-block';
            };
            Scriptlet.prototype.getValue = function () {
                return null;
            };
            return Scriptlet;
        }(MapUiComponent));
        ui.Scriptlet = Scriptlet;
        /**
         * duice.ui.SpanFactory
         */
        var SpanFactory = /** @class */ (function (_super) {
            __extends(SpanFactory, _super);
            function SpanFactory() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SpanFactory.prototype.getInstance = function (element) {
                var span = new Span(element);
                // sets format
                if (element.dataset.duiceFormat) {
                    var duiceFormat = element.dataset.duiceFormat.split(',');
                    var type = duiceFormat[0];
                    var format;
                    switch (type) {
                        case 'string':
                            format = new StringFormat(duiceFormat[1]);
                            break;
                        case 'number':
                            format = new NumberFormat(parseInt(duiceFormat[1]));
                            break;
                        case 'date':
                            format = new DateFormat(duiceFormat[1]);
                            break;
                        default:
                            throw 'format type[' + type + '] is invalid';
                    }
                    span.setFormat(format);
                }
                // binds
                var bind = element.dataset.duiceBind.split(',');
                span.bind(this.getContextProperty(bind[0]), bind[1]);
                return span;
            };
            return SpanFactory;
        }(MapUiComponentFactory));
        ui.SpanFactory = SpanFactory;
        /**
         * duice.ui.Span
         */
        var Span = /** @class */ (function (_super) {
            __extends(Span, _super);
            function Span(span) {
                var _this = _super.call(this, span) || this;
                _this.span = span;
                _this.span.classList.add('duice-ui-span');
                return _this;
            }
            Span.prototype.setFormat = function (format) {
                this.format = format;
            };
            Span.prototype.update = function (map, obj) {
                removeChildNodes(this.span);
                var value = map.get(this.name);
                value = defaultIfEmpty(value, '');
                if (this.format) {
                    value = this.format.encode(value);
                }
                this.span.appendChild(document.createTextNode(value));
            };
            Span.prototype.getValue = function () {
                var value = this.span.innerHTML;
                value = defaultIfEmpty(value, null);
                if (this.format) {
                    value = this.format.decode(value);
                }
                return value;
            };
            return Span;
        }(MapUiComponent));
        ui.Span = Span;
        /**
         * duice.ui.InputFactory
         */
        var InputFactory = /** @class */ (function (_super) {
            __extends(InputFactory, _super);
            function InputFactory() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            InputFactory.prototype.getInstance = function (element) {
                var input;
                switch (element.getAttribute('type')) {
                    case 'text':
                        input = new TextInput(element);
                        if (element.dataset.duiceFormat) {
                            input.setPattern(element.dataset.duiceFormat);
                        }
                        break;
                    case 'number':
                        input = new NumberInput(element);
                        if (element.dataset.duiceFormat) {
                            input.setScale(parseInt(element.dataset.duiceFormat));
                        }
                        break;
                    case 'checkbox':
                        input = new CheckboxInput(element);
                        break;
                    case 'radio':
                        input = new RadioInput(element);
                        break;
                    case 'datetime-local':
                    case 'date':
                        input = new DateInput(element);
                        if (element.dataset.duiceFormat) {
                            input.setPattern(element.dataset.duiceFormat);
                        }
                        break;
                    default:
                        input = new GenericInput(element);
                }
                // bind
                var bind = element.dataset.duiceBind.split(',');
                input.bind(this.getContextProperty(bind[0]), bind[1]);
                return input;
            };
            return InputFactory;
        }(MapUiComponentFactory));
        ui.InputFactory = InputFactory;
        /**
         * duice.ui.Input
         */
        var Input = /** @class */ (function (_super) {
            __extends(Input, _super);
            function Input(input) {
                var _this = _super.call(this, input) || this;
                _this.input = input;
                var $this = _this;
                _this.input.addEventListener('keypress', function (event) {
                    var inputChars = String.fromCharCode(event.keyCode);
                    var newValue = this.value.substr(0, this.selectionStart) + inputChars + this.value.substr(this.selectionEnd);
                    if ($this.validate(newValue) === false) {
                        event.preventDefault();
                    }
                }, true);
                _this.input.addEventListener('paste', function (event) {
                    var inputChars = event.clipboardData.getData('text/plain');
                    var newValue = this.value.substr(0, this.selectionStart) + inputChars + this.value.substr(this.selectionEnd);
                    if ($this.validate(newValue) === false) {
                        event.preventDefault();
                    }
                }, true);
                _this.input.addEventListener('change', function (event) {
                    $this.setChanged();
                    $this.notifyObservers(this);
                }, true);
                return _this;
            }
            Input.prototype.validate = function (value) {
                return true;
            };
            Input.prototype.setDisable = function (disable) {
                if (disable) {
                    this.input.setAttribute('disabled', 'true');
                }
                else {
                    this.input.removeAttribute('disabled');
                }
            };
            Input.prototype.setReadonly = function (readonly) {
                if (readonly === true) {
                    this.input.setAttribute('readonly', 'readonly');
                }
                else {
                    this.input.removeAttribute('readonly');
                }
            };
            return Input;
        }(MapUiComponent));
        ui.Input = Input;
        /**
         * duice.ui.GenericInput
         */
        var GenericInput = /** @class */ (function (_super) {
            __extends(GenericInput, _super);
            function GenericInput(input) {
                var _this = _super.call(this, input) || this;
                addClassNameIfCssEnable(_this.input, 'duice-ui-genericInput');
                return _this;
            }
            GenericInput.prototype.update = function (map, obj) {
                var value = map.get(this.getName());
                this.input.value = defaultIfEmpty(value, '');
                this.setDisable(map.isDisable());
                this.setReadonly(map.isReadonly(this.getName()));
            };
            GenericInput.prototype.getValue = function () {
                var value = this.input.value;
                if (isEmpty(value)) {
                    return null;
                }
                else {
                    if (isNaN(value)) {
                        return String(value);
                    }
                    else {
                        return Number(value);
                    }
                }
            };
            return GenericInput;
        }(Input));
        ui.GenericInput = GenericInput;
        /**
         * duice.ui.TextInput
         */
        var TextInput = /** @class */ (function (_super) {
            __extends(TextInput, _super);
            function TextInput(input) {
                var _this = _super.call(this, input) || this;
                addClassNameIfCssEnable(_this.input, 'duice-ui-textInput');
                _this.format = new StringFormat();
                return _this;
            }
            TextInput.prototype.setPattern = function (format) {
                this.format.setPattern(format);
            };
            TextInput.prototype.update = function (map, obj) {
                var value = map.get(this.getName());
                value = defaultIfEmpty(value, '');
                value = this.format.encode(value);
                this.input.value = value;
                this.setDisable(map.isDisable());
                this.setReadonly(map.isReadonly(this.getName()));
            };
            TextInput.prototype.getValue = function () {
                var value = this.input.value;
                value = defaultIfEmpty(value, null);
                value = this.format.decode(value);
                return value;
            };
            TextInput.prototype.validate = function (value) {
                try {
                    this.format.decode(value);
                }
                catch (e) {
                    return false;
                }
                return true;
            };
            return TextInput;
        }(Input));
        ui.TextInput = TextInput;
        /**
         * duice.ui.NumberInput
         */
        var NumberInput = /** @class */ (function (_super) {
            __extends(NumberInput, _super);
            function NumberInput(input) {
                var _this = _super.call(this, input) || this;
                addClassNameIfCssEnable(_this.input, 'duice-ui-numberInput');
                _this.input.setAttribute('type', 'text');
                _this.format = new NumberFormat();
                return _this;
            }
            NumberInput.prototype.setScale = function (scale) {
                this.format.setScale(scale);
            };
            NumberInput.prototype.update = function (map, obj) {
                var value = map.get(this.getName());
                value = this.format.encode(value);
                this.input.value = value;
                this.setDisable(map.isDisable());
                this.setReadonly(map.isReadonly(this.getName()));
            };
            NumberInput.prototype.getValue = function () {
                var value = this.input.value;
                value = this.format.decode(value);
                return value;
            };
            NumberInput.prototype.validate = function (value) {
                try {
                    this.format.decode(value);
                }
                catch (e) {
                    return false;
                }
                return true;
            };
            return NumberInput;
        }(Input));
        ui.NumberInput = NumberInput;
        /**
         * duice.ui.CheckboxInput
         */
        var CheckboxInput = /** @class */ (function (_super) {
            __extends(CheckboxInput, _super);
            function CheckboxInput(input) {
                var _this = _super.call(this, input) || this;
                addClassNameIfCssEnable(_this.input, 'duice-ui-checkboxInput');
                // stop click event propagation
                _this.input.addEventListener('click', function (event) {
                    event.stopPropagation();
                }, true);
                return _this;
            }
            CheckboxInput.prototype.update = function (map, obj) {
                var value = map.get(this.getName());
                if (value === true) {
                    this.input.checked = true;
                }
                else {
                    this.input.checked = false;
                }
                this.setDisable(map.isDisable());
                this.setReadonly(map.isReadonly(this.getName()));
            };
            CheckboxInput.prototype.getValue = function () {
                return this.input.checked;
            };
            CheckboxInput.prototype.setReadonly = function (readonly) {
                if (readonly) {
                    this.input.style.pointerEvents = 'none';
                }
                else {
                    this.input.style.pointerEvents = '';
                }
            };
            return CheckboxInput;
        }(Input));
        ui.CheckboxInput = CheckboxInput;
        /**
         * duice.ui.RadioInput
         */
        var RadioInput = /** @class */ (function (_super) {
            __extends(RadioInput, _super);
            function RadioInput(input) {
                var _this = _super.call(this, input) || this;
                addClassNameIfCssEnable(_this.input, 'duice-ui-radioInput');
                return _this;
            }
            RadioInput.prototype.update = function (map, obj) {
                var value = map.get(this.getName());
                if (value === this.input.value) {
                    this.input.checked = true;
                }
                else {
                    this.input.checked = false;
                }
                this.setDisable(map.isDisable());
                this.setReadonly(map.isReadonly(this.getName()));
            };
            RadioInput.prototype.getValue = function () {
                return this.input.value;
            };
            RadioInput.prototype.setReadonly = function (readonly) {
                if (readonly) {
                    this.input.style.pointerEvents = 'none';
                }
                else {
                    this.input.style.pointerEvents = '';
                }
            };
            return RadioInput;
        }(Input));
        ui.RadioInput = RadioInput;
        /**
         * duice.ui.DatetimeInput
         */
        var DateInput = /** @class */ (function (_super) {
            __extends(DateInput, _super);
            function DateInput(input) {
                var _this = _super.call(this, input) || this;
                _this.readonly = false;
                _this.type = _this.input.getAttribute('type').toLowerCase();
                _this.input.setAttribute('type', 'text');
                addClassNameIfCssEnable(_this.input, 'duice-ui-dateInput');
                // adds click event listener
                var $this = _this;
                _this.input.addEventListener('click', function (event) {
                    if ($this.readonly !== true) {
                        $this.openPicker();
                    }
                }, true);
                // sets default format
                _this.format = new DateFormat();
                if (_this.type === 'date') {
                    _this.format.setPattern('yyyy-MM-dd');
                }
                else {
                    _this.format.setPattern('yyyy-MM-dd HH:mm:ss');
                }
                return _this;
            }
            DateInput.prototype.setPattern = function (format) {
                this.format.setPattern(format);
            };
            DateInput.prototype.update = function (map, obj) {
                var value = map.get(this.getName());
                value = defaultIfEmpty(value, '');
                value = this.format.encode(value);
                this.input.value = value;
                this.setDisable(map.isDisable());
                this.setReadonly(map.isReadonly(this.getName()));
            };
            DateInput.prototype.getValue = function () {
                var value = this.input.value;
                value = defaultIfEmpty(value, null);
                value = this.format.decode(value);
                if (this.type === 'date') {
                    value = new DateFormat('yyyy-MM-dd').encode(new Date(value).toISOString());
                }
                return value;
            };
            DateInput.prototype.validate = function (value) {
                try {
                    var s = this.format.decode(value);
                }
                catch (e) {
                    return false;
                }
                return true;
            };
            DateInput.prototype.setReadonly = function (readonly) {
                this.readonly = readonly;
                _super.prototype.setReadonly.call(this, readonly);
            };
            DateInput.prototype.openPicker = function () {
                // checks pickerDiv is open.
                if (this.pickerDiv) {
                    return;
                }
                var $this = this;
                this.pickerDiv = document.createElement('div');
                this.pickerDiv.classList.add('duice-ui-dateInput__pickerDiv');
                // parses parts
                var date;
                if (isEmpty(this.getValue)) {
                    date = new Date();
                }
                else {
                    date = new Date(this.getValue());
                }
                var yyyy = date.getFullYear();
                var mm = date.getMonth();
                var dd = date.getDate();
                var hh = date.getHours();
                var mi = date.getMinutes();
                var ss = date.getSeconds();
                // click event listener
                this.clickListener = function (event) {
                    if (!$this.input.contains(event.target) && !$this.pickerDiv.contains(event.target)) {
                        $this.closePicker();
                    }
                };
                window.addEventListener('click', this.clickListener);
                // header
                var headerDiv = document.createElement('div');
                headerDiv.classList.add('duice-ui-dateInput__pickerDiv-headerDiv');
                this.pickerDiv.appendChild(headerDiv);
                // titleIcon
                var titleSpan = document.createElement('span');
                titleSpan.classList.add('duice-ui-dateInput__pickerDiv-headerDiv-titleSpan');
                headerDiv.appendChild(titleSpan);
                // closeButton
                var closeButton = document.createElement('button');
                closeButton.classList.add('duice-ui-dateInput__pickerDiv-headerDiv-closeButton');
                headerDiv.appendChild(closeButton);
                closeButton.addEventListener('click', function (event) {
                    $this.closePicker();
                });
                // bodyDiv
                var bodyDiv = document.createElement('div');
                bodyDiv.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv');
                this.pickerDiv.appendChild(bodyDiv);
                // daySelector
                var dateDiv = document.createElement('div');
                dateDiv.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-dateDiv');
                bodyDiv.appendChild(dateDiv);
                // previous month button
                var prevMonthButton = document.createElement('button');
                prevMonthButton.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-dateDiv-prevMonthButton');
                dateDiv.appendChild(prevMonthButton);
                prevMonthButton.addEventListener('click', function (event) {
                    date.setMonth(date.getMonth() - 1);
                    updateDate(date);
                });
                // todayButton
                var todayButton = document.createElement('button');
                todayButton.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-dateDiv-todayButton');
                dateDiv.appendChild(todayButton);
                todayButton.addEventListener('click', function (event) {
                    var newDate = new Date();
                    date.setFullYear(newDate.getFullYear());
                    date.setMonth(newDate.getMonth());
                    date.setDate(newDate.getDate());
                    updateDate(date);
                });
                // year select
                var yearSelect = document.createElement('select');
                yearSelect.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-dateDiv-yearSelect');
                dateDiv.appendChild(yearSelect);
                yearSelect.addEventListener('change', function (event) {
                    date.setFullYear(parseInt(this.value));
                    updateDate(date);
                });
                // divider
                dateDiv.appendChild(document.createTextNode('-'));
                // month select
                var monthSelect = document.createElement('select');
                monthSelect.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-dateDiv-monthSelect');
                dateDiv.appendChild(monthSelect);
                for (var i = 0, end = 11; i <= end; i++) {
                    var option = document.createElement('option');
                    option.value = String(i);
                    option.text = String(i + 1);
                    monthSelect.appendChild(option);
                }
                monthSelect.addEventListener('change', function (event) {
                    date.setMonth(parseInt(this.value));
                    updateDate(date);
                });
                // next month button
                var nextMonthButton = document.createElement('button');
                nextMonthButton.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-dateDiv-nextMonthButton');
                dateDiv.appendChild(nextMonthButton);
                nextMonthButton.addEventListener('click', function (event) {
                    date.setMonth(date.getMonth() + 1);
                    updateDate(date);
                });
                // calendar table
                var calendarTable = document.createElement('table');
                calendarTable.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-calendarTable');
                bodyDiv.appendChild(calendarTable);
                var calendarThead = document.createElement('thead');
                calendarTable.appendChild(calendarThead);
                var weekTr = document.createElement('tr');
                weekTr.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-calendarTable-weekTr');
                calendarThead.appendChild(weekTr);
                ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(function (element) {
                    var weekTh = document.createElement('th');
                    weekTh.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-calendarTable-weekTh');
                    weekTh.appendChild(document.createTextNode(element));
                    weekTr.appendChild(weekTh);
                });
                var calendarTbody = document.createElement('tbody');
                calendarTable.appendChild(calendarTbody);
                // timeDiv
                var timeDiv = document.createElement('div');
                timeDiv.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-timeDiv');
                bodyDiv.appendChild(timeDiv);
                // check input type is date
                if (this.type === 'date') {
                    date.setHours(0);
                    date.setMinutes(0);
                    date.setSeconds(0);
                    timeDiv.style.display = 'none';
                }
                // now
                var nowButton = document.createElement('button');
                nowButton.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-timeDiv-nowButton');
                timeDiv.appendChild(nowButton);
                nowButton.addEventListener('click', function (event) {
                    var newDate = new Date();
                    date.setHours(newDate.getHours());
                    date.setMinutes(newDate.getMinutes());
                    date.setSeconds(newDate.getSeconds());
                    updateDate(date);
                });
                // hourSelect
                var hourSelect = document.createElement('select');
                hourSelect.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-timeDiv-hourSelect');
                for (var i = 0; i <= 23; i++) {
                    var option = document.createElement('option');
                    option.value = String(i);
                    option.text = lpad(String(i), 2, '0');
                    hourSelect.appendChild(option);
                }
                timeDiv.appendChild(hourSelect);
                hourSelect.addEventListener('change', function (event) {
                    date.setHours(parseInt(this.value));
                });
                // divider
                timeDiv.appendChild(document.createTextNode(':'));
                // minuteSelect
                var minuteSelect = document.createElement('select');
                minuteSelect.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-timeDiv-minuteSelect');
                for (var i = 0; i <= 59; i++) {
                    var option = document.createElement('option');
                    option.value = String(i);
                    option.text = lpad(String(i), 2, '0');
                    minuteSelect.appendChild(option);
                }
                timeDiv.appendChild(minuteSelect);
                minuteSelect.addEventListener('change', function (event) {
                    date.setMinutes(parseInt(this.value));
                });
                // divider
                timeDiv.appendChild(document.createTextNode(':'));
                // secondsSelect
                var secondSelect = document.createElement('select');
                secondSelect.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-timeDiv-secondSelect');
                for (var i = 0; i <= 59; i++) {
                    var option = document.createElement('option');
                    option.value = String(i);
                    option.text = lpad(String(i), 2, '0');
                    secondSelect.appendChild(option);
                }
                timeDiv.appendChild(secondSelect);
                secondSelect.addEventListener('change', function (event) {
                    date.setSeconds(parseInt(this.value));
                });
                // footer
                var footerDiv = document.createElement('div');
                footerDiv.classList.add('duice-ui-dateInput__pickerDiv-footerDiv');
                this.pickerDiv.appendChild(footerDiv);
                // confirm
                var confirmButton = document.createElement('button');
                confirmButton.classList.add('duice-ui-dateInput__pickerDiv-footerDiv-confirmButton');
                footerDiv.appendChild(confirmButton);
                confirmButton.addEventListener('click', function (event) {
                    $this.input.value = $this.format.encode(date.toISOString());
                    $this.setChanged();
                    $this.notifyObservers(this);
                    $this.closePicker();
                });
                // show
                this.input.parentNode.insertBefore(this.pickerDiv, this.input.nextSibling);
                this.pickerDiv.style.position = 'absolute';
                this.pickerDiv.style.zIndex = String(getCurrentMaxZIndex() + 1);
                this.pickerDiv.style.left = getElementPosition(this.input).left + 'px';
                this.pickerDiv.style.margin = '0px';
                // updates date
                function updateDate(date) {
                    var yyyy = date.getFullYear();
                    var mm = date.getMonth();
                    var dd = date.getDate();
                    var hh = date.getHours();
                    var mi = date.getMinutes();
                    var ss = date.getSeconds();
                    // updates yearSelect
                    for (var i = yyyy - 5, end = yyyy + 5; i <= end; i++) {
                        var option = document.createElement('option');
                        option.value = String(i);
                        option.text = String(i);
                        yearSelect.appendChild(option);
                    }
                    yearSelect.value = String(yyyy);
                    // updates monthSelect
                    monthSelect.value = String(mm);
                    // updates dateTbody
                    var startDay = new Date(yyyy, mm, 1).getDay();
                    var lastDates = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                    if (yyyy % 4 && yyyy % 100 != 0 || yyyy % 400 === 0) {
                        lastDates[1] = 29;
                    }
                    var lastDate = lastDates[mm];
                    var rowNum = Math.ceil((startDay + lastDate - 1) / 7);
                    var dNum = 0;
                    var currentDate = new Date();
                    removeChildNodes(calendarTbody);
                    for (var i = 1; i <= rowNum; i++) {
                        var dateTr = document.createElement('tr');
                        dateTr.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-calendarTable-dateTr');
                        for (var k = 1; k <= 7; k++) {
                            var dateTd = document.createElement('td');
                            dateTd.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-calendarTable-dateTd');
                            if ((i === 1 && k < startDay)
                                || (i === rowNum && dNum >= lastDate)) {
                                dateTd.appendChild(document.createTextNode(''));
                            }
                            else {
                                dNum++;
                                dateTd.appendChild(document.createTextNode(String(dNum)));
                                dateTd.dataset.date = String(dNum);
                                // checks selected
                                if (currentDate.getFullYear() === yyyy
                                    && currentDate.getMonth() === mm
                                    && currentDate.getDate() === dNum) {
                                    dateTd.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-calendarTable-dateTd--today');
                                }
                                if (dd === dNum) {
                                    dateTd.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-calendarTable-dateTd--selected');
                                }
                                dateTd.addEventListener('click', function (event) {
                                    date.setDate(parseInt(this.dataset.date));
                                    updateDate(date);
                                    event.preventDefault();
                                    event.stopPropagation();
                                });
                            }
                            dateTr.appendChild(dateTd);
                        }
                        calendarTbody.appendChild(dateTr);
                    }
                    // updates times
                    hourSelect.value = String(hh);
                    minuteSelect.value = String(mi);
                    secondSelect.value = String(ss);
                }
                updateDate(date);
            };
            DateInput.prototype.closePicker = function () {
                this.pickerDiv.parentNode.removeChild(this.pickerDiv);
                this.pickerDiv = null;
                window.removeEventListener('click', this.clickListener);
            };
            return DateInput;
        }(Input));
        ui.DateInput = DateInput;
        /**
         * duice.ui.SelectFactory
         */
        var SelectFactory = /** @class */ (function (_super) {
            __extends(SelectFactory, _super);
            function SelectFactory() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SelectFactory.prototype.getInstance = function (element) {
                var select = new Select(element);
                if (element.dataset.duiceOption) {
                    var option = element.dataset.duiceOption.split(',');
                    var optionList = this.getContextProperty(option[0]);
                    var optionValue = option[1];
                    var optionText = option[2];
                    select.setOption(optionList, optionValue, optionText);
                }
                var bind = element.dataset.duiceBind.split(',');
                select.bind(this.getContextProperty(bind[0]), bind[1]);
                return select;
            };
            return SelectFactory;
        }(MapUiComponentFactory));
        ui.SelectFactory = SelectFactory;
        /**
         * duice.ui.Select
         */
        var Select = /** @class */ (function (_super) {
            __extends(Select, _super);
            function Select(select) {
                var _this = _super.call(this, select) || this;
                _this.defaultOptions = new Array();
                _this.select = select;
                _this.select.classList.add('duice-ui-select');
                var $this = _this;
                _this.select.addEventListener('change', function (event) {
                    $this.setChanged();
                    $this.notifyObservers(this);
                });
                // stores default options
                for (var i = 0, size = _this.select.options.length; i < size; i++) {
                    _this.defaultOptions.push(_this.select.options[i]);
                }
                return _this;
            }
            Select.prototype.setOption = function (list, value, text) {
                this.optionList = list;
                this.optionValue = value;
                this.optionText = text;
                var $this = this;
                function updateOption(optionList) {
                    // removes all options
                    removeChildNodes($this.select);
                    // adds default options
                    for (var i = 0, size = $this.defaultOptions.length; i < size; i++) {
                        $this.select.appendChild($this.defaultOptions[i]);
                    }
                    // update data options
                    for (var i = 0, size = optionList.getSize(); i < size; i++) {
                        var optionMap = optionList.get(i);
                        var option = document.createElement('option');
                        option.value = optionMap.get($this.optionValue);
                        option.appendChild(document.createTextNode(optionMap.get($this.optionText)));
                        $this.select.appendChild(option);
                    }
                }
                updateOption(this.optionList);
            };
            Select.prototype.update = function (map, obj) {
                var value = map.get(this.getName());
                this.select.value = defaultIfEmpty(value, '');
                if (this.select.selectedIndex < 0) {
                    if (this.defaultOptions.length > 0) {
                        this.defaultOptions[0].selected = true;
                    }
                }
                this.setDisable(map.isDisable());
                this.setReadonly(map.isReadonly(this.getName()));
            };
            Select.prototype.getValue = function () {
                var value = this.select.value;
                return defaultIfEmpty(value, null);
            };
            Select.prototype.setDisable = function (disable) {
                if (disable) {
                    this.select.setAttribute('disabled', 'true');
                }
                else {
                    this.select.removeAttribute('disabled');
                }
            };
            Select.prototype.setReadonly = function (readonly) {
                if (readonly === true) {
                    this.select.style.pointerEvents = 'none';
                    this.select.classList.add('duice-ui-select--readonly');
                }
                else {
                    this.select.style.pointerEvents = '';
                    this.select.classList.remove('duice-ui-select--readonly');
                }
            };
            return Select;
        }(MapUiComponent));
        ui.Select = Select;
        /**
         * duice.ui.TextareaFactory
         */
        var TextareaFactory = /** @class */ (function (_super) {
            __extends(TextareaFactory, _super);
            function TextareaFactory() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            TextareaFactory.prototype.getInstance = function (element) {
                var textarea = new Textarea(element);
                var bind = element.dataset.duiceBind.split(',');
                textarea.bind(this.getContextProperty(bind[0]), bind[1]);
                return textarea;
            };
            return TextareaFactory;
        }(MapUiComponentFactory));
        ui.TextareaFactory = TextareaFactory;
        /**
         * duice.ui.Textarea
         */
        var Textarea = /** @class */ (function (_super) {
            __extends(Textarea, _super);
            function Textarea(textarea) {
                var _this = _super.call(this, textarea) || this;
                _this.textarea = textarea;
                _this.textarea.classList.add('duice-ui-textarea');
                var $this = _this;
                _this.textarea.addEventListener('change', function (event) {
                    $this.setChanged();
                    $this.notifyObservers(this);
                });
                return _this;
            }
            Textarea.prototype.update = function (map, obj) {
                var value = map.get(this.getName());
                this.textarea.value = defaultIfEmpty(value, '');
                this.setDisable(map.isDisable());
                this.setReadonly(map.isReadonly(this.getName()));
            };
            Textarea.prototype.getValue = function () {
                return defaultIfEmpty(this.textarea.value, null);
            };
            Textarea.prototype.setDisable = function (disable) {
                if (disable) {
                    this.textarea.setAttribute('disabled', 'true');
                }
                else {
                    this.textarea.removeAttribute('disabled');
                }
            };
            Textarea.prototype.setReadonly = function (readonly) {
                if (readonly) {
                    this.textarea.setAttribute('readonly', 'readonly');
                }
                else {
                    this.textarea.removeAttribute('readonly');
                }
            };
            return Textarea;
        }(MapUiComponent));
        ui.Textarea = Textarea;
        /**
         * duice.ui.ImageFactory
         */
        var ImageFactory = /** @class */ (function (_super) {
            __extends(ImageFactory, _super);
            function ImageFactory() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ImageFactory.prototype.getInstance = function (element) {
                var image = new Image(element);
                var bind = element.dataset.duiceBind.split(',');
                image.bind(this.getContextProperty(bind[0]), bind[1]);
                return image;
            };
            return ImageFactory;
        }(MapUiComponentFactory));
        ui.ImageFactory = ImageFactory;
        /**
         * duice.ui.Image
         */
        var Image = /** @class */ (function (_super) {
            __extends(Image, _super);
            /**
             * Constructor
             * @param img
             */
            function Image(img) {
                var _this = _super.call(this, img) || this;
                _this.img = img;
                _this.originSrc = _this.img.src;
                _this.img.classList.add('duice-ui-img');
                var $this = _this;
                // listener for click
                _this.img.addEventListener('click', function (event) {
                    $this.openPreview();
                });
                // listener for contextmenu event
                _this.img.addEventListener('contextmenu', function (event) {
                    if ($this.disable) {
                        return;
                    }
                    $this.openMenuDiv(event.pageX, event.pageY);
                    event.preventDefault();
                });
                return _this;
            }
            /**
             * Updates image instance
             * @param map
             * @param obj
             */
            Image.prototype.update = function (map, obj) {
                var value = map.get(this.getName());
                this.value = defaultIfEmpty(value, this.originSrc);
                this.img.src = this.value;
                this.disable = map.isDisable();
            };
            /**
             * Return value of image element
             * @return base64 data or image URL
             */
            Image.prototype.getValue = function () {
                return this.value;
            };
            /**
             * Opens preview
             */
            Image.prototype.openPreview = function () {
                var $this = this;
                var parentNode = getCurrentWindow().document.body;
                // creates preview
                this.preview = document.createElement('img');
                this.preview.src = this.img.src;
                this.preview.addEventListener('click', function (event) {
                    $this.closePreview();
                });
                // creates blocker
                this.blocker = new duice.Blocker(parentNode);
                this.blocker.getBlockDiv().addEventListener('click', function (event) {
                    $this.closePreview();
                });
                this.blocker.block();
                // shows preview
                this.preview.style.position = 'absolute';
                this.preview.style.zIndex = String(getCurrentMaxZIndex() + 2);
                parentNode.appendChild(this.preview);
                setPositionCentered(this.preview);
            };
            /**
             * Closes preview
             */
            Image.prototype.closePreview = function () {
                if (this.preview) {
                    this.blocker.unblock();
                    this.preview.parentNode.removeChild(this.preview);
                    this.preview = null;
                }
            };
            /**
             * Opens menu division.
             */
            Image.prototype.openMenuDiv = function (x, y) {
                // checks if already menu exists.
                if (this.menuDiv) {
                    return;
                }
                // defines variables
                var $this = this;
                // creates menu div
                this.menuDiv = document.createElement('div');
                this.menuDiv.classList.add('duice-ui-img__menuDiv');
                // creates change button
                var changeButton = document.createElement('button');
                changeButton.classList.add('duice-ui-img__menuDiv-changeButton');
                changeButton.addEventListener('click', function (event) {
                    $this.changeImage();
                }, true);
                this.menuDiv.appendChild(changeButton);
                // creates view button
                var clearButton = document.createElement('button');
                clearButton.classList.add('duice-ui-img__menuDiv-clearButton');
                clearButton.addEventListener('click', function (event) {
                    $this.clearImage();
                }, true);
                this.menuDiv.appendChild(clearButton);
                // appends menu div
                this.img.parentNode.appendChild(this.menuDiv);
                this.menuDiv.style.position = 'absolute';
                this.menuDiv.style.zIndex = String(getCurrentMaxZIndex() + 1);
                this.menuDiv.style.top = y + 'px';
                this.menuDiv.style.left = x + 'px';
                // listens mouse leaves from menu div.
                this.menuDiv.addEventListener('mouseleave', function (event) {
                    $this.closeMenuDiv();
                });
            };
            /**
             * Closes menu division
             */
            Image.prototype.closeMenuDiv = function () {
                if (this.menuDiv) {
                    this.menuDiv.parentNode.removeChild(this.menuDiv);
                    this.menuDiv = null;
                }
            };
            /**
             * Changes image
             */
            Image.prototype.changeImage = function () {
                // creates file input element
                var $this = this;
                var input = document.createElement('input');
                input.setAttribute("type", "file");
                input.setAttribute("accept", "image/gif, image/jpeg, image/png");
                input.addEventListener('change', function (e) {
                    var fileReader = new FileReader();
                    if (this.files && this.files[0]) {
                        fileReader.addEventListener("load", function (event) {
                            var value = event.target.result;
                            $this.value = value;
                            $this.img.src = value;
                            $this.setChanged();
                            $this.notifyObservers($this);
                        });
                        fileReader.readAsDataURL(this.files[0]);
                    }
                    e.preventDefault();
                    e.stopPropagation();
                });
                input.click();
            };
            /**
             * Clears image
             */
            Image.prototype.clearImage = function () {
                this.value = null;
                this.setChanged();
                this.notifyObservers(this);
            };
            return Image;
        }(MapUiComponent));
        ui.Image = Image;
        /**
         * duice.ui.PaginationFactory
         */
        var PaginationFactory = /** @class */ (function (_super) {
            __extends(PaginationFactory, _super);
            function PaginationFactory() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            PaginationFactory.prototype.getInstance = function (element) {
                var pagination = new Pagination(element);
                if (element.dataset.duiceSize) {
                    pagination.setSize(Number(element.dataset.duiceSize));
                }
                var bind = element.dataset.duiceBind.split(',');
                pagination.bind(this.getContextProperty(bind[0]), bind[1], bind[2], bind[3]);
                return pagination;
            };
            return PaginationFactory;
        }(MapUiComponentFactory));
        ui.PaginationFactory = PaginationFactory;
        /**
         * duice.ui.Pagination
         */
        var Pagination = /** @class */ (function (_super) {
            __extends(Pagination, _super);
            function Pagination(ul) {
                var _this = _super.call(this, ul) || this;
                _this.lis = new Array();
                _this.size = 1;
                _this.page = 1;
                _this.ul = ul;
                addClassNameIfCssEnable(_this.ul, 'duice-ui-pagination');
                // clones li
                var li = _this.ul.querySelector('li');
                _this.li = li.cloneNode(true);
                li.parentNode.removeChild(li);
                return _this;
            }
            Pagination.prototype.bind = function (map, pageName, rowsName, totalCountName) {
                this.pageName = pageName;
                this.rowsName = rowsName;
                this.totalCountName = totalCountName;
                _super.prototype.bind.call(this, map, pageName);
            };
            Pagination.prototype.setSize = function (size) {
                this.size = size;
            };
            Pagination.prototype.setEnable = function (enable) {
                return;
            };
            Pagination.prototype.update = function (map, obj) {
                this.page = Number(defaultIfEmpty(map.get(this.pageName), 1));
                var rows = Number(defaultIfEmpty(map.get(this.rowsName), 1));
                var totalCount = Number(defaultIfEmpty(map.get(this.totalCountName), 1));
                var totalPage = Math.max(Math.ceil(totalCount / rows), 1);
                var startPage = Math.floor((this.page - 1) / this.size) * this.size + 1;
                var endPage = Math.min(startPage + this.size - 1, totalPage);
                var $this = this;
                // clear lis
                for (var i = this.lis.length - 1; i >= 0; i--) {
                    this.lis[i].parentNode.removeChild(this.lis[i]);
                }
                this.lis.length = 0;
                // creates previous item
                var prevPage = startPage - 1;
                var prevLi = this.createPageItem(prevPage, '');
                prevLi.classList.add('duice-ui-pagination__li--prev');
                this.ul.appendChild(prevLi);
                this.lis.push(prevLi);
                prevLi.addEventListener('mousedown', function (event) {
                    $this.page = prevPage;
                    $this.setChanged();
                    $this.notifyObservers($this);
                    this.click();
                });
                if (prevPage < 1) {
                    prevLi.onclick = null;
                    prevLi.style.pointerEvents = 'none';
                    prevLi.style.opacity = '0.5';
                }
                var _loop_1 = function () {
                    var page = i;
                    li = this_1.createPageItem(page, String(page));
                    // add event listener
                    li.addEventListener('mousedown', function (event) {
                        $this.page = page;
                        $this.setChanged();
                        $this.notifyObservers($this);
                        this.click();
                    }, true);
                    this_1.ul.appendChild(li);
                    this_1.lis.push(li);
                    if (page === this_1.page) {
                        addClassNameIfCssEnable(li, 'duice-ui-pagination__li--current');
                        li.onclick = null;
                        li.style.pointerEvents = 'none';
                    }
                };
                var this_1 = this, li;
                // creates page items
                for (var i = startPage; i <= endPage; i++) {
                    _loop_1();
                }
                // creates next item
                var nextPage = endPage + 1;
                var nextLi = this.createPageItem(nextPage, '');
                nextLi.classList.add('duice-ui-pagination__li--next');
                this.ul.appendChild(nextLi);
                this.lis.push(nextLi);
                nextLi.addEventListener('mousedown', function (event) {
                    $this.page = nextPage;
                    $this.setChanged();
                    $this.notifyObservers($this);
                    this.click();
                });
                if (nextPage > totalPage) {
                    nextLi.onclick = null;
                    nextLi.style.pointerEvents = 'none';
                    nextLi.style.opacity = '0.5';
                }
            };
            Pagination.prototype.getValue = function () {
                return this.page;
            };
            Pagination.prototype.createPageItem = function (page, text) {
                var li = this.li.cloneNode(true);
                addClassNameIfCssEnable(li, 'duice-ui-pagination__li');
                var $this = this;
                var $context = {};
                $context['page'] = Number(page);
                $context['text'] = String(text);
                li = executeExpression(li, $context);
                li.appendChild(document.createTextNode(text));
                return li;
            };
            return Pagination;
        }(MapUiComponent));
        ui.Pagination = Pagination;
        /**
         * duice.ui.TableFactory
         */
        var TableFactory = /** @class */ (function (_super) {
            __extends(TableFactory, _super);
            function TableFactory() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            TableFactory.prototype.getInstance = function (element) {
                var table = new Table(element);
                table.setSelectable(element.dataset.duiceSelectable === 'true');
                table.setEditable(element.dataset.duiceEditable === 'true');
                var bind = element.dataset.duiceBind.split(',');
                table.bind(this.getContextProperty(bind[0]), bind[1]);
                return table;
            };
            return TableFactory;
        }(ListUiComponentFactory));
        ui.TableFactory = TableFactory;
        /**
         * duice.ui.Table
         */
        var Table = /** @class */ (function (_super) {
            __extends(Table, _super);
            /**
             * constructor table
             * @param table
             */
            function Table(table) {
                var _this = _super.call(this, table) || this;
                _this.tbodies = new Array();
                _this.table = table;
                addClassNameIfCssEnable(_this.table, 'duice-ui-table');
                // initializes caption
                var caption = _this.table.querySelector('caption');
                if (caption) {
                    addClassNameIfCssEnable(caption, 'duice-ui-table__caption');
                    caption = executeExpression(caption, new Object());
                    initializeComponent(caption, new Object());
                }
                // initializes head
                var thead = _this.table.querySelector('thead');
                if (thead) {
                    addClassNameIfCssEnable(thead, 'duice-ui-table__thead');
                    thead.querySelectorAll('tr').forEach(function (tr) {
                        addClassNameIfCssEnable(tr, 'duice-ui-table__thead-tr');
                    });
                    thead.querySelectorAll('th').forEach(function (th) {
                        addClassNameIfCssEnable(th, 'duice-ui-table__thead-tr-th');
                    });
                    thead = executeExpression(thead, new Object());
                    initializeComponent(thead, new Object());
                }
                // clones body
                var tbody = _this.table.querySelector('tbody');
                _this.tbody = tbody.cloneNode(true);
                addClassNameIfCssEnable(_this.tbody, 'duice-ui-table__tbody');
                _this.tbody.querySelectorAll('tr').forEach(function (tr) {
                    addClassNameIfCssEnable(tr, 'duice-ui-table__tbody-tr');
                });
                _this.tbody.querySelectorAll('td').forEach(function (th) {
                    addClassNameIfCssEnable(th, 'duice-ui-table__tbody-tr-td');
                });
                _this.table.removeChild(tbody);
                // initializes foot
                var tfoot = _this.table.querySelector('tfoot');
                if (tfoot) {
                    addClassNameIfCssEnable(tfoot, 'duice-ui-table__tfoot');
                    tfoot.querySelectorAll('tr').forEach(function (tr) {
                        addClassNameIfCssEnable(tr, 'duice-ui-table__tfoot-tr');
                    });
                    tfoot.querySelectorAll('td').forEach(function (td) {
                        addClassNameIfCssEnable(td, 'duice-ui-table__tfoot-tr-td');
                    });
                    tfoot = executeExpression(tfoot, new Object());
                    initializeComponent(tfoot, new Object());
                }
                return _this;
            }
            /**
             * Sets selectable flag
             * @param selectable
             */
            Table.prototype.setSelectable = function (selectable) {
                this.selectable = selectable;
            };
            /**
             * Sets enable flag
             * @param editable
             */
            Table.prototype.setEditable = function (editable) {
                this.editable = editable;
            };
            /**
             * Updates table
             * @param list
             * @param obj
             */
            Table.prototype.update = function (list, obj) {
                // checks changed source instance
                if (obj instanceof duice.Map) {
                    return;
                }
                var $this = this;
                // remove previous rows
                for (var i = 0; i < this.tbodies.length; i++) {
                    this.table.removeChild(this.tbodies[i]);
                }
                this.tbodies.length = 0;
                // creates new rows
                for (var index = 0; index < list.getSize(); index++) {
                    var map = list.get(index);
                    var tbody = this.createTbody(index, map);
                    tbody.dataset.duiceIndex = String(index);
                    // select index
                    if (this.selectable) {
                        if (index === list.getIndex()) {
                            tbody.classList.add('duice-ui-table__tbody--index');
                        }
                        tbody.addEventListener('click', function (event) {
                            var index = Number(this.dataset.duiceIndex);
                            $this.selectTbody(index);
                        }, true);
                    }
                    // drag and drop event
                    if (this.editable) {
                        tbody.setAttribute('draggable', 'true');
                        tbody.addEventListener('dragstart', function (event) {
                            event.dataTransfer.setData("text", this.dataset.duiceIndex);
                        });
                        tbody.addEventListener('dragover', function (event) {
                            event.preventDefault();
                            event.stopPropagation();
                        });
                        tbody.addEventListener('drop', function (event) {
                            event.preventDefault();
                            event.stopPropagation();
                            var fromIndex = parseInt(event.dataTransfer.getData('text'));
                            var toIndex = parseInt(this.dataset.duiceIndex);
                            list.move(fromIndex, toIndex);
                        });
                    }
                    // appends body
                    this.table.appendChild(tbody);
                    this.tbodies.push(tbody);
                }
                // not found row
                if (list.getSize() < 1) {
                    var emptyTbody = this.createEmptyTbody();
                    emptyTbody.style.pointerEvents = 'none';
                    this.table.appendChild(emptyTbody);
                    this.tbodies.push(emptyTbody);
                }
            };
            /**
             * Selects tbody element
             * @param tbody
             */
            Table.prototype.selectTbody = function (index) {
                this.getList().suspendNotify();
                if (this.getList().setIndex(index)) {
                    // handles class                
                    for (var i = 0; i < this.tbodies.length; i++) {
                        if (i === index) {
                            this.tbodies[i].classList.add('duice-ui-table__tbody--index');
                        }
                        else {
                            this.tbodies[i].classList.remove('duice-ui-table__tbody--index');
                        }
                    }
                }
                this.getList().resumeNotify();
            };
            /**
             * Creates table body element
             * @param index
             * @param map
             */
            Table.prototype.createTbody = function (index, map) {
                var $this = this;
                var tbody = this.tbody.cloneNode(true);
                addClassNameIfCssEnable(tbody, 'duice-ui-table__tbody');
                var $context = new Object;
                $context['index'] = index;
                $context[this.item] = map;
                tbody = executeExpression(tbody, $context);
                initializeComponent(tbody, $context);
                return tbody;
            };
            /**
             * Creates empty table body element
             */
            Table.prototype.createEmptyTbody = function () {
                var emptyTbody = this.tbody.cloneNode(true);
                removeChildNodes(emptyTbody);
                emptyTbody.classList.add('duice-ui-table__tbody--empty');
                var tr = document.createElement('tr');
                addClassNameIfCssEnable(tr, 'duice-ui-table__tbody-tr');
                var td = document.createElement('td');
                addClassNameIfCssEnable(td, 'duice-ui-table__tbody-tr-td');
                var colspan = this.tbody.querySelectorAll('tr > td').length;
                td.setAttribute('colspan', String(colspan));
                var emptyMessage = document.createElement('div');
                emptyMessage.style.textAlign = 'center';
                emptyMessage.classList.add('duice-ui-table__tbody--empty-message');
                td.appendChild(emptyMessage);
                tr.appendChild(td);
                emptyTbody.appendChild(tr);
                return emptyTbody;
            };
            return Table;
        }(ListUiComponent));
        ui.Table = Table;
        /**
         * duice.ui.UListFactory
         */
        var UListFactory = /** @class */ (function (_super) {
            __extends(UListFactory, _super);
            function UListFactory() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            UListFactory.prototype.getInstance = function (element) {
                var uList = new UList(element);
                uList.setSelectable(element.dataset.duiceSelectable === 'true');
                uList.setEditable(element.dataset.duiceEditable === 'true');
                if (element.dataset.duiceHierarchy) {
                    var hirearchy = element.dataset.duiceHierarchy.split(',');
                    uList.setHierarchy(hirearchy[0], hirearchy[1]);
                }
                uList.setFoldable(element.dataset.duiceFoldable === 'true');
                var bind = element.dataset.duiceBind.split(',');
                uList.bind(this.getContextProperty(bind[0]), bind[1]);
                return uList;
            };
            return UListFactory;
        }(ListUiComponentFactory));
        ui.UListFactory = UListFactory;
        /**
         * duice.ui.UList
         */
        var UList = /** @class */ (function (_super) {
            __extends(UList, _super);
            /**
             * Constructor
             * @param ul
             */
            function UList(ul) {
                var _this = _super.call(this, ul) || this;
                _this.lis = new Array();
                _this.foldName = {};
                _this.ul = ul;
                _this.ul.classList.add('duice-ui-ul');
                var li = _this.ul.querySelector('li');
                _this.li = li.cloneNode(true);
                return _this;
            }
            /**
             * Sets selectable flag
             * @param selectable
             */
            UList.prototype.setSelectable = function (selectable) {
                this.selectable = selectable;
            };
            /**
             * Sets editable flag.
             * @param editable
             */
            UList.prototype.setEditable = function (editable) {
                this.editable = editable;
            };
            /**
             * Sets hierarchy function options.
             * @param idName
             * @param parentIdName
             */
            UList.prototype.setHierarchy = function (idName, parentIdName) {
                this.hierarchy = { idName: idName, parentIdName: parentIdName };
            };
            /**
             * Sets foldable flag.
             * @param foldable
             */
            UList.prototype.setFoldable = function (foldable) {
                this.foldable = foldable;
            };
            /**
             * Updates instance
             * @param list
             * @param obj
             */
            UList.prototype.update = function (list, obj) {
                // checks changed source instance
                if (obj instanceof duice.Map) {
                    return;
                }
                // initiates
                var $this = this;
                this.ul.innerHTML = '';
                this.lis.length = 0;
                // root style
                this.ul.style.paddingLeft = '0px';
                if (this.hierarchy && this.editable) {
                    this.createRoot();
                }
                // creates new rows
                for (var index = 0; index < list.getSize(); index++) {
                    var map = list.get(index);
                    var path = [];
                    // checks hierarchy
                    if (this.hierarchy) {
                        if (isNotEmpty(map.get(this.hierarchy.parentIdName))) {
                            continue;
                        }
                    }
                    // creates LI element
                    var li = this.createLi(index, map);
                    this.ul.appendChild(li);
                }
                // creates orphans
                if (this.hierarchy) {
                    for (var index = 0, size = list.getSize(); index < size; index++) {
                        if (this.isLiCreated(index) === false) {
                            var orphanLi = this.createLi(index, list.get(index));
                            orphanLi.classList.add('duice-ui-ul__li--orphan');
                            this.ul.appendChild(orphanLi);
                        }
                    }
                }
            };
            /**
             * Creates root
             */
            UList.prototype.createRoot = function () {
                // sets root style
                this.ul.classList.add('duice-ui-ul--root');
                if (this.foldable) {
                    this.ul.style.paddingLeft = '64px';
                }
                else {
                    this.ul.style.paddingLeft = '32px';
                }
                // add root event
                var $this = this;
                this.ul.addEventListener('dragover', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $this.ul.classList.add('duice-ui-ul--root-dragover');
                });
                this.ul.addEventListener('dragleave', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $this.ul.classList.remove('duice-ui-ul--root-dragover');
                });
                this.ul.addEventListener('drop', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var fromIndex = parseInt(event.dataTransfer.getData('text'));
                    var fromMap = $this.list.get(fromIndex);
                    fromMap.set($this.hierarchy.parentIdName, null);
                    $this.ul.classList.remove('duice-ui-ul--root-dragover');
                    $this.setChanged();
                    $this.notifyObservers(this);
                });
            };
            /**
             * Creates LI element reference to specified map includes child nodes.
             * @param index
             * @param map
             */
            UList.prototype.createLi = function (index, map) {
                var $this = this;
                var li = this.li.cloneNode(true);
                li.classList.add('duice-ui-ul__li');
                var $context = new Object;
                $context['index'] = index;
                $context[this.item] = map;
                li = executeExpression(li, $context);
                initializeComponent(li, $context);
                this.lis.push(li);
                li.dataset.duiceIndex = String(index);
                // sets index
                if (this.selectable) {
                    if (index === this.getList().getIndex()) {
                        li.classList.add('duice-ui-ul__li--index');
                    }
                    li.addEventListener('mousedown', function (event) {
                        $this.getList().suspendNotify();
                        if ($this.getList().setIndex(index)) {
                            event.stopPropagation();
                            for (var i = 0; i < $this.lis.length; i++) {
                                $this.lis[i].classList.remove('duice-ui-ul__li--index');
                            }
                            this.classList.add('duice-ui-ul__li--index');
                            $this.list.index = Number(this.dataset.duiceIndex);
                        }
                        $this.getList().resumeNotify();
                    });
                }
                // editable
                if (this.editable) {
                    li.setAttribute('draggable', 'true');
                    li.addEventListener('dragstart', function (event) {
                        event.stopPropagation();
                        event.dataTransfer.setData("text", this.dataset.duiceIndex);
                    });
                    li.addEventListener('dragover', function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                    });
                    li.addEventListener('drop', function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        var fromIndex = parseInt(event.dataTransfer.getData('text'));
                        var toIndex = parseInt(this.dataset.duiceIndex);
                        $this.moveLi(fromIndex, toIndex);
                    });
                }
                // creates child node
                if (this.hierarchy) {
                    var childUl = document.createElement('ul');
                    childUl.classList.add('duice-ui-ul');
                    var hasChild = false;
                    var hierarchyIdValue = map.get(this.hierarchy.idName);
                    for (var i = 0, size = this.list.getSize(); i < size; i++) {
                        var element = this.list.get(i);
                        var hierarchyParentIdValue = element.get(this.hierarchy.parentIdName);
                        if (isEmpty(hierarchyParentIdValue) === true) {
                            continue;
                        }
                        if (hierarchyParentIdValue === hierarchyIdValue) {
                            var childLi = this.createLi(i, element);
                            childUl.appendChild(childLi);
                            hasChild = true;
                        }
                    }
                    li.appendChild(childUl);
                    // sets fold 
                    if (this.foldable === true) {
                        if (hasChild) {
                            if (this.isFoldLi(map)) {
                                this.foldLi(map, li, true);
                            }
                            else {
                                this.foldLi(map, li, false);
                            }
                            li.addEventListener('click', function (event) {
                                event.preventDefault();
                                event.stopPropagation();
                                if (event.target === this) {
                                    if ($this.isFoldLi(map)) {
                                        $this.foldLi(map, this, false);
                                    }
                                    else {
                                        $this.foldLi(map, this, true);
                                    }
                                }
                            });
                        }
                        else {
                            this.foldLi(map, li, false);
                        }
                    }
                }
                // return node element
                return li;
            };
            /**
             * Returns specified index is already creates LI element.
             * @param index
             */
            UList.prototype.isLiCreated = function (index) {
                for (var i = 0, size = this.lis.length; i < size; i++) {
                    if (parseInt(this.lis[i].dataset.duiceIndex) === index) {
                        return true;
                    }
                }
                return false;
            };
            /**
             * Return specified map is fold.
             * @param map
             */
            UList.prototype.isFoldLi = function (map) {
                if (this.foldName[map.get(this.hierarchy.idName)] === true) {
                    return true;
                }
                else {
                    return false;
                }
            };
            /**
             * folds child nodes
             * @param map
             * @param li
             * @param fold
             */
            UList.prototype.foldLi = function (map, li, fold) {
                if (fold) {
                    this.foldName[map.get(this.hierarchy.idName)] = true;
                    li.classList.remove('duice-ui-ul__li--unfold');
                    li.classList.add('duice-ui-ul__li--fold');
                }
                else {
                    this.foldName[map.get(this.hierarchy.idName)] = false;
                    li.classList.remove('duice-ui-ul__li--fold');
                    li.classList.add('duice-ui-ul__li--unfold');
                }
            };
            /**
             * Modes map element from index to index.
             * @param fromIndex
             * @param toIndex
             */
            UList.prototype.moveLi = function (fromIndex, toIndex) {
                // checks same index
                if (fromIndex === toIndex) {
                    return;
                }
                //defines map
                var fromMap = this.list.get(fromIndex);
                var toMap = this.list.get(toIndex);
                // moving action
                if (this.hierarchy) {
                    // checks circular reference
                    if (this.isCircularReference(toMap, fromMap.get(this.hierarchy.idName))) {
                        throw 'Not allow to movem, becuase of Circular Reference.';
                    }
                    // change parents
                    fromMap.set(this.hierarchy.parentIdName, toMap.get(this.hierarchy.idName));
                    // notifies observers.
                    this.setChanged();
                    this.notifyObservers(this);
                }
                else {
                    // changes row position
                    this.list.move(fromIndex, toIndex);
                }
            };
            /**
             * Gets parent map
             * @param map
             */
            UList.prototype.getParentMap = function (map) {
                var parentIdValue = map.get(this.hierarchy.parentIdName);
                for (var i = 0, size = this.list.getSize(); i < size; i++) {
                    var element = this.list.get(i);
                    if (element.get(this.hierarchy.idName) === parentIdValue) {
                        return element;
                    }
                }
                return null;
            };
            /**
             * Returns whether circular reference or not
             * @param map
             * @param idValue
             */
            UList.prototype.isCircularReference = function (map, idValue) {
                var parentMap = map;
                while (true) {
                    parentMap = this.getParentMap(parentMap);
                    if (parentMap === null) {
                        return false;
                    }
                    if (parentMap.get(this.hierarchy.idName) === idValue) {
                        return true;
                    }
                }
            };
            return UList;
        }(ListUiComponent));
        ui.UList = UList;
        /**
         * Adds components
         */
        duice.ComponentDefinitionRegistry.add(new ComponentDefinition('table', 'duice-ui-table', duice.ui.TableFactory));
        duice.ComponentDefinitionRegistry.add(new ComponentDefinition('ul', 'duice-ui-ul', duice.ui.UListFactory));
        duice.ComponentDefinitionRegistry.add(new ComponentDefinition('*', 'duice-ui-scriptlet', duice.ui.ScriptletFactory));
        duice.ComponentDefinitionRegistry.add(new ComponentDefinition('span', 'duice-ui-span', duice.ui.SpanFactory));
        duice.ComponentDefinitionRegistry.add(new ComponentDefinition('input', 'duice-ui-input', duice.ui.InputFactory));
        duice.ComponentDefinitionRegistry.add(new ComponentDefinition('select', 'duice-ui-select', duice.ui.SelectFactory));
        duice.ComponentDefinitionRegistry.add(new ComponentDefinition('textarea', 'duice-ui-textarea', duice.ui.TextareaFactory));
        duice.ComponentDefinitionRegistry.add(new ComponentDefinition('img', 'duice-ui-img', duice.ui.ImageFactory));
        duice.ComponentDefinitionRegistry.add(new ComponentDefinition('ul', 'duice-ui-pagination', duice.ui.PaginationFactory));
    })(ui = duice.ui || (duice.ui = {})); // end of duice.ui
})(duice || (duice = {})); // end
/**
 * DOMContentLoaded event process
 */
document.addEventListener("DOMContentLoaded", function (event) {
    duice.initialize();
});
