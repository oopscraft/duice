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
     * duice.initialize
     * @param container
     * @param $context
     */
    export function initialize(container:any, $context:any):void {
        
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
        for(var i = 0; i < tableViewerElements.length; i++ ) {
            try {
                var tableViewerElement = tableViewerElements[i];
                var tableViewer = new duice.ui.TableViewer(tableViewerElement);
                var bind = tableViewerElement.dataset.duiceBind;
                var bindList = getObject($context,bind)
                tableViewer.setBind(bindList);
                var item = tableViewerElement.dataset.duiceItem;
                tableViewer.setItem(item);
                tableViewer.setEditable((tableViewerElement.dataset.duiceEditable === 'true'));
                tableViewer.build();
                tableViewerElement.dataset.duice += generateUUID();
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
            ,'input[data-duice="Calendar"]'
            ,'img[data-duice="Image"]'
            ,'div[data-duice="HtmlEditor"]'
            ,'div[data-duice="MarkdownEditor"]'
//         // --
//            ,'input[data-duice="CronExpression"]'
        ];
        var elements = container.querySelectorAll(elementTags.join(','));
        for(var i = 0; i < elements.length; i ++ ) {
            try {
                var element:any = elements[i];
                var type:string = element.dataset.duice;
                var bind = element.dataset.duiceBind.split(',');
                switch(type) {
                    case 'Text':
                        var text:duice.ui.Text = new duice.ui.Text(element);
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
            observers:Array<duice.ui.__> = new Array<duice.ui.__>();
            addObserver(observer:duice.ui.__):void {
                for(var i = 0, size = this.observers.length; i < size; i++){
                    if(this.observers[i] === observer){
                        return;
                    }
                }
                this.observers.push(observer);
            }
            notifyObservers():void {
                for(var i = 0, size = this.observers.length; i < size; i++){
                    this.observers[i].update(this);
                }
            }
        }
        
        /**
         * Map data structure
         */
        export class Map extends __ {
            values:any = new Object();
            parentNode:Map;
            childNodes:Array<Map> = new Array<Map>();
            enable:boolean = true;
            readonlyNames:Array<string> = new Array<string>();
            constructor(json:any) {
                super();
                this.fromJson(json);
            }
            fromJson(json: any): void {
                this.values = new Object();
                for(var name in json){
                    this.values[name] = json[name];
                }
                this.notifyObservers();
            }
            toJson():object {
                var json: any = new Object();
                for(var name in this.values){
                    json[name] = this.values[name];
                }
                return json;
            }
            set(name:string, value:any):void {
                this.values[name] = value;
                this.notifyObservers();
            }
            get(name:string):any {
                return this.values[name];
            }
            getNames():string[]{
                var names = new Array();
                for(var name in this.values){
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
            }
            removeChildNode(index:number):void {
                this.childNodes.splice(index,1);
            }
            setEnable(enable:boolean):void {
                this.enable = enable;
                this.notifyObservers();
            }
            isEnable():boolean {
                return this.enable;
            }
            setReadonly(name:string, readonly:boolean):void {
                if(this.readonlyNames.indexOf(name) == -1){
                    this.readonlyNames.push(name);
                }
                this.notifyObservers();
            }
            isReadonly(name:string):boolean {
                if(this.readonlyNames.indexOf(name) >= 0){
                    return true;
                }else{
                    return false;
                }
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
            update(ui:duice.ui.__):void {
                
            }
            fromJson(jsonArray:Array<any>):void {
                this.mapList = new Array<Map>();
                for(var i = 0; i < jsonArray.length; i ++ ) {
                    var map = new duice.data.Map(jsonArray[i]);
                    this.mapList.push(map);
                }
                this.index = -1;
                this.notifyObservers();
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
                this.notifyObservers();
            }
            getIndex():number {
                return this.index;
            }
            clearIndex():void {
                this.index = -1;
                this.notifyObservers();
            }
            getRowCount():number {
                return this.mapList.length;
            }
            getRow(index:number):Map {
                return this.mapList[index];
            }
            addRow(map:Map):void {
                this.mapList.push(map);
                this.index = this.getRowCount();
                this.notifyObservers();
            }
            insertRow(index:number, map:Map):void {
                this.mapList.splice(index, 0, map);
                this.index = index;
                this.notifyObservers();
            }
            removeRow(index:number):void {
                this.mapList.splice(index, 1);
                this.notifyObservers();
            }
            moveRow(fromIndex:number, toIndex:number):void {
                this.index = fromIndex;
                this.mapList.splice(toIndex, 0, this.mapList.splice(fromIndex, 1)[0]);
                this.index = toIndex;
                this.notifyObservers();
            }
            sortRow(name:string, ascending:boolean):void {
                this.mapList.sort(function(a:duice.data.Map,b:duice.data.Map):number {
                    var aValue = a.get(name);
                    var bValue = b.get(name);
                    return (aValue > bValue ? 1 : aValue < bValue ? -1 : 0) * (ascending == false ? -1 : 1);
                });
                this.notifyObservers();
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
            abstract build():void;
            abstract update(observable:duice.data.__):void;
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
                
                // checks value is valid.
                if(!value){
                    return value;
                }

                // replace tag
                var htmlMap:any = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#039;'
                };
                return value.replace(/[&<>"']/g, function(m:string) {return htmlMap[m];});
            }
            parseMarkdown(value:string):string {
                
                // checks value is valid.
                if(!value){
                    return value;
                }
                
                // code
                value = value.replace(/[\`]{3}([\w]*)\n([^\`]+)\n[\`]{3}/g, function(match,language,code){
                    var codeHtml = new Array();
                    codeHtml.push('<code data-langhage="' + language + '">');
                    var lines = code.split('\n');
                    for(var i = 0; i < lines.length; i++){
                        var line = lines[i];

                        // replace tag
                        line = line.replace(/\</g, '&lt');
                        line = line.replace(/\>/g, '&gt');

                        // comment
                        line = line.replace(/(^|[\s])(\/\/[\s]*.+)/gm,'<span class="comment">$2</span>');
                        line = line.replace(/(\/\*)/gm,'<span class="comment">$1');
                        line = line.replace(/(\*\/)/gm,'$1</span>');
                        line = line.replace(/(\s*)(#+.*)/gm,'$1<span class="comment">$2</span>');

                        // append 
                        codeHtml.push(line);
                    }
                    codeHtml.push('</code>');
                    return codeHtml.join('\n') + '\n';
                });
                
                //ul
                value = value.replace(/(^[ \t]*[\*\-]\s+.+\n)+/gm, function(match) {
                    var ulHtml = new Array();
                    ulHtml.push('<ul>');
                    var lines = match.split('\n');
                    for(var i = 0; i < lines.length; i++){
                        var line = lines[i];
                        if(line.trim().length < 1){
                            continue;
                        }
                        line = line.replace(/^[ \t]*[\*\-]\s+(.+)/gm,'<li>$1</li>');
                        ulHtml.push(line);
                    }
                    ulHtml.push('</ul>');
                    return ulHtml.join('\n') + '\n';
                });
                
                //ol
                value = value.replace(/(^[ \t]*[\d]+[\.]?\s+.+\n)+/gm, function(match) {
                    var olHtml = new Array();
                    olHtml.push('<ol>');
                    var lines = match.split('\n');
                    for(var i = 0; i < lines.length; i++){
                        var line = lines[i];
                        if(line.trim().length < 1){
                            continue;
                        }
                        line = line.replace(/^[ \t]*[\d]+[\.]?\s+(.+)/gm,'<li>$1</li>');
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
                value = value.replace(/(^[\-\=]{5,}\n)/gm, function(match){
                    return '<hr/>';
                });
                
                // parses in-line element
                var lines = value.split('\n');
                for(var i = 0, size = lines.length; i < size; i ++){
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
            enableElement(element:HTMLElement, enable:boolean):void {
                if(element.tagName === 'SELECT'){
                    (<HTMLSelectElement>element).disabled = (enable === true ? false : true);
                }else if(element.tagName === 'BUTTON'){
                    (<HTMLButtonElement>element).disabled = (enable === true ? false : true);
                }
                var childNodes = element.childNodes, i = 0;
                for(var i = 0, size = childNodes.length; i < size; i ++ ){
                    var element:HTMLElement = <HTMLElement>childNodes[i];
                    this.enableElement(element, enable);
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
                console.log('block');
                
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
            }
            setBind(map:duice.data.Map, name:string):void {
                this.bindMap = map;
                this.bindName = name;
            }
            setMode(mode:string):void {
                this.mode = mode;
            }
            build():void {
                this.div.classList.add('duice-ui-text');
                this.bindMap.addObserver(this);
                this.update(null);
            }
            update(observable:duice.data.__):void {
                this.removeChildNodes(this.div);
                var value = this.bindMap.get(this.bindName);
                if(this.mode === 'html') {
                    value = value;
                }else if(this.mode === 'markdown'){
                    value = this.parseMarkdown(value);
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
            }
            build():void {
                var $this = this;
                this.bindMap.addObserver(this);
                this.input.addEventListener('change', function(){
                    $this.bindMap.set($this.bindName, this.value);
                });
                this.update(null);
            }
            update(observable:duice.data.__):void {
                this.input.value = this.bindMap.get(this.bindName);
                
                // checks enable
                if(this.bindMap.isEnable()){
                    this.input.disabled = false;
                }else{
                    this.input.disabled = true;
                }
                
                // checks read-only
                if(this.bindMap.isReadonly(this.bindName)){
                    this.input.setAttribute('readOnly','readOnly');
                }else{
                    this.input.removeAttribute('readOnly');
                }
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
            }
            build():void {
                var $this = this;
                this.bindMap.addObserver(this);
                this.textarea.addEventListener('change', function(){
                    $this.bindMap.set($this.bindName, this.value);
                });
                this.update(null);
            }
            update(observable:duice.data.__):void {
                this.textarea.value = this.bindMap.get(this.bindName);
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
            }
            setOption(list:duice.data.List, value:string, text:string):void {
                this.optionList = list;
                this.optionValue = value;
                this.optionText = text;
            }
            build():void {
                var $this = this;
                this.bindMap.addObserver(this);
                this.select.addEventListener('change', function(){
                    $this.bindMap.set($this.bindName, this.value);
                });
                this.update(this.bindMap);
                this.optionList.addObserver(this);
                this.update(this.optionList);
            }
            update(observable:duice.data.__):void {
                if(observable === this.optionList){
                    this.removeChildNodes(this.select);
                    for(var i = 0, size = this.optionList.getRowCount(); i < size; i ++){
                        var optionMap = this.optionList.getRow(i);
                        var option = document.createElement('option');
                        option.appendChild(document.createTextNode(optionMap.get(this.optionText)));
                        option.value = optionMap.get(this.optionValue);
                        this.select.appendChild(option);
                    }
                }
                if(observable === this.bindMap){
                    var value = this.bindMap.get(this.bindName);
                    this.select.value = value;
                }
            }
        }
        
        /**
         * duice.ui.CheckBox
         */
        export class CheckBox extends __ {
            input:HTMLInputElement;
            bindMap:duice.data.Map;
            bindName:string;
            constructor(input:HTMLInputElement) {
                super();
                this.input = input;
                this.input.classList.add('duice-ui-checkBox');
            }
            setBind(map:duice.data.Map, name:string):void {
                this.bindMap = map;
                this.bindName = name;
            }
            build():void {
                var $this = this;
                this.bindMap.addObserver(this);
                this.input.addEventListener('change', function(){
                    $this.bindMap.set($this.bindName, this.checked);
                });
                this.update(null);
            }
            update(observable:duice.data.__):void {
                var value = this.bindMap.get(this.bindName);
                if(value === true){
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
            }
            build():void {
                var $this = this;
                this.bindMap.addObserver(this);
                this.input.addEventListener('change', function(){
                    $this.bindMap.set($this.bindName, this.value);
                });
                this.update(null);
            }
            update(observable:duice.data.__):void {
                var value = this.bindMap.get(this.bindName);
                if(value === this.input.value){
                    this.input.checked = true;
                }else{
                    this.input.checked = false;
                }
            }
        }
        
        /**
         * duice.ui.Calendar
         */
        export class Calendar extends __ {
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

            }
            build():void {
                var $this = this;
                this.bindMap.addObserver(this);
                this.input.addEventListener('change', function(){
                    $this.bindMap.set($this.bindName, this.value);
                });
            }
            update(observable:duice.data.__):void {
                var value = this.bindMap.get(this.bindName);
                this.input.value = value;
            }
            createPicker():void {
                
            }
        }
        
        /**
         * duice.ui.Image
         */
        export class Image extends __ {
            img:HTMLImageElement;
            bindMap:duice.data.Map;
            bindName:string;
            input:HTMLInputElement;
            blank:string;
            limitSize:number = 1024 * 1024;
            constructor(img:HTMLImageElement) {
                super();
                this.img = img;
                this.img.classList.add('duice-ui-image');

            }
            setBind(map:duice.data.Map, name:string):void {
                this.bindMap = map;
                this.bindName = name;

            }
            build():void {
                var $this = this;
                this.input = document.createElement('input');
                this.input.setAttribute("type", "file");
                this.input.setAttribute("accept", "image/gif, image/jpeg, image/png");
                this.blank = this.img.src;
                
                // adds event listener for change
                this.img.addEventListener('click', function(e:any){
                    if($this.bindMap.isEnable() && $this.bindMap.isReadonly($this.bindName) == false){
                        $this.input.click();
                    }
                });
                this.input.addEventListener('change', function(e:any){
                    var fileReader = new FileReader();
                    if (this.files && this.files[0]) {
                        fileReader.addEventListener("load", function(e:any) {
                            var value = e.target.result;
                            var canvas = document.createElement("canvas");
                            var ctx = canvas.getContext("2d");
                            var image = document.createElement('img');
                            image.onload = function(){
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
                this.img.addEventListener('error', function() {
                    console.log('error',this);
                });
                
                // update
                this.update(null);
            }
            update(observable:duice.data.__):void {
                if(this.bindMap.get(this.bindName)) {
                    var src = this.bindMap.get(this.bindName);
                    this.img.src = src; 
                }else{
                    this.img.src = this.blank;
                }
                if(this.bindMap.isEnable() && this.bindMap.isReadonly(this.bindName) == false){
                    this.img.style.cursor = 'pointer';
                }else{
                    this.img.style.cursor = '';
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
            toolBar:HTMLDivElement;
            content:HTMLDivElement;
            contentHtml:HTMLDivElement;
            contentText:HTMLTextAreaElement;
            mode:string = 'html';
            modeButton:HTMLButtonElement;
            constructor(div:HTMLDivElement) {
                super();
                this.div = div;
                this.div.classList.add('duice-ui-htmlEditor');
            }
            setBind(map:duice.data.Map, name:string):void {
                this.bindMap = map;
                this.bindName = name;
            }
            build():void {
                var $this = this;
                
                // create tool bar
                this.toolBar = document.createElement('div');
                this.toolBar.classList.add('duice-ui-htmlEditor-toolBar');
                this.div.appendChild(this.toolBar);

                // font family
                var fontfamily = document.createElement('select');
                fontfamily.classList.add('duice-ui-htmlEditor-toolBar-fontfamily');
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
                this.toolBar.appendChild(fontfamily);
                
                // font size
                var fontsize = document.createElement('select');
                fontsize.classList.add('duice-ui-htmlEditor-toolBar-fontsize');
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
                this.toolBar.appendChild(fontsize);

                // bold
                var bold = document.createElement('button');
                bold.title = 'Bold';
                bold.classList.add('duice-ui-htmlEditor-toolBar-bold');
                bold.addEventListener('click', function(){
                    document.execCommand('bold', null, null);
                });
                this.toolBar.appendChild(bold);
                
                // italic
                var italic = document.createElement('button');
                italic.title = 'Italic';
                italic.classList.add('duice-ui-htmlEditor-toolBar-italic');
                italic.addEventListener('click',function(){
                    document.execCommand('italic',null,null);
                });
                this.toolBar.appendChild(italic);
                
                // underline
                var underline = document.createElement('button');
                underline.title = 'Underline';
                underline.classList.add('duice-ui-htmlEditor-toolBar-underline');
                underline.addEventListener('click',function() {
                    document.execCommand('underline',null,null);
                });
                this.toolBar.appendChild(underline);

                // align left
                var alignleft = document.createElement('button');
                alignleft.title = 'Align Left';
                alignleft.classList.add('duice-ui-htmlEditor-toolBar-alignleft');
                alignleft.addEventListener('click',function() {
                    document.execCommand('justifyLeft',null,null);
                });
                this.toolBar.appendChild(alignleft);
                
                // align center
                var aligncenter = document.createElement('button');
                aligncenter.title = 'Align Center';
                aligncenter.classList.add('duice-ui-htmlEditor-toolBar-aligncenter');
                aligncenter.addEventListener('click',function() {
                    document.execCommand('justifyCenter',null,null);
                });
                this.toolBar.appendChild(aligncenter);
                
                // align right
                var alignright = document.createElement('button');
                alignright.title = 'Align Right';
                alignright.classList.add('duice-ui-htmlEditor-toolBar-alignright');
                alignright.addEventListener('click',function() {
                    document.execCommand('justifyRight',null,null);
                });
                this.toolBar.appendChild(alignright);
                
                // indent increase
                var indentincrease = document.createElement('button');
                indentincrease.title = 'Indent';
                indentincrease.classList.add('duice-ui-htmlEditor-toolBar-indentincrease');
                indentincrease.addEventListener('click',function() {
                    document.execCommand('indent',null,null);
                });
                this.toolBar.appendChild(indentincrease);
                
                // indent decrease
                var indentdecrease = document.createElement('button');
                indentdecrease.title = 'Outdent';
                indentdecrease.classList.add('duice-ui-htmlEditor-toolBar-indentdecrease');
                indentdecrease.addEventListener('click',function() {
                    document.execCommand('outdent',null,null);
                });
                this.toolBar.appendChild(indentdecrease);
                
                // list order
                var listorder = document.createElement('button');
                listorder.title = 'Orderd List';
                listorder.classList.add('duice-ui-htmlEditor-toolBar-listorder');
                listorder.addEventListener('click',function() {
                    document.execCommand('insertorderedlist',null,null);
                });
                this.toolBar.appendChild(listorder);
                
                // list unorder
                var listunorder = document.createElement('button');
                listunorder.title = 'Unorderd List';
                listunorder.classList.add('duice-ui-htmlEditor-toolBar-listunorder');
                listunorder.addEventListener('click',function() {
                    document.execCommand('insertUnorderedList',null,null);
                });
                this.toolBar.appendChild(listunorder);
                
                // mode
                var mode = document.createElement('button');
                mode.title = 'Change Mode';
                mode.classList.add('duice-ui-htmlEditor-toolBar-mode');
                var $this = this;
                mode.addEventListener('click', function() {
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
                this.contentHtml.addEventListener('DOMSubtreeModified', function(){
                    if($this.bindMap.get($this.bindName) !== this.innerHTML){
                        $this.bindMap.set($this.bindName, this.innerHTML);
                    }
                });
                this.contentText.addEventListener('change', function(){
                    $this.bindMap.set($this.bindName, this.value);
                });
                
                // update
                this.update(null);
            }
            update(observable:duice.data.__):void {
                if(this.contentHtml.innerHTML !== this.bindMap.get(this.bindName)) {
                    this.contentHtml.innerHTML = this.bindMap.get(this.bindName);
                }
                if(this.contentText.value !== this.bindMap.get(this.bindName)){
                    this.contentText.value = this.bindMap.get(this.bindName);
                }
            }
            toggleMode():void {
                if(this.mode === 'html'){
                    this.mode = 'text';
                    this.contentHtml.style.display = 'none';
                    this.contentText.style.display = 'block';
                }else{
                    this.mode = 'html';
                    this.contentText.style.display = 'none';
                    this.contentHtml.style.display = 'block';
                }
                this.enableElement(this.toolBar, this.mode === 'html' ? true : false);
                this.modeButton.disabled = false;
            }
        }
        
        /**
         * duice.ui.MarkdownEditor
         */
        export class MarkdownEditor extends __ {
            div:HTMLDivElement;
            bindMap:duice.data.Map;
            bindName:string;
            toolBar:HTMLDivElement;
            content:HTMLDivElement;
            contentMarkdown:HTMLTextAreaElement;
            contentHtml:HTMLDivElement;
            mode:string = 'markdown';
            modeButton:HTMLButtonElement;
            selectionStart:number;
            selectionEnd:number;
            constructor(div:HTMLDivElement){
                super();
                this.div = div;
                this.div.classList.add('duice-ui-markdownEditor');
            }
            setBind(map:duice.data.Map, name:string):void {
                this.bindMap = map;
                this.bindName = name;
            }
            build():void {
                var $this = this;
                
                // create tool bar
                this.toolBar = document.createElement('div');
                this.toolBar.classList.add('duice-ui-markdownEditor-toolBar');
                this.div.appendChild(this.toolBar);
                
                // header
                var header = document.createElement('button');
                header.title = 'Header';
                header.classList.add('duice-ui-markdownEditor-toolBar-header');
                header.addEventListener('click', function(event){
                    $this.insertMarkdown('#', '');
                });
                this.toolBar.appendChild(header);
                
                // bold
                var bold = document.createElement('button');
                bold.title = 'Bold';
                bold.classList.add('duice-ui-markdownEditor-toolBar-bold');
                bold.addEventListener('click', function(event){
                    $this.insertMarkdown('**', '**');
                });
                this.toolBar.appendChild(bold);
                
                // italic
                var italic = document.createElement('button');
                italic.title = 'Italic';
                italic.classList.add('duice-ui-markdownEditor-toolBar-italic');
                italic.addEventListener('click', function(){
                    $this.insertMarkdown('__', '__');
                });
                this.toolBar.appendChild(italic);
                
                // cancel
                var cancel = document.createElement('button');
                cancel.title = 'Cancel';
                cancel.classList.add('duice-ui-markdownEditor-toolBar-cancel');
                cancel.addEventListener('click', function(){
                    $this.insertMarkdown('~~', '~~');
                });
                this.toolBar.appendChild(cancel);
                
                // list order
                var listorder = document.createElement('button');
                listorder.title = 'Orderd List';
                listorder.classList.add('duice-ui-markdownEditor-toolBar-listorder');
                listorder.addEventListener('click',function() {
                    $this.insertMarkdown('* ', '');
                });
                this.toolBar.appendChild(listorder);
                
                // list unorder
                var listunorder = document.createElement('button');
                listunorder.title = 'Unorderd List';
                listunorder.classList.add('duice-ui-markdownEditor-toolBar-listunorder');
                listunorder.addEventListener('click',function() {
                    $this.insertMarkdown('1. ', '');
                });
                this.toolBar.appendChild(listunorder);
                
                // line
                var line = document.createElement('button');
                line.title = 'Line';
                line.classList.add('duice-ui-markdownEditor-toolBar-line');
                line.addEventListener('click',function() {
                    $this.insertMarkdown('==========', '');
                });
                this.toolBar.appendChild(line);
                
                // code
                var code = document.createElement('button');
                code.title = 'Code Block';
                code.classList.add('duice-ui-markdownEditor-toolBar-code');
                code.addEventListener('click',function() {
                    $this.insertMarkdown('\n```\n', '\n```\n');
                });
                this.toolBar.appendChild(code);
                
                // image
                var image = document.createElement('button');
                image.title = 'Image Link';
                image.classList.add('duice-ui-markdownEditor-toolBar-image');
                image.addEventListener('click',function() {
                    //
                    $this.insertMarkdown(' ![Alt text](', ') ');
                });
                this.toolBar.appendChild(image);
                
                // link
                var link = document.createElement('button');
                link.title = 'URL Link';
                link.classList.add('duice-ui-markdownEditor-toolBar-link');
                link.addEventListener('click',function() {
                    $this.insertMarkdown(' [Title](', ') ');
                });
                this.toolBar.appendChild(link);
                
                // mode
                var $this = this;
                var mode = document.createElement('button');
                mode.title = 'Change Mode';
                mode.classList.add('duice-ui-markdownEditor-toolBar-mode');
                mode.addEventListener('click', function(){
                    $this.toggleMode();
                });
                this.toolBar.appendChild(mode);
                this.modeButton = mode;
                
                // create content
                this.content = document.createElement('div');
                this.content.classList.add('duice-ui-markdownEditor-content');
                this.contentMarkdown = document.createElement('textarea');
                this.contentMarkdown.addEventListener('keydown', function(){
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
                this.contentMarkdown.addEventListener('change', function(){
                    $this.bindMap.set($this.bindName, this.value);
                });
                
                // updates data
                this.update(null);
            }
            update(observable:duice.data.__):void {
                if(this.contentMarkdown.value !== this.bindMap.get(this.bindName)){
                    this.contentMarkdown.value = this.bindMap.get(this.bindName);
                    this.contentMarkdown.setSelectionRange(this.selectionStart,this.selectionEnd);
                    this.contentHtml.innerHTML = this.parseMarkdown(this.bindMap.get(this.bindName));
                }
            }
            insertMarkdown(startTag:string, endTag:string) {
                var selectionStart = this.contentMarkdown.selectionStart;
                var selectionEnd = this.contentMarkdown.selectionEnd;
                var selectionLength = selectionEnd - selectionStart;
                var value  = this.contentMarkdown.value.substring(0, selectionStart)
                            + startTag
                            + this.contentMarkdown.value.substring(selectionStart, selectionEnd)
                            + endTag
                            + this.contentMarkdown.value.substring(selectionEnd);
                this.contentMarkdown.value = value;
                this.selectionStart = selectionStart + startTag.length;
                this.selectionEnd = selectionStart + startTag.length + selectionLength;
                this.contentMarkdown.setSelectionRange(this.selectionStart,this.selectionEnd);
                this.contentMarkdown.focus();
            }
            toggleMode():void {
                if(this.mode === 'markdown' ){
                    this.mode = 'html';
                    this.contentHtml.style.display = 'block';
                    this.contentMarkdown.style.display = 'none';
                }else{
                    this.mode = 'markdown';
                    this.contentMarkdown.style.display = 'block';
                    this.contentHtml.style.display = 'none';
                }
                this.enableElement(this.toolBar, this.mode === 'markdown' ? true : false);
                this.modeButton.disabled = false;
            }
        }
        
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
            }
            setItem(item:string):void {
                this.item = item;
            }
            setEditable(editable:boolean):void {
                this.editable = editable;
            }
            build():void {
                this.bindList.addObserver(this);
                this.update();
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
                        var fromIndex = parseInt(event.dataTransfer.getData('index'));
                        var toIndex = index;
                        $this.bindList.moveRow(fromIndex, toIndex);
                        $this.bindList.index = toIndex;
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
    }

}

//DOMContentLoaded event process
document.addEventListener("DOMContentLoaded", function(event) {
    var $context:any = typeof self !== 'undefined' ? self : 
                        typeof window !== 'undefined' ? window :
                        {};
    duice.initialize(document, $context);
});



