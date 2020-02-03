/* =============================================================================
 * DUICE (Data-oriented UI Component Engine)
 * - Anyone can use it freely.
 * - Modify the source or allow re-creation. However, you must state that you have the original creator.
 * - However, we can not grant patents or licenses for reproductives. (Modifications or reproductions must be shared with the public.)
 * Licence: LGPL(GNU Lesser General Public License version 3)
 * Copyright (C) 2017 duice.oopscraft.net
 * ============================================================================= */

/**
 * project package
 */
namespace duice {
	
	/**
	 * Configuration
	 */
	export var Configuration = {
		 version:'0.9'
		,cssEnable: true
	}
	
	export function initialize() {
		
		// prints configuration
		console.debug(Configuration);
		
		// initializes component
	    var $context:any = typeof self !== 'undefined' ? self : 
	                        typeof window !== 'undefined' ? window :
                            {};

        // initializes component
        duice.initializeComponent(document, $context);

    }

    /**
     * Component definition registry
     */
    export var ComponentDefinitionRegistry = {
        componentDefinitions: new Array(),
        add(componentDefinition:ComponentDefinition) {
            this.componentDefinitions.push(componentDefinition);
        },
        getComponentDefinitions() {
            return this.componentDefinitions;
        }
    }
    
    /**
     * Component definition
     */
    export class ComponentDefinition {
        tagName:string;
        isAttribute:string;
        factoryClass:Function;
        constructor(tagName:string, isAttribute:string, factoryClass:Function){
            this.tagName = tagName;
            this.isAttribute = isAttribute;
            this.factoryClass = factoryClass;
        }
        getTagName(){
            return this.tagName;
        }
        getIsAttribute(){
            return this.isAttribute;
        }
        getFactoryClass(){
            return this.factoryClass;
        }
    }
    
    /**
     * Initializes component
     * @param container
     * @param $context
     */
    export function initializeComponent(container:any, $context:any) {
        [ListUiComponentFactory, MapUiComponentFactory]
        .forEach(function(factoryType){
            ComponentDefinitionRegistry.getComponentDefinitions().forEach(function(componentDefinition:ComponentDefinition){
                var elements = container.querySelectorAll(componentDefinition.getTagName()+'[is="'+componentDefinition.getIsAttribute()+'"][data-duice-bind]:not([data-duice-id])');
                for(var i = 0, size = elements.length; i < size; i ++ ){
                    var element = elements[i];
                    if(componentDefinition.getFactoryClass().prototype instanceof factoryType){
                        var factoryClass = Object.create(componentDefinition.getFactoryClass().prototype);
                        var factoryInstance = factoryClass.constructor.call(factoryClass, $context);
                        factoryInstance.getInstance(element);
                    }
                }
            });
        });
    }

    /**
     * Loads external style
     * @param href
     */
	export function loadExternalStyle(href:string):void {
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = href;
		document.head.appendChild(link);
	}
	
    /**
     * Loads external script
     * @param src
     */
	export function loadExternalScript(src:string):void {
		var script = document.createElement('script');
		script.src = src;
		document.head.appendChild(script);
	}
    
    /**
     * duice.Observable
     * Observable abstract class of Observer Pattern
     */
    abstract class Observable {
        observers:Array<Observer> = new Array<Observer>();
        changed:boolean = false;
        notifyEnable:boolean = true;

        /**
         * Adds observer instance
         * @param observer
         */
        addObserver(observer:Observer):void {
            for(var i = 0, size = this.observers.length; i < size; i++){
                if(this.observers[i] === observer){
                    return;
                }
            }
            this.observers.push(observer);
        }
        /**
         * Removes specified observer instance from observer instances
         * @param observer
         */
        removeObserver(observer:Observer):void {
            for(var i = 0, size = this.observers.length; i < size; i++){
                if(this.observers[i] === observer){
                    this.observers.splice(i,1);
                    return;
                }
            }
        }
        /**
         * Notifies changes to observers
         * @param obj object to transfer to observer
         */
        notifyObservers(obj:object):void {
            console.debug('Observable.observers.length',this.observers.length);
            if(this.notifyEnable && this.hasChanged()){
                this.clearUnavailableObservers();
                for(var i = 0, size = this.observers.length; i < size; i++){
                    try {
                        this.observers[i].update(this, obj);
                    }catch(e){
                        console.error(e, this.observers[i]);
                    }
                }
                this.clearChanged();
            }
        }

        /**
         * Suspends notify
         */
        suspendNotify():void {
            this.notifyEnable = false;
        }

        /**
         * Resumes notify
         */
        resumeNotify():void {
            this.notifyEnable = true;
        }

        /**
         * Sets changed flag 
         */
        setChanged():void {
            this.changed = true;
        }
        /**
         * Returns changed flag
         */
        hasChanged():boolean {
            return this.changed;
        }
        /**
         * Clears changed flag
         */
        clearChanged():void {
            this.changed = false;
        }
        /**
         * Clears unavailable observers to prevent memory leak
         */
        clearUnavailableObservers():void {
            for(var i = this.observers.length - 1; i >= 0; i--){
                try {
                    if(this.observers[i].isAvailable() === false){
                        this.observers.splice(i,1);
                    }
                }catch(e){
                    console.error(e, this.observers[i]);
                }
            }
        }
    }
    
    /**
     * duice.Observer
     * Observer interface of Observer Pattern
     */
    interface Observer {
        isAvailable():boolean;
        update(observable:Observable, obj:object):void;
    }
    
    /**
     * Abstract data object
     * extends from Observable and implements Observer interface.
     */
    export abstract class DataObject extends Observable implements Observer {

        available:boolean = true;
        disable:boolean = false;
        readonly:any = new Object();
        visible:boolean = true;

        /**
         * Updates self data object from observable instance 
         * @param observable
         * @param obj
         */
        abstract update(observable:Observable, obj:object):void;
        
        /**
         * Loads data from JSON object 
         * @param args
         */
        abstract fromJson(...args: any[]):void;
        
        /**
         * Converts data into JSON object.
         * @param args
         * @return JSON object
         */
        abstract toJson(...args: any[]):object;

        /**
         * Checks original data is changed.
         * @return whether original data is changed
         */
        abstract isDirty():boolean;
        
        /**
         * Restores data as original data.
         */
        abstract reset():void;
        
        /**
         * Returns whether instance is active 
         */
        isAvailable():boolean {
            return true;
        }

        /**
         * Sets disable
         * @param disable 
         */
        setDisable(disable:boolean):void {
            this.disable = disable;
            this.setChanged();
            this.notifyObservers(this);
        }

        /**
         * Returns if disabled
         */
        isDisable():boolean {
            return this.disable;
        }

        /**
         * Sets read-only
         * @param name 
         */
        setReadonly(name:string,readonly:boolean):void {
            this.readonly[name] = readonly;
            this.setChanged();
            this.notifyObservers(this);
        }

        /**
         * Returns read-only
         * @param name 
         */
        isReadonly(name:string):boolean {
            if(this.readonly[name]){
                return true;
            }else{
                return false;
            }
        }

        /**
         * Sets visible flag
         * @param visible 
         */
        setVisible(visible:boolean):void {
            this.visible = visible;
            for(var i = 0, size = this.observers.length; i < size; i++){
                try {
                    if(this.observers[i] instanceof UiComponent){
                        var uiComponent = <UiComponent>this.observers[i];
                        uiComponent.setVisible(visible);
                    }
                }catch(e){
                    console.error(e, this.observers[i]);
                }
            }
        }

        /**
         * Returns is visible.
         */
        isVisible():boolean {
            return this.visible;
        }
    }

    /**
     * Map data structure
     * @param JSON object
     */
    export class Map extends DataObject {

        data:any = new Object();                            // internal data object
        originData:string = JSON.stringify(this.data);      // original string JSON data
        on:any = {
             beforeChange:null
            ,afterChange:null
        };
    
        /**
         * constructor 
         * @param json
         */
        constructor(json?:any) {
            super();
            if(json){
                this.fromJson(json);
            }
        }
        
        /**
         * Updates data from observable instance
         * @param UiComponent
         * @param obj
         */
        update(UiComponent:MapUiComponent, obj:object):void {
            console.debug('Map.update', UiComponent, obj);
            var name = UiComponent.getName();
            var value = UiComponent.getValue();
            this.set(name, value);
        }
        
        /**
         * Loads data from JSON object.
         * @param json
         */
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
        
        /**
         * Convert data to JSON object
         * @return JSON object
         */
        toJson():object {
            var json: any = new Object();
            for(var name in this.data){
                json[name] = this.data[name];
            }
            return json;
        }

        /**
         * Clears data
         */
        clear():void {
            this.data = new Object();
            this.setChanged();
            this.notifyObservers(this);
        }
        
        /**
         * Checks original data is changed
         * @return whether original data is changed or not
         */
        isDirty():boolean {
            if(JSON.stringify(this.toJson()) === this.originData){
                return false;
            }else{
                return true;
            }
        }
        
        /**
         * Restores instance as original data
         */
        reset():void {
            var originJson = JSON.parse(this.originData);
            this.fromJson(originJson);
        }

        /**
         * Sets property as input value
         * @param name
         * @param value
         */
        set(name:string, value:any):boolean {

            // calls beforeChange
            if(this.on.beforeChange){
                if(this.on.beforeChange.call(this,name,value) === false){
                    return false;
                }
            }

            // changes value
            this.data[name] = value;
            this.setChanged();
            this.notifyObservers(this);

            // calls 
            if(this.on.afterChange){
                this.on.afterChange.call(this,name,value);
            }

            // return true
            return true;
        }
        
        /**
         * Gets specified property value.
         * @param name
         */
        get(name:string):any {
            return this.data[name];
        }
        
