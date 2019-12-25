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
    var Observable = (function () {
        function Observable() {
            this.observers = new Array();
            this.changed = false;
        }
        Observable.prototype.addObserver = function (observer) {
            for (var i = 0, size = this.observers.length; i < size; i++) {
                if (this.observers[i] === observer) {
                    return;
                }
            }
            this.observers.push(observer);
        };
        Observable.prototype.notifyObservers = function (obj) {
            if (this.hasChanged()) {
                for (var i = 0, size = this.observers.length; i < size; i++) {
                    this.observers[i].update(this, obj);
                }
                this.clearChanged();
            }
        };
        Observable.prototype.setChanged = function () {
            this.changed = true;
        };
        Observable.prototype.hasChanged = function () {
            return this.changed;
        };
        Observable.prototype.clearChanged = function () {
            this.changed = false;
        };
        return Observable;
    }());
    duice.Observable = Observable;
    var BindException = (function () {
        function BindException(element, dataObject, name) {
            this.element = element;
            this.dataObject = dataObject;
            this.name = name;
        }
        return BindException;
    }());
    duice.BindException = BindException;
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
    duice.generateUUID = generateUUID;
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
    duice.getObject = getObject;
    ;
    /**
     * isEmpty
     * @param value
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
    duice.isEmpty = isEmpty;
    /**
     * defaultIfEmpty
     * @param value
     * @param defaultValue
     */
    function defaultIfEmpty(value, defaultValue) {
        if (isEmpty(value) === true) {
            return defaultValue;
        }
        else {
            return value;
        }
    }
    duice.defaultIfEmpty = defaultIfEmpty;
    /**
     * lpad
     * @param value
     * @param length
     * @param padChar
     */
    function lpad(value, length, padChar) {
        for (var i = 0, size = (length - value.length); i < size; i++) {
            value = padChar + value;
        }
        return value;
    }
    duice.lpad = lpad;
    /**
     * rpad
     * @param value
     * @param length
     * @param padChar
     */
    function rpad(value, length, padChar) {
        for (var i = 0, size = (length - value.length); i < size; i++) {
            value = value + padChar;
        }
        return value;
    }
    function mask(value, type, format) {
        switch (type) {
            // string type
            case 'string':
                var string = '';
                var index = -1;
                for (var i = 0, size = format.length; i < size; i++) {
                    var formatChar = format.charAt(i);
                    if (formatChar === '#') {
                        index++;
                        string += value.charAt(index);
                    }
                    else {
                        string += formatChar;
                    }
                }
                return string;
            // number
            case 'number':
                var number;
                if (typeof value === 'number') {
                    number = value;
                }
                else if (typeof value === 'string') {
                    value = value.replace(/\,/gi, '');
                    number = Number(value);
                }
                else {
                    number = Number(value);
                }
                if (isNaN(number)) {
                    throw 'NaN';
                }
                var scale = parseInt(format);
                var maskValue = String(number.toFixed(scale));
                var reg = /(^[+-]?\d+)(\d{3})/;
                while (reg.test(maskValue)) {
                    maskValue = maskValue.replace(reg, '$1' + ',' + '$2');
                }
                return maskValue;
            // date
            case 'date':
                var date;
                if (value instanceof Date) {
                    date = value;
                }
                else if (typeof value === 'number') {
                    date = new Date(value);
                }
                else {
                    throw 'Not Date Type';
                }
                var formatRex = /yyyy|yy|MM|dd|HH|hh|mm|ss/gi;
                var maskValue = format.replace(formatRex, function ($1) {
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
                return maskValue;
            // default
            default:
                throw 'encodeMask-type must be string|number|date';
        }
    }
    /**
     * unmask
     * @param value
     * @param type
     * @param format
     */
    function unmask(value, type, format) {
        switch (type) {
            // string type
            case 'string':
                if (isEmpty(value)) {
                    return null;
                }
                // TODO
                return value;
            // number type
            case 'number':
                if (isEmpty(value)) {
                    return null;
                }
                var number;
                if (typeof value === 'number') {
                    number = value;
                }
                else if (typeof value === 'string') {
                    value = value.replace(/,/g, '');
                    number = Number(value);
                }
                else {
                    number = Number(value);
                }
                if (isNaN(number)) {
                    throw 'NaN';
                }
                var scale = parseInt(format);
                return number.toFixed(scale);
            // date type
            case 'date':
                if (isEmpty(value)) {
                    return null;
                }
                if (value.length !== format.length) {
                    throw 'value length is mismatch:' + value;
                }
                var date = new Date();
                date.setFullYear(0);
                date.setMonth(0);
                date.setDate(1);
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                var formatRex = /yyyy|yy|MM|dd|HH|hh|mm|ss/gi;
                var match;
                while ((match = formatRex.exec(format)) != null) {
                    var formatStr = match[0];
                    var formatIndex = match.index;
                    var formatLength = formatStr.length;
                    var matchValue = value.substr(formatIndex, formatLength);
                    matchValue = lpad(matchValue, formatLength, '0');
                    if (isNaN(Number(matchValue))) {
                        throw 'Not a Date - ' + formatStr + ':' + matchValue;
                    }
                    switch (formatStr) {
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
                return date;
            // default 
            default:
                throw 'encodeMask-type must be string|number|date';
        }
    }
    /**
     * executeExpression
     * @param element
     * @param $context
     */
    function executeExpression(element, $context) {
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
    }
    /**
     * escapeHtml
     * @param value
     */
    function escapeHtml(value) {
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
        return value.replace(/[&<>"']/g, function (m) { return htmlMap[m]; });
    }
    /**
     * parseMarkdown
     * @param value
     */
    function parseMarkdown(value) {
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
    }
    /**
     * removeChildNodes
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
     * enableElement
     * @param element
     * @param enable
     */
    function enableElement(element, enable) {
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
    }
    /**
     * createDocumentFragment
     * @param html
     */
    function createDocumentFragment(html) {
        var template = document.createElement('template');
        template.innerHTML = html;
        return template.content;
    }
    /**
     * getCurrentWindow
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
     * getParentNode
     * @param element
     */
    function getParentNode(element) {
        var parentNode = element.parentNode;
        return parentNode;
    }
    /**
     * setPositionCentered
     * @param element
     */
    function setPositionCentered(element) {
        var window = this.getCurrentWindow();
        var computedStyle = window.getComputedStyle(element);
        var computedWidth = parseInt(computedStyle.getPropertyValue('width').replace(/px/gi, ''));
        var computedHeight = parseInt(computedStyle.getPropertyValue('height').replace(/px/gi, ''));
        element.style.width = Math.min(window.screen.width - 20, computedWidth) + 'px';
        element.style.height = Math.min(window.screen.height, computedHeight) + 'px';
        element.style.left = Math.max(10, window.innerWidth / 2 - computedWidth / 2) + 'px';
        element.style.top = Math.max(0, window.innerHeight / 2 - computedHeight / 2) + 'px';
    }
    /**
     * delay
     * @param callback
     */
    function delay(callback) {
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
    }
    /**
     * fadeIn
     * @param element
     */
    function fadeIn(element) {
        element.classList.remove('duice-ui-fadeOut');
        element.classList.add('duice-ui-fadeIn');
    }
    /**
     * fadeOut
     * @param element
     */
    function fadeOut(element) {
        element.classList.remove('duice-ui-fadeIn');
        element.classList.add('duice-ui-fadeOut');
    }
    /**
     * getCurrentMaxZIndex
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
     * block
     * @param element
     */
    function block(element) {
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
    }
    /**
     * load
     * @param element
     */
    function load(element) {
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
    }
    /**
     * duice.data
     */
    var data;
    (function (data) {
        /**
         * Abstract DataObject
         */
        var DataObject = (function (_super) {
            __extends(DataObject, _super);
            function DataObject() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return DataObject;
        }(Observable));
        data.DataObject = DataObject;
        /**
         * Map data structure
         */
        var Map = (function (_super) {
            __extends(Map, _super);
            function Map(json, __childName) {
                var _this = _super.call(this) || this;
                _this.data = new Object();
                _this.childNodes = new Array();
                _this.enable = true;
                _this.readonlyNames = new Array();
                if (json) {
                    _this.fromJson(json, __childName);
                }
                return _this;
            }
            Map.prototype.update = function (uiElement, obj) {
                console.info('Map.update', uiElement, obj);
                var name = uiElement.getName();
                var value = uiElement.getValue();
                this.set(name, value);
            };
            Map.prototype.fromJson = function (json, __childName) {
                // sets data
                this.data = new Object();
                for (var name in json) {
                    this.data[name] = json[name];
                }
                // makes child nodes
                var $this = this;
                if (__childName) {
                    var childs = json[__childName];
                    if (childs && Array.isArray(childs)) {
                        childs.forEach(function (child) {
                            var childNode = new duice.data.Map(child, __childName);
                            $this.addChildNode(childNode);
                        });
                    }
                }
                // saves original data.
                this.originData = JSON.stringify(this.toJson());
                // notify to observers
                this.setChanged();
                this.notifyObservers(this);
            };
            Map.prototype.toJson = function (__childName) {
                var json = new Object();
                for (var name in this.data) {
                    json[name] = this.data[name];
                }
                return json;
            };
            Map.prototype.isDirty = function () {
                if (JSON.stringify(this.toJson()) === this.originData) {
                    return false;
                }
                else {
                    return true;
                }
            };
            Map.prototype.reset = function () {
                var originJson = JSON.parse(this.originData);
                this.fromJson(originJson);
            };
            Map.prototype.set = function (name, value) {
                this.data[name] = value;
                this.setChanged();
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
            };
            Map.prototype.removeChildNode = function (index) {
                this.childNodes.splice(index, 1);
            };
            Map.prototype.setEnable = function (enable) {
                this.enable = enable;
                this.setChanged();
                this.notifyObservers(this);
            };
            Map.prototype.isEnable = function () {
                return this.enable;
            };
            Map.prototype.setReadonly = function (name, readonly) {
                if (this.readonlyNames.indexOf(name) == -1) {
                    this.readonlyNames.push(name);
                }
                this.setChanged();
                this.notifyObservers(this);
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
         * duice.data.Collection
         */
        var Collection = (function (_super) {
            __extends(Collection, _super);
            function Collection(jsonArray, __childName) {
                var _this = _super.call(this) || this;
                _this.data = new Array();
                _this.index = -1;
                if (jsonArray) {
                    _this.fromJson(jsonArray, __childName);
                }
                return _this;
            }
            Collection.prototype.update = function (observable, obj) {
                console.log('Collection.update');
                this.setChanged();
                this.notifyObservers(obj);
            };
            Collection.prototype.fromJson = function (jsonArray, __childName) {
                this.data = new Array();
                for (var i = 0; i < jsonArray.length; i++) {
                    var map = new duice.data.Map(jsonArray[i], __childName);
                    map.addObserver(this);
                    this.data.push(map);
                }
                this.originData = JSON.stringify(this.toJson());
                this.index = -1;
                this.setChanged();
                this.notifyObservers(this);
            };
            Collection.prototype.toJson = function (__childName) {
                var jsonArray = new Array();
                for (var i = 0; i < this.data.length; i++) {
                    jsonArray.push(this.data[i].toJson());
                }
                return jsonArray;
            };
            Collection.prototype.isDirty = function () {
                if (JSON.stringify(this.toJson()) === this.originData) {
                    return false;
                }
                else {
                    return true;
                }
            };
            Collection.prototype.reset = function () {
                var originJson = JSON.parse(this.originData);
                this.fromJson(originJson);
            };
            Collection.prototype.setIndex = function (index) {
                this.index = index;
                this.setChanged();
                this.notifyObservers(this);
            };
            Collection.prototype.getIndex = function () {
                return this.index;
            };
            Collection.prototype.clearIndex = function () {
                this.index = -1;
                this.setChanged();
                this.notifyObservers(this);
            };
            Collection.prototype.getSize = function () {
                return this.data.length;
            };
            Collection.prototype.get = function (index) {
                return this.data[index];
            };
            Collection.prototype.add = function (map) {
                map.addObserver(this);
                this.data.push(map);
                this.index = this.getSize() - 1;
                this.setChanged();
                this.notifyObservers(this);
            };
            Collection.prototype.insert = function (index, map) {
                if (0 <= index && index < this.data.length) {
                    map.addObserver(this);
                    this.data.splice(index, 0, map);
                    this.index = index;
                    this.setChanged();
                    this.notifyObservers(this);
                }
            };
            Collection.prototype.remove = function (index) {
                console.log(index);
                if (0 <= index && index < this.data.length) {
                    this.data.splice(index, 1);
                    this.index = Math.min(this.index, this.data.length - 1);
                    this.setChanged();
                    this.notifyObservers(this);
                }
            };
            Collection.prototype.move = function (fromIndex, toIndex) {
                this.index = fromIndex;
                this.data.splice(toIndex, 0, this.data.splice(fromIndex, 1)[0]);
                this.index = toIndex;
                this.setChanged();
                this.notifyObservers(this);
            };
            Collection.prototype.sort = function (name, ascending) {
                this.data.sort(function (a, b) {
                    var aValue = a.get(name);
                    var bValue = b.get(name);
                    return (aValue > bValue ? 1 : aValue < bValue ? -1 : 0) * (ascending == false ? -1 : 1);
                });
                this.setChanged();
                this.notifyObservers(this);
            };
            Collection.prototype.forEach = function (handler) {
                for (var i = 0, size = this.data.length; i < size; i++) {
                    handler.call(this, this.data[i]);
                }
            };
            Collection.prototype.findIndex = function (handler) {
                for (var i = 0, size = this.data.length; i < size; i++) {
                    if (handler.call(this, this.data[i]) === true) {
                        return i;
                    }
                }
                return -1;
            };
            Collection.prototype.findIndexes = function (handler) {
                var indexes = [];
                for (var i = 0, size = this.data.length; i < size; i++) {
                    if (handler.call(this, this.data[i]) === true) {
                        indexes.push(i);
                    }
                }
                return indexes;
            };
            Collection.prototype.findNode = function (handler) {
                var index = this.findIndex(handler);
                return this.get(index);
            };
            Collection.prototype.findNodes = function (handler) {
                var indexes = this.findIndexes(handler);
                var rows = new Array();
                for (var i = 0, size = indexes.length; i < size; i++) {
                    var node = this.get(indexes[i]);
                    rows.push(node);
                }
                return rows;
            };
            return Collection;
        }(DataObject));
        data.Collection = Collection;
        //        /**
        //         * duice.data.Tree
        //         */
        //        export class Tree extends DataObject {
        //            rootNode:duice.data.Map = new duice.data.Map({});
        //            index:any = [];
        //            constructor(jsonArray:Array<any>, childName:string) {
        //                super();
        //                this.fromJson(jsonArray, childName);
        //            }
        //            update(observable:Observable, obj:object):void {
        //                this.setChanged();
        //                this.notifyObservers(obj);
        //            }
        //            fromJson(jsonArray: Array<any>, childName:string): void {
        //                this.rootNode = new duice.data.Map({});
        //                for (var i = 0; i < jsonArray.length; i++) {
        //                    var json = jsonArray[i];
        //                    var childNode = createNodeTree(json, childName);
        //                    this.rootNode.addChildNode(childNode);
        //                }
        //
        //                // traverse function
        //                function createNodeTree(json: any, childName:string) {
        //                    var node = new duice.data.Map(json);
        //                    var childs = json[childName];
        //                    if (Array.isArray(childs)) {
        //                        for (var i = 0, size = childs.length; i < size; i++) {
        //                            var child = childs[i];
        //                            var childNode = createNodeTree(child, childName);
        //                            node.addChildNode(childNode);
        //                        }
        //                    }
        //                    return node;
        //                }
        //
        //                // set other properties.
        //                this.index = [];
        //                this.setChanged();
        //                this.notifyObservers(this);
        //            }
        //            toJson(childName: string): Array<object> {
        //                var jsonArray = new Array();
        //                var childNodes = this.rootNode.getChildNodes();
        //                for (var i = 0, size = childNodes.length; i < size; i++){
        //                    var childNode = childNodes[i];
        //                    var json = createJsonTree(childNode, childName);
        //                    jsonArray.push(json);
        //                }
        //
        //                // traverse function
        //                function createJsonTree(node: duice.data.Map, childName:string) {
        //                    var json:any = node.toJson();
        //                    json[childName] = new Array();
        //                    var childNodes = node.getChildNodes();
        //                    for (var i = 0, size = childNodes.length; i < size; i++){
        //                        var childJson = createJsonTree(childNodes[i], childName);
        //                        json[childName].push(childJson);
        //                    }
        //                    return json;
        //                }
        //
        //                // return jsonArray
        //                return jsonArray;
        //            }
        //            getRootNode():duice.data.Map {
        //                return this.rootNode;
        //            }
        //        }
    })(data = duice.data || (duice.data = {}));
    /**
     * duice.ui
     */
    var ui;
    (function (ui) {
        /**
         * duice.initialize
         * @param container
         * @param $context
         */
        function initialize(container, $context) {
            // ul
            var listElements = container.querySelectorAll('ul[is="duice-ui-list"][data-duice-bind]:not([data-duice-id])');
            for (var i = 0; i < listElements.length; i++) {
                try {
                    var element = listElements[i];
                    duice.ui.ListFactory.getList(element, $context);
                }
                catch (e) {
                    console.error(e, element);
                    throw e;
                }
            }
            // table
            var tableElements = container.querySelectorAll('table[is="duice-ui-table"][data-duice-bind]:not([data-duice-id])');
            for (var i = 0; i < tableElements.length; i++) {
                try {
                    var element = tableElements[i];
                    duice.ui.TableFactory.getTable(element, $context);
                }
                catch (e) {
                    console.error(e, element);
                    throw e;
                }
            }
            // creates unit elements
            var elementTags = [
                'span[is="duice-ui-span"][data-duice-bind]:not([data-duice-id])',
                'input[is="duice-ui-input"][data-duice-bind]:not([data-duice-id])',
                'select[is="duice-ui-select"][data-duice-bind]:not([data-duice-id])',
                'textarea[is="duice-ui-textarea"][data-duice-bind]:not([data-duice-id])'
            ];
            var elements = container.querySelectorAll(elementTags.join(','));
            for (var i = 0; i < elements.length; i++) {
                try {
                    var element = elements[i];
                    var type = element.dataset.duice;
                    var is = element.getAttribute('is');
                    switch (is) {
                        case 'duice-ui-span':
                            duice.ui.SpanFactory.getSpan(element, $context);
                            break;
                        case 'duice-ui-input':
                            duice.ui.InputFactory.getInput(element, $context);
                            break;
                        case 'duice-ui-select':
                            duice.ui.SelectFactory.getSelect(element, $context);
                            break;
                        case 'duice-ui-textarea':
                            duice.ui.TextareaFactory.getTextarea(element, $context);
                            break;
                    }
                }
                catch (e) {
                    console.error(e, elements[i]);
                    throw e;
                }
            }
        }
        ui.initialize = initialize;
        var UIElement = (function (_super) {
            __extends(UIElement, _super);
            function UIElement(element) {
                var _this = _super.call(this) || this;
                element.dataset.duiceId = generateUUID();
                return _this;
            }
            return UIElement;
        }(Observable));
        ui.UIElement = UIElement;
        var MapUIElement = (function (_super) {
            __extends(MapUIElement, _super);
            function MapUIElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MapUIElement.prototype.bind = function (map, name) {
                if (map instanceof duice.data.Map === false) {
                    throw new BindException(this, map, name);
                }
                this.map = map;
                this.name = name;
                this.map.addObserver(this);
                this.addObserver(this.map);
                this.update(this.map, this);
            };
            MapUIElement.prototype.getMap = function () {
                return this.map;
            };
            MapUIElement.prototype.getName = function () {
                return this.name;
            };
            return MapUIElement;
        }(UIElement));
        ui.MapUIElement = MapUIElement;
        /**
         * duice.ui.SpanFactory
         */
        ui.SpanFactory = {
            getSpan: function (element, $context) {
                var span = new Span(element);
                var bind = element.dataset.duiceBind.split(',');
                span.bind(getObject($context, bind[0]), bind[1]);
                return span;
            }
        };
        /**
         * duice.ui.Span
         */
        var Span = (function (_super) {
            __extends(Span, _super);
            function Span(span) {
                var _this = _super.call(this, span) || this;
                _this.span = span;
                _this.span.classList.add('duice-ui-span');
                return _this;
            }
            Span.prototype.update = function (map, obj) {
                var value = map.get(this.name);
                removeChildNodes(this.span);
                this.span.appendChild(document.createTextNode(defaultIfEmpty(value, '')));
            };
            Span.prototype.getValue = function () {
                return defaultIfEmpty(this.span.innerHTML, null);
            };
            return Span;
        }(MapUIElement));
        ui.Span = Span;
        /**
         * duice.ui.InputFactory
         */
        ui.InputFactory = {
            getInput: function (element, $context) {
                var input;
                switch (element.getAttribute('type')) {
                    case 'text':
                        input = new TextInput(element);
                        break;
                    case 'number':
                        input = new NumberInput(element);
                        break;
                    case 'checkbox':
                        input = new CheckboxInput(element);
                        break;
                    case 'radio':
                        input = new RadioInput(element);
                        break;
                    case 'date':
                    case 'datetime':
                        input = new DateInput(element);
                        break;
                    default:
                        input = new GenericInput(element);
                }
                var bind = element.dataset.duiceBind.split(',');
                input.bind(getObject($context, bind[0]), bind[1]);
                return input;
            }
        };
        /**
         * duice.ui.Input
         */
        var Input = (function (_super) {
            __extends(Input, _super);
            function Input(input) {
                var _this = _super.call(this, input) || this;
                _this.input = input;
                var $this = _this;
                _this.input.addEventListener('change', function (event) {
                    $this.setChanged();
                    $this.notifyObservers(this);
                });
                // disabled drag in case of parent element is draggable.
                _this.input.setAttribute('draggable', 'true');
                _this.input.addEventListener('dragstart', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                });
                return _this;
            }
            return Input;
        }(MapUIElement));
        ui.Input = Input;
        /**
         * duice.ui.GenericInput
         */
        var GenericInput = (function (_super) {
            __extends(GenericInput, _super);
            function GenericInput(input) {
                var _this = _super.call(this, input) || this;
                _this.input.classList.add('duice-ui-genericInput');
                return _this;
            }
            GenericInput.prototype.update = function (map, obj) {
                var value = map.get(this.getName());
                this.input.value = defaultIfEmpty(value, '');
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
        var TextInput = (function (_super) {
            __extends(TextInput, _super);
            function TextInput(input) {
                var _this = _super.call(this, input) || this;
                _this.input.classList.add('duice-ui-textInput');
                return _this;
            }
            TextInput.prototype.update = function (map, obj) {
                var value = map.get(this.getName());
                this.input.value = defaultIfEmpty(value, '');
            };
            TextInput.prototype.getValue = function () {
                return defaultIfEmpty(this.input.value, null);
            };
            return TextInput;
        }(Input));
        ui.TextInput = TextInput;
        /**
         * duice.ui.NumberInput
         */
        var NumberInput = (function (_super) {
            __extends(NumberInput, _super);
            function NumberInput(input) {
                var _this = _super.call(this, input) || this;
                _this.input.classList.add('duice-ui-numberInput');
                return _this;
            }
            NumberInput.prototype.update = function (map, obj) {
                var value = map.get(this.getName());
                this.input.value = String(defaultIfEmpty(value, 0));
            };
            NumberInput.prototype.getValue = function () {
                return Number(defaultIfEmpty(this.input.value, '0'));
            };
            return NumberInput;
        }(Input));
        ui.NumberInput = NumberInput;
        /**
         * duice.ui.CheckboxInput
         */
        var CheckboxInput = (function (_super) {
            __extends(CheckboxInput, _super);
            function CheckboxInput(input) {
                var _this = _super.call(this, input) || this;
                _this.input.classList.add('duice-ui-checkboxInput');
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
            };
            CheckboxInput.prototype.getValue = function () {
                return this.input.checked;
            };
            return CheckboxInput;
        }(Input));
        ui.CheckboxInput = CheckboxInput;
        /**
         * duice.ui.RadioInput
         */
        var RadioInput = (function (_super) {
            __extends(RadioInput, _super);
            function RadioInput(input) {
                var _this = _super.call(this, input) || this;
                _this.input.classList.add('duice-ui-radioInput');
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
            };
            RadioInput.prototype.getValue = function () {
                return this.input.value;
            };
            return RadioInput;
        }(Input));
        ui.RadioInput = RadioInput;
        /**
         * duice.ui.DateInput
         */
        var DateInput = (function (_super) {
            __extends(DateInput, _super);
            function DateInput(input) {
                var _this = _super.call(this, input) || this;
                _this.type = _this.input.getAttribute('type').toLowerCase();
                _this.input.setAttribute('type', 'text');
                _this.input.classList.add('duice-ui-dateInput');
                var $this = _this;
                _this.input.addEventListener('click', function (event) {
                    $this.openPicker();
                });
                return _this;
            }
            DateInput.prototype.update = function (map, obj) {
                var value = map.get(this.getName());
                if (isEmpty(value)) {
                    this.input.value = '';
                }
                else {
                    value = new Date(value);
                    this.input.value = value.toString();
                }
            };
            DateInput.prototype.getValue = function () {
                var value = this.input.value;
                if (isEmpty(value)) {
                    return null;
                }
                else {
                    return new Date(value).getTime();
                }
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
                    $this.input.value = String(date.toString());
                    $this.setChanged();
                    $this.notifyObservers(this);
                    $this.closePicker();
                });
                // show
                this.input.parentNode.insertBefore(this.pickerDiv, this.input.nextSibling);
                this.pickerDiv.style.position = 'absolute';
                this.pickerDiv.style.zIndex = String(getCurrentMaxZIndex() + 1);
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
                this.pickerDiv.remove();
                this.pickerDiv = null;
                window.removeEventListener('click', this.clickListener);
            };
            return DateInput;
        }(Input));
        ui.DateInput = DateInput;
        /**
         * duice.ui.SpanFactory
         */
        ui.SelectFactory = {
            getSelect: function (element, $context) {
                var select = new Select(element);
                var option = element.dataset.duiceOption.split(',');
                var optionList = getObject($context, option[0]);
                var optionValue = option[1];
                var optionText = option[2];
                select.setOption(optionList, optionValue, optionText);
                var bind = element.dataset.duiceBind.split(',');
                select.bind(getObject($context, bind[0]), bind[1]);
                return select;
            }
        };
        /**
         * duice.ui.Select
         */
        var Select = (function (_super) {
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
                this.optionList.addObserver({
                    update: function (list) {
                        updateOption(list);
                    }
                });
            };
            Select.prototype.update = function (map, obj) {
                var value = map.get(this.getName());
                this.select.value = defaultIfEmpty(value, '');
            };
            Select.prototype.getValue = function () {
                var value = this.select.value;
                return defaultIfEmpty(value, null);
            };
            return Select;
        }(MapUIElement));
        ui.Select = Select;
        /**
         * duice.ui.TextareaFactory
         */
        ui.TextareaFactory = {
            getTextarea: function (element, $context) {
                var textarea = new Textarea(element);
                var bind = element.dataset.duiceBind.split(',');
                textarea.bind(getObject($context, bind[0]), bind[1]);
                return textarea;
            }
        };
        /**
         * duice.ui.Textarea
         */
        var Textarea = (function (_super) {
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
            };
            Textarea.prototype.getValue = function () {
                return defaultIfEmpty(this.textarea.value, null);
            };
            return Textarea;
        }(MapUIElement));
        ui.Textarea = Textarea;
        /**
         * duice.ui.CollectionUIElement
         */
        var CollectionUIElement = (function (_super) {
            __extends(CollectionUIElement, _super);
            function CollectionUIElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            CollectionUIElement.prototype.bind = function (list, item) {
                this.collection = list;
                this.item = item;
                this.collection.addObserver(this);
                this.addObserver(this.collection);
                this.update(this.collection, this);
            };
            CollectionUIElement.prototype.getCollection = function () {
                return this.collection;
            };
            CollectionUIElement.prototype.getItem = function () {
                return this.item;
            };
            return CollectionUIElement;
        }(UIElement));
        ui.CollectionUIElement = CollectionUIElement;
        /**
         * duice.ui.TableFactory
         */
        ui.TableFactory = {
            getTable: function (element, $context) {
                var table = new Table(element);
                if (element.dataset.duiceEditable) {
                    table.setEditable(Boolean(element.dataset.duiceEditable));
                }
                var bind = element.dataset.duiceBind.split(',');
                table.bind(getObject($context, bind[0]), bind[1]);
                return table;
            }
        };
        /**
         * duice.ui.TableViewer
         */
        var Table = (function (_super) {
            __extends(Table, _super);
            function Table(table) {
                var _this = _super.call(this, table) || this;
                _this.rows = new Array();
                _this.table = table;
                _this.table.classList.add('duice-ui-table');
                _this.thead = _this.table.querySelector('thead');
                _this.thead.classList.add('duice-ui-table__thead');
                var tbody = _this.table.querySelector('tbody');
                _this.tbody = tbody.cloneNode(true);
                _this.tbody.classList.add('duice-ui-table__tbody');
                _this.table.removeChild(tbody);
                return _this;
            }
            Table.prototype.setEditable = function (editable) {
                this.editable = editable;
            };
            Table.prototype.update = function (collection, obj) {
                // checks changed source instance
                if (obj instanceof duice.data.Map) {
                    return;
                }
                var $this = this;
                // remove previous rows
                for (var i = 0; i < this.rows.length; i++) {
                    this.table.removeChild(this.rows[i]);
                }
                this.rows.length = 0;
                // creates new rows
                for (var index = 0; index < collection.getSize(); index++) {
                    var map = collection.get(index);
                    var row = this.createRow(index, map);
                    row.dataset.duiceIndex = String(index);
                    // select index
                    if (index == collection.index) {
                        row.classList.add('duice-ui-table__tbody--index');
                    }
                    row.addEventListener('mousedown', function (event) {
                        for (var i = 0; i < $this.rows.length; i++) {
                            $this.rows[i].classList.remove('duice-ui-table__tbody--index');
                        }
                        this.classList.add('duice-ui-table__tbody--index');
                        collection.index = Number(this.dataset.duiceIndex);
                    });
                    // drag and drop event
                    if (this.editable === true) {
                        row.setAttribute('draggable', 'true');
                        row.addEventListener('dragstart', function (event) {
                            event.dataTransfer.setData("fromIndex", this.dataset.duiceIndex);
                        });
                        row.addEventListener('dragover', function (event) {
                            event.preventDefault();
                            event.stopPropagation();
                        });
                        row.addEventListener('drop', function (event) {
                            event.preventDefault();
                            event.stopPropagation();
                            var fromIndex = parseInt(event.dataTransfer.getData('fromIndex'));
                            var toIndex = parseInt(this.dataset.duiceIndex);
                            collection.move(fromIndex, toIndex);
                            row.click();
                        });
                    }
                    this.table.appendChild(row);
                    this.rows.push(row);
                }
                // not found row
                if (collection.getSize() < 1) {
                    var emptyRow = this.createEmptyRow();
                    this.table.appendChild(emptyRow);
                    this.rows.push(emptyRow);
                }
            };
            Table.prototype.createRow = function (index, map) {
                var $this = this;
                var row = this.tbody.cloneNode(true);
                var $context = new Object;
                $context['index'] = index;
                $context[this.item] = map;
                row = executeExpression(row, $context);
                initialize(row, $context);
                return row;
            };
            Table.prototype.createEmptyRow = function () {
                var emptyRow = this.tbody.cloneNode(true);
                removeChildNodes(emptyRow);
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
            return Table;
        }(CollectionUIElement));
        ui.Table = Table;
        /**
         * duice.ui.ListFactory
         */
        ui.ListFactory = {
            getList: function (element, $context) {
                var list = new List(element);
                if (element.dataset.duiceEditable) {
                    list.setEditable(Boolean(element.dataset.duiceEditable));
                }
                var bind = element.dataset.duiceBind.split(',');
                list.bind(getObject($context, bind[0]), bind[1]);
                return list;
            }
        };
        /**
         * duice.ui.List
         */
        var List = (function (_super) {
            __extends(List, _super);
            function List(ul) {
                var _this = _super.call(this, ul) || this;
                _this.lis = new Array();
                _this.ul = ul;
                _this.ul.classList.add('duice-ui-list');
                var li = _this.ul.querySelector('li');
                _this.li = li.cloneNode(true);
                _this.ul.innerHTML = '';
                return _this;
            }
            List.prototype.setEditable = function (editable) {
                this.editable = editable;
            };
            List.prototype.update = function (collection, obj) {
                // checks changed source instance
                if (obj instanceof duice.data.Map) {
                    return;
                }
                console.log('####collection', collection);
                var $this = this;
                // remove previous rows
                for (var i = 0; i < this.lis.length; i++) {
                    this.ul.removeChild(this.lis[i]);
                }
                this.lis.length = 0;
                // creates new rows
                for (var index = 0; index < collection.getSize(); index++) {
                    var map = collection.get(index);
                    var li = this.createLi(index, map);
                    this.ul.appendChild(li);
                    this.lis.push(li);
                }
            };
            List.prototype.createLi = function (index, map) {
                var $this = this;
                var li = this.li.cloneNode(true);
                var $context = new Object;
                $context['index'] = index;
                $context[this.item] = map;
                li = executeExpression(li, $context);
                initialize(li, $context);
                console.log('####map', map);
                // create child nodes
                var childNodes = map.getChildNodes();
                if (childNodes && childNodes.length > 0) {
                    console.log('############');
                    var ul = document.createElement('ul');
                    for (var i = 0, size = childNodes.length; i < size; i++) {
                        var childNode = childNodes[i];
                        var childLi = this.createLi(i, childNode);
                        ul.appendChild(childLi);
                    }
                    li.appendChild(ul);
                }
                return li;
            };
            return List;
        }(CollectionUIElement));
        ui.List = List;
    })(ui = duice.ui || (duice.ui = {})); // end of duice.ui
})(duice || (duice = {})); // end
(function (duice) {
    var dialog;
    (function (dialog) {
        function initialize(container, $context) {
        }
        dialog.initialize = initialize;
        var Dialog = (function () {
            function Dialog() {
            }
            return Dialog;
        }());
        dialog.Dialog = Dialog;
        var Alert = (function () {
            function Alert() {
            }
            return Alert;
        }());
        dialog.Alert = Alert;
        var Confirm = (function () {
            function Confirm() {
            }
            return Confirm;
        }());
        dialog.Confirm = Confirm;
        var Prompt = (function () {
            function Prompt() {
            }
            return Prompt;
        }());
        dialog.Prompt = Prompt;
    })(dialog = duice.dialog || (duice.dialog = {}));
})(duice || (duice = {}));
//DOMContentLoaded event process
document.addEventListener("DOMContentLoaded", function (event) {
    var $context = typeof self !== 'undefined' ? self :
        typeof window !== 'undefined' ? window :
            {};
    duice.ui.initialize(document, $context);
    duice.dialog.initialize(document, $context);
});
