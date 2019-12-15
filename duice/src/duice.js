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
        //        // creates ListView 
        //        var listViewerElements = container.querySelectorAll('ul[data-duice="ListViewer"]');
        //        for(var i = 0; i < listViewerElements.length; i++ ) {
        //            try {
        //                var listViewerElement = listViewerElements[i];
        //                var listViewer = new duice.ui.ListViewer(listViewerElement);
        //                var bind = listViewerElement.dataset.duiceBind;
        //                listViewer.setBind(getObject($context,bind));
        //                var item = listViewerElement.dataset.duiceItem;
        //                listViewer.setItem(item);
        //                listViewer.setEditable((listViewerElement.dataset.duiceEditable === 'true'));
        //                listViewer.update();
        //                listViewerElement.dataset.duice += generateUUID();
        //                console.log(listViewer);
        //            }catch(e){
        //                console.error(e,listViewerElement);
        //                throw e;
        //            }
        //        }
        //        
        // creates TableViewer
        var tableViewerElements = container.querySelectorAll('table[data-duice="TableView"]');
        for (var i = 0; i < tableViewerElements.length; i++) {
            try {
                var tableViewerElement = tableViewerElements[i];
                var tableViewer = new duice.ui.TableViewer(tableViewerElement);
                var bind = tableViewerElement.dataset.duiceBind;
                var bindList = getObject($context, bind);
                tableViewer.setBind(bindList);
                var item = tableViewerElement.dataset.duiceItem;
                tableViewer.setItem(item);
                tableViewer.setEditable((tableViewerElement.dataset.duiceEditable === 'true'));
                tableViewer.build();
                tableViewerElement.dataset.duice += generateUUID();
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
            'input[data-duice="Calendar"]',
            'img[data-duice="Image"]',
            'div[data-duice="HtmlEditor"]',
            'div[data-duice="MarkdownEditor"]'
            //         // --
            //            ,'input[data-duice="CronExpression"]'
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
                        text.setMode(element.dataset.duiceMode);
                        var bindMap = getObject($context, bind[0]);
                        var bindName = bind[1];
                        text.setBind(bindMap, bindName);
                        text.build();
                        break;
                    case 'TextField':
                        var textField = new duice.ui.TextField(element);
                        var bindMap = getObject($context, bind[0]);
                        var bindName = bind[1];
                        textField.setBind(bindMap, bindName);
                        textField.build();
                        break;
                    case 'TextArea':
                        var textArea = new duice.ui.TextArea(element);
                        var bindMap = getObject($context, bind[0]);
                        var bindName = bind[1];
                        textArea.setBind(bindMap, bindName);
                        textArea.build();
                        break;
                    case 'ComboBox':
                        var comboBox = new duice.ui.ComboBox(element);
                        var bindMap = getObject($context, bind[0]);
                        var bindName = bind[1];
                        comboBox.setBind(bindMap, bindName);
                        var option = element.dataset.duiceOption.split(',');
                        var optionList = getObject($context, option[0]);
                        var optionValue = option[1];
                        var optionText = option[2];
                        comboBox.setOption(optionList, optionValue, optionText);
                        comboBox.build();
                        break;
                    case 'CheckBox':
                        var checkBox = new duice.ui.CheckBox(element);
                        var bindMap = getObject($context, bind[0]);
                        var bindName = bind[1];
                        checkBox.setBind(bindMap, bindName);
                        checkBox.build();
                        break;
                    case 'Radio':
                        var radio = new duice.ui.Radio(element);
                        var bindMap = getObject($context, bind[0]);
                        var bindName = bind[1];
                        radio.setBind(bindMap, bindName);
                        radio.build();
                        break;
                    case 'Calendar':
                        var calendar = new duice.ui.Calendar(element);
                        var radio = new duice.ui.Radio(element);
                        var bindMap = getObject($context, bind[0]);
                        var bindName = bind[1];
                        calendar.setBind(bindMap, bindName);
                        calendar.build();
                        break;
                    case 'Image':
                        var image = new duice.ui.Image(element);
                        var bindMap = getObject($context, bind[0]);
                        var bindName = bind[1];
                        image.setBind(bindMap, bindName);
                        image.build();
                        break;
                    case 'HtmlEditor':
                        var htmlEditor = new duice.ui.HtmlEditor(element);
                        var bindMap = getObject($context, bind[0]);
                        var bindName = bind[1];
                        htmlEditor.setBind(bindMap, bindName);
                        htmlEditor.build();
                        break;
                    case 'MarkdownEditor':
                        var markdownEditor = new duice.ui.MarkdownEditor(element);
                        var bindMap = getObject($context, bind[0]);
                        var bindName = bind[1];
                        markdownEditor.setBind(bindMap, bindName);
                        markdownEditor.build();
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
     * generateObjectID
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
    /**
     * getObject
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
    ;
    /**
     * duice.data
     */
    var data;
    (function (data) {
        /**
         * Super prototype of duice.data
         */
        var DataObject = (function () {
            function DataObject() {
                this.observers = new Array();
            }
            DataObject.prototype.addObserver = function (observer) {
                for (var i = 0, size = this.observers.length; i < size; i++) {
                    if (this.observers[i] === observer) {
                        return;
                    }
                }
                this.observers.push(observer);
            };
            DataObject.prototype.notifyObservers = function () {
                for (var i = 0, size = this.observers.length; i < size; i++) {
                    this.observers[i].update(this);
                }
            };
            return DataObject;
        }());
        data.DataObject = DataObject;
        /**
         * Map data structure
         */
        var Map = (function (_super) {
            __extends(Map, _super);
            function Map(json) {
                var _this = _super.call(this) || this;
                _this.values = new Object();
                _this.childNodes = new Array();
                _this.enable = true;
                _this.readonlyNames = new Array();
                _this.fromJson(json);
                return _this;
            }
            Map.prototype.fromJson = function (json) {
                this.values = new Object();
                for (var name in json) {
                    this.values[name] = json[name];
                }
                this.notifyObservers();
            };
            Map.prototype.toJson = function () {
                var json = new Object();
                for (var name in this.values) {
                    json[name] = this.values[name];
                }
                return json;
            };
            Map.prototype.set = function (name, value) {
                this.values[name] = value;
                this.notifyObservers();
            };
            Map.prototype.get = function (name) {
                return this.values[name];
            };
            Map.prototype.getNames = function () {
                var names = new Array();
                for (var name in this.values) {
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
            };
            Map.prototype.removeChildNode = function (index) {
                this.childNodes.splice(index, 1);
            };
            Map.prototype.setEnable = function (enable) {
                this.enable = enable;
                this.notifyObservers();
            };
            Map.prototype.isEnable = function () {
                return this.enable;
            };
            Map.prototype.setReadonly = function (name, readonly) {
                if (this.readonlyNames.indexOf(name) == -1) {
                    this.readonlyNames.push(name);
                }
                this.notifyObservers();
            };
            Map.prototype.isReadonly = function (name) {
                if (this.readonlyNames.indexOf(name) >= 0) {
                    return true;
                }
                else {
                    return false;
                }
            };
            return Map;
        }(DataObject));
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
            List.prototype.update = function (ui) {
            };
            List.prototype.fromJson = function (jsonArray) {
                this.mapList = new Array();
                for (var i = 0; i < jsonArray.length; i++) {
                    var map = new duice.data.Map(jsonArray[i]);
                    this.mapList.push(map);
                }
                this.index = -1;
                this.notifyObservers();
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
                this.notifyObservers();
            };
            List.prototype.getIndex = function () {
                return this.index;
            };
            List.prototype.clearIndex = function () {
                this.index = -1;
                this.notifyObservers();
            };
            List.prototype.getRowCount = function () {
                return this.mapList.length;
            };
            List.prototype.getRow = function (index) {
                return this.mapList[index];
            };
            List.prototype.addRow = function (map) {
                this.mapList.push(map);
                this.index = this.getRowCount();
                this.notifyObservers();
            };
            List.prototype.insertRow = function (index, map) {
                this.mapList.splice(index, 0, map);
                this.index = index;
                this.notifyObservers();
            };
            List.prototype.removeRow = function (index) {
                this.mapList.splice(index, 1);
                this.notifyObservers();
            };
            List.prototype.moveRow = function (fromIndex, toIndex) {
                this.index = fromIndex;
                this.mapList.splice(toIndex, 0, this.mapList.splice(fromIndex, 1)[0]);
                this.index = toIndex;
                this.notifyObservers();
            };
            List.prototype.sortRow = function (name, ascending) {
                this.mapList.sort(function (a, b) {
                    var aValue = a.get(name);
                    var bValue = b.get(name);
                    return (aValue > bValue ? 1 : aValue < bValue ? -1 : 0) * (ascending == false ? -1 : 1);
                });
                this.notifyObservers();
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
        }(DataObject));
        data.List = List;
        //        /**
        //         * Tree data structure
        //         */
        //        export class Tree extends __ {
        //            index:Array<number> = [];
        //            rootNode:Map = new Map({});
        //            Tree(jsonArray:Array<any>, childNodeName:string):void {
        //                if(jsonArray) {
        //                    this.fromJson(jsonArray, childNodeName);
        //                }
        //            }
        //            fromJson(jsonArray:Array<Map>, childNodeName:string) {
        //                this.rootNode = new Map({});
        //            }
        //            toJson():any {
        //                return null;
        //            }
        //        }
    })(data = duice.data || (duice.data = {}));
    /**
     * duice.data
     */
    var ui;
    (function (ui) {
        /**
         * Super prototype of duice.ui
         */
        var UIComponent = (function () {
            function UIComponent() {
            }
            UIComponent.prototype.executeExpression = function (element, $context) {
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
            UIComponent.prototype.escapeHtml = function (value) {
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
            UIComponent.prototype.parseMarkdown = function (value) {
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
            UIComponent.prototype.removeChildNodes = function (element) {
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
            UIComponent.prototype.enableElement = function (element, enable) {
                if (element.tagName === 'SELECT') {
                    element.disabled = (enable === true ? false : true);
                }
                else if (element.tagName === 'BUTTON') {
                    element.disabled = (enable === true ? false : true);
                }
                var childNodes = element.childNodes, i = 0;
                for (var i = 0, size = childNodes.length; i < size; i++) {
                    var element = childNodes[i];
                    this.enableElement(element, enable);
                }
            };
            UIComponent.prototype.createDocumentFragment = function (html) {
                var template = document.createElement('template');
                template.innerHTML = html;
                return template.content;
            };
            /**
             * getCurrentWindow
             */
            UIComponent.prototype.getCurrentWindow = function () {
                if (window.frameElement) {
                    return window.parent;
                }
                else {
                    return window;
                }
            };
            UIComponent.prototype.getParentNode = function (element) {
                var parentNode = element.parentNode;
                return parentNode;
            };
            /**
             * setPositionCentered
             * @param element
             */
            UIComponent.prototype.setPositionCentered = function (element) {
                var window = this.getCurrentWindow();
                var computedStyle = window.getComputedStyle(element);
                var computedWidth = parseInt(computedStyle.getPropertyValue('width').replace(/px/gi, ''));
                var computedHeight = parseInt(computedStyle.getPropertyValue('height').replace(/px/gi, ''));
                element.style.width = Math.min(window.screen.width - 20, computedWidth) + 'px';
                element.style.height = Math.min(window.screen.height, computedHeight) + 'px';
                element.style.left = Math.max(10, window.innerWidth / 2 - computedWidth / 2) + 'px';
                element.style.top = Math.max(0, window.innerHeight / 2 - computedHeight / 2) + 'px';
            };
            UIComponent.prototype.delay = function (callback) {
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
            UIComponent.prototype.fadeIn = function (element) {
                element.classList.remove('duice-ui-fadeOut');
                element.classList.add('duice-ui-fadeIn');
            };
            UIComponent.prototype.fadeOut = function (element) {
                element.classList.remove('duice-ui-fadeIn');
                element.classList.add('duice-ui-fadeOut');
            };
            UIComponent.prototype.getCurrentMaxZIndex = function () {
                var zIndex, z = 0, all = document.getElementsByTagName('*');
                for (var i = 0, n = all.length; i < n; i++) {
                    zIndex = document.defaultView.getComputedStyle(all[i], null).getPropertyValue("z-index");
                    zIndex = parseInt(zIndex, 10);
                    z = (zIndex) ? Math.max(z, zIndex) : z;
                }
                return z;
            };
            UIComponent.prototype.block = function (element) {
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
            UIComponent.prototype.load = function (element) {
                var $this = this;
                var div = document.createElement('div');
                div.classList.add('duice-ui-load');
                div.style.position = 'fixed';
                div.style.opacity = '0';
                div.style.zIndex = String(this.getCurrentMaxZIndex() + 1);
                // on resize event
                this.getCurrentWindow().addEventListener('resize', function (event) {
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
            return UIComponent;
        }());
        ui.UIComponent = UIComponent;
        /**
         * duice.ui.Text
         */
        var Text = (function (_super) {
            __extends(Text, _super);
            function Text(span) {
                var _this = _super.call(this) || this;
                _this.div = span;
                return _this;
            }
            Text.prototype.setBind = function (map, name) {
                this.bindMap = map;
                this.bindName = name;
            };
            Text.prototype.setMode = function (mode) {
                this.mode = mode;
            };
            Text.prototype.build = function () {
                this.div.classList.add('duice-ui-text');
                this.bindMap.addObserver(this);
                this.update(null);
            };
            Text.prototype.update = function (observable) {
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
        }(UIComponent));
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
            };
            TextField.prototype.build = function () {
                var $this = this;
                this.bindMap.addObserver(this);
                this.input.addEventListener('change', function () {
                    $this.bindMap.set($this.bindName, this.value);
                });
                this.update(null);
            };
            TextField.prototype.update = function (observable) {
                this.input.value = this.bindMap.get(this.bindName);
                // checks enable
                if (this.bindMap.isEnable()) {
                    this.input.disabled = false;
                }
                else {
                    this.input.disabled = true;
                }
                // checks read-only
                if (this.bindMap.isReadonly(this.bindName)) {
                    this.input.setAttribute('readOnly', 'readOnly');
                }
                else {
                    this.input.removeAttribute('readOnly');
                }
            };
            return TextField;
        }(UIComponent));
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
            };
            TextArea.prototype.build = function () {
                var $this = this;
                this.bindMap.addObserver(this);
                this.textarea.addEventListener('change', function () {
                    $this.bindMap.set($this.bindName, this.value);
                });
                this.update(null);
            };
            TextArea.prototype.update = function (observable) {
                this.textarea.value = this.bindMap.get(this.bindName);
            };
            return TextArea;
        }(UIComponent));
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
            };
            ComboBox.prototype.setOption = function (list, value, text) {
                this.optionList = list;
                this.optionValue = value;
                this.optionText = text;
            };
            ComboBox.prototype.build = function () {
                var $this = this;
                this.bindMap.addObserver(this);
                this.select.addEventListener('change', function () {
                    $this.bindMap.set($this.bindName, this.value);
                });
                this.update(this.bindMap);
                this.optionList.addObserver(this);
                this.update(this.optionList);
            };
            ComboBox.prototype.update = function (observable) {
                if (observable === this.optionList) {
                    this.removeChildNodes(this.select);
                    for (var i = 0, size = this.optionList.getRowCount(); i < size; i++) {
                        var optionMap = this.optionList.getRow(i);
                        var option = document.createElement('option');
                        option.appendChild(document.createTextNode(optionMap.get(this.optionText)));
                        option.value = optionMap.get(this.optionValue);
                        this.select.appendChild(option);
                    }
                }
                if (observable === this.bindMap) {
                    var value = this.bindMap.get(this.bindName);
                    this.select.value = value;
                }
            };
            return ComboBox;
        }(UIComponent));
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
            };
            CheckBox.prototype.build = function () {
                var $this = this;
                this.bindMap.addObserver(this);
                this.input.addEventListener('change', function () {
                    $this.bindMap.set($this.bindName, this.checked);
                });
                this.update(null);
            };
            CheckBox.prototype.update = function (observable) {
                var value = this.bindMap.get(this.bindName);
                if (value === true) {
                    this.input.checked = true;
                }
                else {
                    this.input.checked = false;
                }
            };
            return CheckBox;
        }(UIComponent));
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
            };
            Radio.prototype.build = function () {
                var $this = this;
                this.bindMap.addObserver(this);
                this.input.addEventListener('change', function () {
                    $this.bindMap.set($this.bindName, this.value);
                });
                this.update(null);
            };
            Radio.prototype.update = function (observable) {
                var value = this.bindMap.get(this.bindName);
                if (value === this.input.value) {
                    this.input.checked = true;
                }
                else {
                    this.input.checked = false;
                }
            };
            return Radio;
        }(UIComponent));
        ui.Radio = Radio;
        /**
         * duice.ui.Calendar
         */
        var Calendar = (function (_super) {
            __extends(Calendar, _super);
            function Calendar(input) {
                var _this = _super.call(this) || this;
                _this.format = 'yyyy-MM-dd HH:mm:ss';
                _this.date = new Date();
                _this.windowClickListener = function (event) {
                    //if(this.dateTimePicker){
                    if (this.input.contains(event.target) || this.dateTimePicker.contains(event.target)) {
                        console.log('click inside.');
                    }
                    else {
                        console.log('click outside.');
                        this.closeDateTimePicker();
                    }
                    //}
                };
                _this.input = input;
                _this.input.classList.add('duice-ui-calendar');
                return _this;
            }
            Calendar.prototype.setBind = function (map, name) {
                this.bindMap = map;
                this.bindName = name;
            };
            Calendar.prototype.build = function () {
                var $this = this;
                this.bindMap.addObserver(this);
                this.input.addEventListener('change', function () {
                    $this.bindMap.set($this.bindName, this.value);
                });
                // date picker
                this.input.addEventListener('focus', function () {
                    $this.openDateTimePicker($this.date);
                });
            };
            Calendar.prototype.update = function (observable) {
                var value = this.bindMap.get(this.bindName);
                this.input.value = value;
            };
            Calendar.prototype.convertDateToString = function (date, format) {
                return null;
            };
            Calendar.prototype.convertStringToDate = function (string, format) {
                return null;
            };
            Calendar.prototype.openDateTimePicker = function (date) {
                var $this = this;
                this.dateTimePicker = document.createElement('div');
                this.dateTimePicker.classList.add('duice-ui-calendar-dateTimePicker');
                this.dateTimePicker.style.position = 'absolute';
                this.dateTimePicker.style.zIndex = String(this.getCurrentMaxZIndex());
                // click event listener
                this.windowClickListener = function (event) {
                    if (!$this.input.contains(event.target) && !$this.dateTimePicker.contains(event.target)) {
                        $this.closeDateTimePicker();
                    }
                };
                window.addEventListener('click', this.windowClickListener);
                // defines year, month, date integer.
                var yyyy = date.getFullYear();
                var mm = date.getMonth();
                var dd = date.getDate();
                var hh = date.getHours();
                var mi = date.getMinutes();
                var ss = date.getSeconds();
                // datePicker
                var datePicker = document.createElement('div');
                datePicker.classList.add('duice-ui-calendar-dateTimePicker-datePicker');
                this.dateTimePicker.appendChild(datePicker);
                // toolBar
                var toolBar = document.createElement('div');
                toolBar.classList.add('duice-ui-calendar-dateTimePicker-datePicker-toolBar');
                datePicker.appendChild(toolBar);
                // previous month button
                var prevMonth = document.createElement('button');
                prevMonth.classList.add('duice-ui-calendar-dateTimePicker-datePicker-toolBar-prevMonth');
                toolBar.appendChild(prevMonth);
                // today
                var today = document.createElement('button');
                today.classList.add('duice-ui-calendar-dateTimePicker-datePicker-toolBar-today');
                toolBar.appendChild(today);
                // year select
                var yearSelect = document.createElement('select');
                yearSelect.classList.add('duice-ui-calendar-dateTimePicker-datePicker-toolBar-yearSelect');
                toolBar.appendChild(yearSelect);
                for (var i = yyyy - 5, end = yyyy + 5; i <= end; i++) {
                    var option = document.createElement('option');
                    option.value = String(i);
                    option.text = String(i);
                    yearSelect.appendChild(option);
                }
                yearSelect.value = String(yyyy);
                yearSelect.addEventListener('change', function (event) {
                    //                    date.setFullYear(parseInt(this.value));
                    //                    $this.openDatePicker(date);
                });
                // divider
                toolBar.appendChild(document.createTextNode('-'));
                // month select
                var monthSelect = document.createElement('select');
                monthSelect.classList.add('duice-ui-calendar-dateTimePicker-datePicker-toolBar-monthSelect');
                toolBar.appendChild(monthSelect);
                for (var i = 1, end = 12; i <= end; i++) {
                    var option = document.createElement('option');
                    option.value = String(i);
                    option.text = String(i);
                    if (i === yyyy) {
                        option.setAttribute('selected', 'selected');
                    }
                    monthSelect.appendChild(option);
                }
                monthSelect.addEventListener('change', function (event) {
                    //                    date.setFullYear(parseInt(this.value));
                    //                    $this.openDatePicker(date);
                });
                monthSelect.value = String(mm);
                // next month button
                var nextMonth = document.createElement('button');
                nextMonth.classList.add('duice-ui-calendar-dateTimePicker-datePicker-toolBar-nextMonth');
                toolBar.appendChild(nextMonth);
                // calendar table
                var dateTable = document.createElement('table');
                dateTable.classList.add('duice-ui-calendar-dateTimePicker-datePicker-dateTable');
                this.dateTimePicker.appendChild(dateTable);
                var dayThead = document.createElement('thead');
                dateTable.appendChild(dayThead);
                var dayTr = document.createElement('tr');
                dayThead.appendChild(dayTr);
                ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(function (element) {
                    var dayTh = document.createElement('th');
                    dayTh.appendChild(document.createTextNode(element));
                    dayTr.appendChild(dayTh);
                });
                var dateTbody = document.createElement('tbody');
                dateTable.appendChild(dateTbody);
                var startDay = new Date(yyyy, mm, 1).getDay();
                var lastDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                if (yyyy % 4 && yyyy % 100 != 0 || yyyy % 400 === 0) {
                    lastDays[1] = 29;
                }
                var lastDay = lastDays[mm];
                var rowNum = Math.ceil((startDay + lastDay) / 7);
                var dNum = 1;
                var currentDate = new Date();
                for (var i = 1; i <= rowNum; i++) {
                    console.log('i', i);
                    var dateTr = document.createElement('tr');
                    for (var k = 1; k <= 7; k++) {
                        var dateTd = document.createElement('td');
                        if (dNum <= lastDay) {
                            dateTd.appendChild(document.createTextNode(String(dNum)));
                        }
                        dateTr.appendChild(dateTd);
                        dNum++;
                    }
                    dateTbody.appendChild(dateTr);
                }
                // timePicker
                var timePicker = document.createElement('div');
                timePicker.classList.add('duice-ui-calendar-dateTimePicker-timePicker');
                this.dateTimePicker.appendChild(timePicker);
                // now
                var now = document.createElement('button');
                now.classList.add('duice-ui-calendar-dateTimePicker-timePicker-now');
                timePicker.appendChild(now);
                // hourSelect
                var hourSelect = document.createElement('select');
                hourSelect.classList.add('duice-ui-calendar-dateTimePicker-timePicker-hourSelect');
                for (var i = 0; i < 23; i++) {
                    var option = document.createElement('option');
                    option.value = String(i);
                    option.text = String(i);
                    hourSelect.appendChild(option);
                }
                timePicker.appendChild(hourSelect);
                // divider
                timePicker.appendChild(document.createTextNode(':'));
                // minuteSelect
                var minuteSelect = document.createElement('select');
                minuteSelect.classList.add('duice-ui-calendar-dateTimePicker-timePicker-minuteSelect');
                for (var i = 0; i < 59; i++) {
                    var option = document.createElement('option');
                    option.value = String(i);
                    option.text = String(i);
                    minuteSelect.appendChild(option);
                }
                timePicker.appendChild(minuteSelect);
                // divider
                timePicker.appendChild(document.createTextNode(':'));
                // secondsSelect
                var secondSelect = document.createElement('select');
                secondSelect.classList.add('duice-ui-calendar-dateTimePicker-timePicker-secondSelect');
                for (var i = 0; i < 59; i++) {
                    var option = document.createElement('option');
                    option.value = String(i);
                    option.text = String(i);
                    secondSelect.appendChild(option);
                }
                timePicker.appendChild(secondSelect);
                // footer
                var footer = document.createElement('div');
                footer.classList.add('duice-ui-calendar-dateTimePicker-footer');
                this.dateTimePicker.appendChild(footer);
                // confirm
                var confirm = document.createElement('button');
                confirm.classList.add('duice-ui-calendar-dateTimePicker-footer-confirm');
                footer.appendChild(confirm);
                // show
                this.input.parentNode.appendChild(this.dateTimePicker);
                this.dateTimePicker.style.display = 'block';
            };
            Calendar.prototype.closeDateTimePicker = function () {
                this.dateTimePicker.style.display = 'none';
                this.dateTimePicker.remove();
                window.removeEventListener('click', this.windowClickListener);
            };
            return Calendar;
        }(UIComponent));
        ui.Calendar = Calendar;
        /**
         * duice.ui.Image
         */
        var Image = (function (_super) {
            __extends(Image, _super);
            function Image(img) {
                var _this = _super.call(this) || this;
                _this.limitSize = 1024 * 1024;
                _this.img = img;
                _this.img.classList.add('duice-ui-image');
                return _this;
            }
            Image.prototype.setBind = function (map, name) {
                this.bindMap = map;
                this.bindName = name;
            };
            Image.prototype.build = function () {
                var $this = this;
                this.input = document.createElement('input');
                this.input.setAttribute("type", "file");
                this.input.setAttribute("accept", "image/gif, image/jpeg, image/png");
                this.blank = this.img.src;
                // adds event listener for change
                this.img.addEventListener('click', function (e) {
                    if ($this.bindMap.isEnable() && $this.bindMap.isReadonly($this.bindName) == false) {
                        $this.input.click();
                    }
                });
                this.input.addEventListener('change', function (e) {
                    var fileReader = new FileReader();
                    if (this.files && this.files[0]) {
                        fileReader.addEventListener("load", function (e) {
                            var value = e.target.result;
                            var canvas = document.createElement("canvas");
                            var ctx = canvas.getContext("2d");
                            var image = document.createElement('img');
                            image.onload = function () {
                                ctx.drawImage(image, 0, 0);
                                value = canvas.toDataURL("image/png");
                                $this.bindMap.set($this.bindName, value);
                            };
                            image.src = value;
                        });
                        fileReader.readAsDataURL(this.files[0]);
                    }
                });
                // bind data
                this.bindMap.addObserver(this);
                this.img.addEventListener('error', function () {
                    console.log('error', this);
                });
                // update
                this.update(null);
            };
            Image.prototype.update = function (observable) {
                if (this.bindMap.get(this.bindName)) {
                    var src = this.bindMap.get(this.bindName);
                    this.img.src = src;
                }
                else {
                    this.img.src = this.blank;
                }
                if (this.bindMap.isEnable() && this.bindMap.isReadonly(this.bindName) == false) {
                    this.img.style.cursor = 'pointer';
                }
                else {
                    this.img.style.cursor = '';
                }
            };
            return Image;
        }(UIComponent));
        ui.Image = Image;
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
                return _this;
            }
            HtmlEditor.prototype.setBind = function (map, name) {
                this.bindMap = map;
                this.bindName = name;
            };
            HtmlEditor.prototype.build = function () {
                var $this = this;
                // create tool bar
                this.toolBar = document.createElement('div');
                this.toolBar.classList.add('duice-ui-htmlEditor-toolBar');
                this.div.appendChild(this.toolBar);
                // font family
                var fontfamily = document.createElement('select');
                fontfamily.classList.add('duice-ui-htmlEditor-toolBar-fontfamily');
                var defaultFont = window.getComputedStyle(this.div, null).getPropertyValue('font-family');
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
                this.toolBar.appendChild(fontfamily);
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
                this.toolBar.appendChild(fontsize);
                // bold
                var bold = document.createElement('button');
                bold.title = 'Bold';
                bold.classList.add('duice-ui-htmlEditor-toolBar-bold');
                bold.addEventListener('click', function () {
                    document.execCommand('bold', null, null);
                });
                this.toolBar.appendChild(bold);
                // italic
                var italic = document.createElement('button');
                italic.title = 'Italic';
                italic.classList.add('duice-ui-htmlEditor-toolBar-italic');
                italic.addEventListener('click', function () {
                    document.execCommand('italic', null, null);
                });
                this.toolBar.appendChild(italic);
                // underline
                var underline = document.createElement('button');
                underline.title = 'Underline';
                underline.classList.add('duice-ui-htmlEditor-toolBar-underline');
                underline.addEventListener('click', function () {
                    document.execCommand('underline', null, null);
                });
                this.toolBar.appendChild(underline);
                // align left
                var alignleft = document.createElement('button');
                alignleft.title = 'Align Left';
                alignleft.classList.add('duice-ui-htmlEditor-toolBar-alignleft');
                alignleft.addEventListener('click', function () {
                    document.execCommand('justifyLeft', null, null);
                });
                this.toolBar.appendChild(alignleft);
                // align center
                var aligncenter = document.createElement('button');
                aligncenter.title = 'Align Center';
                aligncenter.classList.add('duice-ui-htmlEditor-toolBar-aligncenter');
                aligncenter.addEventListener('click', function () {
                    document.execCommand('justifyCenter', null, null);
                });
                this.toolBar.appendChild(aligncenter);
                // align right
                var alignright = document.createElement('button');
                alignright.title = 'Align Right';
                alignright.classList.add('duice-ui-htmlEditor-toolBar-alignright');
                alignright.addEventListener('click', function () {
                    document.execCommand('justifyRight', null, null);
                });
                this.toolBar.appendChild(alignright);
                // indent increase
                var indentincrease = document.createElement('button');
                indentincrease.title = 'Indent';
                indentincrease.classList.add('duice-ui-htmlEditor-toolBar-indentincrease');
                indentincrease.addEventListener('click', function () {
                    document.execCommand('indent', null, null);
                });
                this.toolBar.appendChild(indentincrease);
                // indent decrease
                var indentdecrease = document.createElement('button');
                indentdecrease.title = 'Outdent';
                indentdecrease.classList.add('duice-ui-htmlEditor-toolBar-indentdecrease');
                indentdecrease.addEventListener('click', function () {
                    document.execCommand('outdent', null, null);
                });
                this.toolBar.appendChild(indentdecrease);
                // list order
                var listorder = document.createElement('button');
                listorder.title = 'Orderd List';
                listorder.classList.add('duice-ui-htmlEditor-toolBar-listorder');
                listorder.addEventListener('click', function () {
                    document.execCommand('insertorderedlist', null, null);
                });
                this.toolBar.appendChild(listorder);
                // list unorder
                var listunorder = document.createElement('button');
                listunorder.title = 'Unorderd List';
                listunorder.classList.add('duice-ui-htmlEditor-toolBar-listunorder');
                listunorder.addEventListener('click', function () {
                    document.execCommand('insertUnorderedList', null, null);
                });
                this.toolBar.appendChild(listunorder);
                // mode
                var mode = document.createElement('button');
                mode.title = 'Change Mode';
                mode.classList.add('duice-ui-htmlEditor-toolBar-mode');
                var $this = this;
                mode.addEventListener('click', function () {
                    $this.toggleMode();
                });
                this.toolBar.appendChild(mode);
                this.modeButton = mode;
                // create content
                this.content = document.createElement('div');
                this.content.classList.add('duice-ui-htmlEditor-content');
                this.contentHtml = document.createElement('div');
                this.contentHtml.contentEditable = 'true';
                this.content.appendChild(this.contentHtml);
                this.contentText = document.createElement('textarea');
                this.contentText.style.display = 'none';
                this.content.appendChild(this.contentText);
                this.div.appendChild(this.content);
                // bind element
                this.bindMap.addObserver(this);
                this.contentHtml.addEventListener('DOMSubtreeModified', function () {
                    if ($this.bindMap.get($this.bindName) !== this.innerHTML) {
                        $this.bindMap.set($this.bindName, this.innerHTML);
                    }
                });
                this.contentText.addEventListener('change', function () {
                    $this.bindMap.set($this.bindName, this.value);
                });
                // update
                this.update(null);
            };
            HtmlEditor.prototype.update = function (observable) {
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
                this.enableElement(this.toolBar, this.mode === 'html' ? true : false);
                this.modeButton.disabled = false;
            };
            return HtmlEditor;
        }(UIComponent));
        ui.HtmlEditor = HtmlEditor;
        /**
         * duice.ui.MarkdownEditor
         */
        var MarkdownEditor = (function (_super) {
            __extends(MarkdownEditor, _super);
            function MarkdownEditor(div) {
                var _this = _super.call(this) || this;
                _this.mode = 'markdown';
                _this.div = div;
                _this.div.classList.add('duice-ui-markdownEditor');
                return _this;
            }
            MarkdownEditor.prototype.setBind = function (map, name) {
                this.bindMap = map;
                this.bindName = name;
            };
            MarkdownEditor.prototype.build = function () {
                var $this = this;
                // create tool bar
                this.toolBar = document.createElement('div');
                this.toolBar.classList.add('duice-ui-markdownEditor-toolBar');
                this.div.appendChild(this.toolBar);
                // header
                var header = document.createElement('button');
                header.title = 'Header';
                header.classList.add('duice-ui-markdownEditor-toolBar-header');
                header.addEventListener('click', function (event) {
                    $this.insertMarkdown('#', '');
                });
                this.toolBar.appendChild(header);
                // bold
                var bold = document.createElement('button');
                bold.title = 'Bold';
                bold.classList.add('duice-ui-markdownEditor-toolBar-bold');
                bold.addEventListener('click', function (event) {
                    $this.insertMarkdown('**', '**');
                });
                this.toolBar.appendChild(bold);
                // italic
                var italic = document.createElement('button');
                italic.title = 'Italic';
                italic.classList.add('duice-ui-markdownEditor-toolBar-italic');
                italic.addEventListener('click', function () {
                    $this.insertMarkdown('__', '__');
                });
                this.toolBar.appendChild(italic);
                // cancel
                var cancel = document.createElement('button');
                cancel.title = 'Cancel';
                cancel.classList.add('duice-ui-markdownEditor-toolBar-cancel');
                cancel.addEventListener('click', function () {
                    $this.insertMarkdown('~~', '~~');
                });
                this.toolBar.appendChild(cancel);
                // list order
                var listorder = document.createElement('button');
                listorder.title = 'Orderd List';
                listorder.classList.add('duice-ui-markdownEditor-toolBar-listorder');
                listorder.addEventListener('click', function () {
                    $this.insertMarkdown('* ', '');
                });
                this.toolBar.appendChild(listorder);
                // list unorder
                var listunorder = document.createElement('button');
                listunorder.title = 'Unorderd List';
                listunorder.classList.add('duice-ui-markdownEditor-toolBar-listunorder');
                listunorder.addEventListener('click', function () {
                    $this.insertMarkdown('1. ', '');
                });
                this.toolBar.appendChild(listunorder);
                // line
                var line = document.createElement('button');
                line.title = 'Line';
                line.classList.add('duice-ui-markdownEditor-toolBar-line');
                line.addEventListener('click', function () {
                    $this.insertMarkdown('==========', '');
                });
                this.toolBar.appendChild(line);
                // code
                var code = document.createElement('button');
                code.title = 'Code Block';
                code.classList.add('duice-ui-markdownEditor-toolBar-code');
                code.addEventListener('click', function () {
                    $this.insertMarkdown('\n```\n', '\n```\n');
                });
                this.toolBar.appendChild(code);
                // image
                var image = document.createElement('button');
                image.title = 'Image Link';
                image.classList.add('duice-ui-markdownEditor-toolBar-image');
                image.addEventListener('click', function () {
                    //
                    $this.insertMarkdown(' ![Alt text](', ') ');
                });
                this.toolBar.appendChild(image);
                // link
                var link = document.createElement('button');
                link.title = 'URL Link';
                link.classList.add('duice-ui-markdownEditor-toolBar-link');
                link.addEventListener('click', function () {
                    $this.insertMarkdown(' [Title](', ') ');
                });
                this.toolBar.appendChild(link);
                // mode
                var $this = this;
                var mode = document.createElement('button');
                mode.title = 'Change Mode';
                mode.classList.add('duice-ui-markdownEditor-toolBar-mode');
                mode.addEventListener('click', function () {
                    $this.toggleMode();
                });
                this.toolBar.appendChild(mode);
                this.modeButton = mode;
                // create content
                this.content = document.createElement('div');
                this.content.classList.add('duice-ui-markdownEditor-content');
                this.contentMarkdown = document.createElement('textarea');
                this.contentMarkdown.addEventListener('keydown', function () {
                    $this.selectionStart = this.selectionStart;
                    $this.selectionEnd = this.selectionEnd;
                });
                this.content.appendChild(this.contentMarkdown);
                this.contentHtml = document.createElement('div');
                this.contentHtml.style.whiteSpace = 'normal';
                this.contentHtml.style.display = 'none';
                this.content.appendChild(this.contentHtml);
                this.div.appendChild(this.content);
                // bind data object
                this.bindMap.addObserver(this);
                this.contentMarkdown.addEventListener('change', function () {
                    $this.bindMap.set($this.bindName, this.value);
                });
                // updates data
                this.update(null);
            };
            MarkdownEditor.prototype.update = function (observable) {
                if (this.contentMarkdown.value !== this.bindMap.get(this.bindName)) {
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
                this.enableElement(this.toolBar, this.mode === 'markdown' ? true : false);
                this.modeButton.disabled = false;
            };
            return MarkdownEditor;
        }(UIComponent));
        ui.MarkdownEditor = MarkdownEditor;
        //        /**
        //         * duice.ui.CronExpression
        //         */
        //        export class CronExpression extends __ {
        //            constructor(input:HTMLInputElement){
        //                super();
        //            }
        //            setBind(list:duice.data.List):void {
        //            }
        //            update():void {
        //            }
        //        }
        //        /**
        //         * duice.ui.ListViewer
        //         */
        //        export class ListViewer extends __ {
        //            ul:HTMLUListElement;
        //            li:HTMLLIElement;
        //            bindList:duice.data.List;
        //            item:string;
        //            rows:Array<HTMLLIElement> = new Array<HTMLLIElement>();
        //            editable:boolean;
        //            constructor(ul:HTMLUListElement){
        //                super();
        //                this.ul = ul;
        //                this.ul.classList.add('duice-ui-listViewer');
        //                var li = this.ul.querySelector('li');
        //                this.li = <HTMLLIElement>li.cloneNode(true);
        //                this.ul.innerHTML = '';
        //            }
        //            setBind(list:duice.data.List):void {
        //                this.bindList = list;
        //                this.bindList.addObserver(this);   
        //            }
        //            setItem(item:string):void {
        //                this.item = item;
        //            }
        //            setEditable(editable:boolean):void {
        //                this.editable = editable;
        //            }
        //            update():void {
        //                var $this = this;
        //                
        //                // remove previous rows
        //                for(var i = 0; i < this.rows.length; i ++ ) {
        //                    this.ul.removeChild(this.rows[i]);
        //                }
        //                this.rows.length = 0;
        //                
        //                // creates new rows
        //                for(var index = 0; index < this.bindList.getRowCount(); index ++ ) {
        //                    var map = this.bindList.getRow(index);
        //                    var row = this.createRow(index,map);
        //                    this.ul.appendChild(row);
        //                    this.rows.push(row);
        //                }
        //            }
        //            createRow(index:number, bindMap:duice.data.Map):HTMLLIElement {
        //                var $this = this;
        //                var row:HTMLLIElement = <HTMLLIElement>this.li.cloneNode(true);
        //                var $context:any = new Object;
        //                $context['index'] = index;
        //                $context[this.item] = bindMap;
        //                row = this.executeExpression(<HTMLElement>row, $context);
        //                initialize(row,$context);
        //                return row;
        //            }
        //        }
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
            };
            TableViewer.prototype.setItem = function (item) {
                this.item = item;
            };
            TableViewer.prototype.setEditable = function (editable) {
                this.editable = editable;
            };
            TableViewer.prototype.build = function () {
                this.bindList.addObserver(this);
                this.update();
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
                row.addEventListener('mousedown', function (event) {
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
                        var fromIndex = parseInt(event.dataTransfer.getData('index'));
                        var toIndex = index;
                        $this.bindList.moveRow(fromIndex, toIndex);
                        $this.bindList.index = toIndex;
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
        }(UIComponent));
        ui.TableViewer = TableViewer;
        //        
        //        /**
        //         * duice.ui.TreeViewer
        //         */
        //        export class TreeViewer extends __ {
        //            setBind(list:duice.data.List):void {
        //            }
        //            update():void {
        //            }
        //        }
    })(ui = duice.ui || (duice.ui = {}));
})(duice || (duice = {}));
//DOMContentLoaded event process
document.addEventListener("DOMContentLoaded", function (event) {
    var $context = typeof self !== 'undefined' ? self :
        typeof window !== 'undefined' ? window :
            {};
    duice.initialize(document, $context);
});
