"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var duice;
(function (duice) {
    /**
     * duice.initialize
     * @param container
     * @param $context
     */
    function initialize(container, $context) {
        // generateUUID
        function generateUUID() {
            var dt = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (dt + Math.random() * 16) % 16 | 0;
                dt = Math.floor(dt / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        }
        // getObject
        function getObject($context, name) {
            try {
                var obj = eval("$context." + name);
                if (!obj) {
                    obj = eval(name);
                }
                return obj;
            }
            catch (e) {
                console.error(e, $context, name);
                throw e;
            }
        }
        ;
        // creates Grid
        var gridElements = container.querySelectorAll('table[data-duice="Grid"]');
        for (var i = 0; i < gridElements.length; i++) {
            try {
                var gridElement = gridElements[i];
                var grid = new duice.ui.Grid(gridElement);
                var bind = gridElement.dataset.duiceBind;
                grid.setBind(getObject($context, bind));
                var item = gridElement.dataset.duiceItem;
                grid.setItem(item);
                grid.update();
                gridElement.dataset.duice += generateUUID();
            }
            catch (e) {
                console.error(e, gridElement);
                throw e;
            }
        }
        // creates unit elements
        var elementTags = [
            'span[data-duice="Text"]',
            'input[data-duice="TextField"]',
            'select[data-duice="ComboBox"]',
            'input[data-duice="CheckBox"]',
            'input[data-duice="Radio"]',
            'div[data-duice="TextView"]',
            'textarea[data-duice="TextArea"]',
            'div[data-duice="HtmlEditor"]',
            'input[data-duice="CronExpression"]',
            'img[data-duice="Image"]'
        ];
        var elements = container.querySelectorAll(elementTags.join(','));
        for (var i = 0; i < elements.length; i++) {
            try {
                var element = elements[i];
                var type = element.dataset.duice;
                var bind = element.dataset.duiceBind.split(',');
                switch (type) {
                    case 'Text':
                        var text = new duice.ui.Text(element);
                        var format = element.dataset.duiceFormat;
                        text.setBind(getObject($context, bind[0]), bind[1]);
                        text.update();
                        break;
                    case 'TextField':
                        var textField = new duice.ui.TextField(element);
                        textField.setBind(getObject($context, bind[0]), bind[1]);
                        textField.update();
                        break;
                    case 'ComboBox':
                        var comboBox = new duice.ui.ComboBox(element);
                        comboBox.setBind(getObject($context, bind[0]), bind[1]);
                        var option = element.dataset.duiceOption.split(',');
                        comboBox.setOption(getObject($context, option[0]), option[1], option[2]);
                        comboBox.update();
                        break;
                    case 'CheckBox':
                        var checkBox = new duice.ui.CheckBox(element);
                        checkBox.setBind($context[bind[0]], bind[1]);
                        var option = element.dataset.duiceOption.split(',');
                        checkBox.setOption(option[0], option[1]);
                        checkBox.update();
                        break;
                }
                element.dataset.duice += generateUUID();
            }
            catch (e) {
                console.error(e, elements[i]);
                throw e;
            }
        }
    }
    duice.initialize = initialize;
    /**
     * duice.data
     */
    var data;
    (function (data) {
        /**
         * Super prototype of duice.data
         */
        var __ = (function () {
            function __() {
                this.observers = new Array();
                this.enable = true;
            }
            __.prototype.addObserver = function (observer) {
                for (var i = 0, size = this.observers.length; i < size; i++) {
                    if (this.observers[i] === observer) {
                        return;
                    }
                }
                this.observers.push(observer);
            };
            __.prototype.notifyObservers = function (observer) {
                for (var i = 0, size = this.observers.length; i < size; i++) {
                    if (this.observers[i] === observer) {
                        continue;
                    }
                    this.observers[i].update();
                }
            };
            __.prototype.update = function () {
                this.notifyObservers(this);
            };
            __.prototype.setEnable = function (enable) {
                this.enable = enable;
                this.notifyObservers(this);
            };
            __.prototype.isEnable = function () {
                return this.enable;
            };
            return __;
        }());
        data.__ = __;
        /**
         * Map data structure
         */
        var Map = (function (_super) {
            __extends(Map, _super);
            function Map(json) {
                var _this = _super.call(this) || this;
                _this.data = new Object();
                _this.childNodes = new Array();
                _this.fromJson(json);
                return _this;
            }
            Map.prototype.fromJson = function (json) {
                this.data = new Object();
                for (var name in json) {
                    this.data[name] = json[name];
                }
                this.notifyObservers(this);
            };
            Map.prototype.toJson = function () {
                var json = new Object();
                for (var name in this.data) {
                    json[name] = this.data[name];
                }
                return json;
            };
            Map.prototype.set = function (name, value) {
                this.data[name] = value;
                this.notifyObservers(this);
            };
            Map.prototype.get = function (name) {
                return this.data[name];
            };
            Map.prototype.getNames = function () {
                var names = new Array();
                for (var name in this.data) {
                    names.push(name);
                }
                return names;
            };
            Map.prototype.setParentNode = function (parentNode) {
                this.parentNode = parentNode;
            };
            Map.prototype.getParentNode = function () {
                return this.parentNode;
            };
            Map.prototype.getChildNodes = function () {
                return this.childNodes;
            };
            Map.prototype.getChildNode = function (index) {
                return this.childNodes[index];
            };
            Map.prototype.addChildNode = function (node) {
                node.setParentNode(this);
                this.childNodes.push(node);
            };
            Map.prototype.insertChildNode = function (index, node) {
                node.setParentNode(this);
                this.childNodes.splice(index, 0, node);
                node.addObserver(this);
            };
            Map.prototype.removeChildNode = function (index) {
                this.childNodes.splice(index, 1);
            };
            return Map;
        }(__));
        data.Map = Map;
        /**
         * List data structure
         */
        var List = (function (_super) {
            __extends(List, _super);
            function List(jsonArray) {
                var _this = _super.call(this) || this;
                _this.mapList = new Array();
                _this.index = -1;
                _this.enable = true;
                _this.readonly = new Object();
                _this.fromJson(jsonArray);
                return _this;
            }
            List.prototype.fromJson = function (jsonArray) {
                this.mapList = new Array();
                for (var i = 0; i < jsonArray.length; i++) {
                    var map = new duice.data.Map(jsonArray[i]);
                    map.setEnable(this.enable);
                    map.addObserver(this);
                    this.mapList.push(map);
                }
                this.index = -1;
                this.notifyObservers(this);
            };
            List.prototype.toJson = function () {
                var jsonArray = new Array();
                for (var i = 0; i < this.mapList.length; i++) {
                    jsonArray.push(this.mapList[i].toJson());
                }
                return jsonArray;
            };
            List.prototype.setIndex = function (index) {
                this.index = index;
                this.notifyObservers(this);
            };
            List.prototype.getIndex = function () {
                return this.index;
            };
            List.prototype.clearIndex = function () {
                this.index = -1;
                this.notifyObservers(this);
            };
            List.prototype.getRowCount = function () {
                return this.mapList.length;
            };
            List.prototype.getRow = function (index) {
                return this.mapList[index];
            };
            List.prototype.addRow = function (map) {
                map.addObserver(this);
                this.mapList.push(map);
                this.index = this.getRowCount();
                this.notifyObservers(this);
            };
            List.prototype.insertRow = function (index, map) {
                map.addObserver(this);
                this.mapList.splice(index, 0, map);
                this.index = index;
                this.notifyObservers(this);
            };
            List.prototype.removeRow = function (index) {
                this.mapList.splice(index, 1);
                this.notifyObservers(this);
            };
            List.prototype.moveRow = function (fromIndex, toIndex) {
                this.index = fromIndex;
                this.mapList.splice(toIndex, 0, this.mapList.splice(fromIndex, 1)[0]);
                this.index = toIndex;
                this.notifyObservers(this);
            };
            List.prototype.forEach = function (handler) {
                for (var i = 0, size = this.mapList.length; i < size; i++) {
                    handler.call(this, this.mapList[i]);
                }
            };
            List.prototype.findIndex = function (handler) {
                for (var i = 0, size = this.mapList.length; i < size; i++) {
                    if (handler.call(this, this.mapList[i]) == true) {
                        return i;
                    }
                }
                return -1;
            };
            List.prototype.findIndexes = function (handler) {
                var indexes = [];
                for (var i = 0, size = this.mapList.length; i < size; i++) {
                    if (handler.call(this, this.mapList[i]) == true) {
                        indexes.push(i);
                    }
                }
                return indexes;
            };
            List.prototype.findRow = function (handler) {
                var index = this.findIndex(handler);
                return this.getRow(index);
            };
            List.prototype.findRows = function (handler) {
                var indexes = this.findIndexes(handler);
                var rows = new Array();
                for (var i = 0, size = indexes.length; i < size; i++) {
                    var node = this.getRow(indexes[i]);
                    rows.push(node);
                }
                return rows;
            };
            return List;
        }(__));
        data.List = List;
        /**
         * Tree data structure
         */
        var Tree = (function (_super) {
            __extends(Tree, _super);
            function Tree() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.index = [];
                _this.rootNode = new Map({});
                return _this;
            }
            Tree.prototype.Tree = function (jsonArray, childNodeName) {
                if (jsonArray) {
                    this.fromJson(jsonArray, childNodeName);
                }
            };
            Tree.prototype.fromJson = function (jsonArray, childNodeName) {
                this.rootNode = new Map({});
                this.addObserver(this);
            };
            return Tree;
        }(__));
        data.Tree = Tree;
    })(data = duice.data || (duice.data = {}));
    /**
     * duice.data
     */
    var ui;
    (function (ui) {
        /**
         * Super prototype of duice.ui
         */
        var __ = (function () {
            function __() {
            }
            __.prototype.executeExpression = function (element, $context) {
                var string = element.outerHTML;
                string = string.replace(/\[\[(.*?)\]\]/mgi, function (match, command) {
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
                var template = document.createElement('template');
                template.innerHTML = string;
                return template.content.firstChild;
            };
            __.prototype.removeChildNodes = function (element) {
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
            };
            __.prototype.createDocumentFragment = function (html) {
                var template = document.createElement('template');
                template.innerHTML = html;
                return template.content;
            };
            __.prototype.getCurrentWindow = function () {
                if (window.frameElement) {
                    return window.parent;
                }
                else {
                    return window;
                }
            };
            __.prototype.getParentNode = function (element) {
                var parentNode = element.parentNode;
                return parentNode;
            };
            __.prototype.setPositionCentered = function (element) {
                var window = this.getCurrentWindow();
                var computedStyle = window.getComputedStyle(element);
                var computedWidth = parseInt(computedStyle.getPropertyValue('width').replace(/px/gi, ''));
                var computedHeight = parseInt(computedStyle.getPropertyValue('height').replace(/px/gi, ''));
                element.style.width = Math.min(window.screen.width - 20, computedWidth) + 'px';
                element.style.height = Math.min(window.screen.height, computedHeight) + 'px';
                element.style.left = Math.max(10, window.innerWidth / 2 - computedWidth / 2) + 'px';
                element.style.top = Math.max(0, window.innerHeight / 2 - computedHeight / 2) + 'px';
            };
            __.prototype.parseFormat = function (format) {
                var splitedFormat = format.split(':');
                var type = splitedFormat.shift();
                var option = splitedFormat.join(':');
                return { type: type, option: option };
            };
            __.prototype.delay = function (callback) {
                var interval = setInterval(function () {
                    try {
                        callback.call(callback);
                    }
                    catch (ignore) {
                        console.log(ignore, callback);
                    }
                    finally {
                        clearInterval(interval);
                    }
                }, 200);
            };
            __.prototype.fadeIn = function (element) {
                element.classList.remove('duice-ui-fadeOut');
                element.classList.add('duice-ui-fadeIn');
            };
            __.prototype.fadeOut = function (element) {
                element.classList.remove('duice-ui-fadeIn');
                element.classList.add('duice-ui-fadeOut');
            };
            __.prototype.getCurrentMaxZIndex = function () {
                var zIndex, z = 0, all = document.getElementsByTagName('*');
                for (var i = 0, n = all.length; i < n; i++) {
                    zIndex = document.defaultView.getComputedStyle(all[i], null).getPropertyValue("z-index");
                    zIndex = parseInt(zIndex, 10);
                    z = (zIndex) ? Math.max(z, zIndex) : z;
                }
                return z;
            };
            __.prototype.block = function (element) {
                var div = document.createElement('div');
                div.classList.add('duice-ui-block');
                // defines maxZIndex
                var zIndex = this.getCurrentMaxZIndex() + 1;
                // adjusting position
                div.style.position = 'fixed';
                div.style.zIndex = String(zIndex);
                // full blocking in case of BODY
                if (element.tagName == 'BODY') {
                    div.style.width = '100%';
                    div.style.height = '100%';
                    div.style.top = '0px';
                    div.style.left = '0px';
                }
                else {
                    var boundingClientRect = element.getBoundingClientRect();
                    var width = boundingClientRect.width;
                    var height = boundingClientRect.height;
                    var left = boundingClientRect.left;
                    var top = boundingClientRect.top;
                    div.style.width = width + "px";
                    div.style.height = height + "px";
                    div.style.top = top + 'px';
                    div.style.left = left + 'px';
                }
                // append
                element.appendChild(div);
                this.fadeIn(div);
                // return handler
                var $this = this;
                return {
                    getZIndex: function () {
                        return zIndex;
                    },
                    release: function () {
                        $this.fadeOut(div);
                        $this.delay(function () {
                            element.removeChild(div);
                        });
                    }
                };
            };
            __.prototype.load = function (element) {
                var $this = this;
                var div = document.createElement('div');
                div.classList.add('duice-ui-load');
                div.style.position = 'fixed';
                div.style.opacity = '0';
                div.style.zIndex = String(this.getCurrentMaxZIndex() + 1);
                // on resize event
                this.getCurrentWindow().addEventListener('resize', function (ev) {
                    if (div) {
                        $this.setPositionCentered(div);
                        div.style.top = '30vh'; // adjust top
                    }
                });
                // start
                element.appendChild(div);
                this.setPositionCentered(div);
                div.style.top = '30vh'; // adjust top   
                this.fadeIn(div);
                // return handler
                return {
                    release: function () {
                        $this.fadeOut(div);
                        $this.delay(function () {
                            element.removeChild(div);
                        });
                    }
                };
            };
            return __;
        }());
        ui.__ = __;
        /**
         * duice.ui.Text
         */
        var Text = (function (_super) {
            __extends(Text, _super);
            function Text(span) {
                var _this = _super.call(this) || this;
                _this.span = span;
                _this.span.classList.add('duice-ui-text');
                return _this;
            }
            Text.prototype.setBind = function (map, name) {
                this.bindMap = map;
                this.bindName = name;
                this.bindMap.addObserver(this);
            };
            Text.prototype.update = function () {
                this.removeChildNodes(this.span);
                var value = this.bindMap.get(this.bindName);
                this.span.appendChild(this.createDocumentFragment(value));
            };
            return Text;
        }(__));
        ui.Text = Text;
        /**
         * duice.ui.TextField
         */
        var TextField = (function (_super) {
            __extends(TextField, _super);
            function TextField(input) {
                var _this = _super.call(this) || this;
                _this.input = input;
                _this.input.classList.add('duice-ui-textField');
                return _this;
            }
            TextField.prototype.setBind = function (map, name) {
                this.bindMap = map;
                this.bindName = name;
                this.bindMap.addObserver(this);
                var $this = this;
                this.input.addEventListener('change', function () {
                    $this.bindMap.set($this.bindName, this.value);
                });
            };
            TextField.prototype.update = function () {
                var value = this.bindMap.get(this.bindName);
                this.input.value = value;
            };
            return TextField;
        }(__));
        ui.TextField = TextField;
        /**
         * duice.ui.ComboBox
         */
        var ComboBox = (function (_super) {
            __extends(ComboBox, _super);
            function ComboBox(select) {
                var _this = _super.call(this) || this;
                _this.select = select;
                _this.select.classList.add('duice-ui-comboBox');
                return _this;
            }
            ComboBox.prototype.setBind = function (map, name) {
                this.bindMap = map;
                this.bindName = name;
                this.bindMap.addObserver(this);
                var $this = this;
                this.select.addEventListener('change', function () {
                    $this.bindMap.set($this.bindName, this.value);
                });
            };
            ComboBox.prototype.setOption = function (list, value, text) {
                this.optionList = list;
                this.optionValue = value;
                this.optionText = text;
            };
            ComboBox.prototype.update = function () {
                this.removeChildNodes(this.select);
                for (var i = 0, size = this.optionList.getRowCount(); i < size; i++) {
                    var optionMap = this.optionList.getRow(i);
                    var option = document.createElement('option');
                    option.appendChild(document.createTextNode(optionMap.get(this.optionText)));
                    option.value = optionMap.get(this.optionValue);
                    this.select.appendChild(option);
                }
                var value = this.bindMap.get(this.bindName);
                this.select.value = value;
            };
            return ComboBox;
        }(__));
        ui.ComboBox = ComboBox;
        /**
         * duice.ui.CheckBox
         */
        var CheckBox = (function (_super) {
            __extends(CheckBox, _super);
            function CheckBox(input) {
                var _this = _super.call(this) || this;
                _this.input = input;
                _this.input.classList.add('duice-ui-checkBox');
                return _this;
            }
            CheckBox.prototype.setBind = function (map, name) {
                this.bindMap = map;
                this.bindName = name;
                this.bindMap.addObserver(this);
                var $this = this;
                this.input.addEventListener('change', function () {
                    $this.bindMap.set($this.bindName, this.checked ? $this.optionCheck : $this.optionUncheck);
                });
            };
            CheckBox.prototype.setOption = function (check, uncheck) {
                this.optionCheck = check;
                this.optionUncheck = uncheck;
            };
            CheckBox.prototype.update = function () {
                var value = this.bindMap.get(this.bindName);
                if (value === this.optionCheck) {
                    this.input.checked = true;
                }
                else {
                    this.input.checked = false;
                }
            };
            return CheckBox;
        }(__));
        ui.CheckBox = CheckBox;
        /**
         * duice.ui.Grid
         */
        var Grid = (function (_super) {
            __extends(Grid, _super);
            function Grid(table) {
                var _this = _super.call(this) || this;
                _this.rows = new Array();
                _this.table = table;
                _this.table.classList.add('duice-ui-grid');
                _this.thead = _this.table.querySelector('thead').cloneNode(true);
                var tbody = _this.table.querySelector('tbody');
                _this.tbody = tbody.cloneNode(true);
                _this.table.removeChild(tbody);
                return _this;
            }
            Grid.prototype.setBind = function (list) {
                this.bindList = list;
                this.bindList.addObserver(this);
            };
            Grid.prototype.setItem = function (item) {
                this.item = item;
            };
            Grid.prototype.update = function () {
                // remove previous rows
                for (var i = 0; i < this.rows.length; i++) {
                    this.table.removeChild(this.rows[i]);
                }
                this.rows.length = 0;
                // creates new rows
                for (var index = 0; index < this.bindList.getRowCount(); index++) {
                    var map = this.bindList.getRow(index);
                    var row = this.createRow(index, map);
                    this.table.appendChild(row);
                    this.rows.push(row);
                }
            };
            Grid.prototype.createRow = function (index, map) {
                var row = this.tbody.cloneNode(true);
                var $context = new Object;
                $context['index'] = index;
                $context[this.item] = map;
                row = this.executeExpression(row, $context);
                duice.initialize(row, $context);
                var $this = this;
                row.addEventListener('mousedown', function (event) {
                    $this.bindList.index = index;
                    console.log($this.bindList.getIndex());
                    for (var i = 0; i < $this.rows.length; i++) {
                        var row = $this.rows[i];
                        if (i === index) {
                            row.classList.add('duice-ui-grid-index');
                        }
                        else {
                            row.classList.remove('duice-ui-grid-index');
                        }
                    }
                });
                return row;
            };
            return Grid;
        }(__));
        ui.Grid = Grid;
    })(ui = duice.ui || (duice.ui = {}));
})(duice || (duice = {}));
//DOMContentLoaded event process
document.addEventListener("DOMContentLoaded", function (event) {
    var $context = typeof self !== 'undefined' ? self :
        typeof window !== 'undefined' ? window :
            {};
    duice.initialize(document, $context);
});
