namespace duice {
    
    /**
     * duice.initialize
     * @param container
     * @param $context
     */
    export function initialize(container:any, $context:any):void {
        
        // generateUUID
        function generateUUID():string {
            var dt = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (dt + Math.random()*16)%16 | 0;
                dt = Math.floor(dt/16);
                return (c=='x' ? r :(r&0x3|0x8)).toString(16);
            });
            return uuid;
        }
        
        // getObject
        function getObject($context:any, name:string) {
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
        
        // creates Grid
        var gridElements = container.querySelectorAll('table[data-duice="Grid"]');
        for(var i = 0; i < gridElements.length; i++ ) {
            try {
                var gridElement = gridElements[i];
                var grid = new duice.ui.Grid(gridElement);
                var bind = gridElement.dataset.duiceBind;
                grid.setBind(getObject($context,bind));
                var item = gridElement.dataset.duiceItem;
                grid.setItem(item);
                grid.setEditable((gridElement.dataset.duiceEditable === 'true'));
                grid.update();
                gridElement.dataset.duice += generateUUID();
                console.log(grid);
            }catch(e){
                console.error(e,gridElement);
                throw e;
            }
        }
        
        // creates unit elements
        var elementTags = [
             'span[data-duice="Text"]'
            ,'input[data-duice="TextField"]'
            ,'select[data-duice="ComboBox"]'
            ,'input[data-duice="CheckBox"]'
            ,'input[data-duice="Radio"]'
            ,'div[data-duice="TextView"]'
            ,'textarea[data-duice="TextArea"]'
            ,'div[data-duice="HtmlEditor"]'
            ,'input[data-duice="CronExpression"]'
            ,'img[data-duice="Image"]'
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
                        text.update();
                    break;
                    case 'TextField':
                        var textField = new duice.ui.TextField(element);
                        textField.setBind(getObject($context,bind[0]), bind[1]);
                        textField.update();
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
                }
                element.dataset.duice += generateUUID();
            }catch(e){
                console.error(e, elements[i]);
                throw e;
            }
        }
    }
    
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
            span:HTMLSpanElement;
            bindMap:duice.data.Map;
            bindName:string;
            constructor(span:HTMLSpanElement){
                super();
                this.span = span;
                this.span.classList.add('duice-ui-text');
            }
            setBind(map:duice.data.Map, name:string):void {
                this.bindMap = map;
                this.bindName = name;
                this.bindMap.addObserver(this);
            }
            update(): void {
                this.removeChildNodes(this.span);
                var value = this.bindMap.get(this.bindName);
                this.span.appendChild(this.createDocumentFragment(value));
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
        * duice.ui.Grid
        */
        export class Grid extends __ {
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
                this.table.classList.add('duice-ui-grid');
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
            }
            createRow(index:number, bindMap:duice.data.Map):HTMLTableSectionElement {
                var $this = this;
                var row:HTMLTableSectionElement = <HTMLTableSectionElement>this.tbody.cloneNode(true);
                var $context:any = new Object;
                $context['index'] = index;
                $context[this.item] = bindMap;
                row = this.executeExpression(<HTMLElement>row, $context);
                duice.initialize(row,$context);
                
                // select index
                if(index == this.bindList.index){
                    row.classList.add('duice-ui-grid-index');
                }
                row.addEventListener('mouseup', function(event){
                    for(var i = 0; i < $this.rows.length; i ++ ) {
                        $this.rows[i].classList.remove('duice-ui-grid-index');
                    }
                    row.classList.add('duice-ui-grid-index');
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
        }
    }
}

//DOMContentLoaded event process
document.addEventListener("DOMContentLoaded", function(event) {
    var $context:any = typeof self !== 'undefined' ? self : 
                        typeof window !== 'undefined' ? window :
                        {};
    duice.initialize(document, $context);
});



