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
     * duice.generateUUID
     */
    function generateUUID() {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
    duice.generateUUID = generateUUID;
    /**
     * duice.getObject
     * @param $context
     * @param name
     */
    function getObject($context, name) {
        if ($context.hasOwnProperty(name)) {
            return $context[name];
        }
        if (window.hasOwnProperty(name)) {
            return window[name];
        }
        try {
            return eval(name);
        }
        catch (e) {
            console.error(e, $context, name);
            throw e;
        }
    }
    duice.getObject = getObject;
    ;
    /**
     * duice.initialize
     * @param container
     * @param $context
     */
    function initialize(container, $context) {
        // creates TableViewer
        var tableViewerElements = container.querySelectorAll('table[data-duice="TableView"]');
        for (var i = 0; i < tableViewerElements.length; i++) {
            try {
                var tableViewerElement = tableViewerElements[i];
                var tableViewer = new duice.ui.TableViewer(tableViewerElement);
                var bind = tableViewerElement.dataset.duiceBind;
                tableViewer.setBind(getObject($context, bind));
                var item = tableViewerElement.dataset.duiceItem;
                tableViewer.setItem(item);
                tableViewer.setEditable((tableViewerElement.dataset.duiceEditable === 'true'));
                tableViewer.update();
                tableViewerElement.dataset.duice += generateUUID();
                console.log(tableViewer);
            }
            catch (e) {
                console.error(e, tableViewerElement);
                throw e;
            }
        }
        // creates unit elements
        var elementTags = [
            'div[data-duice="Text"]',
            'input[data-duice="TextField"]',
            'textarea[data-duice="TextArea"]',
            'select[data-duice="ComboBox"]',
            'input[data-duice="CheckBox"]',
            'input[data-duice="Radio"]',
            'div[data-duice="HtmlEditor"]',
            'div[data-duice="MarkdownEditor"]'
            // --
            ,
            'img[data-duice="Image"]',
            'input[data-duice="CronExpression"]'
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
                        text.setMode(element.dataset.duiceMode);
                        text.update();
                        break;
                    case 'TextField':
                        var textField = new duice.ui.TextField(element);
                        textField.setBind(getObject($context, bind[0]), bind[1]);
                        textField.update();
                        break;
                    case 'TextArea':
                        console.log("fdsafdsafdsa");
                        var textArea = new duice.ui.TextArea(element);
                        textArea.setBind(getObject($context, bind[0]), bind[1]);
                        textArea.update();
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
                    case 'Radio':
                        var radio = new duice.ui.Radio(element);
                        radio.setBind($context[bind[0]], bind[1]);
                        radio.update();
                        break;
                    case 'HtmlEditor':
                        var htmlEditor = new duice.ui.HtmlEditor(element);
                        htmlEditor.setBind($context[bind[0]], bind[1]);
                        htmlEditor.update();
                        break;
                    case 'MarkdownEditor':
                        var markdownEditor = new duice.ui.MarkdownEditor(element);
                        markdownEditor.setBind($context[bind[0]], bind[1]);
                        markdownEditor.update();
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
                _this.fromJson(jsonArray);
                return _this;
            }
            List.prototype.fromJson = function (jsonArray) {
                this.mapList = new Array();
                for (var i = 0; i < jsonArray.length; i++) {
                    var map = new duice.data.Map(jsonArray[i]);
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
            List.prototype.sortRow = function (name, ascending) {
                this.mapList.sort(function (a, b) {
                    var aValue = a.get(name);
                    var bValue = b.get(name);
                    return (aValue > bValue ? 1 : aValue < bValue ? -1 : 0) * (ascending == false ? -1 : 1);
                });
            };
            List.prototype.forEach = function (handler) {
                for (var i = 0, size = this.mapList.length; i < size; i++) {
                    handler.call(this, this.mapList[i]);
                }
            };
            List.prototype.findIndex = function (handler) {
                for (var i = 0, size = this.mapList.length; i < size; i++) {
                    if (handler.call(this, this.mapList[i]) === true) {
                        return i;
                    }
                }
                return -1;
            };
            List.prototype.findIndexes = function (handler) {
                var indexes = [];
                for (var i = 0, size = this.mapList.length; i < size; i++) {
                    if (handler.call(this, this.mapList[i]) === true) {
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
            __.prototype.escapeHtml = function (value) {
                // checks value is valid.
                if (!value) {
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
                return value.replace(/[&<>"']/g, function (m) { return htmlMap[m]; });
            };
            __.prototype.parseMarkdown = function (value) {
                // checks value is valid.
                if (!value) {
                    return value;
                }
                // code
                value = value.replace(/[\`]{3}([\w]*)\n([^\`]+)\n[\`]{3}/g, function (match, language, code) {
                    var codeHtml = new Array();
                    codeHtml.push('<code data-langhage="' + language + '">');
                    var lines = code.split('\n');
                    for (var i = 0; i < lines.length; i++) {
                        var line = lines[i];
                        // replace tag
                        line = line.replace(/\</g, '&lt');
                        line = line.replace(/\>/g, '&gt');
                        // comment
                        line = line.replace(/(^|[\s])(\/\/[\s]*.+)/gm, '<span class="comment">$2</span>');
                        line = line.replace(/(\/\*)/gm, '<span class="comment">$1');
                        line = line.replace(/(\*\/)/gm, '$1</span>');
                        line = line.replace(/(\s*)(#+.*)/gm, '$1<span class="comment">$2</span>');
                        // append 
                        codeHtml.push(line);
                    }
                    codeHtml.push('</code>');
                    return codeHtml.join('\n') + '\n';
                });
                //ul
                value = value.replace(/(^[ \t]*[\*\-]\s+.+\n)+/gm, function (match) {
                    var ulHtml = new Array();
                    ulHtml.push('<ul>');
                    var lines = match.split('\n');
                    for (var i = 0; i < lines.length; i++) {
                        var line = lines[i];
                        if (line.trim().length < 1) {
                            continue;
                        }
                        line = line.replace(/^[ \t]*[\*\-]\s+(.+)/gm, '<li>$1</li>');
                        ulHtml.push(line);
                    }
                    ulHtml.push('</ul>');
                    return ulHtml.join('\n') + '\n';
                });
                //ol
                value = value.replace(/(^[ \t]*[\d]+[\.]?\s+.+\n)+/gm, function (match) {
                    var olHtml = new Array();
                    olHtml.push('<ol>');
                    var lines = match.split('\n');
                    for (var i = 0; i < lines.length; i++) {
                        var line = lines[i];
                        if (line.trim().length < 1) {
                            continue;
                        }
                        line = line.replace(/^[ \t]*[\d]+[\.]?\s+(.+)/gm, '<li>$1</li>');
                        olHtml.push(line);
                    }
                    olHtml.push('</ol>');
                    return olHtml.join('\n') + '\n';
                });
                // title
                value = value.replace(/^[\#]{6}\s(.+)/gm, '<h6>$1</h6>');
                value = value.replace(/^[\#]{5}\s(.+)/gm, '<h5>$1</h5>');
                value = value.replace(/^[\#]{4}\s(.+)/gm, '<h4>$1</h4>');
                value = value.replace(/^[\#]{3}\s(.+)/gm, '<h3>$1</h3>');
                value = value.replace(/^[\#]{2}\s(.+)/gm, '<h2>$1</h2>');
                value = value.replace(/^[\#]{1}\s(.+)/gm, '<h1>$1</h1>');
                // hr
                value = value.replace(/(^[\-\=]{5,}\n)/gm, function (match) {
                    return '<hr/>';
                });
                // parses in-line element
                var lines = value.split('\n');
                for (var i = 0, size = lines.length; i < size; i++) {
                    var line = lines[i];
                    // font style
                    line = line.replace(/\*{2}([^\*].+)\*{2}/gm, '<b>$1</b>');
                    line = line.replace(/\_{2}([^\_].+)\_{2}/gm, '<em>$1</em>');
                    line = line.replace(/\~{2}([^\~].+)\~{2}/gm, '<del>$1</del>');
                    // image
                    line = line.replace(/\!\[([^\]]+)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" />');
                    // link
                    line = line.replace(/[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g, '<a href="$2" title="$4">$1</a>');
                    // replace line
                    lines[i] = line;
                }
                value = lines.join('\n');
                // return parsed value
                return value;
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
                console.log('block');
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
                _this.div = span;
                _this.div.classList.add('duice-ui-text');
                return _this;
            }
            Text.prototype.setBind = function (map, name) {
                this.bindMap = map;
                this.bindName = name;
                this.bindMap.addObserver(this);
            };
            Text.prototype.setMode = function (mode) {
                this.mode = mode;
            };
            Text.prototype.update = function () {
                this.removeChildNodes(this.div);
                var value = this.bindMap.get(this.bindName);
                if (this.mode === 'html') {
                    value = value;
                }
                else if (this.mode === 'markdown') {
                    value = this.parseMarkdown(value);
                }
                else {
                    value = this.escapeHtml(value);
                }
                this.div.appendChild(this.createDocumentFragment(value));
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
         * duice.ui.TextArea
         */
        var TextArea = (function (_super) {
            __extends(TextArea, _super);
            function TextArea(textarea) {
                var _this = _super.call(this) || this;
                _this.textarea = textarea;
                _this.textarea.classList.add('duice-ui-textArea');
                return _this;
            }
            TextArea.prototype.setBind = function (map, name) {
                this.bindMap = map;
                this.bindName = name;
                this.bindMap.addObserver(this);
                var $this = this;
                this.textarea.addEventListener('change', function () {
                    $this.bindMap.set($this.bindName, this.value);
                });
            };
            TextArea.prototype.update = function () {
                var value = this.bindMap.get(this.bindName);
                this.textarea.value = value;
            };
            return TextArea;
        }(__));
        ui.TextArea = TextArea;
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
         * duice.ui.Radio
         */
        var Radio = (function (_super) {
            __extends(Radio, _super);
            function Radio(input) {
                var _this = _super.call(this) || this;
                _this.input = input;
                _this.input.classList.add('duice-ui-radio');
                return _this;
            }
            Radio.prototype.setBind = function (map, name) {
                this.bindMap = map;
                this.bindName = name;
                this.bindMap.addObserver(this);
                var $this = this;
                this.input.addEventListener('change', function () {
                    $this.bindMap.set($this.bindName, this.value);
                });
            };
            Radio.prototype.update = function () {
                var value = this.bindMap.get(this.bindName);
                if (value === this.input.value) {
                    this.input.checked = true;
                }
                else {
                    this.input.checked = false;
                }
            };
            return Radio;
        }(__));
        ui.Radio = Radio;
        /**
         * duice.ui.HtmlEditor
         */
        var HtmlEditor = (function (_super) {
            __extends(HtmlEditor, _super);
            function HtmlEditor(div) {
                var _this = _super.call(this) || this;
                _this.mode = 'html';
                _this.div = div;
                _this.div.classList.add('duice-ui-htmlEditor');
                // create tool bar
                _this.toolBar = document.createElement('div');
                _this.toolBar.classList.add('duice-ui-htmlEditor-toolBar');
                _this.div.appendChild(_this.toolBar);
                // font family
                var fontfamily = document.createElement('select');
                fontfamily.classList.add('duice-ui-htmlEditor-toolBar-fontfamily');
                var defaultFont = window.getComputedStyle(_this.div, null).getPropertyValue('font-family');
                defaultFont = defaultFont.replace(/"/gi, '');
                var fonts = defaultFont.split(',');
                var additionalFonts = ['Arial', 'Arial Black', 'Times New Roman', 'Courier New', 'Impact'];
                for (var i = 0; i < additionalFonts.length; i++) {
                    var font = additionalFonts[i];
                    if (fonts.indexOf(font) < 0) {
                        fonts.push(font);
                    }
                }
                for (var i = 0; i < fonts.length; i++) {
                    var option = document.createElement('option');
                    option.value = fonts[i];
                    option.appendChild(document.createTextNode(fonts[i]));
                    fontfamily.appendChild(option);
                }
                fontfamily.addEventListener('change', function () {
                    document.execCommand('fontName', null, this.value);
                });
                _this.toolBar.appendChild(fontfamily);
                // font size
                var fontsize = document.createElement('select');
                fontsize.classList.add('duice-ui-htmlEditor-toolBar-fontsize');
                for (var i = 1; i <= 7; i++) {
                    var option = document.createElement('option');
                    option.value = String(i);
                    if (i == 3) {
                        option.selected = true; //  default font size
                    }
                    option.appendChild(document.createTextNode(String(i)));
                    fontsize.appendChild(option);
                }
                fontsize.addEventListener('change', function () {
                    document.execCommand('fontSize', null, this.value);
                });
                _this.toolBar.appendChild(fontsize);
                // bold
                var bold = document.createElement('button');
                bold.title = 'Bold';
                bold.classList.add('duice-ui-htmlEditor-toolBar-bold');
                bold.addEventListener('click', function () {
                    document.execCommand('bold', null, null);
                });
                _this.toolBar.appendChild(bold);
                // italic
                var italic = document.createElement('button');
                italic.title = 'Italic';
                italic.classList.add('duice-ui-htmlEditor-toolBar-italic');
                italic.addEventListener('click', function () {
                    document.execCommand('italic', null, null);
                });
                _this.toolBar.appendChild(italic);
                // underline
                var underline = document.createElement('button');
                underline.title = 'Underline';
                underline.classList.add('duice-ui-htmlEditor-toolBar-underline');
                underline.addEventListener('click', function () {
                    document.execCommand('underline', null, null);
                });
                _this.toolBar.appendChild(underline);
                // align left
                var alignleft = document.createElement('button');
                alignleft.title = 'Align Left';
                alignleft.classList.add('duice-ui-htmlEditor-toolBar-alignleft');
                alignleft.addEventListener('click', function () {
                    document.execCommand('justifyLeft', null, null);
                });
                _this.toolBar.appendChild(alignleft);
                // align center
                var aligncenter = document.createElement('button');
                aligncenter.title = 'Align Center';
                aligncenter.classList.add('duice-ui-htmlEditor-toolBar-aligncenter');
                aligncenter.addEventListener('click', function () {
                    document.execCommand('justifyCenter', null, null);
                });
                _this.toolBar.appendChild(aligncenter);
                // align right
                var alignright = document.createElement('button');
                alignright.title = 'Align Right';
                alignright.classList.add('duice-ui-htmlEditor-toolBar-alignright');
                alignright.addEventListener('click', function () {
                    document.execCommand('justifyRight', null, null);
                });
                _this.toolBar.appendChild(alignright);
                // indent increase
                var indentincrease = document.createElement('button');
                indentincrease.title = 'Indent';
                indentincrease.classList.add('duice-ui-htmlEditor-toolBar-indentincrease');
                indentincrease.addEventListener('click', function () {
                    document.execCommand('indent', null, null);
                });
                _this.toolBar.appendChild(indentincrease);
                // indent decrease
                var indentdecrease = document.createElement('button');
                indentdecrease.title = 'Outdent';
                indentdecrease.classList.add('duice-ui-htmlEditor-toolBar-indentdecrease');
                indentdecrease.addEventListener('click', function () {
                    document.execCommand('outdent', null, null);
                });
                _this.toolBar.appendChild(indentdecrease);
                // list order
                var listorder = document.createElement('button');
                listorder.title = 'Orderd List';
                listorder.classList.add('duice-ui-htmlEditor-toolBar-listorder');
                listorder.addEventListener('click', function () {
                    document.execCommand('insertorderedlist', null, null);
                });
                _this.toolBar.appendChild(listorder);
                // list unorder
                var listunorder = document.createElement('button');
                listunorder.title = 'Unorderd List';
                listunorder.classList.add('duice-ui-htmlEditor-toolBar-listunorder');
                listunorder.addEventListener('click', function () {
                    document.execCommand('insertUnorderedList', null, null);
                });
                _this.toolBar.appendChild(listunorder);
                // mode
                var mode = document.createElement('button');
                mode.title = 'Change Mode';
                mode.classList.add('duice-ui-htmlEditor-toolBar-mode');
                var $this = _this;
                mode.addEventListener('click', function () {
                    $this.toggleMode();
                });
                _this.toolBar.appendChild(mode);
                // create content
                _this.content = document.createElement('div');
                _this.content.classList.add('duice-ui-htmlEditor-content');
                _this.contentHtml = document.createElement('div');
                _this.contentHtml.contentEditable = 'true';
                _this.content.appendChild(_this.contentHtml);
                _this.contentText = document.createElement('textarea');
                _this.contentText.style.display = 'none';
                _this.content.appendChild(_this.contentText);
                _this.div.appendChild(_this.content);
                return _this;
            }
            HtmlEditor.prototype.setBind = function (map, name) {
                this.bindMap = map;
                this.bindName = name;
                this.bindMap.addObserver(this);
                var $this = this;
                this.contentHtml.addEventListener('DOMSubtreeModified', function () {
                    if (map.get(name) !== this.innerHTML) {
                        map.set(name, this.innerHTML);
                    }
                });
                this.contentText.addEventListener('change', function () {
                    map.set(name, this.value);
                });
            };
            HtmlEditor.prototype.update = function () {
                if (this.contentHtml.innerHTML !== this.bindMap.get(this.bindName)) {
                    this.contentHtml.innerHTML = this.bindMap.get(this.bindName);
                }
                if (this.contentText.value !== this.bindMap.get(this.bindName)) {
                    this.contentText.value = this.bindMap.get(this.bindName);
                }
            };
            HtmlEditor.prototype.toggleMode = function () {
                if (this.mode === 'html') {
                    this.mode = 'text';
                    this.contentHtml.style.display = 'none';
                    this.contentText.style.display = 'block';
                }
                else {
                    this.mode = 'html';
                    this.contentText.style.display = 'none';
                    this.contentHtml.style.display = 'block';
                }
            };
            return HtmlEditor;
        }(__));
        ui.HtmlEditor = HtmlEditor;
        /**
         * duice.ui.MarkdownEditor
         */
        var MarkdownEditor = (function (_super) {
            __extends(MarkdownEditor, _super);
            function MarkdownEditor(div) {
                var _this = _super.call(this) || this;
                _this.mode = 'markdown';
                var $this = _this;
                _this.div = div;
                _this.div.classList.add('duice-ui-markdownEditor');
                // create tool bar
                _this.toolBar = document.createElement('div');
                _this.toolBar.classList.add('duice-ui-markdownEditor-toolBar');
                _this.div.appendChild(_this.toolBar);
                // header
                var header = document.createElement('button');
                header.title = 'Header';
                header.classList.add('duice-ui-markdownEditor-toolBar-header');
                header.addEventListener('click', function (event) {
                    $this.insertMarkdown('#', '');
                });
                _this.toolBar.appendChild(header);
                // bold
                var bold = document.createElement('button');
                bold.title = 'Bold';
                bold.classList.add('duice-ui-markdownEditor-toolBar-bold');
                bold.addEventListener('click', function (event) {
                    $this.insertMarkdown('**', '**');
                });
                _this.toolBar.appendChild(bold);
                // italic
                var italic = document.createElement('button');
                italic.title = 'Italic';
                italic.classList.add('duice-ui-markdownEditor-toolBar-italic');
                italic.addEventListener('click', function () {
                    $this.insertMarkdown('__', '__');
                });
                _this.toolBar.appendChild(italic);
                // cancel
                var cancel = document.createElement('button');
                cancel.title = 'Cancel';
                cancel.classList.add('duice-ui-markdownEditor-toolBar-cancel');
                cancel.addEventListener('click', function () {
                    $this.insertMarkdown('~~', '~~');
                });
                _this.toolBar.appendChild(cancel);
                // list order
                var listorder = document.createElement('button');
                listorder.title = 'Orderd List';
                listorder.classList.add('duice-ui-markdownEditor-toolBar-listorder');
                listorder.addEventListener('click', function () {
                    $this.insertMarkdown('* ', '');
                });
                _this.toolBar.appendChild(listorder);
                // list unorder
                var listunorder = document.createElement('button');
                listunorder.title = 'Unorderd List';
                listunorder.classList.add('duice-ui-markdownEditor-toolBar-listunorder');
                listunorder.addEventListener('click', function () {
                    $this.insertMarkdown('1. ', '');
                });
                _this.toolBar.appendChild(listunorder);
                // line
                var line = document.createElement('button');
                line.title = 'Line';
                line.classList.add('duice-ui-markdownEditor-toolBar-line');
                line.addEventListener('click', function () {
                    $this.insertMarkdown('==========', '');
                });
                _this.toolBar.appendChild(line);
                // code
                var code = document.createElement('button');
                code.title = 'Code Block';
                code.classList.add('duice-ui-markdownEditor-toolBar-code');
                code.addEventListener('click', function () {
                    $this.insertMarkdown('\n```\n', '\n```\n');
                });
                _this.toolBar.appendChild(code);
                // image
                var image = document.createElement('button');
                image.title = 'Image Link';
                image.classList.add('duice-ui-markdownEditor-toolBar-image');
                image.addEventListener('click', function () {
                    //
                });
                _this.toolBar.appendChild(image);
                // link
                var link = document.createElement('button');
                link.title = 'URL Link';
                link.classList.add('duice-ui-markdownEditor-toolBar-link');
                link.addEventListener('click', function () {
                    //
                });
                _this.toolBar.appendChild(link);
                // mode
                var mode = document.createElement('button');
                mode.title = 'Change Mode';
                mode.classList.add('duice-ui-markdownEditor-toolBar-mode');
                var $this = _this;
                mode.addEventListener('click', function () {
                    $this.toggleMode();
                });
                _this.toolBar.appendChild(mode);
                // create content
                _this.content = document.createElement('div');
                _this.content.classList.add('duice-ui-markdownEditor-content');
                _this.contentMarkdown = document.createElement('textarea');
                _this.contentMarkdown.addEventListener('keydown', function () {
                    $this.selectionStart = this.selectionStart;
                    $this.selectionEnd = this.selectionEnd;
                });
                _this.content.appendChild(_this.contentMarkdown);
                _this.contentHtml = document.createElement('div');
                _this.contentHtml.style.whiteSpace = 'normal';
                _this.contentHtml.style.display = 'none';
                _this.content.appendChild(_this.contentHtml);
                _this.div.appendChild(_this.content);
                return _this;
            }
            MarkdownEditor.prototype.setBind = function (map, name) {
                this.bindMap = map;
                this.bindName = name;
                this.bindMap.addObserver(this);
                var $this = this;
                this.contentMarkdown.addEventListener('change', function () {
                    map.set(name, this.value);
                });
            };
            MarkdownEditor.prototype.update = function () {
                if (this.contentMarkdown.value !== this.bindMap.get(this.bindName)) {
                    console.log('update');
                    this.contentMarkdown.value = this.bindMap.get(this.bindName);
                    this.contentMarkdown.setSelectionRange(this.selectionStart, this.selectionEnd);
                    this.contentHtml.innerHTML = this.parseMarkdown(this.bindMap.get(this.bindName));
                }
            };
            MarkdownEditor.prototype.insertMarkdown = function (startTag, endTag) {
                var selectionStart = this.contentMarkdown.selectionStart;
                var selectionEnd = this.contentMarkdown.selectionEnd;
                var selectionLength = selectionEnd - selectionStart;
                var value = this.contentMarkdown.value.substring(0, selectionStart)
                    + startTag
                    + this.contentMarkdown.value.substring(selectionStart, selectionEnd)
                    + endTag
                    + this.contentMarkdown.value.substring(selectionEnd);
                this.contentMarkdown.value = value;
                this.selectionStart = selectionStart + startTag.length;
                this.selectionEnd = selectionStart + startTag.length + selectionLength;
                this.contentMarkdown.setSelectionRange(this.selectionStart, this.selectionEnd);
                this.contentMarkdown.focus();
            };
            MarkdownEditor.prototype.toggleMode = function () {
                if (this.mode === 'markdown') {
                    this.mode = 'html';
                    this.contentHtml.style.display = 'block';
                    this.contentMarkdown.style.display = 'none';
                }
                else {
                    this.mode = 'markdown';
                    this.contentMarkdown.style.display = 'block';
                    this.contentHtml.style.display = 'none';
                }
            };
            return MarkdownEditor;
        }(__));
        ui.MarkdownEditor = MarkdownEditor;
        /**
         * duice.ui.Calendar
         */
        var Calendar = (function (_super) {
            __extends(Calendar, _super);
            function Calendar(input) {
                return _super.call(this) || this;
            }
            Calendar.prototype.setBind = function (list) {
            };
            Calendar.prototype.update = function () {
            };
            return Calendar;
        }(__));
        ui.Calendar = Calendar;
        /**
         * duice.ui.CronExpression
         */
        var CronExpression = (function (_super) {
            __extends(CronExpression, _super);
            function CronExpression(input) {
                return _super.call(this) || this;
            }
            CronExpression.prototype.setBind = function (list) {
            };
            CronExpression.prototype.update = function () {
            };
            return CronExpression;
        }(__));
        ui.CronExpression = CronExpression;
        /**
         * duice.ui.ListViewer
         */
        var ListViewer = (function (_super) {
            __extends(ListViewer, _super);
            function ListViewer() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ListViewer.prototype.setBind = function (list) {
            };
            ListViewer.prototype.update = function () {
            };
            return ListViewer;
        }(__));
        ui.ListViewer = ListViewer;
        /**
         * duice.ui.TableViewer
         */
        var TableViewer = (function (_super) {
            __extends(TableViewer, _super);
            function TableViewer(table) {
                var _this = _super.call(this) || this;
                _this.rows = new Array();
                _this.table = table;
                _this.table.classList.add('duice-ui-tableViewer');
                _this.thead = _this.table.querySelector('thead');
                var tbody = _this.table.querySelector('tbody');
                _this.tbody = tbody.cloneNode(true);
                _this.table.removeChild(tbody);
                return _this;
            }
            TableViewer.prototype.setBind = function (list) {
                this.bindList = list;
                this.bindList.addObserver(this);
            };
            TableViewer.prototype.setItem = function (item) {
                this.item = item;
            };
            TableViewer.prototype.setEditable = function (editable) {
                this.editable = editable;
            };
            TableViewer.prototype.update = function () {
                var $this = this;
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
                // not found row
                if (this.bindList.getRowCount() < 1) {
                    var emptyRow = this.createEmptyRow();
                    this.table.appendChild(emptyRow);
                    this.rows.push(emptyRow);
                }
            };
            TableViewer.prototype.createRow = function (index, bindMap) {
                var $this = this;
                var row = this.tbody.cloneNode(true);
                var $context = new Object;
                $context['index'] = index;
                $context[this.item] = bindMap;
                row = this.executeExpression(row, $context);
                initialize(row, $context);
                // select index
                if (index == this.bindList.index) {
                    row.classList.add('duice-ui-tableViewer-index');
                }
                row.addEventListener('mouseup', function (event) {
                    for (var i = 0; i < $this.rows.length; i++) {
                        $this.rows[i].classList.remove('duice-ui-tableViewer-index');
                    }
                    row.classList.add('duice-ui-tableViewer-index');
                    $this.bindList.index = index;
                });
                // drag and drop event
                if (this.editable === true) {
                    row.setAttribute('draggable', 'true');
                    row.addEventListener('dragstart', function (event) {
                        console.log('dragstart', index);
                        event.dataTransfer.setData("index", String(index));
                    });
                    row.addEventListener('dragover', function (event) {
                        event.preventDefault();
                        console.log('dragover');
                    });
                    row.addEventListener('drop', function (event) {
                        event.preventDefault();
                        console.log('drop', index, event);
                        console.log();
                        var fromIndex = parseInt(event.dataTransfer.getData('index'));
                        var toIndex = index;
                        $this.bindList.moveRow(fromIndex, toIndex);
                        $this.bindList.index = toIndex;
                        $this.update();
                        row.click();
                    });
                }
                // return
                return row;
            };
            TableViewer.prototype.createEmptyRow = function () {
                var emptyRow = this.tbody.cloneNode(true);
                this.removeChildNodes(emptyRow);
                emptyRow.classList.add('duice-ui-tableViewer-empty');
                var tr = document.createElement('tr');
                var td = document.createElement('td');
                var colspan = this.tbody.querySelectorAll('tr > td').length;
                td.setAttribute('colspan', String(colspan));
                var emptyMessage = document.createElement('div');
                emptyMessage.classList.add('duice-ui-tableViewer-empty-message');
                td.appendChild(emptyMessage);
                tr.appendChild(td);
                emptyRow.appendChild(tr);
                return emptyRow;
            };
            return TableViewer;
        }(__));
        ui.TableViewer = TableViewer;
        /**
         * duice.ui.TreeViewer
         */
        var TreeViewer = (function (_super) {
            __extends(TreeViewer, _super);
            function TreeViewer() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            TreeViewer.prototype.setBind = function (list) {
            };
            TreeViewer.prototype.update = function () {
            };
            return TreeViewer;
        }(__));
        ui.TreeViewer = TreeViewer;
    })(ui = duice.ui || (duice.ui = {}));
})(duice || (duice = {}));
//DOMContentLoaded event process
document.addEventListener("DOMContentLoaded", function (event) {
    var $context = typeof self !== 'undefined' ? self :
        typeof window !== 'undefined' ? window :
            {};
    duice.initialize(document, $context);
});