        /**
         * Returns properties names as array.
         * @return array of names
         */
        getNames():string[]{
            var names = new Array();
            for(var name in this.data){
                names.push(name);
            }
            return names;
        }

        /**
         * Sets focus
         * @param name 
         */
        setFocus(name:string):void {
            for(var i = 0, size = this.observers.length; i < size; i ++){
                var observer = this.observers[i];
                if(observer instanceof MapUiComponent){
                    if(observer.getName() === name && observer.element.focus){
                        observer.element.focus();
                        break;
                    }
                }
            }
        }

        /**
         * Sets listener before change
         * @param listener 
         */
        onBeforeChange(listener:Function):void {
            this.on.beforeChange = listener;
        }

        /**
         * Sets listener after change
         * @param listener 
         */
        onAfterChange(listener:Function):void {
            this.on.afterChange = listener;
        }

    }
    
    /**
     * duice.List
     */
    export class List extends DataObject {

        data:Array<duice.Map> = new Array<duice.Map>();
        originData:string = JSON.stringify(this.data);
        index:number = -1;
        on:any = {
             beforeChangeIndex:null
            ,afterChangeIndex:null
            ,beforeChange:null
            ,afterChange:null
        }

        /**
         * constructor
         * @param jsonArray
         */
        constructor(jsonArray?:Array<any>) {
            super();
            if(jsonArray){
                this.fromJson(jsonArray);
            }
        }
        update(observable:Observable, obj:object):void {
            console.debug('List.update', observable, obj);
            this.setChanged();
            this.notifyObservers(obj);
        }
        fromJson(jsonArray:Array<any>):void {
            this.clear();
            for(var i = 0; i < jsonArray.length; i ++ ) {
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
        }

        /**
         * toJson
         */
        toJson():Array<object> {
            var jsonArray = new Array();
            for(var i = 0; i < this.data.length; i ++){
                jsonArray.push(this.data[i].toJson());
            }
            return jsonArray;
        }

        /**
         * Clears data
         */
        clear():void {
            for(var i = 0, size = this.data.length; i < size; i ++ ){
                this.data[i].removeObserver(this);
            }
            this.data = new Array<duice.Map>();
            this.index = -1;
            this.setChanged();
            this.notifyObservers(this);
        }

        /**
         * Returns if changed
         */
        isDirty():boolean {
            if(JSON.stringify(this.toJson()) === this.originData){
                return false;
            }else{
                return true;
            }
        }

        /**
         * Resets data from original data.
         */
        reset():void {
            var originJson = JSON.parse(this.originData);
            this.fromJson(originJson);
        }

        /**
         * Sets index.
         * @param index 
         */
        setIndex(index:number):boolean {

            // calls beforeChangeIndex 
            if(this.on.beforeChangeIndex){
                if(this.on.beforeChangeIndex.call(this,index) === false){
                    return false;
                }
            }

            // changes index
            this.index = index;
            this.setChanged();
            this.notifyObservers(this);

            // calls 
            if(this.on.afterChangeIndex){
                this.on.afterChangeIndex.call(this,index);
            }

            // returns true
            return true;
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
            map.disable = this.disable;
            map.readonly = clone(this.readonly);
            map.onBeforeChange(this.on.beforeChange);
            map.onAfterChange(this.on.afterChange);
            map.addObserver(this);
            this.data.push(map);
            this.index = this.getSize()-1;
            this.setChanged();
            this.notifyObservers(this);
        }
        insert(index:number, map:Map):void {
            if(0 <= index && index < this.data.length) {
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
        }
        remove(index:number):void {
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
		indexOf(handler:Function){
			for(var i = 0, size = this.data.length; i < size; i ++){
				if(handler.call(this, this.data[i]) === true){
					return i;
				}
			}
			return -1;
		}
		contains(handler:Function){
			if(this.indexOf(handler) > -1){
				return true;
			}else{
				return false;
			}
		}
        forEach(handler:Function){
            for(var i = 0, size = this.data.length; i < size; i ++){
                if(handler.call(this, this.data[i], i) === false){
                    break;
                }
            }
        }
        sort(name:string, ascending:boolean):void {
            this.data.sort(function(a:duice.Map,b:duice.Map):number {
                var aValue = a.get(name);
                var bValue = b.get(name);
                return (aValue > bValue ? 1 : aValue < bValue ? -1 : 0) * (ascending == false ? -1 : 1);
            });
            this.setChanged();
            this.notifyObservers(this);
        }
        setDisable(disable:boolean):void{
            this.data.forEach(function(map){
                map.setDisable(disable);
            });
            super.setDisable(disable);
        }
        setReadonly(name:string,readonly:boolean):void {
            this.data.forEach(function(map){
                map.setReadonly(name,readonly);
            });
            super.setReadonly(name,readonly);
        }
        onBeforeChangeIndex(listener:Function):void {
            this.on.beforeChangeIndex = listener;
        }
        onAfterChangeIndex(listener:Function):void {
            this.on.afterChangeIndex = listener;
        }
        onBeforeChange(listener:Function):void {
            this.on.beforeChange = listener;
        }
        onAfterChange(listener:Function):void {
            this.on.afterChange = listener;
        }
    }
    
    /**
     * duice.UiComponent
     */
    abstract class UiComponent extends Observable implements Observer {
        element:HTMLElement;
        constructor(element:HTMLElement){
            super();
            this.element = element;
            this.element.dataset.duiceId = generateUuid();
        }
        abstract bind(...args: any[]):void;
        abstract update(dataObject:duice.DataObject, obj:object):void;
        isAvailable():boolean {
            
            // contains method not support(IE)
            if(!Node.prototype.contains) {
                Node.prototype.contains = function(el){
                    while (el = el.parentNode) {
                        if (el === this) return true;
                    }
                    return false;
                }
            }
            
            // checks contains element
            if(document.contains(this.element)){
                return true;
            }else{
                return false;
            }
        }

        /**
         * Sets element visible
         * @param visible 
         */
        setVisible(visible:boolean){
            this.element.style.display = (visible ? '' : 'none');
        }
    }
    
    /**
     * duice.MapUiComponent
     */
    export abstract class MapUiComponent extends UiComponent {
        map:duice.Map;
        name:string;
        bind(map:duice.Map, name:string, ...args:any[]):void {
            this.map = map;
            this.name = name;
            this.map.addObserver(this);
            this.addObserver(this.map);
            this.update(this.map, this.map);
        }
        getMap():duice.Map {
            return this.map;
        }
        getName():string {
            return this.name;
        }
        abstract update(map:duice.Map, obj:object):void;
        abstract getValue():any;
    }
    
    /**
     * duice.ListUiComponent
     */
    export abstract class ListUiComponent extends UiComponent {
        list:duice.List;
        item:string;
        bind(list:duice.List, item:string):void {
            this.list = list;
            this.item = item;
            this.list.addObserver(this);
            this.addObserver(this.list);
            this.update(this.list, this.list);
        }
        getList():duice.List {
            return this.list;
        }
        getItem():string {
            return this.item;
        }
        abstract update(list:duice.List, obj:object):void;
    }

    /**
     * duice.ui.UiComponentFactory
     */
    abstract class UiComponentFactory {
        context:any;
        constructor(context:any){
            if(context){
                this.setContext(context);
            }
        }
        setContext(context:any){
            this.context = context;
        }
        getContext():any {
            return this.context;
        }
        getContextProperty(name:string) {
            if(this.context[name]){
                return this.context[name];
            }
            if((<any>window).hasOwnProperty(name)){
                return (<any>window)[name];
            }
            try {
                return eval.call(this.context, name);
            }catch(e){
                console.error(e,this.context, name);
                throw e;
            }
        }
        abstract getInstance(element:HTMLElement):UiComponent;
    }
    
    export abstract class MapUiComponentFactory extends UiComponentFactory { }
    
    export abstract class ListUiComponentFactory extends UiComponentFactory { }
    
    /**
     * Generates random UUID value
     * @return  UUID string
     */
    function generateUuid():string {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (dt + Math.random()*16)%16 | 0;
            dt = Math.floor(dt/16);
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return uuid;
    }
    
    /**
     * Adds class
     */
	function addClassNameIfCssEnable(element:HTMLElement, className:string):void {
		if(Configuration.cssEnable) {
			element.classList.add(className);	
		}
	}

    /**
     * Checks mobile browser
     */
    export function isMobile() { 
        if( navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
        ){
            return true;
        }else {
            return false;
        }
    }

    /**
     * Returns Query Variables
     */
	export function getQueryVariables():any {
		var queryVariables:any = new Object();
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
    
    /**
     * Check if value is empty
     * @param value
     * @return whether value is empty
     */
    function isEmpty(value:any){
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
     * Check if value is not empty
     * @param value
     * @return whether value is not empty
     */
    function isNotEmpty(value:any) {
        if(isEmpty(value)){
            return false;
        }else{
            return true;
        }
    }
    
    /**
     * Checks if value is empty and return specified value as default
     * @param value to check
     * @param default value if value is empty
     */
    function defaultIfEmpty(value:any, defaultValue:any) {
        if(isEmpty(value) === true) {
            return defaultValue;
        }else{
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
    function lpad(value:string, length:number, padChar:string) {
        for(var i = 0, size = (length-value.length); i < size; i ++ ) {
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
    function rpad(value:string, length:number, padChar:string) {
        for(var i = 0, size = (length-value.length); i < size; i ++ ) {
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
    function executeExpression(element:HTMLElement, $context:any):any {
        var string = element.outerHTML;
        string = string.replace(/\[\[([\s\S]*?)\]\]/mgi,function(match, command){
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
        try {
            var template = document.createElement('template');
            template.innerHTML = string;
            return template.content.firstChild;
        }catch(e){
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
    function escapeHTML(value:string):string {
        
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
        
        // replace and returns
        return value.replace(/[&<>"']/g, function(m:string) {
            return htmlMap[m];
        });
    }
    
    /**
     * Removes child elements from HTML element.
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
     * Returns current upper window object.
     * @return window object
     */
    function getCurrentWindow():Window {
        if(window.frameElement){
            return window.parent;
        }else{
            return window;
        }
    }

    /**
     * clones object
     * @param obj 
     */
    function clone(obj:object){
        return JSON.parse(JSON.stringify(obj));
    }
    
    /**
     * Sets element position to be centered
     * @param element
     */
    function setPositionCentered(element:HTMLElement):void {
        var win = getCurrentWindow();
        var computedStyle = win.getComputedStyle(element);
        var computedWidth = parseInt(computedStyle.getPropertyValue('width').replace(/px/gi, ''));
        var computedHeight = parseInt(computedStyle.getPropertyValue('height').replace(/px/gi, ''));
        element.style.left = Math.max(0,win.innerWidth/2 - computedWidth/2) + win.scrollX + 'px';
        element.style.top = Math.max(0,win.innerHeight/2 - computedHeight/2) + win.scrollY + 'px';
    }

    /**
     * Returns position info of specified element
     * @param element
     */
    function getElementPosition(element:any) {
        var pos:any = ('absolute relative').indexOf(getComputedStyle(element).position) == -1;
        var rect1:any = {top: element.offsetTop * pos, left: element.offsetLeft * pos};
        var rect2:any = element.offsetParent ? getElementPosition(element.offsetParent) : {top:0,left:0};
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
    export function delayCall(millis:number, callback:Function, $this:any, ...args:any[]){
			var interval = setInterval(function() {
            try {
                callback.call($this, ...args);
            }catch(e){
                throw e;
            }finally{
                clearInterval(interval);
            }
        },millis); 
    }
    
    /**
     * Returns current max z-index value.
     * @return max z-index value
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
     * duice.Format interface
     */
    interface Format {
        
        /**
         * Encodes original value as formatted value
         * @param original value
         * @return formatted value
         */
        encode(value:any):any;
        
        /**
         * Decodes formatted value to original value
         * @param formatted value
         * @return original value
         */
        decode(value:any):any;
    }
    
    /**
     * duice.StringFormat
     * @param string format
     */
    export class StringFormat implements Format {
        pattern:string;
    
        /**
         * Constructor
         * @param pattern
         */
        constructor(pattern?:string){
            if(pattern){
                this.setPattern(pattern);
            }
        }
        
        /**
         * Sets format string
         * @param pattern
         */
        setPattern(pattern:string){
            this.pattern = pattern;
        }
        
        /**
         * encode string as format
         * @param value
         */
        encode(value:any):any{
            if(isEmpty(this.pattern)){
                return value;
            }
            var encodedValue = '';
            var patternChars = this.pattern.split('');
            var valueChars = value.split('');
            var valueCharsPosition = 0;
            for(var i = 0, size = patternChars.length; i < size; i ++ ){
                var patternChar = patternChars[i];
                if(patternChar === '#'){
                    encodedValue += defaultIfEmpty(valueChars[valueCharsPosition++], '');
                } else {
                    encodedValue += patternChar;
                }
            }
            return encodedValue;
        }
        
        /**
         * decodes string as format
         * @param value
         */
        decode(value:any):any{
            if(isEmpty(this.pattern)){
                return value;
            }
            var decodedValue = '';
            var patternChars = this.pattern.split('');
            var valueChars = value.split('');
            var valueCharsPosition = 0;
            for(var i = 0, size = patternChars.length; i < size; i ++ ){
                var patternChar = patternChars[i];
                if (patternChar === '#') {
                    decodedValue += defaultIfEmpty(valueChars[valueCharsPosition++], '');
                } else {
                    valueCharsPosition++;
                }
            }
            return decodedValue;
        }
    }
    
    /**
     * duice.NumberFormat
     * @param scale number
     */
    export class NumberFormat implements Format {
        scale:number = 0;
    
       /**
        * Constructor
        * @param scale
        */
        constructor(scale?:number){
            if(scale){
                this.setScale(scale);
            }
        }
        
        /**
         * Sets number format scale
         * @param scale
         */
        setScale(scale:number){
            this.scale = scale;
        }
        
        /**
         * Encodes number as format
         * @param number
         */
        encode(number:number):string{
            if(isEmpty(number) || isNaN(Number(number))){
                return '';
            }
            number = Number(number);
            var string = String(number.toFixed(this.scale));
            var reg = /(^[+-]?\d+)(\d{3})/;
            while (reg.test(string)) {
                string = string.replace(reg, '$1' + ',' + '$2');
            }
            return string;
        }
        
        /**
         * Decodes formatted value as original value
         * @param string
         */
        decode(string:string):number{
            if(isEmpty(string)){
                return null;
            }
            if(string.length === 1 && /[+-]/.test(string)){
                string += '0';
            }
            string = string.replace(/\,/gi,'');
            if(isNaN(Number(string))){
                throw 'NaN';
            }
            var number = Number(string);
            number = Number(number.toFixed(this.scale));
            return number;
        }
    }
    
    /**
     * duice.DateFormat
     */
    export class DateFormat implements Format {
        pattern:string;
        patternRex = /yyyy|yy|MM|dd|HH|hh|mm|ss/gi;
        
        /**
         * Constructor
         * @param pattern
         */
        constructor(pattern?:string){
            if(pattern){
                this.setPattern(pattern);
            }
        }
        
        /**
         * Sets format string
         * @param pattern
         */
        setPattern(pattern:string){
            this.pattern = pattern;
        }
        
        /**
         * Encodes date string
         * @param string
         */
        encode(string:string):string{
            if(isEmpty(string)){
                return '';
            }
            if(isEmpty(this.pattern)){
                return new Date(string).toString();
            }
            var date = new Date(string);
            string = this.pattern.replace(this.patternRex, function($1:any) {
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
            return string;
        }
        
        /**
         * Decodes formatted date string to ISO date string.
         * @param string
         */
        decode(string:string):string{
            if(isEmpty(string)){
                return null;
            }
            if(isEmpty(this.pattern)){
                return new Date(string).toISOString();
            }
            var date = new Date(0,0,0,0,0,0);
            var match;
            while ((match = this.patternRex.exec(this.pattern)) != null) {
                var formatString = match[0];
                var formatIndex = match.index;
                var formatLength = formatString.length;
                var matchValue = string.substr(formatIndex, formatLength);
                matchValue = rpad(matchValue, formatLength,'0');
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
            return date.toISOString();
        }
    }

    /**
     * duice.ui.Blocker
     */
    export class Blocker {
        element:HTMLElement;
        div:HTMLDivElement;
		opacity:number = 0.2;
        constructor(element:HTMLElement){
            this.element = element;
            this.div = document.createElement('div');
            this.div.classList.add('duice-blocker');
        }
		setOpacity(opacity:number):void {
			this.opacity = opacity;
		}
        block():void {
            
            // adjusting position
            this.div.style.position = 'fixed';
            this.div.style.zIndex = String(getCurrentMaxZIndex() + 1);
			this.div.style.background = 'rgba(0, 0, 0, ' + this.opacity + ')';
            this.takePosition();

			// adds events
			var $this = this;
			getCurrentWindow().addEventListener('scroll', function(){
				$this.takePosition();
			});
            
            // append
            this.element.appendChild(this.div);
        }
        unblock():void {
            this.element.removeChild(this.div);
        }
		takePosition() { 
            // full blocking in case of BODY
            if(this.element.tagName == 'BODY'){
                this.div.style.width = '100%';
                this.div.style.height = '100%';
                this.div.style.top = '0px';
                this.div.style.left = '0px';
            }
            // otherwise adjusting to parent element
            else{
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
		}
		getBlockDiv():HTMLDivElement {
			return this.div;	
		}
    }

    /**
     * duice.ui.Progress
     */
	export class Progress {
       	element:HTMLElement;
		div:HTMLDivElement;
		blocker:Blocker;
        constructor(element:HTMLElement){
			this.blocker =  new Blocker(element);
			this.blocker.setOpacity(0.0);
        }
		start():void {
			this.blocker.block();
			this.div = document.createElement('div');
            this.div.classList.add('duice-progress');
			this.blocker.getBlockDiv().appendChild(this.div);
		}
		stop():void {
			this.blocker.getBlockDiv().removeChild(this.div);
			this.blocker.unblock();
		}
	}
	
   /**
     * duice.ui.Modal
     */
    export abstract class Modal {
        container:HTMLDivElement;
        headerDiv:HTMLDivElement;
        bodyDiv:HTMLDivElement;
        blocker:Blocker;
        on:any = {};
        constructor(){
            var $this = this;
            this.container = document.createElement('div');
            this.container.classList.add('duice-modal');
            
            this.headerDiv = document.createElement('div');
            this.headerDiv.classList.add('duice-modal__headerDiv');
            this.container.appendChild(this.headerDiv);
            
            // drag
            this.headerDiv.style.cursor = 'move';
            this.headerDiv.onmousedown = function(ev){
                var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                pos3 = ev.clientX;
                pos4 = ev.clientY;
                getCurrentWindow().document.onmouseup = function(ev){ 
                    getCurrentWindow().document.onmousemove = null;
                    getCurrentWindow().document.onmouseup = null;
                };
                getCurrentWindow().document.onmousemove = function(ev){
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
            closeButton.addEventListener('click', function(event){
               $this.close();
            });
            this.headerDiv.appendChild(closeButton);
            
            // creates body
            this.bodyDiv = document.createElement('div');
            this.container.appendChild(this.bodyDiv);

            // adds blocker
            this.blocker = new Blocker(getCurrentWindow().document.body);
        }
        addContent(content:HTMLDivElement):void {
            this.bodyDiv.appendChild(content);
        }
		removeContent(content:HTMLDivElement):void {
			this.bodyDiv.removeChild(content);
		}
        createButton(type:string):HTMLButtonElement {
            var button = document.createElement('button');
            button.classList.add('duice-modal__button--' + type);
            return button;
        }
        show():void {
            
            // block
            this.blocker.block();
            
            // opens modal
            this.container.style.display = 'block';
            this.container.style.position = 'absolute';
            this.container.style.zIndex = String(getCurrentMaxZIndex() + 1);
            getCurrentWindow().document.body.appendChild(this.container);
            setPositionCentered(this.container);
        }
        hide():void {

            // closes modal
            this.container.style.display = 'none';
            getCurrentWindow().document.body.removeChild(this.container);
            
            // unblock
            this.blocker.unblock();
        }
        open(...args:any[]):boolean {
            if(this.on.beforeOpen){
                if(this.on.beforeOpen.call(this, ...args) === false){
                    return false;
                }
            }
            this.show();
            if(this.on.afterOpen){
                delayCall(200, this.on.afterOpen, this, ...args);
            }
            return true;
        }
        onBeforeOpen(listener:Function):any {
            this.on.beforeOpen = listener;
            return this;
        }
        onAfterOpen(listener:Function):any {
            this.on.afterOpen = listener;
            return this;
        }
        close(...args:any[]):boolean {
            if(this.on.beforeClose){
                if(this.on.beforeClose.call(this, ...args) === false){
                    return false;
                }
            }
            this.hide();
            if(this.on.afterClose){
                delayCall(200, this.on.afterClose, this, ...args);
            }
            return true;
        }
        onBeforeClose(listener:Function):any{
            this.on.beforeClose = listener;
            return this;
        }
        onAfterClose(listener:Function):any {
            this.on.afterClose = listener;
            return this;
        }
        confirm(...args: any[]):boolean {
            if(this.on.beforeConfirm){
                if(this.on.beforeConfirm.call(this, ...args) === false){
                    return false;
                }
            }
            this.hide();
            if(this.on.afterConfirm){
                delayCall(200, this.on.afterConfirm, this, ...args);
            }
            return true;
        }
        onBeforeConfirm(listener:Function):any {
            this.on.beforeConfirm = listener;
            return this;
        }
        onAfterConfirm(listener:Function):any {
            this.on.afterConfirm = listener;
            return this;
        }
    }

    /**
     * duice.ui.Alert
     */
    export class Alert extends Modal {
        message:string;
        iconDiv:HTMLDivElement;
        messageDiv:HTMLDivElement;
        buttonDiv:HTMLDivElement;
        confirmButton:HTMLButtonElement;
        constructor(message:string) {
            super();
            this.message = message;
            var $this = this;
            
            this.iconDiv = document.createElement('div');
            this.iconDiv.classList.add('duice-alert__iconDiv');
            
            this.messageDiv = document.createElement('div');
            this.messageDiv.classList.add('duice-alert__messageDiv');
            this.messageDiv.appendChild(document.createTextNode(this.message));
            
            this.buttonDiv = document.createElement('div');
            this.buttonDiv.classList.add('duice-alert__buttonDiv');
            
            this.confirmButton = this.createButton('confirm');
            this.confirmButton.addEventListener('click', function(event){
                $this.close(); 
            });
            this.buttonDiv.appendChild(this.confirmButton);
            
            // appends parts to bodyDiv
            this.addContent(this.iconDiv);
            this.addContent(this.messageDiv);
            this.addContent(this.buttonDiv);
        }
        open():boolean {
            if(super.open()){
                this.confirmButton.focus();
                return true;
            }else{
                return false;
            }
        }
    }
    
    /**
     * duice.ui.Confirm
     */
    export class Confirm extends Modal {
        message:string;
        iconDiv:HTMLDivElement;
        messageDiv:HTMLDivElement;
        buttonDiv:HTMLDivElement;
        cancelButton:HTMLButtonElement;
        confirmButton:HTMLButtonElement;
        constructor(message:string) {
            super();
            this.message = message;
            var $this = this;
            
            this.iconDiv = document.createElement('div');
            this.iconDiv.classList.add('duice-confirm__iconDiv');
            
            this.messageDiv = document.createElement('div');
            this.messageDiv.classList.add('duice-confirm__messageDiv');
            this.messageDiv.appendChild(document.createTextNode(this.message));
            
            this.buttonDiv = document.createElement('div');
            this.buttonDiv.classList.add('duice-confirm__buttonDiv');
            
            // confirm button
            this.confirmButton = this.createButton('confirm');
            this.confirmButton.addEventListener('click', function(event){
               $this.confirm(); 
            });
            this.buttonDiv.appendChild(this.confirmButton);

            // cancel button
            this.cancelButton = this.createButton('cancel');
            this.cancelButton.addEventListener('click', function(event){
               $this.close(); 
            });
            this.buttonDiv.appendChild(this.cancelButton);
            
            // appends parts to bodyDiv
            this.addContent(this.iconDiv);
            this.addContent(this.messageDiv);
            this.addContent(this.buttonDiv);
        }
        open():boolean {
            if(super.open()){
                this.confirmButton.focus();    
            }else{
                return false;
            }
        }
    }
    
    /**
     * duice.ui.Prompt
     */
    export class Prompt extends Modal {
        message:string;
        iconDiv:HTMLDivElement;
        messageDiv:HTMLDivElement;
        inputDiv:HTMLDivElement;
        input:HTMLInputElement;
        buttonDiv:HTMLDivElement;
        cancelButton:HTMLButtonElement;
        confirmButton:HTMLButtonElement;
        constructor(message:string) {
            super();
            this.message = message;
            var $this = this;
            
            this.iconDiv = document.createElement('div');
            this.iconDiv.classList.add('duice-prompt__iconDiv');
            
            this.messageDiv = document.createElement('div');
            this.messageDiv.classList.add('duice-prompt__messageDiv');
            this.messageDiv.appendChild(document.createTextNode(this.message));
            
            this.inputDiv = document.createElement('div');
            this.inputDiv.classList.add('duice-prompt__inputDiv');
            this.input = document.createElement('input');
            this.input.classList.add('duice-prompt__inputDiv-input');
            this.inputDiv.appendChild(this.input);
            
            this.buttonDiv = document.createElement('div');
            this.buttonDiv.classList.add('duice-prompt__buttonDiv');
            
            // confirm button
            this.confirmButton = this.createButton('confirm');
            this.confirmButton.addEventListener('click', function(event){
               $this.confirm(); 
            });
            this.buttonDiv.appendChild(this.confirmButton);

            // cancel button
            this.cancelButton = this.createButton('cancel');
            this.cancelButton.addEventListener('click', function(event){
               $this.close(); 
            });
            this.buttonDiv.appendChild(this.cancelButton);
            
            // appends parts to bodyDiv
            this.addContent(this.iconDiv);
            this.addContent(this.messageDiv);
            this.addContent(this.inputDiv);
            this.addContent(this.buttonDiv);
        }
        open():boolean {
            if(super.open()){
                this.input.focus();
                return true;
            }else{
                return false;
            }
        }
        getValue():string {
            return this.input.value;
        }
    }
    
	/**
	 * duice.ui.Dialog
	 * @param dialog
	 */
    export class Dialog extends Modal {
        dialog:HTMLDivElement;
        parentNode:Node;
        constructor(dialog:HTMLDivElement) {
            super();
            this.dialog = dialog;
            this.dialog.classList.add('duice-dialog');
            this.parentNode = this.dialog.parentNode;
        }
        open(...args:any[]):boolean {
            this.dialog.style.display = 'block';
            this.addContent(this.dialog);

			// opens dialog
            if(super.open(...args)){
                return true;
            }else{
                this.dialog.style.display = 'none';
                this.parentNode.appendChild(this.dialog);
                return false;
            }
        }
        close(...args:any[]):boolean {
            if(super.close(...args)){
                this.dialog.style.display = 'none';
                this.parentNode.appendChild(this.dialog);
                return true;
            }else{
                return false;
            }
        }
        confirm(...args:any[]):boolean {
            if(super.confirm(...args)){
                this.dialog.style.display = 'none';
                this.parentNode.appendChild(this.dialog);
                return true;
            }else{
                return false;
            }
        }
    }
    
    /**
     * duice.ui
     */
    export namespace ui {
        
        /**
         * duice.ui.ScriptletFactory
         */
        export class ScriptletFactory extends MapUiComponentFactory {
            getInstance(element:HTMLElement):Scriptlet {
                var scriptlet = new Scriptlet(element);
                var context:any;
                if(this.getContext() !== window) {
                    context = this.getContext();
                }else{
                    context = {};
                }
                if(element.dataset.duiceBind) {
                    var bind = element.dataset.duiceBind.split(',');
                    var $this = this;
                    bind.forEach(function(name){
                       context[name] = $this.getContextProperty(name); 
                    });
                }
                scriptlet.bind(context);
                return scriptlet;
            }
        }
        
        /**
         * duice.ui.Scriptlet
         */
        export class Scriptlet extends MapUiComponent {
            expression:string;
            context:any;;
            constructor(element:HTMLElement){
                super(element);
                this.expression = element.innerHTML;
                this.element.classList.add('duice-ui-scriptlet');
            }
            bind(context:any):void {
                this.context = context;
                for(var name in this.context){
                    var obj = this.context[name];
                    if(typeof obj === 'object'
                    && obj instanceof duice.DataObject){
                        obj.addObserver(this);
                        this.addObserver(obj);
                        this.update(obj, obj);
                    }
                }
            }
            update(dataObject:duice.DataObject, obj:object) {
                const func = Function('$context', '"use strict";' + this.expression + '');
                var result = func(this.context);
                this.element.innerHTML = '';
                this.element.appendChild(document.createTextNode(result));
                this.element.style.display = 'inline-block';
            }
            getValue():string {
                return null;
            }
        }

        /**
         * duice.ui.SpanFactory
         */
        export class SpanFactory extends MapUiComponentFactory {
            getInstance(element:HTMLInputElement):Span {
                var span = new Span(element);
                
                // sets format
                if(element.dataset.duiceFormat){
                    var duiceFormat:Array<string> = element.dataset.duiceFormat.split(',');
                    var type = duiceFormat[0];
                    var format;
                    switch(type){
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
            }
        }
        
        /**
         * duice.ui.Span
         */
        export class Span extends MapUiComponent {
            span:HTMLSpanElement;
            format:Format;
            constructor(span:HTMLSpanElement){
                super(span);
                this.span = span;
                this.span.classList.add('duice-ui-span');
            }
            setFormat(format:Format){
                this.format = format;
            }
            update(map:Map, obj:object):void {
                removeChildNodes(this.span);
                var value = map.get(this.name);
                value = defaultIfEmpty(value,'');
                if(this.format){
                    value = this.format.encode(value);
                }
                this.span.appendChild(document.createTextNode(value));
            }
            getValue():string {
                var value = this.span.innerHTML;
                value = defaultIfEmpty(value, null);
                if(this.format){
                    value = this.format.decode(value);
                }
                return value;
            }
        }

        /**
         * duice.ui.InputFactory
         */
        export class InputFactory extends MapUiComponentFactory {
            getInstance(element:HTMLInputElement):Input {
                var input;
                switch(element.getAttribute('type')){
                case 'text':
                    input = new TextInput(element);
                    if(element.dataset.duiceFormat){
                        input.setPattern(element.dataset.duiceFormat);
                    }
                    break;
                case 'number':
                    input = new NumberInput(element);
                    if(element.dataset.duiceFormat){
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
                    if(element.dataset.duiceFormat){
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
            }
        }
        
        /**
         * duice.ui.Input
         */
        export abstract class Input extends MapUiComponent {
            input:HTMLInputElement;
            constructor(input:HTMLInputElement){
                super(input);
                this.input = input;
                var $this = this;
                this.input.addEventListener('keypress', function(event:any){
                    var inputChars = String.fromCharCode(event.keyCode);
                    var newValue = this.value.substr(0,this.selectionStart) + inputChars + this.value.substr(this.selectionEnd);
                    if($this.validate(newValue) === false){
                        event.preventDefault();
                    }
                }, true);
                this.input.addEventListener('paste', function(event:any){
                    var inputChars = event.clipboardData.getData('text/plain');
                    var newValue = this.value.substr(0,this.selectionStart) + inputChars + this.value.substr(this.selectionEnd);
                    if($this.validate(newValue) === false){
                        event.preventDefault();
                    }
                }, true);
                this.input.addEventListener('change', function(event){
                    $this.setChanged();
                    $this.notifyObservers(this);
                },true);
            }
            abstract update(map:duice.Map, obj:object):void;
            abstract getValue():any;
            validate(value:string):boolean {
                return true;
            }
            setDisable(disable:boolean):void {
                if(disable){
                    this.input.setAttribute('disabled','true');                    
                }else{
                    this.input.removeAttribute('disabled');
                }
            }
            setReadonly(readonly:boolean):void {
                if(readonly === true){
                    this.input.setAttribute('readonly', 'readonly');
                }else{
                    this.input.removeAttribute('readonly');
                }
            }
        }
        
        /**
         * duice.ui.GenericInput
         */
        export class GenericInput extends Input {
            constructor(input:HTMLInputElement){
                super(input);
                addClassNameIfCssEnable(this.input,'duice-ui-genericInput');
            }
            update(map:duice.Map, obj:object):void {
                var value = map.get(this.getName());
                this.input.value = defaultIfEmpty(value, '');
                this.setDisable(map.isDisable());
                this.setReadonly(map.isReadonly(this.getName()));
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
            format:StringFormat;
            constructor(input:HTMLInputElement){
                super(input);
                addClassNameIfCssEnable(this.input,'duice-ui-textInput');
                this.format = new StringFormat();
            }
            setPattern(format:string){
                this.format.setPattern(format);
            }
            update(map:duice.Map, obj:object):void {
                var value = map.get(this.getName());
                value = defaultIfEmpty(value, '');
                value = this.format.encode(value);
                this.input.value = value;
                this.setDisable(map.isDisable());
                this.setReadonly(map.isReadonly(this.getName()));
            }
            getValue():string {
                var value = this.input.value;
                value = defaultIfEmpty(value, null);
                value = this.format.decode(value);
                return value;
            }
            validate(value:string):boolean {
                try {
                    this.format.decode(value);
                }catch(e){
                    return false;
                }
                return true;
            }
        }
        
        /**
         * duice.ui.NumberInput
         */
        export class NumberInput extends Input {
            format:NumberFormat;
            constructor(input:HTMLInputElement){
                super(input);
                addClassNameIfCssEnable(this.input,'duice-ui-numberInput');
                this.input.setAttribute('type','text');
                this.format = new NumberFormat();
            }
            setScale(scale:number){
                this.format.setScale(scale);
            }
            update(map:duice.Map, obj:object):void {
                var value = map.get(this.getName());
                value = this.format.encode(value);
                this.input.value = value;
                this.setDisable(map.isDisable());
                this.setReadonly(map.isReadonly(this.getName()));
            }
            getValue():number {
                var value:any = this.input.value;
                value = this.format.decode(value);
                return value;
            }
            validate(value:string):boolean {
                try {
                    this.format.decode(value);
                }catch(e){
                    return false;
                }
                return true;
            }
        }
        
        /**
         * duice.ui.CheckboxInput
         */
        export class CheckboxInput extends Input {
            constructor(input:HTMLInputElement){
                super(input);
                addClassNameIfCssEnable(this.input,'duice-ui-checkboxInput');
               
                // stop click event propagation
                this.input.addEventListener('click', function(event){
                    event.stopPropagation();
                },true);
            }
            update(map:duice.Map, obj:object):void {
                var value = map.get(this.getName());
                if(value === true){
                    this.input.checked = true;
                }else{
                    this.input.checked = false;
                }
                this.setDisable(map.isDisable());
                this.setReadonly(map.isReadonly(this.getName()));
            }
            getValue():boolean {
                return this.input.checked;
            }
            setReadonly(readonly:boolean) {
                if(readonly){
                    this.input.style.pointerEvents = 'none';
                }else{
                    this.input.style.pointerEvents = '';
                }
            }
        }
        
        /**
         * duice.ui.RadioInput
         */
        export class RadioInput extends Input {
            constructor(input:HTMLInputElement){
                super(input);
                addClassNameIfCssEnable(this.input,'duice-ui-radioInput');
            }
            update(map:duice.Map, obj:object):void {
                var value = map.get(this.getName());
                if(value === this.input.value){
                    this.input.checked = true;
                }else{
                    this.input.checked = false;
                }
                this.setDisable(map.isDisable());
                this.setReadonly(map.isReadonly(this.getName()));
            }
            getValue():string {
                return this.input.value;
            }
            setReadonly(readonly:boolean) {
                if(readonly){
                    this.input.style.pointerEvents = 'none';
                }else{
                    this.input.style.pointerEvents = '';
                }
            }
        }
        
        /**
         * duice.ui.DatetimeInput
         */
        export class DateInput extends Input {
            readonly:boolean = false;
            pickerDiv:HTMLDivElement;
            type:string;
            format:DateFormat;
            clickListener:any;
            constructor(input:HTMLInputElement){
                super(input);
                this.type = this.input.getAttribute('type').toLowerCase();
                this.input.setAttribute('type','text');
				addClassNameIfCssEnable(this.input,'duice-ui-dateInput');
                
                // adds click event listener
                var $this = this;
                this.input.addEventListener('click', function(event){
                    if($this.readonly !== true){
                        $this.openPicker();
                    }
                },true);

                // sets default format
                this.format = new DateFormat();
                if(this.type === 'date'){
                    this.format.setPattern('yyyy-MM-dd');
                }else{
                    this.format.setPattern('yyyy-MM-dd HH:mm:ss');
                }
            }
            setPattern(format:string){
                this.format.setPattern(format);
            }
            update(map:duice.Map, obj:object):void {
                var value:string = map.get(this.getName());
                value = defaultIfEmpty(value,'');
                value = this.format.encode(value);
                this.input.value = value;
                this.setDisable(map.isDisable());
                this.setReadonly(map.isReadonly(this.getName()));
            }
            getValue():string {
                var value = this.input.value;
                value = defaultIfEmpty(value, null);
                value = this.format.decode(value);
                if(this.type === 'date'){
                    value = new DateFormat('yyyy-MM-dd').encode(new Date(value).toISOString())
                }
                return value;
            }
            validate(value:string):boolean {
                try {
                    var s = this.format.decode(value);
                }catch(e){
                    return false;
                }
                return true;
            }
            setReadonly(readonly:boolean):void {
                this.readonly = readonly;
                super.setReadonly(readonly);
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
                this.pickerDiv.parentNode.removeChild(this.pickerDiv);
                this.pickerDiv = null;
                window.removeEventListener('click', this.clickListener);
            }
        }

        /**
         * duice.ui.SelectFactory
         */
        export class SelectFactory extends MapUiComponentFactory {
            getInstance(element:HTMLSelectElement):Select {
                var select = new Select(element);
				if(element.dataset.duiceOption){
	                var option = element.dataset.duiceOption.split(',');
	                var optionList = this.getContextProperty(option[0]);
	                var optionValue = option[1];
	                var optionText = option[2];
	                select.setOption(optionList, optionValue, optionText);
				}
                var bind = element.dataset.duiceBind.split(',');
                select.bind(this.getContextProperty(bind[0]), bind[1]);
                return select;
            }
        }
        
        /**
         * duice.ui.Select
         */
        export class Select extends MapUiComponent {
            select:HTMLSelectElement;
            optionList:duice.List;
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
            setOption(list:duice.List, value:string, text:string):void {
                this.optionList = list;
                this.optionValue = value;
                this.optionText = text;
                var $this = this;
                function updateOption(optionList:duice.List){
                    
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
            }
            update(map:duice.Map, obj:object):void {
                var value = map.get(this.getName());
				this.select.value = defaultIfEmpty(value,'');
				if(this.select.selectedIndex < 0){
					if(this.defaultOptions.length > 0){
						this.defaultOptions[0].selected = true;
					}
                }
                this.setDisable(map.isDisable());
                this.setReadonly(map.isReadonly(this.getName()));
            }
            getValue():any {
                var value = this.select.value;
                return defaultIfEmpty(value, null);
            }
            setDisable(disable: boolean): void {
                if(disable){
                    this.select.setAttribute('disabled', 'true');
                }else{
                    this.select.removeAttribute('disabled');
                }
            }
            setReadonly(readonly:boolean):void {
                if(readonly === true){
                    this.select.style.pointerEvents = 'none';
                    this.select.classList.add('duice-ui-select--readonly');
                }else{
                    this.select.style.pointerEvents = '';
                    this.select.classList.remove('duice-ui-select--readonly');
                }
            }
        }
        
        /**
         * duice.ui.TextareaFactory
         */
        export class TextareaFactory extends MapUiComponentFactory {
            getInstance(element:HTMLTextAreaElement):Textarea {
                var textarea = new Textarea(element);
                var bind = element.dataset.duiceBind.split(',');
                textarea.bind(this.getContextProperty(bind[0]), bind[1]);
                return textarea;
            }
        }
        
        /**
         * duice.ui.Textarea
         */
        export class Textarea extends MapUiComponent {
            textarea:HTMLTextAreaElement;
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
            update(map:duice.Map, obj:object):void {
                var value = map.get(this.getName());
                this.textarea.value = defaultIfEmpty(value, '');
                this.setDisable(map.isDisable());
                this.setReadonly(map.isReadonly(this.getName()));
            }
            getValue():any {
                return defaultIfEmpty(this.textarea.value, null);
            }
            setDisable(disable:boolean): void {
                if(disable){
                    this.textarea.setAttribute('disabled', 'true');
                }else{
                    this.textarea.removeAttribute('disabled');
                }
            }
            setReadonly(readonly:boolean):void {
                if(readonly){
                    this.textarea.setAttribute('readonly', 'readonly');
                }else{
                    this.textarea.removeAttribute('readonly');
                }
            }
        }
        
        /**
         * duice.ui.ImageFactory
         */
        export class ImageFactory extends MapUiComponentFactory {
            getInstance(element:HTMLImageElement):Image {
                var image = new Image(element);
                var bind = element.dataset.duiceBind.split(',');
                image.bind(this.getContextProperty(bind[0]), bind[1]);
                return image;
            }
        }
        
        /**
         * duice.ui.Image
         */
        export class Image extends MapUiComponent {
            img:HTMLImageElement;
            originSrc:string;
            value:string;
            disable:boolean;
            preview:HTMLImageElement;
            blocker:duice.Blocker;
            menuDiv:HTMLDivElement;

            /**
             * Constructor
             * @param img
             */
            constructor(img:HTMLImageElement) {
                super(img);
                this.img = img;
                this.originSrc = this.img.src;
                this.img.classList.add('duice-ui-img');
                var $this = this;

                // listener for click
                this.img.addEventListener('click', function(event){
                    $this.openPreview();
                });

                // listener for contextmenu event
                this.img.addEventListener('contextmenu', function(event){
                    if($this.disable){
                        return;
                    }
                    $this.openMenuDiv(event.pageX,event.pageY);
                    event.preventDefault();
                });
            }
            
            /**
             * Updates image instance
             * @param map
             * @param obj
             */
            update(map:duice.Map, obj:object):void {
                var value = map.get(this.getName());
                this.value = defaultIfEmpty(value,this.originSrc);
                this.img.src = this.value;
                this.disable = map.isDisable();
            }
            
            /**
             * Return value of image element
             * @return base64 data or image URL
             */
            getValue():any {
                return this.value;
            }

            /**
             * Opens preview
             */
            openPreview():void {
                var $this = this;
                var parentNode = getCurrentWindow().document.body;

                // creates preview
                this.preview = document.createElement('img');
                this.preview.src = this.img.src;
                this.preview.addEventListener('click', function(event){
                    $this.closePreview();
                });

                // creates blocker
                this.blocker = new duice.Blocker(parentNode);
                this.blocker.getBlockDiv().addEventListener('click',function(event){
                    $this.closePreview();
                });
                this.blocker.block();
                
                // shows preview
                this.preview.style.position = 'absolute';
                this.preview.style.zIndex = String(getCurrentMaxZIndex() + 2);
                parentNode.appendChild(this.preview);
                setPositionCentered(this.preview);
            }

            /**
             * Closes preview
             */
            closePreview(){
                if(this.preview){
                    this.blocker.unblock();
                    this.preview.parentNode.removeChild(this.preview);
                    this.preview = null;
                }
            }

            /**
             * Opens menu division.
             */
            openMenuDiv(x:number,y:number):void {
                // checks if already menu exists.
                if(this.menuDiv){
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
                changeButton.addEventListener('click', function(event:any) {
                    $this.changeImage();
                }, true);
                this.menuDiv.appendChild(changeButton);

                // creates view button
                var clearButton = document.createElement('button');
                clearButton.classList.add('duice-ui-img__menuDiv-clearButton');
                clearButton.addEventListener('click', function(event:any) {
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
                this.menuDiv.addEventListener('mouseleave', function(event:any){
                    $this.closeMenuDiv();
                });
            }

            /**
             * Closes menu division
             */
            closeMenuDiv():void {
                if(this.menuDiv) {
                    this.menuDiv.parentNode.removeChild(this.menuDiv);         
                    this.menuDiv = null;
                }
            }

            /**
             * Changes image
             */
            changeImage():void {
                // creates file input element
                var $this = this;
                var input = document.createElement('input');
                input.setAttribute("type", "file");
                input.setAttribute("accept", "image/gif, image/jpeg, image/png");
                input.addEventListener('change', function(e){
                    var fileReader = new FileReader();
                    if (this.files && this.files[0]) {
                        fileReader.addEventListener("load", function(event:any) {
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
            }

            /**
             * Clears image
             */
            clearImage():void {
                this.value = null;
                this.setChanged();
                this.notifyObservers(this);
            }
        }

        /**
         * duice.ui.PaginationFactory
         */
        export class PaginationFactory extends MapUiComponentFactory {
            getInstance(element:HTMLUListElement):Pagination {
                var pagination = new Pagination(element);
                if(element.dataset.duiceSize){
                    pagination.setSize(Number(element.dataset.duiceSize));
                }
                var bind = element.dataset.duiceBind.split(',');
                pagination.bind(this.getContextProperty(bind[0]), bind[1], bind[2], bind[3]);
                return pagination;
            }
        }

		/**
		 * duice.ui.Pagination
		 */
		export class Pagination extends MapUiComponent {
			ul:HTMLUListElement;
			li:HTMLLIElement;
            lis:Array<HTMLLIElement> = new Array<HTMLLIElement>();
            pageName:string;
            rowsName:string;
            totalCountName:string;
            size:number = 1;
            page:number = 1;
			constructor(ul:HTMLUListElement) {
				super(ul);
				this.ul = ul;
				addClassNameIfCssEnable(this.ul, 'duice-ui-pagination');
				
                // clones li
                var li = this.ul.querySelector('li');
                this.li = <HTMLLIElement>li.cloneNode(true);
				li.parentNode.removeChild(li);
            }
            bind(map:duice.Map, pageName:string, rowsName:string, totalCountName:string):void {
                this.pageName = pageName;
                this.rowsName = rowsName;
                this.totalCountName = totalCountName;
                super.bind(map,pageName);
            }
            setSize(size:number):void{
                this.size = size;
            }
            setEnable(enable:boolean):void {
                return;
            }
			update(map:duice.Map, obj:object):void {
                this.page = Number(defaultIfEmpty(map.get(this.pageName),1));
                var rows = Number(defaultIfEmpty(map.get(this.rowsName),1));
                var totalCount = Number(defaultIfEmpty(map.get(this.totalCountName),1));
                var totalPage = Math.max(Math.ceil(totalCount/rows),1);
                var startPage = Math.floor((this.page-1)/this.size)*this.size + 1;
                var endPage = Math.min(startPage+this.size-1, totalPage);
                var $this = this;
				
				// clear lis
				for(var i = this.lis.length-1; i >= 0; i --){
					this.lis[i].parentNode.removeChild(this.lis[i]);
				}
                this.lis.length = 0;
                
                // creates previous item
                const prevPage = startPage - 1;
                var prevLi = this.createPageItem(prevPage,'');
                prevLi.classList.add('duice-ui-pagination__li--prev');
                this.ul.appendChild(prevLi);
                this.lis.push(prevLi);
                prevLi.addEventListener('mousedown', function(event){
                    $this.page = prevPage;
                    $this.setChanged();
                    $this.notifyObservers($this);
                    this.click();
                });
                if(prevPage < 1){
                    prevLi.onclick = null;
                    prevLi.style.pointerEvents = 'none';
                    prevLi.style.opacity = '0.5';
                }
				
				// creates page items
				for(var i = startPage; i <= endPage; i ++ ){
                    const page = i;
                    var li = this.createPageItem(page, String(page));
                    // add event listener
                    li.addEventListener('mousedown', function(event){
                        $this.page = page;
                        $this.setChanged();
                        $this.notifyObservers($this);
                        this.click();
                    },true);
					this.ul.appendChild(li);
                    this.lis.push(li);
					if(page === this.page){
                        addClassNameIfCssEnable(li, 'duice-ui-pagination__li--current');
                        li.onclick = null;
                        li.style.pointerEvents = 'none';
                    }
                }
                
                // creates next item
                const nextPage = endPage + 1;
                var nextLi = this.createPageItem(nextPage,'');
                nextLi.classList.add('duice-ui-pagination__li--next');
                this.ul.appendChild(nextLi);
                this.lis.push(nextLi);
                nextLi.addEventListener('mousedown', function(event){
                    $this.page = nextPage;
                    $this.setChanged();
                    $this.notifyObservers($this);
                    this.click();
                });
                if(nextPage > totalPage){
                    nextLi.onclick = null;
                    nextLi.style.pointerEvents = 'none';
                    nextLi.style.opacity = '0.5';
                }
            }
			getValue():any {
				return this.page;
            }
			createPageItem(page:number, text:string):HTMLLIElement {
				var li:HTMLLIElement = <HTMLLIElement>this.li.cloneNode(true);
				addClassNameIfCssEnable(li, 'duice-ui-pagination__li');
				var $this = this;
				var $context:any = {};
                $context['page'] = Number(page);
                $context['text'] = String(text);
				li = executeExpression(li, $context);
				li.appendChild(document.createTextNode(text));
				return li;
            }
		}
        
        /**
         * duice.ui.TableFactory
         */
        export class TableFactory extends ListUiComponentFactory {
            getInstance(element:HTMLTableElement):Table {
                var table = new Table(element);
                table.setSelectable(element.dataset.duiceSelectable === 'true');
                table.setEditable(element.dataset.duiceEditable === 'true');
                var bind = element.dataset.duiceBind.split(',');
                table.bind(this.getContextProperty(bind[0]), bind[1]);
                return table;
            }
        }
                
        /**
         * duice.ui.Table
         */
        export class Table extends ListUiComponent {
            table:HTMLTableElement;
            tbody:HTMLTableSectionElement;
            tbodies:Array<HTMLTableSectionElement> = new Array<HTMLTableSectionElement>();
            selectable:boolean;
            editable:boolean;
        
            /**
             * constructor table
             * @param table
             */
            constructor(table:HTMLTableElement) {
                super(table);
                this.table = table;
				addClassNameIfCssEnable(this.table, 'duice-ui-table');
                
                // initializes caption
                var caption = <HTMLTableCaptionElement>this.table.querySelector('caption');
                if(caption){
                    addClassNameIfCssEnable(caption,'duice-ui-table__caption');
                    caption = executeExpression(<HTMLElement>caption, new Object());
                    initializeComponent(caption, new Object());
                }
                
                // initializes head
                var thead = <HTMLTableSectionElement>this.table.querySelector('thead');
                if(thead){
                    addClassNameIfCssEnable(thead,'duice-ui-table__thead');
                    thead.querySelectorAll('tr').forEach(function(tr){
                        addClassNameIfCssEnable(tr,'duice-ui-table__thead-tr');
                    });
                    thead.querySelectorAll('th').forEach(function(th){
                        addClassNameIfCssEnable(th,'duice-ui-table__thead-tr-th');
                    });
                    thead = executeExpression(<HTMLElement>thead, new Object());
                    initializeComponent(thead, new Object());
                }
                
                // clones body
                var tbody = this.table.querySelector('tbody');
                this.tbody = <HTMLTableSectionElement>tbody.cloneNode(true);
                addClassNameIfCssEnable(this.tbody,'duice-ui-table__tbody');
                this.tbody.querySelectorAll('tr').forEach(function(tr){
                    addClassNameIfCssEnable(tr,'duice-ui-table__tbody-tr');
                });
                this.tbody.querySelectorAll('td').forEach(function(th){
                    addClassNameIfCssEnable(th,'duice-ui-table__tbody-tr-td');
                });
                this.table.removeChild(tbody);
                
                // initializes foot
                var tfoot = <HTMLTableSectionElement>this.table.querySelector('tfoot');
                if(tfoot){
                    addClassNameIfCssEnable(tfoot,'duice-ui-table__tfoot');
                    tfoot.querySelectorAll('tr').forEach(function(tr){
                        addClassNameIfCssEnable(tr,'duice-ui-table__tfoot-tr');
                    });
                    tfoot.querySelectorAll('td').forEach(function(td){
                        addClassNameIfCssEnable(td,'duice-ui-table__tfoot-tr-td');
                    });
                    tfoot = executeExpression(<HTMLElement>tfoot, new Object());
                    initializeComponent(tfoot, new Object());
                }
            }

            /**
             * Sets selectable flag
             * @param selectable 
             */
            setSelectable(selectable:boolean):void {
                this.selectable = selectable;
            }
            
            /**
             * Sets enable flag
             * @param editable
             */
            setEditable(editable:boolean):void {
                this.editable = editable;
            }
            
            /**
             * Updates table
             * @param list
             * @param obj
             */
            update(list:duice.List, obj:object):void {
                
                // checks changed source instance
                if(obj instanceof duice.Map){
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
                    if(this.selectable){
                        if(index === list.getIndex()){
                            tbody.classList.add('duice-ui-table__tbody--index');
                        }
                        tbody.addEventListener('click', function(event){
                            var index = Number(this.dataset.duiceIndex);
                            $this.selectTbody(index);
                        }, true);
                    }
                    
                    // drag and drop event
                    if(this.editable) {
                        tbody.setAttribute('draggable', 'true');
                        tbody.addEventListener('dragstart', function(event){
                            event.dataTransfer.setData("text", this.dataset.duiceIndex);
                        });
                        tbody.addEventListener('dragover', function(event){
                            event.preventDefault();
                            event.stopPropagation();
                        });
                        tbody.addEventListener('drop', function(event){
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
                if(list.getSize() < 1) {
                    var emptyTbody = this.createEmptyTbody();
                    emptyTbody.style.pointerEvents = 'none';
                    this.table.appendChild(emptyTbody);
                    this.tbodies.push(emptyTbody);
                }
            }

            /**
             * Selects tbody element
             * @param tbody 
             */
            selectTbody(index:number):void {
                this.getList().suspendNotify();
                if(this.getList().setIndex(index)){
                    // handles class                
                    for(var i = 0; i < this.tbodies.length; i ++ ) {
                        if(i === index){
                            this.tbodies[i].classList.add('duice-ui-table__tbody--index');
                        }else{
                            this.tbodies[i].classList.remove('duice-ui-table__tbody--index');
                        }
                    }
                }
                this.getList().resumeNotify();
            }
            
            /**
             * Creates table body element
             * @param index
             * @param map
             */
            createTbody(index:number, map:duice.Map):HTMLTableSectionElement {
                var $this = this;
                var tbody:HTMLTableSectionElement = <HTMLTableSectionElement>this.tbody.cloneNode(true);
				addClassNameIfCssEnable(tbody,'duice-ui-table__tbody');
                var $context:any = new Object;
                $context['index'] = index;
                $context[this.item] = map;
                tbody = executeExpression(<HTMLElement>tbody,$context);
                initializeComponent(tbody,$context);
                return tbody;
            }
            
            /**
             * Creates empty table body element
             */
            createEmptyTbody():HTMLTableSectionElement {
                var emptyTbody:HTMLTableSectionElement = <HTMLTableSectionElement>this.tbody.cloneNode(true);
                removeChildNodes(emptyTbody);
                emptyTbody.classList.add('duice-ui-table__tbody--empty')
                var tr = document.createElement('tr');
                addClassNameIfCssEnable(tr,'duice-ui-table__tbody-tr');
                var td = document.createElement('td');
                addClassNameIfCssEnable(td,'duice-ui-table__tbody-tr-td');
                var colspan = this.tbody.querySelectorAll('tr > td').length;
                td.setAttribute('colspan',String(colspan));
                var emptyMessage = document.createElement('div');
                emptyMessage.style.textAlign = 'center';
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
        export class UListFactory extends ListUiComponentFactory {
            getInstance(element:HTMLUListElement):UList {
                var uList = new UList(element);
                uList.setSelectable(element.dataset.duiceSelectable === 'true');
                uList.setEditable(element.dataset.duiceEditable === 'true');
                if(element.dataset.duiceHierarchy){
                    var hirearchy = element.dataset.duiceHierarchy.split(',');
                    uList.setHierarchy(hirearchy[0], hirearchy[1]);
                }
                uList.setFoldable(element.dataset.duiceFoldable === 'true');
                var bind = element.dataset.duiceBind.split(',');
                uList.bind(this.getContextProperty(bind[0]), bind[1]);
                return uList;
            }
        }
        
        /**
         * duice.ui.UList
         */
        export class UList extends ListUiComponent {
            ul:HTMLUListElement;
            li:HTMLLIElement;
            lis:Array<HTMLLIElement> = new Array<HTMLLIElement>();
            selectable:boolean;
            editable:boolean;
            hierarchy:{ idName:string, parentIdName:string }
            foldable:boolean;
            foldName:any = {};
        
            /**
             * Constructor
             * @param ul
             */
            constructor(ul:HTMLUListElement) {
                super(ul);
                this.ul = ul;
                this.ul.classList.add('duice-ui-ul');
                var li = <HTMLLIElement>this.ul.querySelector('li');
                this.li = <HTMLLIElement>li.cloneNode(true);
            }

            /**
             * Sets selectable flag
             * @param selectable 
             */
            setSelectable(selectable:boolean):void {
                this.selectable = selectable;
            }  

            /**
             * Sets editable flag.
             * @param editable
             */
            setEditable(editable:boolean):void {
                this.editable = editable;
            }
            
            /**
             * Sets hierarchy function options.
             * @param idName
             * @param parentIdName
             */
            setHierarchy(idName:string, parentIdName:string):void {
                this.hierarchy = { idName:idName, parentIdName:parentIdName };
                this.ul.classList.add('duice-ui-ul--hierarchy');
                    
                // add root event
                var $this = this;
                this.ul.addEventListener('dragover', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $this.ul.classList.add('duice-ui-ul--hierarchy-dragover');
                });
                this.ul.addEventListener('dragleave', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $this.ul.classList.remove('duice-ui-ul--hierarchy-dragover');
                });
                this.ul.addEventListener('drop', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var fromIndex = parseInt(event.dataTransfer.getData('text'));
                    var fromMap = $this.list.get(fromIndex);
                    fromMap.set($this.hierarchy.parentIdName, null);
                    $this.ul.classList.remove('duice-ui-ul--hierarchy-dragover');
                    $this.setChanged();
                    $this.notifyObservers(this);
                });
            }
            
            /**
             * Sets foldable flag.
             * @param foldable
             */
            setFoldable(foldable:boolean):void {
                this.foldable = foldable;
            }
            
            /**
             * Updates instance
             * @param list
             * @param obj
             */
            update(list:duice.List, obj:object):void {

                // checks changed source instance
                if(obj instanceof duice.Map){
                    return;
                }
                
                // initiates
                var $this = this;
                this.ul.innerHTML = '';
                this.lis.length = 0;
              
                // creates new rows
                for(var index = 0; index < list.getSize(); index ++ ) {
                    var map = list.get(index);
                    var path:Array<number> = [];
                    
                    // checks hierarchy
                    if(this.hierarchy){
                        if(isNotEmpty(map.get(this.hierarchy.parentIdName))){
                            continue;
                        }
                    }
                    
                    // creates LI element
                    var li = this.createLi(index, map);
                    this.ul.appendChild(li);
                }
                
                // creates orphans
                if(this.hierarchy){
                    for(var index = 0, size = list.getSize(); index < size; index ++ ) {
                        if(this.isLiCreated(index) === false){
                            var orphanLi = this.createLi(index, list.get(index));
                            orphanLi.classList.add('duice-ui-ul__li--orphan');
                            this.ul.appendChild(orphanLi);
                        }
                    }
                }
            }
            
            /**
             * Creates LI element reference to specified map includes child nodes.
             * @param index
             * @param map
             */
            createLi(index:number, map:duice.Map):HTMLLIElement {
                var $this = this;
                var li:HTMLLIElement = <HTMLLIElement>this.li.cloneNode(true);
                li.classList.add('duice-ui-ul__li');
                var $context:any = new Object;
                $context['index'] = index;
                $context[this.item] = map;
                li = executeExpression(<HTMLElement>li,$context);
                initializeComponent(li,$context);
                this.lis.push(li);
                li.dataset.duiceIndex = String(index);
                
                // sets index
                if(this.selectable){
                    if(index === this.getList().getIndex()){
                        li.classList.add('duice-ui-ul__li--index');
                    }
                    li.addEventListener('mousedown', function(event){
                        $this.getList().suspendNotify();
                        if($this.getList().setIndex(index)){
                            event.stopPropagation();
                            for(var i = 0; i < $this.lis.length; i ++ ) {
                                $this.lis[i].classList.remove('duice-ui-ul__li--index');
                            }
                            this.classList.add('duice-ui-ul__li--index');
                            $this.list.index = Number(this.dataset.duiceIndex);
                        }
                        $this.getList().resumeNotify();
                    });
                }

                // editable
                if(this.editable){
                    li.setAttribute('draggable', 'true');
                    li.addEventListener('dragstart', function(event){
                        event.stopPropagation();
                        event.dataTransfer.setData("text", this.dataset.duiceIndex);
                    });
                    li.addEventListener('dragover', function(event){
                        event.preventDefault();
                        event.stopPropagation();
                    });
                    li.addEventListener('drop', function(event){
                        event.preventDefault();
                        event.stopPropagation();
                        var fromIndex = parseInt(event.dataTransfer.getData('text'));
                        var toIndex = parseInt(this.dataset.duiceIndex);
                        $this.moveLi(fromIndex, toIndex);
                    });
                }

                // creates child node
                if(this.hierarchy) {
                    var childUl = document.createElement('ul');
                    childUl.classList.add('duice-ui-ul');
                    var hasChild:boolean = false;
                    var hierarchyIdValue = map.get(this.hierarchy.idName);
                    for(var i = 0, size = this.list.getSize(); i < size; i ++ ){
                        var element = this.list.get(i);
                        var hierarchyParentIdValue = element.get(this.hierarchy.parentIdName);
                        if(isEmpty(hierarchyParentIdValue) === true){
                            continue;
                        }
                        if(hierarchyParentIdValue === hierarchyIdValue){
                            var childLi = this.createLi(i, element);
                            childLi.classList.add('duice-ui-ul__li--indent');
                            childUl.appendChild(childLi);
                            hasChild = true;
                        }
                    }
                    li.appendChild(childUl);
                    
                    // sets fold 
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
            
            /**
             * Returns specified index is already creates LI element.
             * @param index
             */
            isLiCreated(index:number):boolean {
                for(var i = 0, size = this.lis.length; i < size; i ++ ){
                    if(parseInt(this.lis[i].dataset.duiceIndex) === index){
                        return true;
                    }
                }
                return false;
            }
            
            /**
             * Return specified map is fold.
             * @param map
             */
            isFoldLi(map:duice.Map){
                if(this.foldName[map.get(this.hierarchy.idName)] === true){
                    return true;
                }else{
                    return false;
                }
            }
            
            /**
             * folds child nodes
             * @param map
             * @param li
             * @param fold
             */
            foldLi(map:duice.Map, li:HTMLLIElement, fold:boolean){
                if(fold){
                    this.foldName[map.get(this.hierarchy.idName)] = true;
                    li.classList.remove('duice-ui-ul__li--unfold');
                    li.classList.add('duice-ui-ul__li--fold');
                }else{
                    this.foldName[map.get(this.hierarchy.idName)] = false;
                    li.classList.remove('duice-ui-ul__li--fold');
                    li.classList.add('duice-ui-ul__li--unfold');
                }
            }
            
            /**
             * Modes map element from index to index.
             * @param fromIndex
             * @param toIndex
             */
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
                    
                    // checks circular reference
                    if(this.isCircularReference(toMap, fromMap.get(this.hierarchy.idName))){
                        throw 'Not allow to movem, becuase of Circular Reference.';
                    }
                    
                    // change parents
                    fromMap.set(this.hierarchy.parentIdName, toMap.get(this.hierarchy.idName));
                    
                    // notifies observers.
                    this.setChanged();
                    this.notifyObservers(this);
                }else{
                    // changes row position
                    this.list.move(fromIndex, toIndex);
                }
            }
            
            /**
             * Gets parent map
             * @param map
             */
            getParentMap(map:duice.Map):duice.Map {
                var parentIdValue = map.get(this.hierarchy.parentIdName);
                for(var i = 0, size = this.list.getSize(); i < size; i ++){
                    var element = this.list.get(i);
                    if(element.get(this.hierarchy.idName) === parentIdValue){
                        return element;
                    }
                }
                return null;
            }
            
            /**
             * Returns whether circular reference or not
             * @param map
             * @param idValue
             */
            isCircularReference(map:duice.Map, idValue:any):boolean {
                var parentMap = map;
                while(true){
                    parentMap = this.getParentMap(parentMap);
                    if(parentMap === null){
                        return false;
                    }
                    if(parentMap.get(this.hierarchy.idName) === idValue){
                        return true;
                    }
                }
            }
        }
        
        /**
         * Adds components
         */
        ComponentDefinitionRegistry.add(new ComponentDefinition('table','duice-ui-table', duice.ui.TableFactory));
        ComponentDefinitionRegistry.add(new ComponentDefinition('ul','duice-ui-ul', duice.ui.UListFactory));
        ComponentDefinitionRegistry.add(new ComponentDefinition('*','duice-ui-scriptlet', duice.ui.ScriptletFactory));
        ComponentDefinitionRegistry.add(new ComponentDefinition('span','duice-ui-span', duice.ui.SpanFactory));
        ComponentDefinitionRegistry.add(new ComponentDefinition('input','duice-ui-input', duice.ui.InputFactory));
        ComponentDefinitionRegistry.add(new ComponentDefinition('select','duice-ui-select', duice.ui.SelectFactory));
        ComponentDefinitionRegistry.add(new ComponentDefinition('textarea','duice-ui-textarea', duice.ui.TextareaFactory));
        ComponentDefinitionRegistry.add(new ComponentDefinition('img','duice-ui-img', duice.ui.ImageFactory));
        ComponentDefinitionRegistry.add(new ComponentDefinition('ul','duice-ui-pagination', duice.ui.PaginationFactory));

    }   // end of duice.ui

}   // end


/**
 * DOMContentLoaded event process
 */
document.addEventListener("DOMContentLoaded", function(event) {
    duice.initialize();
});

