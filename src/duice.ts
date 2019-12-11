namespace duice {
    
    /**
     * duice.generateUUID
     */
    export function generateUUID():string {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (dt + Math.random()*16)%16 | 0;
            dt = Math.floor(dt/16);
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return uuid;
    }
    
    /**
     * duice.getObject
     * @param $context
     * @param name
     */
    export function getObject($context:any, name:string) {
        if($context.hasOwnProperty(name)){
            return $context[name];
        }
        if((<any>window).hasOwnProperty(name)){
            return (<any>window)[name];
        }
        try {
            return eval(name);
        }catch(e){
            console.error(e,$context, name);
            throw e;
        }
    };
    
    /**
     * duice.data
     */
    export namespace data {
        
        /**
         * Super prototype of duice.data
         */
        export abstract class __ {
            observers:Array<any> = new Array<any>();
            addObserver(observer:any): void {
                for(var i = 0, size = this.observers.length; i < size; i++){
                    if(this.observers[i] === observer){
                        return;
                    }
                }
                this.observers.push(observer);
            }
            notifyObservers(observer:any): void {
                for(var i = 0, size = this.observers.length; i < size; i++){
                    if(this.observers[i] === observer){
                        continue;
                    }
                    this.observers[i].update();
                }
            }
            update():void {
                this.notifyObservers(this);
            }
        }
        
        /**
         * Map data structure
         */
        export class Map extends __ {
            data:any = new Object();
            parentNode:Map;
            childNodes:Array<Map> = new Array<Map>();
            constructor(json:any) {
                super();
                this.fromJson(json);
            }
            fromJson(json: any): void {
                this.data = new Object();
                for(var name in json){
                    this.data[name] = json[name];
                }
                this.notifyObservers(this);
            }
            toJson():object {
                var json: any = new Object();
                for(var name in this.data){
                    json[name] = this.data[name];
                }
                return json;
            }
            set(name:string, value:any):void {
                this.data[name] = value;
                this.notifyObservers(this);
            }
            get(name:string):any {
                return this.data[name];
            }
            getNames():any[]{
                var names = new Array();
                for(var name in this.data){
                    names.push(name);
                }
                return names;
            }
            setParentNode(parentNode:Map):void {
                this.parentNode = parentNode;
            }
            getParentNode():Map {
                return this.parentNode;
            }
            getChildNodes():Array<Map> {
                return this.childNodes;
            }
            getChildNode(index:number):Map {
                return this.childNodes[index];
            }
            addChildNode(node:Map):void {
                node.setParentNode(this);
                this.childNodes.push(node);
            }
            insertChildNode(index:number, node:Map):void {
                node.setParentNode(this);
                this.childNodes.splice(index, 0, node);
                node.addObserver(this);
            }
            removeChildNode(index:number):void {
                this.childNodes.splice(index,1);
            }
        }
        
        /**
         * List data structure
         */
        export class List extends __ {
            mapList:Array<Map> = new Array<Map>();
            index:number = -1;
            constructor(jsonArray:Array<any>) {
                super();
                this.fromJson(jsonArray);
            }
            fromJson(jsonArray:Array<any>):void {
                this.mapList = new Array<Map>();
                for(var i = 0; i < jsonArray.length; i ++ ) {
                    var map = new duice.data.Map(jsonArray[i]);
                    map.addObserver(this);
                    this.mapList.push(map);
                }
                this.index = -1;
                this.notifyObservers(this);
            }
            toJson():Array<object> {
                var jsonArray = new Array();
                for(var i = 0; i < this.mapList.length; i ++){
                    jsonArray.push(this.mapList[i].toJson());
                }
                return jsonArray;
            }
            setIndex(index:number):void {
                this.index = index;
                this.notifyObservers(this);
            }
            getIndex():number {
                return this.index;
            }
            clearIndex():void {
                this.index = -1;
                this.notifyObservers(this);
            }
            getRowCount():number {
                return this.mapList.length;
            }
            getRow(index:number):Map {
                return this.mapList[index];
            }
            addRow(map:Map):void {
                map.addObserver(this);
                this.mapList.push(map);
                this.index = this.getRowCount();
                this.notifyObservers(this);
            }
            insertRow(index:number, map:Map):void {
                map.addObserver(this);
                this.mapList.splice(index, 0, map);
                this.index = index;
                this.notifyObservers(this);
            }
            removeRow(index:number):void {
                this.mapList.splice(index, 1);
                this.notifyObservers(this);
            }
            moveRow(fromIndex:number, toIndex:number):void {
                this.index = fromIndex;
                this.mapList.splice(toIndex, 0, this.mapList.splice(fromIndex, 1)[0]);
                this.index = toIndex;
                this.notifyObservers(this);
            }
            sortRow(name:string, ascending:boolean):void {
                this.mapList.sort(function(a:duice.data.Map,b:duice.data.Map):number {
                    var aValue = a.get(name);
                    var bValue = b.get(name);
                    return (aValue > bValue ? 1 : aValue < bValue ? -1 : 0) * (ascending == false ? -1 : 1);
                });
            }
            forEach(handler:Function):void {
                for(var i = 0, size = this.mapList.length; i < size; i ++){
                    handler.call(this, this.mapList[i]);
                }
            }
            findIndex(handler:Function):number {
                for(var i = 0, size = this.mapList.length; i < size; i ++){
                    if(handler.call(this, this.mapList[i]) === true){
                        return i;
                    }
                }
                return -1;
            }
            findIndexes(handler:Function):Array<number> {
                var indexes = [];
                for(var i = 0, size = this.mapList.length; i < size; i ++){
                    if(handler.call(this, this.mapList[i]) === true){
                        indexes.push(i);
                    }
                }
                return indexes;
            }
            findRow(handler:Function):Map {
                var index = this.findIndex(handler);
                return this.getRow(index);
            }
            findRows(handler:Function):Array<Map> {
                var indexes = this.findIndexes(handler);
                var rows = new Array();
                for(var i = 0, size = indexes.length; i < size; i ++){
                    var node = this.getRow(indexes[i]);
                    rows.push(node);
                }
                return rows;
            }
        }
        
        /**
         * Tree data structure
         */
        export class Tree extends __ {
            index:Array<number> = [];
            rootNode:Map = new Map({});
            Tree(jsonArray:Array<any>, childNodeName:string):void {
                if(jsonArray) {
                    this.fromJson(jsonArray, childNodeName);
                }
            }
            fromJson(jsonArray:Array<Map>, childNodeName:string) {
                this.rootNode = new Map({});
                this.addObserver(this);
            }
        }
    }
    
    /**
     * duice.data
     */
    export namespace ui {
        
        /**
         * duice.initialize
         * @param container
         * @param $context
         */
        export function initialize(container:any, $context:any):void {
            
            // creates TableViewer
            var tableViewerElements = container.querySelectorAll('table[data-duice="TableView"]');
            for(var i = 0; i < tableViewerElements.length; i++ ) {
                try {
                    var tableViewerElement = tableViewerElements[i];
                    var tableViewer = new duice.ui.TableViewer(tableViewerElement);
                    var bind = tableViewerElement.dataset.duiceBind;
                    tableViewer.setBind(getObject($context,bind));
                    var item = tableViewerElement.dataset.duiceItem;
                    tableViewer.setItem(item);
                    tableViewer.setEditable((tableViewerElement.dataset.duiceEditable === 'true'));
                    tableViewer.update();
                    tableViewerElement.dataset.duice += generateUUID();
                    console.log(tableViewer);
                }catch(e){
                    console.error(e,tableViewerElement);
                    throw e;
                }
            }
            
            // creates unit elements
            var elementTags = [
                 'div[data-duice="Text"]'
                ,'input[data-duice="TextField"]'
                ,'textarea[data-duice="TextArea"]'
                ,'select[data-duice="ComboBox"]'
                ,'input[data-duice="CheckBox"]'
                ,'input[data-duice="Radio"]'
                ,'div[data-duice="HtmlEditor"]'
                ,'div[data-duice="MarkdownEditor"]'
    // --
                ,'img[data-duice="Image"]'
                ,'input[data-duice="CronExpression"]'
            ];
            var elements = container.querySelectorAll(elementTags.join(','));
            for(var i = 0; i < elements.length; i ++ ) {
                try {
                    var element:any = elements[i];
                    var type:string = element.dataset.duice;
                    var bind:any = element.dataset.duiceBind.split(',');
                    switch(type) {
                        case 'Text':
                            var text:duice.ui.Text = new duice.ui.Text(element);
                            var format = element.dataset.duiceFormat;
                            text.setBind(getObject($context,bind[0]), bind[1]);
                            text.setMode(element.dataset.duiceMode);
                            text.update();
                        break;
                        case 'TextField':
                            var textField = new duice.ui.TextField(element);
                            textField.setBind(getObject($context,bind[0]), bind[1]);
                            textField.update();
                        break;
                        case 'TextArea':
                            console.log("fdsafdsafdsa");
                            var textArea = new duice.ui.TextArea(element);
                            textArea.setBind(getObject($context,bind[0]), bind[1]);
                            textArea.update();
                        break;
                        case 'ComboBox':
                            var comboBox = new duice.ui.ComboBox(element);
                            comboBox.setBind(getObject($context,bind[0]), bind[1]);
                            var option:Array<any> = element.dataset.duiceOption.split(',');
                            comboBox.setOption(getObject($context,option[0]), option[1], option[2]);
                            comboBox.update();
                        break;
                        case 'CheckBox':
                            var checkBox = new duice.ui.CheckBox(element);
                            checkBox.setBind($context[bind[0]], bind[1]);
                            var option:Array<any> = element.dataset.duiceOption.split(',');
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
                }catch(e){
                    console.error(e, elements[i]);
                    throw e;
                }
            }
        }
        
        /**
         * Super prototype of duice.ui
         */
        export abstract class __ {
            abstract setBind(...args: any[]):void;
            abstract update(): void;
            executeExpression(element:HTMLElement, $context:any):any {
                var string = element.outerHTML;
                string = string.replace(/\[\[(.*?)\]\]/mgi,function(match, command){
                    try {
                        command = command.replace('&amp;', '&');
                        command = command.replace('&lt;', '<');
                        command = command.replace('&gt;', '>');
                        var result = eval(command);
                        return result;
                    }catch(e){
                        console.error(e,command);
                        throw e;
                    }
                });
                var template = document.createElement('template');
                template.innerHTML = string;
                return template.content.firstChild;
            }
            escapeHtml(value:string):string {
                if(value){
                    var htmlMap:any = {
                        '&': '&amp;',
                        '<': '&lt;',
                        '>': '&gt;',
                        '"': '&quot;',
                        "'": '&#039;'
                    };
                    return value.replace(/[&<>"']/g, function(m:string) {return htmlMap[m];});
                }else{
                    return value;
                }
            }
            parseMarkdown(value:string):string {
                return null;
            }
            removeChildNodes(element:HTMLElement):void {
                // Remove element nodes and prevent memory leaks
                var node, nodes = element.childNodes, i = 0;
                while (node = nodes[i++]) {
                    if (node.nodeType === 1 ) {
                        element.removeChild(node);
                    }
                }

                // Remove any remaining nodes
                while (element.firstChild) {
                    element.removeChild(element.firstChild);
                }

                // If this is a select, ensure that it displays empty
                if(element instanceof HTMLSelectElement){
                    (<HTMLSelectElement>element).options.length = 0;
                }
            }
            createDocumentFragment(html:string):DocumentFragment {
                var template = document.createElement('template');
                template.innerHTML = html;
                return template.content;
            }
            getCurrentWindow():Window {
                if(window.frameElement){
                    return window.parent;
                }else{
                    return window;
                }
            }
            getParentNode(element:HTMLElement):Node {
                var parentNode = element.parentNode;
                return parentNode;
            }
            setPositionCentered(element:HTMLElement):void {
                var window = this.getCurrentWindow();
                var computedStyle = window.getComputedStyle(element);
                var computedWidth = parseInt(computedStyle.getPropertyValue('width').replace(/px/gi, ''));
                var computedHeight = parseInt(computedStyle.getPropertyValue('height').replace(/px/gi, ''));
                element.style.width = Math.min(window.screen.width-20, computedWidth) + 'px';
                element.style.height = Math.min(window.screen.height, computedHeight) + 'px';
                element.style.left = Math.max(10,window.innerWidth/2 - computedWidth/2) + 'px';
                element.style.top = Math.max(0,window.innerHeight/2 - computedHeight/2) + 'px';
            }
            parseFormat(format:string):object {
                var splitedFormat = format.split(':');
                var type = splitedFormat.shift();
                var option = splitedFormat.join(':');
                return { type: type, option: option };
            }
            delay(callback:Function){
                var interval = setInterval(function() {
                    try {
                        callback.call(callback);
                    }catch(ignore){
                        console.log(ignore, callback);
                    }finally{
                        clearInterval(interval);
                    }
                },200); 
            }
            fadeIn(element:HTMLElement):void {
                element.classList.remove('duice-ui-fadeOut');
                element.classList.add('duice-ui-fadeIn');
            }
            fadeOut(element:HTMLElement):void {
                element.classList.remove('duice-ui-fadeIn');
                element.classList.add('duice-ui-fadeOut');
            }
            getCurrentMaxZIndex():number {
                var zIndex,
                z = 0,
                all = document.getElementsByTagName('*');
                for (var i = 0, n = all.length; i < n; i++) {
                    zIndex = document.defaultView.getComputedStyle(all[i],null).getPropertyValue("z-index");
                    zIndex = parseInt(zIndex, 10);
                    z = (zIndex) ? Math.max(z, zIndex) : z;
                }
                return z;
            }
            block(element:HTMLElement):object {
                
                var div = document.createElement('div');
                div.classList.add('duice-ui-block');
                
                // defines maxZIndex
                var zIndex = this.getCurrentMaxZIndex() + 1;
                
                // adjusting position
                div.style.position = 'fixed';
                div.style.zIndex = String(zIndex);
                
                // full blocking in case of BODY
                if(element.tagName == 'BODY'){
                    div.style.width = '100%';
                    div.style.height = '100%';
                    div.style.top = '0px';
                    div.style.left = '0px';
                }
                // otherwise adjusting to parent element
                else{
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
                    getZIndex: function(){
                        return zIndex;
                    },
                    release: function() {
                        $this.fadeOut(div);
                        $this.delay(function(){
                            element.removeChild(div);
                        });
                    }
                }
            }
            load(element:HTMLElement):object {
                var $this = this;
                var div = document.createElement('div');
                div.classList.add('duice-ui-load');
                div.style.position = 'fixed';
                div.style.opacity = '0';
                div.style.zIndex = String(this.getCurrentMaxZIndex() + 1);

                // on resize event
                this.getCurrentWindow().addEventListener('resize', function(ev) {
                    if(div){
                        $this.setPositionCentered(div);
                        div.style.top = '30vh';   // adjust top
                    }
                });
                
                // start
                element.appendChild(div);
                this.setPositionCentered(div);
                div.style.top = '30vh'; // adjust top   
                this.fadeIn(div);
                
                // return handler
                return {
                    release: function() {
                        $this.fadeOut(div);
                        $this.delay(function(){
                            element.removeChild(div);
                        });
                    }
                }
            }
        }
        
        /**
         * duice.ui.Text
         */
        export class Text extends __ {
            div:HTMLDivElement;
            bindMap:duice.data.Map;
            bindName:string;
            mode:string;
            constructor(span:HTMLDivElement){
                super();
                this.div = span;
                this.div.classList.add('duice-ui-text');
            }
            setBind(map:duice.data.Map, name:string):void {
                this.bindMap = map;
                this.bindName = name;
                this.bindMap.addObserver(this);
            }
            setMode(mode:string):void {
                this.mode = mode;
            }
            update(): void {
                this.removeChildNodes(this.div);
                var value = this.bindMap.get(this.bindName);
                if(this.mode === 'html') {
                    value = value;
                }else if(this.mode === 'markdown'){
                    // TODO 
                    // value = this.parseMarkdown(value);
                }else{
                    value = this.escapeHtml(value);
                }
                this.div.appendChild(this.createDocumentFragment(value));
            }
        }
        
        /**
         * duice.ui.TextField
         */
        export class TextField extends __ {
            input:HTMLInputElement;
            bindMap:duice.data.Map;
            bindName:string;
            constructor(input:HTMLInputElement){
                super();
                this.input = input;
                this.input.classList.add('duice-ui-textField');
            }
            setBind(map:duice.data.Map, name:string):void {
                this.bindMap = map;
                this.bindName = name;
                this.bindMap.addObserver(this);
                var $this = this;
                this.input.addEventListener('change', function(){
                    $this.bindMap.set($this.bindName, this.value);
                });
            }
            update():void {
                var value = this.bindMap.get(this.bindName);
                this.input.value = value;
            }
        }
        
        /**
         * duice.ui.TextArea
         */
        export class TextArea extends __ {
            textarea:HTMLTextAreaElement;
            bindMap:duice.data.Map;
            bindName:string;
            constructor(textarea:HTMLTextAreaElement){
                super();
                this.textarea = textarea;
                this.textarea.classList.add('duice-ui-textArea');
            }
            setBind(map:duice.data.Map, name:string):void {
                this.bindMap = map;
                this.bindName = name;
                this.bindMap.addObserver(this);
                var $this = this;
                this.textarea.addEventListener('change', function(){
                   $this.bindMap.set($this.bindName, this.value); 
                });
            }
            update():void {
                var value = this.bindMap.get(this.bindName);
                this.textarea.value = value;
            }
        }
        
        /**
         * duice.ui.ComboBox
         */
        export class ComboBox extends __ {
            select:HTMLSelectElement;
            bindMap:duice.data.Map;
            bindName:string;
            optionList:duice.data.List;
            optionText:string;
            optionValue:string;
            constructor(select:HTMLSelectElement) {
                super();
                this.select = select;
                this.select.classList.add('duice-ui-comboBox');
            }
            setBind(map:duice.data.Map, name:string):void {
                this.bindMap = map;
                this.bindName = name;
                this.bindMap.addObserver(this);
                var $this = this;
                this.select.addEventListener('change', function(){
                    $this.bindMap.set($this.bindName, this.value);
                });
            }
            setOption(list:duice.data.List, value:string, text:string):void {
                this.optionList = list;
                this.optionValue = value;
                this.optionText = text;
            }
            update():void {
                this.removeChildNodes(this.select);
                for(var i = 0, size = this.optionList.getRowCount(); i < size; i ++){
                    var optionMap = this.optionList.getRow(i);
                    var option = document.createElement('option');
                    option.appendChild(document.createTextNode(optionMap.get(this.optionText)));
                    option.value = optionMap.get(this.optionValue);
                    this.select.appendChild(option);
                }
                var value = this.bindMap.get(this.bindName);
                this.select.value = value;
            }
        }
        
        /**
         * duice.ui.CheckBox
         */
        export class CheckBox extends __ {
            input:HTMLInputElement;
            bindMap:duice.data.Map;
            bindName:string;
            optionCheck:any;
            optionUncheck:any;
            constructor(input:HTMLInputElement) {
                super();
                this.input = input;
                this.input.classList.add('duice-ui-checkBox');
            }
            setBind(map:duice.data.Map, name:string):void {
                this.bindMap = map;
                this.bindName = name;
                this.bindMap.addObserver(this);
                var $this = this;
                this.input.addEventListener('change', function(){
                    $this.bindMap.set($this.bindName, this.checked ? $this.optionCheck : $this.optionUncheck);
                });
            }
            setOption(check:any, uncheck:any):void {
                this.optionCheck = check;
                this.optionUncheck = uncheck;
            }
            update():void {
                var value = this.bindMap.get(this.bindName);
                if(value === this.optionCheck){
                    this.input.checked = true;
                }else{
                    this.input.checked = false;
                }
            }
        }
        
        /**
         * duice.ui.Radio
         */
        export class Radio extends __ {
            input:HTMLInputElement;
            bindMap:duice.data.Map;
            bindName:string;
            constructor(input:HTMLInputElement){
                super();
                this.input = input;
                this.input.classList.add('duice-ui-radio');
            }
            setBind(map:duice.data.Map, name:string):void {
                this.bindMap = map;
                this.bindName = name;
                this.bindMap.addObserver(this);
                var $this = this;
                this.input.addEventListener('change', function(){
                    $this.bindMap.set($this.bindName, this.value);
                });
            }
            update():void {
                var value = this.bindMap.get(this.bindName);
                if(value === this.input.value){
                    this.input.checked = true;
                }else{
                    this.input.checked = false;
                }
            }
        }
        
        /**
         * duice.ui.HtmlEditor
         */
        export class HtmlEditor extends __ {
            div:HTMLDivElement;
            bindMap:duice.data.Map;
            bindName:string;
            toolbar:HTMLDivElement;
            content:HTMLDivElement;
            contentHtml:HTMLPreElement;
            contentText:HTMLTextAreaElement;
            mode:string = 'html';
            constructor(div:HTMLDivElement) {
                super();
                this.div = div;
                this.div.classList.add('duice-ui-htmlEditor');
                
                // create tool bar
                this.toolbar = document.createElement('div');
                this.toolbar.classList.add('duice-ui-htmlEditor-toolbar');
                this.div.appendChild(this.toolbar);

                // font family
                var fontfamily = document.createElement('select');
                fontfamily.classList.add('duice-ui-htmlEditor-toolbar-fontfamily');
                var defaultFont = window.getComputedStyle(this.div,null).getPropertyValue('font-family');
                defaultFont = defaultFont.replace(/"/gi, '');
                var fonts = defaultFont.split(',');
                var additionalFonts = ['Arial','Arial Black','Times New Roman','Courier New','Impact'];
                for(var i = 0; i < additionalFonts.length; i ++ ) {
                    var font = additionalFonts[i];
                    if(fonts.indexOf(font) < 0) {
                        fonts.push(font);
                    }
                }
                for(var i = 0; i < fonts.length; i++){
                    var option = document.createElement('option');
                    option.value = fonts[i];
                    option.appendChild(document.createTextNode(fonts[i]));
                    fontfamily.appendChild(option);
                }
                fontfamily.addEventListener('change',function(){
                    document.execCommand('fontName', null, this.value);
                });
                this.toolbar.appendChild(fontfamily);
                
                // font size
                var fontsize = document.createElement('select');
                fontsize.classList.add('duice-ui-htmlEditor-toolbar-fontsize');
                for(var i = 1; i <= 7; i++){
                    var option = document.createElement('option');
                    option.value = String(i);
                    if(i == 3){
                        option.selected = true;     //  default font size
                    }
                    option.appendChild(document.createTextNode(String(i)));
                    fontsize.appendChild(option);
                }
                fontsize.addEventListener('change',function(){
                    document.execCommand('fontSize', null, this.value);
                });
                this.toolbar.appendChild(fontsize);

                // bold
                var bold = document.createElement('button');
                bold.title = 'Bold';
                bold.classList.add('duice-ui-htmlEditor-toolbar-bold');
                bold.addEventListener('click', function(){
                    document.execCommand('bold', null, null);
                });
                this.toolbar.appendChild(bold);
                
                // italic
                var italic = document.createElement('button');
                italic.title = 'Italic';
                italic.classList.add('duice-ui-htmlEditor-toolbar-italic');
                italic.addEventListener('click',function(){
                    document.execCommand('italic',null,null);
                });
                this.toolbar.appendChild(italic);
                
                // underline
                var underline = document.createElement('button');
                underline.title = 'Underline';
                underline.classList.add('duice-ui-htmlEditor-toolbar-underline');
                underline.addEventListener('click',function() {
                    document.execCommand('underline',null,null);
                });
                this.toolbar.appendChild(underline);

                // align left
                var alignleft = document.createElement('button');
                alignleft.title = 'Align Left';
                alignleft.classList.add('duice-ui-htmlEditor-toolbar-alignleft');
                alignleft.addEventListener('click',function() {
                    document.execCommand('justifyLeft',null,null);
                });
                this.toolbar.appendChild(alignleft);
                
                // align center
                var aligncenter = document.createElement('button');
                aligncenter.title = 'Align Center';
                aligncenter.classList.add('duice-ui-htmlEditor-toolbar-aligncenter');
                aligncenter.addEventListener('click',function() {
                    document.execCommand('justifyCenter',null,null);
                });
                this.toolbar.appendChild(aligncenter);
                
                // align right
                var alignright = document.createElement('button');
                alignright.title = 'Align Right';
                alignright.classList.add('duice-ui-htmlEditor-toolbar-alignright');
                alignright.addEventListener('click',function() {
                    document.execCommand('justifyRight',null,null);
                });
                this.toolbar.appendChild(alignright);
                
                // indent increase
                var indentincrease = document.createElement('button');
                indentincrease.title = 'Indent';
                indentincrease.classList.add('duice-ui-htmlEditor-toolbar-indentincrease');
                indentincrease.addEventListener('click',function() {
                    document.execCommand('indent',null,null);
                });
                this.toolbar.appendChild(indentincrease);
                
                // indent decrease
                var indentdecrease = document.createElement('button');
                indentdecrease.title = 'Outdent';
                indentdecrease.classList.add('duice-ui-htmlEditor-toolbar-indentdecrease');
                indentdecrease.addEventListener('click',function() {
                    document.execCommand('outdent',null,null);
                });
                this.toolbar.appendChild(indentdecrease);
                
                // list order
                var listorder = document.createElement('button');
                listorder.title = 'Orderd List';
                listorder.classList.add('duice-ui-htmlEditor-toolbar-listorder');
                listorder.addEventListener('click',function() {
                    document.execCommand('insertorderedlist',null,null);
                });
                this.toolbar.appendChild(listorder);
                
                // list unorder
                var listunorder = document.createElement('button');
                listunorder.title = 'Unorderd List';
                listunorder.classList.add('duice-ui-htmlEditor-toolbar-listunorder');
                listunorder.addEventListener('click',function() {
                    document.execCommand('insertUnorderedList',null,null);
                });
                this.toolbar.appendChild(listunorder);
                
                // mode
                var mode = document.createElement('button');
                mode.title = 'Change Mode';
                mode.classList.add('duice-ui-htmlEditor-toolbar-mode');
                var $this = this;
                mode.addEventListener('click', function() {
                    $this.toggleMode();
                });
                this.toolbar.appendChild(mode);
                
                // create content
                this.content = document.createElement('div');
                this.content.classList.add('duice-ui-htmlEditor-content');
                this.contentHtml = document.createElement('pre');
                this.contentHtml.contentEditable = 'true';
                this.content.appendChild(this.contentHtml);
                this.contentText = document.createElement('textarea');
                this.contentText.style.display = 'none';
                this.content.appendChild(this.contentText);
                this.div.appendChild(this.content);
            }
            setBind(map:duice.data.Map, name:string):void {
                this.bindMap = map;
                this.bindName = name;
                this.bindMap.addObserver(this);
                var $this = this;
                this.contentHtml.addEventListener('DOMSubtreeModified', function(){
                    console.log(this.innerHTML);
                    if(map.get(name) !== this.innerHTML){
                        map.set(name, this.innerHTML);
                    }
                });
                this.contentText.addEventListener('change', function(){
                    console.log(this);
                    map.set(name, this.value);
                });
            }
            update():void {
                if(this.contentHtml.innerHTML !== this.bindMap.get(this.bindName)) {
                    this.contentHtml.innerHTML = this.bindMap.get(this.bindName);
                }
                if(this.contentText.value !== this.bindMap.get(this.bindName)){
                    this.contentText.value = this.bindMap.get(this.bindName);
                }
            }
            toggleMode():void {
                if(this.mode === 'html' ){
                    this.mode = 'text';
                    this.contentHtml.style.display = 'none';
                    this.contentText.style.display = 'block';
                }else{
                    this.mode = 'html';
                    this.contentText.style.display = 'none';
                    this.contentHtml.style.display = 'block';
                }
            }
        }
        
        export class MarkdownEditor extends __ {
            div:HTMLDivElement;
            bindMap:duice.data.Map;
            bindName:string;
            toolbar:HTMLDivElement;
            content:HTMLDivElement;
            contentHtml:HTMLPreElement;
            contentText:HTMLTextAreaElement;
            mode:string = 'markdown';
            constructor(div:HTMLDivElement){
                super();
                this.div = div;
                this.div.classList.add('duice-ui-markdownEditor');
                
                // create tool bar
                this.toolbar = document.createElement('div');
                this.toolbar.classList.add('duice-ui-markdownEditor-toolbar');
                this.div.appendChild(this.toolbar);
                
                // header
                var header = document.createElement('button');
                header.title = 'Header';
                header.classList.add('duice-ui-markdownEditor-toolbar-header');
                header.addEventListener('click', function(){
                    //
                });
                this.toolbar.appendChild(header);
                
                // bold
                var bold = document.createElement('button');
                bold.title = 'Bold';
                bold.classList.add('duice-ui-markdownEditor-toolbar-bold');
                bold.addEventListener('click', function(){
                    //
                });
                this.toolbar.appendChild(bold);
                
                // italic
                var italic = document.createElement('button');
                italic.title = 'Italic';
                italic.classList.add('duice-ui-markdownEditor-toolbar-italic');
                italic.addEventListener('click', function(){
                    //
                });
                this.toolbar.appendChild(italic);
                
                // cancel
                var cancel = document.createElement('button');
                cancel.title = 'Cancel';
                cancel.classList.add('duice-ui-markdownEditor-toolbar-cancel');
                cancel.addEventListener('click', function(){
                    //
                });
                this.toolbar.appendChild(cancel);
                
                // list order
                var listorder = document.createElement('button');
                listorder.title = 'Orderd List';
                listorder.classList.add('duice-ui-markdownEditor-toolbar-listorder');
                listorder.addEventListener('click',function() {
                    //
                });
                this.toolbar.appendChild(listorder);
                
                // list unorder
                var listunorder = document.createElement('button');
                listunorder.title = 'Unorderd List';
                listunorder.classList.add('duice-ui-markdownEditor-toolbar-listunorder');
                listunorder.addEventListener('click',function() {
                    //
                });
                this.toolbar.appendChild(listunorder);
                
                // line
                var line = document.createElement('button');
                line.title = 'Line';
                line.classList.add('duice-ui-markdownEditor-toolbar-line');
                line.addEventListener('click',function() {
                    //
                });
                this.toolbar.appendChild(line);
                
                // code
                var code = document.createElement('button');
                code.title = 'Image';
                code.classList.add('duice-ui-markdownEditor-toolbar-code');
                code.addEventListener('click',function() {
                    //
                });
                this.toolbar.appendChild(code);
                
                // image
                var image = document.createElement('button');
                image.title = 'Image';
                image.classList.add('duice-ui-markdownEditor-toolbar-image');
                image.addEventListener('click',function() {
                    //
                });
                this.toolbar.appendChild(image);
                
                // link
                var link = document.createElement('button');
                link.title = 'Image';
                link.classList.add('duice-ui-markdownEditor-toolbar-link');
                link.addEventListener('click',function() {
                    //
                });
                this.toolbar.appendChild(link);
                
                
                
                
                
                // mode
                var mode = document.createElement('button');
                mode.title = 'Change Mode';
                mode.classList.add('duice-ui-markdownEditor-toolbar-mode');
                mode.addEventListener('click', function(){
                    //
                });
                this.toolbar.appendChild(mode);
                
                // create content
                this.content = document.createElement('div');
                this.content.classList.add('duice-ui-htmlEditor-content');
                this.contentHtml = document.createElement('pre');
                this.contentHtml.contentEditable = 'true';
                this.content.appendChild(this.contentHtml);
                this.contentText = document.createElement('textarea');
                this.contentText.style.display = 'none';
                this.content.appendChild(this.contentText);
                this.div.appendChild(this.content);
            }
            setBind(map:duice.data.Map, name:string):void {
            }
            update():void {
            }
        }
        
        /**
         * duice.ui.Calendar
         */
        export class Calendar extends __ {
            constructor(input:HTMLInputElement){
                super();
            }
            setBind(list:duice.data.List):void {
            }
            update():void {
            }
        }
        
        /**
         * duice.ui.CronExpression
         */
        export class CronExpression extends __ {
            constructor(input:HTMLInputElement){
                super();
            }
            setBind(list:duice.data.List):void {
            }
            update():void {
            }
        }
        
        /**
         * duice.ui.ListViewer
         */
        export class ListViewer extends __ {
            setBind(list:duice.data.List):void {
            }
            update():void {
            }
        }
        
        /**
         * duice.ui.TableViewer
         */
        export class TableViewer extends __ {
            table:HTMLTableElement;
            thead:HTMLTableSectionElement;
            tbody:HTMLTableSectionElement;
            bindList:duice.data.List;
            item:string;
            rows:Array<HTMLTableSectionElement> = new Array<HTMLTableSectionElement>();
            editable:boolean;
            constructor(table:HTMLTableElement) {
                super();
                this.table = table;
                this.table.classList.add('duice-ui-tableViewer');
                this.thead = <HTMLTableSectionElement>this.table.querySelector('thead');
                var tbody = this.table.querySelector('tbody');
                this.tbody = <HTMLTableSectionElement>tbody.cloneNode(true);
                this.table.removeChild(tbody);
            }
            setBind(list:duice.data.List):void {
                this.bindList = list;
                this.bindList.addObserver(this);
            }
            setItem(item:string):void {
                this.item = item;
            }
            setEditable(editable:boolean):void {
                this.editable = editable;
            }
            update():void {
                var $this = this;
                
                // remove previous rows
                for(var i = 0; i < this.rows.length; i ++ ) {
                    this.table.removeChild(this.rows[i]);
                }
                this.rows.length = 0;
                
                // creates new rows
                for(var index = 0; index < this.bindList.getRowCount(); index ++ ) {
                    var map = this.bindList.getRow(index);
                    var row = this.createRow(index,map);
                    this.table.appendChild(row);
                    this.rows.push(row);
                }
                
                // not found row
                if(this.bindList.getRowCount() < 1) {
                    var emptyRow = this.createEmptyRow();
                    this.table.appendChild(emptyRow);
                    this.rows.push(emptyRow);
                }
            }
            createRow(index:number, bindMap:duice.data.Map):HTMLTableSectionElement {
                var $this = this;
                var row:HTMLTableSectionElement = <HTMLTableSectionElement>this.tbody.cloneNode(true);
                var $context:any = new Object;
                $context['index'] = index;
                $context[this.item] = bindMap;
                row = this.executeExpression(<HTMLElement>row, $context);
                initialize(row,$context);
                
                // select index
                if(index == this.bindList.index){
                    row.classList.add('duice-ui-tableViewer-index');
                }
                row.addEventListener('mouseup', function(event){
                    for(var i = 0; i < $this.rows.length; i ++ ) {
                        $this.rows[i].classList.remove('duice-ui-tableViewer-index');
                    }
                    row.classList.add('duice-ui-tableViewer-index');
                    $this.bindList.index = index;
                });
                
                // drag and drop event
                if(this.editable === true) {
                    row.setAttribute('draggable', 'true');
                    row.addEventListener('dragstart', function(event){
                        console.log('dragstart',index);
                        event.dataTransfer.setData("index", String(index));
                    });
                    row.addEventListener('dragover', function(event){
                        event.preventDefault();
                        console.log('dragover');
                    });
                    row.addEventListener('drop', function(event){
                        event.preventDefault();
                        console.log('drop',index,event);
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
            }
            createEmptyRow():HTMLTableSectionElement {
                var emptyRow:HTMLTableSectionElement = <HTMLTableSectionElement>this.tbody.cloneNode(true);
                this.removeChildNodes(emptyRow);
                emptyRow.classList.add('duice-ui-tableViewer-empty')
                var tr = document.createElement('tr');
                var td = document.createElement('td');
                var colspan = this.tbody.querySelectorAll('tr > td').length;
                td.setAttribute('colspan',String(colspan));
                var emptyMessage = document.createElement('div');
                emptyMessage.classList.add('duice-ui-tableViewer-empty-message');
                td.appendChild(emptyMessage);
                tr.appendChild(td);
                emptyRow.appendChild(tr);
                return emptyRow;
            }
        }
        
        /**
         * duice.ui.TreeViewer
         */
        export class TreeViewer extends __ {
            setBind(list:duice.data.List):void {
            }
            update():void {
            }
        }
    }
    
    /**
     * TODO duice.widget
     */
    export namespace widget {
        
    }
    
    /**
     * TODO duice.chart
     */
    export namespace chart {
        
    }
}

//DOMContentLoaded event process
document.addEventListener("DOMContentLoaded", function(event) {
    var $context:any = typeof self !== 'undefined' ? self : 
                        typeof window !== 'undefined' ? window :
                        {};
    duice.ui.initialize(document, $context);
});



