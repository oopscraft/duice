namespace duice {
    
    export class Observable {
        observers:Array<Observer> = new Array<Observer>();
        changed:boolean = false;
        addObserver(observer:Observer):void {
            for(var i = 0, size = this.observers.length; i < size; i++){
                if(this.observers[i] === observer){
                    return;
                }
            }
            this.observers.push(observer);
        }
        notifyObservers(obj:object):void {
            if(this.hasChanged()){
                for(var i = 0, size = this.observers.length; i < size; i++){
                    this.observers[i].update(this, obj);
                }
                this.clearChanged();
            }
        }
        setChanged():void {
            this.changed = true;
        }
        hasChanged():boolean {
            return this.changed;
        }
        clearChanged():void {
            this.changed = false;
        }
    }
    
    export interface Observer {
        update(observable:Observable, obj:object):void;
    }
    
    export class BindException {
        element:any;
        dataObject:duice.data.DataObject;
        name:string;
        constructor(element:any, dataObject:duice.data.DataObject, name:string){
            this.element = element;
            this.dataObject = dataObject;
            this.name = name;
        }
    }
    
    /**
     * generateObjectID
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
     * getObject
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
     * isEmpty
     * @param value
     */
    export function isEmpty(value:any){
        if(value === undefined
        || value === null
        || value === ''
        ){
            return true;
        }else{
            return false;
        }
    }
    
    /**
     * defaultIfEmpty
     * @param value
     * @param defaultValue
     */
    export function defaultIfEmpty(value:any, defaultValue:any) {
        if(isEmpty(value) === true) {
            return defaultValue;
        }else{
            return value;
        }
    }
    
    
    /**
     * lpad
     * @param value
     * @param length
     * @param padChar
     */
    export function lpad(value:string, length:number, padChar:string) {
        for(var i = 0, size = (length-value.length); i < size; i ++ ) {
            value = padChar + value;
        }
        return value;
    }
    
    /**
     * rpad
     * @param value
     * @param length
     * @param padChar
     */
    function rpad(value:string, length:number, padChar:string) {
        for(var i = 0, size = (length-value.length); i < size; i ++ ) {
            value = value + padChar;
        }
        return value;
    }
    
    function mask(value: any, type: string, format: any):string {
        switch (type) {
        
            // string type
            case 'string' :
                var string = '';
                var index = -1;
                for(var i = 0, size = format.length; i < size; i ++){
                    var formatChar = format.charAt(i);
                    if(formatChar === '#'){
                        index ++;
                        string += value.charAt(index);
                    }else{
                        string += formatChar;
                    }
                }
                return string;
                    
            // number
            case 'number':
                var number;
                if(typeof value === 'number'){
                    number = value;
                }else if(typeof value === 'string'){
                    value = value.replace(/\,/gi,'');
                    number = Number(value);
                }else{
                    number = Number(value);
                }
                if(isNaN(number)){
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
                var date:Date;
                if(value instanceof Date){
                    date = value;
                }else if (typeof value === 'number'){
                    date = new Date(value);
                } else {
                    throw 'Not Date Type';
                }
                var formatRex = /yyyy|yy|MM|dd|HH|hh|mm|ss/gi;
                var maskValue:string = format.replace(formatRex, function($1:string) {
                    switch ($1) {
                        case "yyyy": return date.getFullYear();
                        case "yy": return lpad(String(date.getFullYear()%1000), 2, '0');
                        case "MM": return lpad(String(date.getMonth() + 1), 2, '0');
                        case "dd": return lpad(String(date.getDate()), 2, '0');
                        case "HH": return lpad(String(date.getHours()), 2, '0');
                        case "hh": return lpad(String(date.getHours() <= 12 ? date.getHours() : date.getHours()%12), 2, '0');
                        case "mm": return lpad(String(date.getMinutes()), 2, '0');
                        case "ss": return lpad(String(date.getSeconds()), 2, '0');
                        default: return $1;
                    }
                });
                return maskValue;
    
            // default
            default :
                throw 'encodeMask-type must be string|number|date';
        }
    }
    
    /**
     * unmask
     * @param value
     * @param type
     * @param format
     */
    function unmask(value:string, type:string, format:any):any {
        switch (type) {
        
            // string type
            case 'string' :
                if(isEmpty(value)){
                    return null;
                }
                // TODO
                
                return value;
                
            // number type
            case 'number' :
                if(isEmpty(value)){
                    return null;
                }
                var number;
                if(typeof value === 'number'){
                    number = value;
                }else if(typeof value === 'string'){
                    value = value.replace(/,/g,'');
                    number = Number(value);
                }else{
                    number = Number(value);
                }
                if(isNaN(number)){
                    throw 'NaN';
                }
                var scale = parseInt(format);
                return number.toFixed(scale);
                
            // date type
            case 'date' :
                if(isEmpty(value)){
                    return null;
                }
                if(value.length !== format.length){
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
                    matchValue = lpad(matchValue, formatLength,'0');
                    if(isNaN(Number(matchValue))){
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
                            date.setMonth(monthValue-1);
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
    function executeExpression(element:HTMLElement, $context:any):any {
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
    
    /**
     * escapeHtml
     * @param value
     */
    function escapeHtml(value:string):string {
        
        // checks value is valid.
        if(!value || typeof value !== 'string'){
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
    
    /**
     * parseMarkdown
     * @param value
     */
    function parseMarkdown(value:string):string {
        
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
    
    /**
     * removeChildNodes
     * @param element
     */
    function removeChildNodes(element:HTMLElement):void {
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
    
    /**
     * enableElement
     * @param element
     * @param enable
     */
    function enableElement(element:HTMLElement, enable:boolean):void {
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
    
    /**
     * createDocumentFragment
     * @param html
     */
    function createDocumentFragment(html:string):DocumentFragment {
        var template = document.createElement('template');
        template.innerHTML = html;
        return template.content;
    }
    
    /**
     * getCurrentWindow
     */
    function getCurrentWindow():Window {
        if(window.frameElement){
            return window.parent;
        }else{
            return window;
        }
    }
    
    /**
     * getParentNode
     * @param element
     */
    function getParentNode(element:HTMLElement):Node {
        var parentNode = element.parentNode;
        return parentNode;
    }
    
    /**
     * setPositionCentered
     * @param element
     */
    function setPositionCentered(element:HTMLElement):void {
        var window = this.getCurrentWindow();
        var computedStyle = window.getComputedStyle(element);
        var computedWidth = parseInt(computedStyle.getPropertyValue('width').replace(/px/gi, ''));
        var computedHeight = parseInt(computedStyle.getPropertyValue('height').replace(/px/gi, ''));
        element.style.width = Math.min(window.screen.width-20, computedWidth) + 'px';
        element.style.height = Math.min(window.screen.height, computedHeight) + 'px';
        element.style.left = Math.max(10,window.innerWidth/2 - computedWidth/2) + 'px';
        element.style.top = Math.max(0,window.innerHeight/2 - computedHeight/2) + 'px';
    }
    
    /**
     * delay
     * @param callback
     */
    function delay(callback:Function){
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
    
    /**
     * fadeIn
     * @param element
     */
    function fadeIn(element:HTMLElement):void {
        element.classList.remove('duice-ui-fadeOut');
        element.classList.add('duice-ui-fadeIn');
    }
    
    /**
     * fadeOut
     * @param element
     */
    function fadeOut(element:HTMLElement):void {
        element.classList.remove('duice-ui-fadeIn');
        element.classList.add('duice-ui-fadeOut');
    }
    
    /**
     * getCurrentMaxZIndex
     */
    function getCurrentMaxZIndex():number {
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
    
    /**
     * block
     * @param element
     */
    function block(element:HTMLElement):object {
        
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
    
    /**
     * load
     * @param element
     */
    function load(element:HTMLElement):object {
        var $this = this;
        var div = document.createElement('div');
        div.classList.add('duice-ui-load');
        div.style.position = 'fixed';
        div.style.opacity = '0';
        div.style.zIndex = String(this.getCurrentMaxZIndex() + 1);

        // on resize event
        this.getCurrentWindow().addEventListener('resize', function(event:any) {
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
    
    /**
     * duice.data
     */
    export namespace data {

        /**
         * Abstract DataObject
         */
        export abstract class DataObject extends Observable implements Observer {
            abstract update(observable:Observable, obj:object):void;
            abstract fromJson(...args: any[]):void;
            abstract toJson(...args: any[]):object;  
            abstract isDirty():boolean;
            abstract reset():void;
        }
        
        /**
         * Map data structure
         */
        export class Map extends DataObject {
            data:any = new Object();
            originData:string;
            enable:boolean = true;
            readonly:Array<string> = new Array<string>();
            constructor(json?:any) {
                super();
                if(json){
                    this.fromJson(json);
                }
            }
            update(uiElement:duice.ui.MapUIElement, obj:object):void {
                console.info('Map.update', uiElement, obj);
                var name = uiElement.getName();
                var value = uiElement.getValue();
                this.set(name, value);
            }
            fromJson(json:any): void {
                
                // sets data
                this.data = new Object();
                for(var name in json){
                    this.data[name] = json[name];
                }
                
                // saves original data.
                this.originData = JSON.stringify(this.toJson());
                
                // notify to observers
                this.setChanged();
                this.notifyObservers(this);
            }
            toJson():object {
                var json: any = new Object();
                for(var name in this.data){
                    json[name] = this.data[name];
                }
                return json;
            }
            isDirty():boolean {
                if(JSON.stringify(this.toJson()) === this.originData){
                    return false;
                }else{
                    return true;
                }
            }
            reset():void {
                var originJson = JSON.parse(this.originData);
                this.fromJson(originJson);
            }
            set(name:string, value:any):void {
                this.data[name] = value;
                this.setChanged();
                this.notifyObservers(this);
            }
            get(name:string):any {
                return this.data[name];
            }
            getNames():string[]{
                var names = new Array();
                for(var name in this.data){
                    names.push(name);
                }
                return names;
            }
            setEnable(enable:boolean):void {
                this.enable = enable;
                this.setChanged();
                this.notifyObservers(this);
            }
            isEnable():boolean {
                return this.enable;
            }
            setReadonly(name:string, readonly:boolean):void {
                if(this.readonly.indexOf(name) == -1){
                    this.readonly.push(name);
                }
                this.setChanged();
                this.notifyObservers(this);
            }
            isReadonly(name:string):boolean {
                if(this.readonly.indexOf(name) >= 0){
                    return true;
                }else{
                    return false;
                }
            }
        }
        
        /**
         * duice.data.List
         */
        export class List extends DataObject {
            data:Array<duice.data.Map> = new Array<duice.data.Map>();
            originData:string;
            index:number = -1;
            constructor(jsonArray?:Array<any>, __childName?:string) {
                super();
                if(jsonArray){
                    this.fromJson(jsonArray);
                }
            }
            update(observable:Observable, obj:object):void {
                console.log('List.update');
                this.setChanged();
                this.notifyObservers(obj);
            }
            fromJson(jsonArray:Array<any>):void {
                this.data = new Array<duice.data.Map>();
                for(var i = 0; i < jsonArray.length; i ++ ) {
                    var map = new duice.data.Map(jsonArray[i]);
                    map.addObserver(this);
                    this.data.push(map);
                }
                this.originData = JSON.stringify(this.toJson());
                this.clearIndex();
                this.setChanged();
                this.notifyObservers(this);
            }
            toJson(__childName?:string):Array<object> {
                var jsonArray = new Array();
                for(var i = 0; i < this.data.length; i ++){
                    jsonArray.push(this.data[i].toJson());
                }
                return jsonArray;
            }
            isDirty():boolean {
                if(JSON.stringify(this.toJson()) === this.originData){
                    return false;
                }else{
                    return true;
                }
            }
            reset():void {
                var originJson = JSON.parse(this.originData);
                this.fromJson(originJson);
            }
            setIndex(index:number):void {
                this.index = index;
                this.setChanged();
                this.notifyObservers(this);
            }
            getIndex():number {
                return this.index;
            }
            clearIndex():void {
                this.index = -1;
                this.setChanged();
                this.notifyObservers(this);
            }
            getSize():number {
                return this.data.length;
            }
            get(index:number):Map {
                return this.data[index];
            }
            add(map:Map):void {
                map.addObserver(this);
                this.data.push(map);
                this.index = this.getSize()-1;
                this.setChanged();
                this.notifyObservers(this);
            }
            insert(index:number, map:Map):void {
                if(0 <= index && index < this.data.length) {
                    map.addObserver(this);
                    this.data.splice(index, 0, map);
                    this.index = index;
                    this.setChanged();
                    this.notifyObservers(this);
                }
            }
            remove(index:number):void {
                console.log(index);
                if(0 <= index && index < this.data.length) {
                    this.data.splice(index, 1);
                    this.index = Math.min(this.index, this.data.length -1);
                    this.setChanged();
                    this.notifyObservers(this);
                }
            }
            move(fromIndex:number, toIndex:number):void {
                this.index = fromIndex;
                this.data.splice(toIndex, 0, this.data.splice(fromIndex, 1)[0]);
                this.index = toIndex;
                this.setChanged();
                this.notifyObservers(this);
            }
            sort(name:string, ascending:boolean):void {
                this.data.sort(function(a:duice.data.Map,b:duice.data.Map):number {
                    var aValue = a.get(name);
                    var bValue = b.get(name);
                    return (aValue > bValue ? 1 : aValue < bValue ? -1 : 0) * (ascending == false ? -1 : 1);
                });
                this.setChanged();
                this.notifyObservers(this);
            }
        }
    }
    
    /**
     * duice.ui
     */
    export namespace ui {
        
        /**
         * duice.initialize
         * @param container
         * @param $context
         */
        export function initialize(container:any, $context:any):void {

            // ul
            var ulElements = container.querySelectorAll('ul[is="duice-ui-ul"][data-duice-bind]:not([data-duice-id])');
            for(var i = 0; i < ulElements.length; i++ ) {
                try {
                    var element:any = ulElements[i];
                    duice.ui.UListFactory.getUList(element, $context);
                }catch(e){
                    console.error(e,element);
                    throw e;
                }
            }
            
            // table
            var tableElements = container.querySelectorAll('table[is="duice-ui-table"][data-duice-bind]:not([data-duice-id])');
            for(var i = 0; i < tableElements.length; i++ ) {
                try {
                    var element:any = tableElements[i];
                    duice.ui.TableFactory.getTable(element, $context);
                }catch(e){
                    console.error(e,element);
                    throw e;
                }
            }
            
            // creates unit elements
            var elementTags = [
                 'span[is="duice-ui-span"][data-duice-bind]:not([data-duice-id])'
                ,'input[is="duice-ui-input"][data-duice-bind]:not([data-duice-id])'
                ,'select[is="duice-ui-select"][data-duice-bind]:not([data-duice-id])'
                ,'textarea[is="duice-ui-textarea"][data-duice-bind]:not([data-duice-id])'
            ];
            var elements = container.querySelectorAll(elementTags.join(','));
            for(var i = 0; i < elements.length; i ++ ) {
                try {
                    var element:any = elements[i];
                    var type = element.dataset.duice;
                    var is = element.getAttribute('is');
                    switch(is) {
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
                }catch(e){
                    console.error(e, elements[i]);
                    throw e;
                }
            }
        }
        
        export abstract class UIElement extends Observable implements Observer {
            constructor(element:HTMLElement){
                super();
                element.dataset.duiceId = generateUUID();
            }
            abstract bind(...args: any[]):void;
            abstract update(observable:duice.data.DataObject, obj:object):void;
        }
        
        export abstract class MapUIElement extends UIElement {
            map:duice.data.Map;
            name:string;
            bind(map:duice.data.Map, name:string):void {
                if(map instanceof duice.data.Map === false){
                    throw new BindException(this, map, name);
                }
                this.map = map;
                this.name = name;
                this.map.addObserver(this);
                this.addObserver(this.map);
                this.update(this.map, this);
            }
            getMap():duice.data.Map {
                return this.map;
            }
            getName():string {
                return this.name;
            }
            abstract update(map:duice.data.Map, obj:object):void;
            abstract getValue():any;
        }

        /**
         * duice.ui.SpanFactory
         */
        export var SpanFactory = {
            getSpan(element:HTMLInputElement, $context:any):Span {
                var span = new Span(element);
                var bind = element.dataset.duiceBind.split(',');
                span.bind(getObject($context, bind[0]), bind[1]);
                return span;
            }
        }
        
        /**
         * duice.ui.Span
         */
        export class Span extends MapUIElement {
            span:HTMLSpanElement;
            constructor(span:HTMLSpanElement){
                super(span);
                this.span = span;
                this.span.classList.add('duice-ui-span');
            }
            update(map:duice.data.Map, obj:object):void {
                var value = map.get(this.name);
                removeChildNodes(this.span);
                this.span.appendChild(document.createTextNode(defaultIfEmpty(value, '')));
            }
            getValue():string {
                return defaultIfEmpty(this.span.innerHTML, null);
            }
        }

        /**
         * duice.ui.InputFactory
         */
        export var InputFactory = {
            getInput(element:HTMLInputElement, $context:any):Input {
                var input;
                switch(element.getAttribute('type')){
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
        }
        
        /**
         * duice.ui.Input
         */
        export abstract class Input extends MapUIElement {
            input:HTMLInputElement;
            constructor(input:HTMLInputElement){
                super(input);
                this.input = input;
                var $this = this;
                this.input.addEventListener('change', function(event){
                    $this.setChanged();
                    $this.notifyObservers(this); 
                });
                
                // disabled drag in case of parent element is draggable.
                this.input.setAttribute('draggable', 'true');
                this.input.addEventListener('dragstart', function(event){
                   event.preventDefault();
                   event.stopPropagation();
                });
            }
            abstract update(map:duice.data.Map, obj:object):void;
            abstract getValue():any;
        }
        
        /**
         * duice.ui.GenericInput
         */
        export class GenericInput extends Input {
            constructor(input:HTMLInputElement){
                super(input);
                this.input.classList.add('duice-ui-genericInput');
            }
            update(map:duice.data.Map, obj:object):void {
                var value = map.get(this.getName());
                this.input.value = defaultIfEmpty(value, '');
            }
            getValue():any {
                var value:any = this.input.value;
                if(isEmpty(value)){
                    return null;
                }else{
                    if(isNaN(value)){
                        return String(value);
                    }else{
                        return Number(value);
                    }
                }
            }
        }
        
        /**
         * duice.ui.TextInput
         */
        export class TextInput extends Input {
            constructor(input:HTMLInputElement){
                super(input);
                this.input.classList.add('duice-ui-textInput');
            }
            update(map:duice.data.Map, obj:object):void {
                var value = map.get(this.getName());
                this.input.value = defaultIfEmpty(value, '');
            }
            getValue():string {
                return defaultIfEmpty(this.input.value, null);
            }
        }
        
        /**
         * duice.ui.NumberInput
         */
        export class NumberInput extends Input {
            constructor(input:HTMLInputElement){
                super(input);
                this.input.classList.add('duice-ui-numberInput');
            }
            update(map:duice.data.Map, obj:object):void {
                var value = map.get(this.getName());
                this.input.value = String(defaultIfEmpty(value,0));
            }
            getValue():number {
                return Number(defaultIfEmpty(this.input.value,'0'));
            }
        }
        
        /**
         * duice.ui.CheckboxInput
         */
        export class CheckboxInput extends Input {
            constructor(input:HTMLInputElement){
                super(input);
                this.input.classList.add('duice-ui-checkboxInput');
            }
            update(map:duice.data.Map, obj:object):void {
                var value = map.get(this.getName());
                if(value === true){
                    this.input.checked = true;
                }else{
                    this.input.checked = false;
                }
            }
            getValue():boolean {
                return this.input.checked;
            }
        }
        
        /**
         * duice.ui.RadioInput
         */
        export class RadioInput extends Input {
            constructor(input:HTMLInputElement){
                super(input);
                this.input.classList.add('duice-ui-radioInput');
            }
            update(map:duice.data.Map, obj:object):void {
                var value = map.get(this.getName());
                if(value === this.input.value){
                    this.input.checked = true;
                }else{
                    this.input.checked = false;
                }
            }
            getValue():string {
                return this.input.value;
            }
        }
        
        /**
         * duice.ui.DateInput
         */
        export class DateInput extends Input {
            pickerDiv:HTMLDivElement;
            type:string;
            clickListener:any;
            constructor(input:HTMLInputElement){
                super(input);
                this.type = this.input.getAttribute('type').toLowerCase();
                this.input.setAttribute('type','text');
                this.input.classList.add('duice-ui-dateInput');
                var $this = this;
                this.input.addEventListener('click', function(event){
                    $this.openPicker();
                });
            }
            update(map:duice.data.Map, obj:object):void {
                var value = map.get(this.getName());
                if(isEmpty(value)){
                    this.input.value = '';
                }else{
                    value = new Date(value);
                    this.input.value = value.toString();
                }
            }
            getValue():number {
                var value = this.input.value;
                if(isEmpty(value)){
                    return null;
                }else{
                    return new Date(value).getTime();
                }
            }
            openPicker():void {
                
                // checks pickerDiv is open.
                if(this.pickerDiv){
                    return;
                }
                
                var $this = this;
                this.pickerDiv = document.createElement('div');
                this.pickerDiv.classList.add('duice-ui-dateInput__pickerDiv');

                // parses parts
                var date:Date;
                if(isEmpty(this.getValue)){
                    date = new Date();
                }else{
                    date = new Date(this.getValue());
                }
                var yyyy = date.getFullYear();
                var mm = date.getMonth();
                var dd = date.getDate();
                var hh = date.getHours();
                var mi = date.getMinutes();
                var ss = date.getSeconds();
                
                // click event listener
                this.clickListener = function(event:any){
                    if(!$this.input.contains(event.target) && !$this.pickerDiv.contains(event.target)){
                        $this.closePicker();
                    }
                }
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
                closeButton.addEventListener('click', function(event){
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
                prevMonthButton.addEventListener('click', function(event){
                    date.setMonth(date.getMonth() - 1);
                    updateDate(date);
                });
                
                // todayButton
                var todayButton = document.createElement('button');
                todayButton.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-dateDiv-todayButton');
                dateDiv.appendChild(todayButton);
                todayButton.addEventListener('click', function(event){
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
                yearSelect.addEventListener('change', function(event){
                    date.setFullYear(parseInt(this.value));
                    updateDate(date);
                });
                
                // divider
                dateDiv.appendChild(document.createTextNode('-'));
                
                // month select
                var monthSelect = document.createElement('select');
                monthSelect.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-dateDiv-monthSelect');
                dateDiv.appendChild(monthSelect);
                for(var i = 0, end = 11; i <= end; i ++ ) {
                    var option = document.createElement('option');
                    option.value = String(i);
                    option.text = String(i + 1);
                    monthSelect.appendChild(option);
                }
                monthSelect.addEventListener('change', function(event){
                    date.setMonth(parseInt(this.value));
                    updateDate(date);
                });
               
                // next month button
                var nextMonthButton = document.createElement('button');
                nextMonthButton.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-dateDiv-nextMonthButton');
                dateDiv.appendChild(nextMonthButton);
                nextMonthButton.addEventListener('click', function(event){
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
                ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(function(element){
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
                if(this.type === 'date'){
                    date.setHours(0);
                    date.setMinutes(0);
                    date.setSeconds(0);
                    timeDiv.style.display = 'none';
                }
                
                // now
                var nowButton = document.createElement('button');
                nowButton.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-timeDiv-nowButton');
                timeDiv.appendChild(nowButton);
                nowButton.addEventListener('click', function(event){
                    var newDate = new Date();
                    date.setHours(newDate.getHours());
                    date.setMinutes(newDate.getMinutes());
                    date.setSeconds(newDate.getSeconds());
                    updateDate(date);
                });

                // hourSelect
                var hourSelect = document.createElement('select');
                hourSelect.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-timeDiv-hourSelect');
                for(var i = 0; i <= 23; i ++){
                    var option = document.createElement('option');
                    option.value = String(i);
                    option.text = lpad(String(i), 2, '0');
                    hourSelect.appendChild(option);
                }
                timeDiv.appendChild(hourSelect);
                hourSelect.addEventListener('change', function(event){
                    date.setHours(parseInt(this.value)); 
                });
                
                // divider
                timeDiv.appendChild(document.createTextNode(':'));
                
                // minuteSelect
                var minuteSelect = document.createElement('select');
                minuteSelect.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-timeDiv-minuteSelect');
                for(var i = 0; i <= 59; i ++){
                    var option = document.createElement('option');
                    option.value = String(i);
                    option.text = lpad(String(i), 2, '0');
                    minuteSelect.appendChild(option);
                }
                timeDiv.appendChild(minuteSelect);
                minuteSelect.addEventListener('change', function(event){
                    date.setMinutes(parseInt(this.value)); 
                });
                
                // divider
                timeDiv.appendChild(document.createTextNode(':'));
                
                // secondsSelect
                var secondSelect = document.createElement('select');
                secondSelect.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-timeDiv-secondSelect');
                for(var i = 0; i <= 59; i ++){
                    var option = document.createElement('option');
                    option.value = String(i);
                    option.text = lpad(String(i), 2, '0');
                    secondSelect.appendChild(option);
                }
                timeDiv.appendChild(secondSelect);
                secondSelect.addEventListener('change', function(event){
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
                confirmButton.addEventListener('click', function(event){
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
                function updateDate(date:Date):void {
                    var yyyy = date.getFullYear();
                    var mm = date.getMonth();
                    var dd = date.getDate();
                    var hh = date.getHours();
                    var mi = date.getMinutes();
                    var ss = date.getSeconds();
                    
                    // updates yearSelect
                    for(var i = yyyy - 5, end = yyyy + 5; i <= end; i ++ ) {
                        var option = document.createElement('option');
                        option.value = String(i);
                        option.text = String(i);
                        yearSelect.appendChild(option);
                    }
                    yearSelect.value = String(yyyy);
                    
                    // updates monthSelect
                    monthSelect.value = String(mm);
                    
                    // updates dateTbody
                    var startDay = new Date(yyyy,mm,1).getDay();
                    var lastDates = [31,28,31,30,31,30,31,31,30,31,30,31];
                    if (yyyy%4 && yyyy%100!=0 || yyyy%400===0) {
                        lastDates[1] = 29;
                    }
                    var lastDate = lastDates[mm];
                    var rowNum = Math.ceil((startDay + lastDate - 1)/7);
                    var dNum = 0;
                    var currentDate = new Date();
                    removeChildNodes(calendarTbody);
                    for (var i=1; i<=rowNum; i++) {
                        var dateTr = document.createElement('tr');
                        dateTr.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-calendarTable-dateTr');
                        for (var k=1; k<=7; k++) {
                            var dateTd = document.createElement('td');
                            dateTd.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-calendarTable-dateTd');
                            if((i === 1 && k < startDay) 
                            || (i === rowNum && dNum >= lastDate)
                            ){
                                dateTd.appendChild(document.createTextNode(''));
                            }else{
                                dNum++;
                                dateTd.appendChild(document.createTextNode(String(dNum)));
                                dateTd.dataset.date = String(dNum);
                                
                                // checks selected
                                if(currentDate.getFullYear() === yyyy
                                && currentDate.getMonth() === mm
                                && currentDate.getDate() === dNum){
                                    dateTd.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-calendarTable-dateTd--today');
                                }
                                if(dd === dNum){
                                    dateTd.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-calendarTable-dateTd--selected');
                                }
                                dateTd.addEventListener('click', function(event){
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
            }
            closePicker():void {
                this.pickerDiv.remove();
                this.pickerDiv = null;
                window.removeEventListener('click', this.clickListener);
            }
        }
        
        /**
         * duice.ui.SpanFactory
         */
        export var SelectFactory = {
            getSelect(element:HTMLSelectElement, $context:any):Select {
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
        }
        
        /**
         * duice.ui.Select
         */
        export class Select extends MapUIElement {
            select:HTMLSelectElement;
            optionList:duice.data.List;
            optionValue:string;
            optionText:string;
            defaultOptions:Array<HTMLOptionElement> = new Array<HTMLOptionElement>();
            constructor(select:HTMLSelectElement) {
                super(select);
                this.select = select;
                this.select.classList.add('duice-ui-select');
                var $this = this;
                this.select.addEventListener('change', function(event){
                    $this.setChanged();
                    $this.notifyObservers(this); 
                });
                
                // stores default options
                for(var i = 0, size = this.select.options.length; i < size; i ++){
                    this.defaultOptions.push(this.select.options[i])
                }
            }
            setOption(list:duice.data.List, value:string, text:string):void {
                this.optionList = list;
                this.optionValue = value;
                this.optionText = text;
                var $this = this;
                function updateOption(optionList:duice.data.List){
                    
                    // removes all options
                    removeChildNodes($this.select);
                    
                    // adds default options
                    for(var i = 0, size = $this.defaultOptions.length; i < size; i ++){
                        $this.select.appendChild($this.defaultOptions[i]); 
                    }
                    
                    // update data options
                    for(var i = 0, size = optionList.getSize(); i < size; i ++){
                        var optionMap = optionList.get(i);
                        var option = document.createElement('option');
                        option.value = optionMap.get($this.optionValue);
                        option.appendChild(document.createTextNode(optionMap.get($this.optionText)));
                        $this.select.appendChild(option);
                    }
                }
                updateOption(this.optionList);
                this.optionList.addObserver({
                    update(list:duice.data.List):void {
                        updateOption(list);
                    }
                });
            }
            update(map:duice.data.Map, obj:object):void {
                var value = map.get(this.getName());
                this.select.value = defaultIfEmpty(value,'');
            }
            getValue():any {
                var value = this.select.value;
                return defaultIfEmpty(value, null);
            }
        }
        
        /**
         * duice.ui.TextareaFactory
         */
        export var TextareaFactory = {
            getTextarea(element:HTMLTextAreaElement, $context:any):Textarea {
                var textarea = new Textarea(element);
                var bind = element.dataset.duiceBind.split(',');
                textarea.bind(getObject($context, bind[0]), bind[1]);
                return textarea;
            }
        }
        
        /**
         * duice.ui.Textarea
         */
        export class Textarea extends MapUIElement {
            textarea:HTMLTextAreaElement;
            editorDiv:HTMLDivElement;
            clickListener:any;
            constructor(textarea:HTMLTextAreaElement) {
                super(textarea);
                this.textarea = textarea;
                this.textarea.classList.add('duice-ui-textarea');
                var $this = this;
                this.textarea.addEventListener('change', function(event){
                    $this.setChanged();
                    $this.notifyObservers(this); 
                });
            }
            update(map:duice.data.Map, obj:object):void {
                var value = map.get(this.getName());
                this.textarea.value = defaultIfEmpty(value, '');
            }
            getValue():any {
                return defaultIfEmpty(this.textarea.value, null);
            }
        }
        
        /**
         * duice.ui.ListUIElement
         */
        export abstract class ListUIElement extends UIElement {
            list:duice.data.List;
            item:string;
            bind(list:duice.data.List, item:string):void {
                this.list = list;
                this.item = item;
                this.list.addObserver(this);
                this.addObserver(this.list);
                this.update(this.list, this);
            }
            getList():duice.data.List {
                return this.list;
            }
            getItem():string {
                return this.item;
            }
            abstract update(list:duice.data.List, obj:object):void;
        }
        
        /**
         * duice.ui.TableFactory
         */
        export var TableFactory = {
            getTable(element:HTMLTableElement, $context:any):Table {
                var table = new Table(element);
                if(element.dataset.duiceEditable){
                    table.setEditable(Boolean(element.dataset.duiceEditable));
                }
                var bind = element.dataset.duiceBind.split(',');
                table.bind(getObject($context, bind[0]), bind[1]);
                return table;
            }
        }
        
        /**
         * duice.ui.TableViewer
         */
        export class Table extends ListUIElement {
            table:HTMLTableElement;
            thead:HTMLTableSectionElement;
            tbody:HTMLTableSectionElement;
            tbodies:Array<HTMLTableSectionElement> = new Array<HTMLTableSectionElement>();
            editable:boolean;
            constructor(table:HTMLTableElement) {
                super(table);
                this.table = table;
                this.table.classList.add('duice-ui-table');
                this.thead = <HTMLTableSectionElement>this.table.querySelector('thead');
                this.thead.classList.add('duice-ui-table__thead');
                var tbody = this.table.querySelector('tbody');
                this.tbody = <HTMLTableSectionElement>tbody.cloneNode(true);
                this.tbody.classList.add('duice-ui-table__tbody');
                this.table.removeChild(tbody);
            }
            setEditable(editable:boolean):void {
                this.editable = editable;
            }
            update(list:duice.data.List, obj:object):void {
                
                // checks changed source instance
                if(obj instanceof duice.data.Map){
                    return;
                }
                
                var $this = this;
                
                // remove previous rows
                for(var i = 0; i < this.tbodies.length; i ++ ) {
                    this.table.removeChild(this.tbodies[i]);
                }
                this.tbodies.length = 0;
                
                // creates new rows
                for(var index = 0; index < list.getSize(); index ++ ) {
                    var map = list.get(index);
                    var tbody = this.createTbody(index,map);
                    tbody.dataset.duiceIndex = String(index);
                    
                    // select index
                    if(index === list.getIndex()){
                        tbody.classList.add('duice-ui-table__tbody--index');
                    }
                    tbody.addEventListener('mousedown', function(event){
                        for(var i = 0; i < $this.tbodies.length; i ++ ) {
                            $this.tbodies[i].classList.remove('duice-ui-table__tbody--index');
                        }
                        this.classList.add('duice-ui-table__tbody--index');
                        list.index = Number(this.dataset.duiceIndex);
                    });
                    
                    // drag and drop event
                    if(this.editable === true) {
                        tbody.setAttribute('draggable', 'true');
                        tbody.addEventListener('dragstart', function(event){
                            event.dataTransfer.setData("fromIndex", this.dataset.duiceIndex);
                        });
                        tbody.addEventListener('dragover', function(event){
                            event.preventDefault();
                            event.stopPropagation();
                        });
                        tbody.addEventListener('drop', function(event){
                            event.preventDefault();
                            event.stopPropagation();
                            var fromIndex = parseInt(event.dataTransfer.getData('fromIndex'));
                            var toIndex = parseInt(this.dataset.duiceIndex);
                            list.move(fromIndex, toIndex);
                            tbody.click();
                        });
                    }
                    
                    this.table.appendChild(tbody);
                    this.tbodies.push(tbody);
                }
                
                // not found row
                if(list.getSize() < 1) {
                    var emptyTbody = this.createEmptyTbody();
                    this.table.appendChild(emptyTbody);
                    this.tbodies.push(emptyTbody);
                }
            }
            createTbody(index:number, map:duice.data.Map):HTMLTableSectionElement {
                var $this = this;
                var tbody:HTMLTableSectionElement = <HTMLTableSectionElement>this.tbody.cloneNode(true);
                var $context:any = new Object;
                $context['index'] = index;
                $context[this.item] = map;
                tbody = executeExpression(<HTMLElement>tbody, $context);
                initialize(tbody,$context);
                return tbody;
            }
            createEmptyTbody():HTMLTableSectionElement {
                var emptyTbody:HTMLTableSectionElement = <HTMLTableSectionElement>this.tbody.cloneNode(true);
                removeChildNodes(emptyTbody);
                emptyTbody.classList.add('duice-ui-table__tbody--empty')
                var tr = document.createElement('tr');
                var td = document.createElement('td');
                var colspan = this.tbody.querySelectorAll('tr > td').length;
                td.setAttribute('colspan',String(colspan));
                var emptyMessage = document.createElement('div');
                emptyMessage.classList.add('duice-ui-table__tbody--empty-message');
                td.appendChild(emptyMessage);
                tr.appendChild(td);
                emptyTbody.appendChild(tr);
                return emptyTbody;
            }
        }
        
        /**
         * duice.ui.UListFactory
         */
        export var UListFactory = {
            getUList(element:HTMLUListElement, $context:any):UList {
                var uList = new UList(element);
                if(element.dataset.duiceHierarchy){
                    var hirearchy = element.dataset.duiceHierarchy.split(',');
                    uList.setHierarchy(hirearchy[0], hirearchy[1]);
                }
                if(element.dataset.duiceFoldable){
                    uList.setFoldable(Boolean(element.dataset.duiceFoldable));
                }
                if(element.dataset.duiceEditable){
                    uList.setEditable(Boolean(element.dataset.duiceEditable));
                }
                var bind = element.dataset.duiceBind.split(',');
                uList.bind(getObject($context, bind[0]), bind[1]);
                return uList;
            }
        }
        
        /**
         * duice.ui.UList
         */
        export class UList extends ListUIElement {
            ul:HTMLUListElement;
            li:HTMLLIElement;
            hierarchy:{ name:string, parentName:string }
            foldable:boolean;
            foldName:any = {};
            editable:boolean;
            constructor(ul:HTMLUListElement) {
                super(ul);
                this.ul = ul;
                this.ul.classList.add('duice-ui-ul');
                var li = <HTMLLIElement>this.ul.querySelector('li');
                this.li = <HTMLLIElement>li.cloneNode(true);
            }
            setHierarchy(name:string, parentName:string):void {
                this.hierarchy = { name:name, parentName:parentName };
            }
            setFoldable(foldable:boolean):void {
                this.foldable = foldable;
            }
            setEditable(editable:boolean):void {
                this.editable = editable;
            }
            update(list:duice.data.List, obj:object):void {

                // checks changed source instance
                if(obj instanceof duice.data.Map){
                    return;
                }
                
                // defines
                var $this = this;
                
                // clear child elements
                this.ul.innerHTML = '';
                
                // hierarchy 
                if(this.hierarchy){
                    this.ul.classList.add('duice-ui-ul--hierarchy');
                }
              
                // creates new rows
                for(var i = 0; i < list.getSize(); i ++ ) {
                    var map = list.get(i);
                    var path:Array<number> = [];
                    
                    // checks hierarchy
                    if(this.hierarchy){
                        if(map.get(this.hierarchy.parentName)){
                            continue;
                        }
                    }
                    
                    // creates LI element
                    var li = this.createLi(i, map);
                    this.ul.appendChild(li);
                }
            }
            createLi(index:number, map:duice.data.Map):HTMLLIElement {
                var $this = this;
                var li:HTMLLIElement = <HTMLLIElement>this.li.cloneNode(true);
                li.classList.add('duice-ui-ul__li');
                var $context:any = new Object;
                $context['index'] = index;
                $context[this.item] = map;
                li = executeExpression(<HTMLElement>li, $context);
                initialize(li,$context);
                li.dataset.duiceIndex = String(index);

                // editable
                if(this.editable){
                    li.setAttribute('draggable', 'true');
                    li.addEventListener('dragstart', function(event){
                        event.stopPropagation();
                        event.dataTransfer.setData("fromIndex", this.dataset.duiceIndex);
                    });
                    li.addEventListener('dragover', function(event){
                        event.preventDefault();
                        event.stopPropagation();
                    });
                    li.addEventListener('drop', function(event){
                        event.preventDefault();
                        event.stopPropagation();
                        var fromIndex = parseInt(event.dataTransfer.getData('fromIndex'));
                        var toIndex = parseInt(this.dataset.duiceIndex);
                        $this.moveLi(fromIndex, toIndex);
                    });
                }

                // creates child node
                if(this.hierarchy) {
                    
                    var childUl = document.createElement('ul');
                    childUl.classList.add('duice-ui-ul');
                    var hasChild:boolean = false;
                    for(var i = 0, size = this.list.getSize(); i < size; i ++ ){
                        var element = this.list.get(i);
                        if(element.get(this.hierarchy.parentName) === map.get(this.hierarchy.name)){
                            var childLi = this.createLi(i, element);
                            childLi.classList.add('duice-ui-ul__li--indent');
                            childUl.appendChild(childLi);
                            hasChild = true;
                        }
                    }
                    li.appendChild(childUl);
                    
                    // sets foldable
                    if(this.foldable === true) {
                        if(hasChild) {
                            if(this.isFoldLi(map)){
                                this.foldLi(map, li, true);
                            }else{
                                this.foldLi(map, li, false);
                            }
                            li.addEventListener('click', function(event){
                                event.preventDefault();
                                event.stopPropagation();
                                if(event.target === this){
                                    if($this.isFoldLi(map)){
                                        $this.foldLi(map, this, false);
                                    }else{
                                        $this.foldLi(map, this, true);
                                    }
                                }
                            });
                        }else{
                            this.foldLi(map, li, false);
                        }
                    }
                }

                // return node element
                return li;
            }
            isFoldLi(map:duice.data.Map){
                if(this.foldName[map.get(this.hierarchy.name)] === true){
                    return true;
                }else{
                    return false;
                }
            }
            foldLi(map:duice.data.Map, li:HTMLLIElement, fold:boolean){
                if(fold){
                    this.foldName[map.get(this.hierarchy.name)] = true;
                    li.classList.remove('duice-ui-ul__li--unfold');
                    li.classList.add('duice-ui-ul__li--fold');
                }else{
                    this.foldName[map.get(this.hierarchy.name)] = false;
                    li.classList.remove('duice-ui-ul__li--fold');
                    li.classList.add('duice-ui-ul__li--unfold');
                }
            }
            moveLi(fromIndex:number, toIndex:number):void {
                
                // checks same index
                if(fromIndex === toIndex){
                    return;
                }
                
                //defines map
                var fromMap = this.list.get(fromIndex);
                var toMap = this.list.get(toIndex);
                
                // moving action
                if(this.hierarchy){
                    // change parents
                    fromMap.set(this.hierarchy.parentName, toMap.get(this.hierarchy.name));
                }else{
                    // changes row position
                    this.list.move(fromIndex, toIndex);
                }
                
                // notifies observers.
                this.setChanged();
                this.notifyObservers(this);
            }
        }
        
    }   // end of duice.ui

}   // end

namespace duice {
    export namespace dialog {
        export function initialize(container:any, $context:any):void {

        }
        export class Dialog {
            
        }
        export class Alert {
            
        }
        export class Confirm {
            
        }
        export class Prompt {
            
        }
    }
}

//DOMContentLoaded event process
document.addEventListener("DOMContentLoaded", function(event) {
    var $context:any = typeof self !== 'undefined' ? self : 
                        typeof window !== 'undefined' ? window :
                        {};
    duice.ui.initialize(document, $context);
    duice.dialog.initialize(document, $context);
});

