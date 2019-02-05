// =============================================================================
// JUICE (Javascript UI Component Engine)
// - Anyone can use it freely.
// - Modify the source or allow re-creation. However, you must state that you have the original creator.
// - However, we can not grant patents or licenses for reproductives. (Modifications or reproductions must be shared with the public.)
// Licence: LGPL(GNU Lesser General Public License version 3)
// Copyright (C) 2017 juice.oopscraft.net
// -------------------------
// juice
// juice.initialize
// -------------------------
// juice.data
// juice.data.__
// juice.data.Map
// juice.data.List
// juice.data.Tree
// -------------------------
// juice.ui
// juice.ui.__
// juice.ui.Label
// juice.ui.Text
// juice.ui.TextField
// juice.ui.ComboBox
// juice.ui.CheckBox
// juice.ui.Radio
// juice.ui.TextArea
// juice.ui.HtmlEditor
// juice.ui.CronExpression
// juice.ui.Image
// juice.ui.ListView
// juice.ui.TreeView
// juice.ui.Grid
// juice.ui.Workflow
// juice.ui.Pagination
// juice.ui.Dialog
// juice.ui.Alert
// juice.ui.Confirm
// juice.ui.Prompt
// -------------------------
// juice.util.StringUtils
// juice.util.FormatUtils
// juice.util.RandomUtils
// juice.util.WebSocketClient
// =============================================================================
"use strict";
if(!console.debug){
	console.debug = console.log;
}

/**
 * juice component package package.
 * @namespace
 */
var juice = {};

/**
 * initialize juice component
 * @method
 * @param {HTMLElement} - container
 * @param {Object} - context
 */
juice.initialize = function(container, $context) {
	
	// getObject
	function getObject($context, name) {
		try {
			var obj = eval("$context." + name);
			if(!obj) {
				obj = eval(name);
			}
			return obj;
		}catch(e){
			console.error(e,$context, name);
			throw e;
		}
	};
	
	// creates ListView 
	var listViewElements = container.querySelectorAll('ul[data-juice="ListView"]');
	for(var i = 0; i < listViewElements.length; i++ ) {
		try {
			var element = listViewElements[i];
			var listView = new juice.ui.ListView(element);
			var bind = element.dataset.juiceBind;
			var list = getObject($context,bind);
			listView.bind(list);
			listView.setItem(element.dataset.juiceItem);
			listView.update();
			var id = juice.util.RandomUtils.generateUUID();
			element.dataset.juice += id;
		}catch(e){
			console.error(e,listViewElements[i]);
			throw e;
		}
	}

	// creates TreeView 
	var treeViewElements = container.querySelectorAll('ul[data-juice="TreeView"]');
	for(var i = 0; i < treeViewElements.length; i++ ) {
		try {
			var element = treeViewElements[i];
			var treeView = new juice.ui.TreeView(element);
			var bind = element.dataset.juiceBind;
			var list = getObject($context,bind);
			treeView.bind(list);
			treeView.setItem(element.dataset.juiceItem);
			element.dataset.juiceEditable && treeView.setEditable(eval(element.dataset.juiceEditable));
			treeView.update();
			var id = juice.util.RandomUtils.generateUUID();
			element.dataset.juice += id;
		}catch(e){
			console.error(e,treeViewElements[i]);
			throw e;
		}
	}
	
	// creates Grid
	var gridElements = container.querySelectorAll('table[data-juice="Grid"]');
	for(var i = 0; i < gridElements.length; i++ ) {
		try {
			var element = gridElements[i];
			var grid = new juice.ui.Grid(element);
			var bind = element.dataset.juiceBind;
			var list = getObject($context,bind);
			grid.bind(list);
			grid.setItem(element.dataset.juiceItem);
			element.dataset.juiceEditable && grid.setEditable(eval(element.dataset.juiceEditable));
			element.dataset.juiceFilter && grid.setFilter(eval(element.dataset.juiceFilter));
			grid.update();
			var id = juice.util.RandomUtils.generateUUID();
			element.dataset.juice += id;
		}catch(e){
			console.error(e,gridElements[i]);
			throw e;
		}
	}
	
	// creates Workflow
	var workflowElements = container.querySelectorAll('ul[data-juice="Workflow"]');
	for(var i = 0; i < workflowElements.length; i++ ) {
		try {
			var element = workflowElements[i];
			var workflow = new juice.ui.Workflow(element);
			var bind = element.dataset.juiceBind.split(',');
			var nodeList = getObject($context,bind[0]);
			var linkList = getObject($context,bind[1]);
			workflow.bind(nodeList, linkList);
			workflow.setNodeId(element.dataset.juiceNodeId);
			workflow.setNodeX(element.dataset.juiceNodeX);
			workflow.setNodeY(element.dataset.juiceNodeY);
			workflow.setLinkFrom(element.dataset.juiceLinkFrom);
			workflow.setLinkTo(element.dataset.juiceLinkTo);
			element.dataset.juiceLinkText && workflow.setLinkText(element.dataset.juiceLinkText);
			workflow.update();
			var id = juice.util.RandomUtils.generateUUID();
			element.dataset.juice = +id;
		}catch(e){
			console.error(e,workflowElements[i]);
			throw e;
		}
	}

	// creates Pagination
	var paginationElements = container.querySelectorAll('ul[data-juice="Pagination"]');
	for(var i = 0; i < paginationElements.length; i++ ) {
		try {
			var element = paginationElements[i];
			var pagination = new juice.ui.Pagination(element);
			pagination.bind(getObject($context,element.dataset.juiceBind));
			pagination.setRows(element.dataset.juiceRows);
			pagination.setPage(element.dataset.juicePage);
			pagination.setTotalCount(element.dataset.juiceTotalCount);
			pagination.setPageSize(element.dataset.juicePageSize);
			pagination.update();
			var id = juice.util.RandomUtils.generateUUID();
			element.dataset.juice += id;
		}catch(e){
			console.error(e,paginationElements[i]);
			throw e;
		}
	}
		
	// creates unit elements
	var elementTags = [
		 '[data-juice="Label"]'
		,'[data-juice="Text"]'
		,'[data-juice="TextField"]'
		,'[data-juice="ComboBox"]'
		,'[data-juice="CheckBox"]'
		,'[data-juice="Radio"]'
		,'[data-juice="TextArea"]'
		,'[data-juice="HtmlEditor"]'
		,'[data-juice="CronExpression"]'
		,'[data-juice="Image"]'
	];
	var elements = container.querySelectorAll(elementTags.join(','));
	for(var i = 0; i < elements.length; i ++ ) {
		try {
			var element = elements[i];
			var type = element.dataset.juice;
			var bind = element.dataset.juiceBind.split('.');
			var name = bind.pop();
			var map = getObject($context,bind.join('.'));
			var id = juice.util.RandomUtils.generateUUID();
			switch(type) {
				case 'Label':
					var label = new juice.ui.Label(element);
					var format = element.dataset.juiceFormat;
					format && label.setFormat(format);
					label.bind(map,name);
					label.update();
				break;
				case 'Text':
					var contents = new juice.ui.Text(element);
					contents.bind(map,name);
					contents.update();
				break;
				case 'TextField':
					var textField = new juice.ui.TextField(element);
					textField.bind(map,name);
					textField.update();
				break;
				case 'ComboBox':
					var comboBox = new juice.ui.ComboBox(element);
					var options = element.dataset.juiceOptions;
					var optionValue = element.dataset.juiceOptionValue;
					var optionText = element.dataset.juiceOptionText;
					comboBox.bind(map, name);
					comboBox.setOptions(getObject($context,options));
					optionValue && comboBox.setOptionValue(optionValue);
					optionText && comboBox.setOptionText(optionText);
					comboBox.update();
				break;
				case 'CheckBox':
					var checkBox = new juice.ui.CheckBox(element);
					checkBox.bind(map, name);
					checkBox.update();
				break;
				case 'Radio':
					var radio = new juice.ui.Radio(element);
					radio.bind(map, name);
					radio.update();
				break;
				case 'TextArea':
					var textArea = new juice.ui.TextArea(element);
					textArea.bind(map, name);
					textArea.update();
				break;
				case 'HtmlEditor':
					var htmlEditor = new juice.ui.HtmlEditor(element);
					htmlEditor.bind(map, name);
					htmlEditor.update();
				break;
				case 'CronExpression':
					var cronExpression = new juice.ui.CronExpression(element);
					cronExpression.bind(map, name);
					cronExpression.update();				
				break;
				case 'Image':
					var thumbnail = new juice.ui.Image(element);
					var width = element.dataset.juiceWidth;
					var height = element.dataset.juiceHeight;
					var readonly = element.dataset.juiceReadonly;
					thumbnail.bind(map, name);
					thumbnail.setWidth(width);
					thumbnail.setHeight(height);
					readonly && thumbnail.setReadonly(readonly);
					thumbnail.update();
				break;
			}
			element.dataset.juice += id;
		}catch(e){
			console.error(e, elements[i]);
			throw e;
		}
	}
}

/**
 * data structure package
 * @namespace
 */
juice.data = {};

/**
 * Super prototype of juice.data
 * @class
 * @constructor
 */
juice.data.__ = function(){
	this.observers = new Array();
	this.fireEvent = true;
}
/**
 * Adds observer
 * @method
 * @param {Object} observer for adding
 * @return {void}
 */
juice.data.__.prototype.addObserver = function(observer){
	for(var i = 0, size=this.observers.length; i < size; i++){
		if(this.observers[i] === observer){
			return;
		}
	}
	this.observers.push(observer);
}
/**
 * Notifies all observer
 * @method
 * @param {Object} caller observer
 * @return {void}
 */
juice.data.__.prototype.notifyObservers = function(observer) {
	if(this.fireEvent = false){
		return;
	}
	for(var i = 0, size = this.observers.length; i < size; i++){
		if(this.observers[i] === observer){
			continue;
		}
		this.observers[i].update();
	}
}
/**
 * Updates
 * @method
 * @return {void}
 */
juice.data.__.prototype.update = function() {
	if(this.fireEvent == true){
		this.notifyObservers(this);
	}
}
/**
 * Sets fireEvent flag
 * @method
 * @param {boolean} fire event or not
 * @return {void}
 */
juice.data.__.prototype.setFireEvent = function(fireEvent) {
	this.fireEvent = fireEvent;
	if(fireEvent == true){
		this.notifyObservers(this);
	}
}

// Prevents prototype changed.
Object.freeze(juice.data.__.prototype);

/**
 * Map data structure
 * @class
 * @classdesc
 * Key-Value Map data structure.
 * @constructor
 * @param {Object} JSON data
 * @example
 * // creates map object 
 * var user = new juice.data.Map({
 * 	name:'James'
 * });
 * 
 * // prints name
 * alert(user);
 */
juice.data.Map = function(json) {
	juice.data.__.call(this);
	this.data = {};
	this.listener = {};
	this.parentNode = null;
	this.childNodes = new Array();
	if(json) {
		this.fromJson(json);
	}
	this.enable = true;
	this.readonly = {};
}
juice.data.Map.prototype = Object.create(juice.data.__.prototype);

/**
 * Creates data from JSON object
 * @method
 * @param {Object} JSON data
 * @example
 * // creates empty map.
 * var user = new juice.data.Map();
 * 
 * // sets data to map 
 * user.fromJson({
 * 	name:'james'
 * });
 * 
 * // print user name
 * alert(user); 
 */
juice.data.Map.prototype.fromJson = function(json) {
	this.data = {};
	for(var name in json){
		var value = json[name];
		this.data[name] = value;
	}
	this.notifyObservers();
}
/**
 * Convert map to JSON object
 * @method
 * @return {Object} JSON data
 * @example
 * // creates map object
 * var user = new juice.data.Map({
 * 	name:'james'
 * });
 * 
 * // prints user as JSON object 
 * alert(user.toJson());
 */
juice.data.Map.prototype.toJson = function() {
	var json = {};
	for(var name in this.data){
		var value = this.data[name];
		json[name] = value;
	}
	return json;
}
/**
 * Sets value by name
 * @method
 * @param {String} name - map key name
 * @param {String} value - map value for setting
 * @example
 * // creates map
 * var user = new juice.data.Map({name:'james'});
 * 
 * // sets new name 
 * user.set('name', 'scott');
 * 
 * // prints name
 * alert(user.toJson());
 */
juice.data.Map.prototype.set = function(name,value) {
	if(this.listener.beforeChange){
		if(this.listener.beforeChange.call(this,{name:name, value:value}) == false){
			this.notifyObservers();
			return false;
		}
	}
	this.data[name] = value;
	if(this.listener.afterChange){
		this.listener.afterChange.call(this,{name:name, value:this.get(name)});
	}
	this.notifyObservers();
}

/**
 * Gets specified name's value.
 * @method
 * @param {String} name - key name
 * @return {String} value - map value
 */ 
juice.data.Map.prototype.get = function(name){
	return this.data[name];
}

/**
 * Gets column names
 * @method
 * @return {Array} names of columns as string array.
 */
juice.data.Map.prototype.getNames = function() {
	var names = new Array();
	for(var name in this.data){
		names.push(name);
	}
	return names;
}

/**
 * Gets parent node for tree map
 * @method
 * @return {juice.data.Map} parent node.
 */
juice.data.Map.prototype.getParentNode = function(){
	return this.parentNode;
}

/**
 * Gets child node list
 * @method
 * @return {Array(juice.data.Map)} child node array.
 */
juice.data.Map.prototype.getChildNodes = function(){
	return this.childNodes;
}

/**
 * Returns specified child node
 * @method
 * @param {number} index - index number of child node array.
 * @return {juice.data.Map} specified indexed node
 */
juice.data.Map.prototype.getChildNode = function(index){
	return this.childNodes[index];
}

/**
 * Adds node into child nodes
 * @method
 * @param {juice.data.Map} map - juice.data.Map Object to insert into child nodes.
 */
juice.data.Map.prototype.addChildNode = function(map){
	map.parentNode = this;
	this.childNodes.push(map);
	map.addObserver(this);
}

/**
 * Inserts child node into specified child index.
 * @method
 * @param {number} index - inserting index position in child node array.
 * @param {juicd.data.Map} map - child node object to insert.
 */
juice.data.Map.prototype.insertChildNode = function(index,map){
	map.parentNode = this;
	this.childNodes.splice(index,0,map);
	map.addObserver(this);
}

/**
 * Remove specified child node
 * @method
 * @param {number} index - child array index to remove.
 */
juice.data.Map.prototype.removeChildNode = function(index){
	this.childNodes.splice(index,1);
}

/**
 * Enables data changes.
 * if set true, can changes data values. default is true.
 * @method
 * @param {boolean} enable or not
 */
juice.data.Map.prototype.setEnable = function(enable){
	this.enable = enable;
	this.notifyObservers();
}

/**
 * Gets data change is enable or not
 * @method
 * @return {boolean} change of data is enable or not
 */
juice.data.Map.prototype.isEnable = function() {
	return this.enable;
}

/**
 * Sets specified column is read-only or not/
 * If read-only value is true, specified column data is disabled in bind UI component.
 * Default is false.
 * @method
 * @param {string} name - Name of the column to disable.
 * @param {string} readonly - Whether or not to use
 */
juice.data.Map.prototype.setReadonly = function(name, readonly){
	this.readonly[name] = readonly;
	this.notifyObservers();
}

/**
 * Returns whether the column is read-only
 * @method
 * @param {string} name - column name to check.
 * @Return {boolean} whether the column is read-only 
 */
juice.data.Map.prototype.isReadonly = function(name){
	return this.readonly[name] || false;
}

/**
 * Defines before change event listener
 * @method
 * @param {function} listener - Event listener function before data change
 */
juice.data.Map.prototype.beforeChange = function(listener){
	this.listener.beforeChange = listener;
}

/**
 * Defines after change event listener
 * @method
 * @param {function} listener - Event listener function after data change
 */
juice.data.Map.prototype.afterChange = function(listener){
	this.listener.afterChange = listener;
}

//Prevents prototype changed.
Object.freeze(juice.data.Map.prototype);

/**
 * List data structure
 * @class
 * @classdesc
 * List data structure.
 * @constructor
 * @param {Object[]} jsonArray - JSON Array data
 */
juice.data.List = function(jsonArray) {
	juice.data.__.call(this);
	this.mapList = new Array();
	this.index = -1;
	if(jsonArray) {
		this.fromJson(jsonArray);
	}
	this.enable = true;
	this.readonly = {};
}
juice.data.List.prototype = Object.create(juice.data.__.prototype);

/**
 * Sets data from JSON Array 
 * @method
 * @param {Object[]} jsonArray - JSON Array data
 */
juice.data.List.prototype.fromJson = function(jsonArray){
	this.mapList = new Array();
	for(var i = 0; i < jsonArray.length; i ++ ) {
		var map = new juice.data.Map();
		map.fromJson(jsonArray[i]);
		map.enable = this.enable;
		map.readonly = this.readonly;
		map.addObserver(this);
		this.mapList.push(map);
	}
	this.index = -1;
	this.notifyObservers();
}

/**
 * Converts to JSON object
 * @method
 * @return {Object[]} JSON Array
 */
juice.data.List.prototype.toJson = function() {
	var json = new Array();
	for(var i = 0; i < this.mapList.length; i ++){
		json.push(this.mapList[i].toJson());
	}
	return json;
}

/**
 * Sets current index
 * @method
 * @param {number[]} index - current positioned index
 */
juice.data.List.prototype.setIndex = function(index) {
	this.index = index;
	this.notifyObservers();
}

/**
 * Gets current select row index 
 * @method
 * @return {number[]} current positioned index.
 */
juice.data.List.prototype.getIndex = function() {
	return this.index;
}
// clear current select row index 
juice.data.List.prototype.clearIndex = function() {
	this.index = -1;
	this.notifyObservers();
}
// returns current row count
juice.data.List.prototype.getRowCount = function() {
	return this.mapList.length;
}
// returns specified row
juice.data.List.prototype.getRow = function(index) {
	return this.mapList[index];
}
// adds new row map into list
juice.data.List.prototype.addRow = function(map){
	map.addObserver(this);
	this.mapList.push(map);
	this.index = this.getRowCount();
	this.notifyObservers();
}
/**
 * Adds all rows
 * @Param {juice.data.List}
 * @Return {void}
 */
juice.data.List.prototype.addRows = function(list){
	for(var i = 0, size = list.getRowCount(); i < size; i ++){
		var map = list.getRow(i);
		this.addRow(map);
	}
	this.notifyObservers();
}
// moves from row into to row
juice.data.List.prototype.moveRow = function(from, to) {
	this.index = from;
	this.mapList.splice(to, 0, this.mapList.splice(from, 1)[0]);
	this.index = to;
	this.notifyObservers();
}
// insert row map into specified position 
juice.data.List.prototype.insertRow = function(index, map){
	map.addObserver(this);
	this.mapList.splice(index, 0, map);
	this.index = index;
	this.notifyObservers();
}
// removes specified row map
juice.data.List.prototype.removeRow = function(index){
	this.mapList.splice(index, 1);
	this.notifyObservers();
}
/**
 * Loop forEach function
 */
juice.data.List.prototype.forEach = function(handler) {
	this.setFireEvent(false);
	for(var i = 0, size = this.mapList.length; i < size; i ++){
		handler.call(this, this.mapList[i]);
	}
	this.setFireEvent(true);
}
/**
 * Finds first index by handler
 * @Param {function}	handler - searching handler function
 * @Return {Number}	-  first index of searching
 */
juice.data.List.prototype.indexOf = function(handler){
	for(var i = 0, size = this.mapList.length; i < size; i ++){
		if(handler.call(this, this.mapList[i]) == true){
			return i;
		}
	}
	return -1;
}
/**
 * Finds indexes by handler
 * @Param {function} handler - handler function for searching.
 * @return {Array} - founded indexes array.
 */
juice.data.List.prototype.findIndexes = function(handler){
	var indexes = [];
	for(var i = 0, size = this.mapList.length; i < size; i ++){
		if(handler.call(this, this.mapList[i]) == true){
			indexes.push(i);
		}
	}
	return indexes;
}
/**
 * Checks contains by handler
 * @Param {function} handler
 * @Return {Boolean}
 */
juice.data.List.prototype.contains = function(handler){
	var index = this.indexOf(handler);
	return (index > -1);
}
/**
 * Finds row with handler
 * @Param {function} handler
 * @Return {juice.data.Map}
 */
juice.data.List.prototype.findRow = function(handler) {
	var index = this.indexOf(handler);
	return this.getRow(index);
}
/**
 * Finds rows with handler
 * @Param {function} handler
 * @Return {Array<juice.data.Map>}
 */
juice.data.List.prototype.findRows = function(handler) {
	var indexes = this.findIndexes(handler);
	var rows = new Array();
	for(var i = 0, size = indexes.length; i < size; i ++){
		var node = this.getRow(indexes[i]);
		rows.push(node);
	}
	return rows;
}
juice.data.List.prototype.setEnable = function(enable){
	this.enable = enable;
	this.mapList.forEach(function(element){
		element.setEnable(enable);
	})
	this.notifyObservers();
}
juice.data.List.prototype.isEnable = function(){
	return this.enable;
}
/* beforeChange */
juice.data.List.prototype.beforeChange = function(beforeChangeListener){
	// TODO
}
/* afterChange */
juice.data.List.prototype.afterChange = function(afterChangeListener){
	// TODO
}

//-----------------------------------------------------------------------------
// juice.data.Tree prototype
//-----------------------------------------------------------------------------
juice.data.Tree = function(json,linkNodeName) {
	juice.data.__.call(this);
	this.index = [];
	this.rootNode = new juice.data.Map();
	if(json) {
		this.fromJson(json,linkNodeName);
	}
	this.enable = true;
	this.readonly = {};
}
juice.data.Tree.prototype = Object.create(juice.data.__.prototype);
// load data from JSON Array  
juice.data.Tree.prototype.fromJson = function(json,linkNodeName){
	var $this = this;
	this.rootNode = new juice.data.Map();
	this.rootNode.addObserver(this);
	for(var i = 0; i < json.length; i ++){
		var node = new juice.data.Map();
		node.fromJson(json[i]);
		node.enable = this.enable;
		node.readonly = this.readonly;
		makeTree(node);
		this.rootNode.addChildNode(node);
	}
	function makeTree(node) {
		var childNodes = node.get(linkNodeName);
		if(childNodes){
			for(var i = 0; i < childNodes.length; i ++){
				var childNode = new juice.data.Map();
				childNode.fromJson(childNodes[i]);
				childNode.enable = node.enable;
				childNode.readonly = node.readonly;
				makeTree(childNode);
				node.addChildNode(childNode);
			}
		}
	}
	this.index = [];
	this.notifyObservers();
}
// convert into JSON Array 
juice.data.Tree.prototype.toJson = function(linkNodeName){
	var json = new Array();
	var childNodes = this.rootNode.getChildNodes();
	for(var i = 0; i < childNodes.length; i ++){
		var childNode = childNodes[i];
		var childJson = makeJson(childNode);
		json.push(childJson);
	}
	function makeJson(node) {
		var json = node.toJson();
		var childNodes = node.getChildNodes();
		if(childNodes){
			json[linkNodeName] = new Array();
			for(var i = 0; i < childNodes.length; i ++){
				var childNode = childNodes[i];
				var childJson = makeJson(childNode);
				json[linkNodeName].push(childJson);
			}
		}
		return json;
	}
	return json;
}
/* set index */
juice.data.Tree.prototype.setIndex = function(index) {
	this.index = index;
	this.notifyObservers();
}
/* get current select row index */
juice.data.Tree.prototype.getIndex = function() {
	return this.index;
}
/* clear current select row index */
juice.data.Tree.prototype.clearIndex = function() {
	this.index = [];
	this.notifyObservers();
}
/* get rootNode */
juice.data.Tree.prototype.getRootNode = function() {
	return this.rootNode;
}
/* get tree node */
juice.data.Tree.prototype.getNode = function(index){
	var node = this.rootNode;
	for(var i = 0; i < index.length; i ++){
		var childNodes = node.getChildNodes();
		node = childNodes[index[i]];
	}
	return node;
}
juice.data.Tree.prototype.removeNode = function(index){
	var node = this.getNode(index);
	var parentNode = node.getParentNode();
	parentNode.removeChildNode(index[index.length-1]);
	this.index = -1;
	this.notifyObservers();
}
juice.data.Tree.prototype.insertNode = function(index, map){
	var node = this.getNode(index);
	var parentNode = node.getParentNode();
	parentNode.insertChildNode(index[index.length-1], map);
	this.index = index;
	this.notifyObservers();
}
juice.data.Tree.prototype.moveNode = function(fromIndex, toIndex){
	var fromNode = this.getNode(fromIndex);
	var toNode = this.getNode(toIndex);
	
	//remove
	var fromParentNode = fromNode.getParentNode();
	fromParentNode.removeChildNode(fromIndex[fromIndex.length-1]);
	
	// insert
	var toParentNode = toNode.getParentNode();
	toParentNode.insertChildNode(toIndex[toIndex.length-1],fromNode);
	
	// notify 
	this.index = toIndex;
	this.notifyObservers();
}
/**
 * Loop forEach
 * @Param {function} handler
 */
juice.data.Tree.prototype.forEach = function(handler) {
	this.setFireEvent(false);
	findChild(this.rootNode);
	var $this = this;
	function findChild(node) {
		var childNodes = node.getChildNodes();
		for(var i = 0, size = childNodes.length; i < size; i ++){
			var childNode = childNodes[i];
			handler.call($this,childNode);
			findChild(childNode);
		}
	}
	this.setFireEvent(true);
}
/**
 * Finds indexes by handler
 * @Param {function} handler
 * @Return {Array} - result of finding as array containing index.
 */
juice.data.Tree.prototype.findIndexes = function(handler){
	var indexes = [];
	var depth = -1;
	var cursor = [];
	findChild(this.rootNode);
	var $this = this;
	function findChild(node) {
		depth ++;
		cursor.push(-1);
		var childNodes = node.getChildNodes();
		for(var i = 0, size = childNodes.length; i < size; i ++){
			var childNode = childNodes[i];
			cursor[depth] = i;
			if(handler.call($this,childNode) == true){
				indexes.push(JSON.parse(JSON.stringify(cursor)));
			}
			findChild(childNode);
		}
		depth --;
		cursor.pop();
	}
	return indexes;
}
/**
 * Find first index by handler
 * @Param {function} handler - function(node){...}
 * @Return {Array} - result of finding result
 */
juice.data.Tree.prototype.indexOf = function(handler){
	var indexes = this.findIndexes(handler);
	if(indexes.length > 0){
		return indexes[0];
	}else{
		return [];
	}
}
/**
 * Checks contains node by handler
 * @Param {function} handler - function(node){...}
 * @Return {Boolean}
 */
juice.data.Tree.prototype.contains = function(handler) {
	var indexes = this.findIndexes(handler);
	return (indexes.length > 0);
}
/**
 * Find node
 * @Param {function} handler - function(node){...}
 * @Return {juice.data.Node}
 */
juice.data.Tree.prototype.findNode = function(handler) {
	var index = this.indexOf(handler);
	return this.getNode(index);
}
/**
 * Finds nodes
 * @Param {function} handler - function(node){...}
 * @Return {Array<juice.data.Map>}
 */
juice.data.Tree.prototype.findNodes = function(handler){
	var indexes = this.findIndexes(handler);
	var nodes = new Array();
	for(var i = 0, size = indexes.length; i < size; i ++){
		var node = this.getNode(indexes[i]);
		nodes.push(node);
	}
	return nodes;
}
/**
 * Sets enable flag
 * @Param {boolean} enable - true or false
 * @Return void
 */
juice.data.Tree.prototype.setEnable = function(enable){
	this.enable = enable;
	this.forEach(function(node){
		node.setEnable(enable);
	});
	this.notifyObservers();
}
/**
 * Gets enable flag
 * @Return {boolean} enable or not
 */
juice.data.Tree.prototype.isEnable = function(){
	return this.enable;
}
/**
 * Sets read only in child node by name
 * @Param {string} name - column name
 * @Param {boolean} read only - read only or not flag
 * @Return {void}
 */
juice.data.Tree.prototype.setReadonly = function(name, readonly){
	this.readonly[name] = readonly;
	this.forEach(function(node){
		node.setReadonly(name, readonly);
	});
}
/**
 * Returns current name of column is read only or not.
 * @Param {string] name - column name to checks
 * @Return {boolean} read only or not
 */
juice.data.Tree.prototype.isReadonly = function(name){
	return this.readonly[name] || false;
}
juice.data.Tree.prototype.beforeNodeChange = function(listener){
	// TODO
}
juice.data.Tree.prototype.afterNodeChange = function(listener){
	// TODO
}
juice.data.Tree.prototype.beforeIndexChange = function(listener){
	// TODO
}
juice.data.Tree.prototype.afterIndexChange = function(listener){
	// TODO
}


//-----------------------------------------------------------------------------
// juice.ui package
//-----------------------------------------------------------------------------
juice.ui = {};
juice.ui.__ = function(){}
juice.ui.__.prototype.executeExpression = function(element,$context) {
	var string = element.outerHTML;
	string = string.replace(/\{\{(.*?)\}\}/mgi,function(match, command){
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
	console.debug('executeExpression', template.content.firstChild);
	return template.content.firstChild;
}
juice.ui.__.prototype.removeChildNodes = function(element){
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
    if (element.options && element.nodeName === "select") {
    	element.options.length = 0;
    }
}
juice.ui.__.prototype.createHtml = function(string){
	var template = document.createElement('template');
	template.innerHTML = string;
	return template.content;
}
// returns current window
juice.ui.__.prototype.getWindow = function() {
	if(window.frameElement){
		return window.parent;
	}else{
		return window;
	}
}
juice.ui.__.prototype.setPosition = function(element){
	var window = this.getWindow();
	var computedStyle = window.getComputedStyle(element);
	var computedWidth = computedStyle.getPropertyValue('width').replace(/px/gi, '');
	var computedHeight = computedStyle.getPropertyValue('height').replace(/px/gi, '');
	element.style.width = Math.min(window.screen.width-20, computedWidth) + 'px';
	element.style.height = Math.min(window.screen.height, computedHeight) + 'px';
	element.style.left = Math.max(10,window.innerWidth/2 - computedWidth/2) + 'px';
	element.style.top = Math.max(0,window.innerHeight/2 - computedHeight/2) + 'px';
}
juice.ui.__.prototype.parseFormat = function(format){
	var splitedFormat = format.split(':');
	var formatType = splitedFormat.shift();
	var formatBody = splitedFormat.join(':');
	return { type: formatType, body: formatBody };
}
juice.ui.__.prototype.delay = function(callback){
	var interval = setInterval(function() {
		try {
			callback.call();
		}catch(ignore){
			console.log(ignore, callback);
		}finally{
			clearInterval(interval);
		}
	},400);	
}
juice.ui.__.prototype.fadeIn = function(element){
	element.classList.remove('juice-ui-fadeOut');
	element.classList.add('juice-ui-fadeIn');
}
juice.ui.__.prototype.fadeOut = function(element) {
	element.classList.remove('juice-ui-fadeIn');
	element.classList.add('juice-ui-fadeOut');
}
juice.ui.__.prototype.getMaxZIndex = function(){
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
// blocking specified element 
juice.ui.__.prototype.block = function(element){
	var $this = this;
	
	var div = document.createElement('div');
	div.classList.add('juice-ui-block');
	
	// defines maxZIndex
	var zIndex = this.getMaxZIndex() + 1;
	
	// adjusting position
	div.style.position = 'fixed';
	div.style.zIndex = zIndex;
	
	// full blocking in case of BODY
	if(element.tagName == 'BODY'){
		div.style.width = '100%';
		div.style.height = '100%';
		div.style.top = '0px';
		div.style.left = '0px';
	}
	// otherwise adjusting to parent element
	else{
		var boundingClientRect = this.element.getBoundingClientRect();
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
// progress
juice.ui.__.prototype.load = function(element){
	var $this = this;
	
	// creates div
	var div = document.createElement('div');
	div.classList.add('juice-ui-load');
	div.style.position = 'fixed';
	div.style.opacity = 0;
	div.style.zIndex = this.getMaxZIndex() + 1;

	// on resize event
	this.getWindow().addEventListener('resize', function(ev) {
		if($this.div){
			$this.setPosition(div);
			$this.div.style.top = '30vh';	// adjust top
		}
	});
	
	// start
	element.appendChild(div);
	this.setPosition(div);
	div.style.top = '30vh';	// adjust top	
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

// Freezes prototype of super class.
Object.freeze(juice.ui.__.prototype);


/**
 * juice.ui.Label prototype
 * @class
 * @classdesc
 * Prints the value of the binded data map object on the screen.
 * <iframe width="100%" height="300" src="http://jsfiddle.net/chomookun/ogtf6vh9/embedded/js,html,css,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
 * 
 * ## HTML5 Tag and Attribute
 * 
 * | HTML Tag   	| data-juice* Attribute 								| Description  							|
 * | ------------- 	| -----------------------------------------------------	| -----------------------------------	|
 * | Label  	   	| data-juice="Label" 									| component Type						|
 * | Label		    | data-juice-bind="[juice.data.Map].[column name]    	| specify binding Map and column name	|
 * 
 * @example 
 * <caption>Javascript</caption>
 * var user = new juice.data.Map({
 * 	name:'james'
 * });
 * @example
 * <caption>HTML</caption>
 * <label data-juice="Label" data-juice-bind="user.name"></label>
 * @constructor
 * @param {HTMLLabelElement} label - Label HTML Element
 */
juice.ui.Label = function(label) {
	juice.ui.__.call(this);
	this.label = label;
	this.label.classList.add('juice-ui-label');
}

// extends __ prototype
juice.ui.Label.prototype = Object.create(juice.ui.__.prototype);

/**
 * Binds with specified column in map
 * @method
 * @param {string} map - map name to bind
 * @param {string} name - column name to bind
 */
juice.ui.Label.prototype.bind = function(map, name) {
	this.map = map;
	this.name = name;
	this.map.addObserver(this);
}

/**
 * Updates self from binded data map.
 * @method
 */
juice.ui.Label.prototype.update = function() {
	this.removeChildNodes(this.label);
	var value = '';
	if(this.map.get(this.name) !== null && this.map.get(this.name) !== undefined){
		value = this.map.get(this.name);
	}
	if(this.format){
		var parsedFormat = this.parseFormat(this.format);
		if(parsedFormat.type == 'date'){
			value = juice.util.FormatUtils.toDateFormat(value, parsedFormat.body);
		}else if(parsedFormat.type == 'number'){
			value = juice.util.FormatUtils.toNumberFormat(value, parsedFormat.body);
		}
	}
	this.label.appendChild(this.createHtml(value));
}
juice.ui.Label.prototype.setFormat = function(format) {
	this.format = format;
}

//-----------------------------------------------------------------------------
//juice.ui.Text prototype
//-----------------------------------------------------------------------------
juice.ui.Text = function(pre) {
	juice.ui.__.call(this);
	this.pre = pre;
	this.pre.classList.add('juice-ui-text');
}
juice.ui.Text.prototype = Object.create(juice.ui.__.prototype);
juice.ui.Text.prototype.bind = function(map, name) {
	this.map = map;
	this.name = name;
	this.map.addObserver(this);
}
juice.ui.Text.prototype.update = function() {
	var value = '';
	if(this.map.get(this.name) !== null && this.map.get(this.name) !== undefined){
		value = this.map.get(this.name);
	}
	this.pre.innerHTML = value;
}

//-----------------------------------------------------------------------------
// juice.ui.TextField prototype
//-----------------------------------------------------------------------------
juice.ui.TextField = function(input){
	juice.ui.__.call(this);
	this.input = input;
	this.input.classList.add('juice-ui-textField');
}
juice.ui.TextField.prototype = Object.create(juice.ui.TextField.prototype);
juice.ui.TextField.prototype.bind = function(map, name) {
	var $this = this;
	this.map = map;
	this.name = name;
	this.map.addObserver(this);
	this.input.addEventListener('change',function(){
		map.set(name, this.value);
	});
	
}
juice.ui.TextField.prototype.update = function() {
	var value = this.map.get(this.name) == undefined ? '' : this.map.get(this.name);
	this.input.value = value;
	if(this.map.enable == false){
		this.setReadonly(true);
	}else{
		this.setReadonly(this.map.readonly[this.name]);	
	}
}
juice.ui.TextField.prototype.setReadonly = function(readonly){
	if(readonly){
		this.input.setAttribute('readOnly',true);
	}else{
		this.input.removeAttribute('readOnly');
	}
}

//-----------------------------------------------------------------------------
//juice.ui.ComboBox prototype
//-----------------------------------------------------------------------------
juice.ui.ComboBox = function(select) {
	juice.ui.__.call(this);
	this.select = select;
	this.select.classList.add('juice-ui-comboBox');
	this.options = [];
	this.optionValue = 'value';
	this.optionText = 'text';
	this.optionDisabled = null;
}
juice.ui.ComboBox.prototype = Object.create(juice.ui.__.prototype);
juice.ui.ComboBox.prototype.bind = function(map, name) {
	this.map = map;
	this.name = name;
	this.map.addObserver(this);
	this.select.addEventListener('change',function(){
		map.set(name, this.value);	
	});
}
juice.ui.ComboBox.prototype.update = function() {
	// removes all options
	this.removeChildNodes(this.select);
	
	// creates options
	for(var i = 0; i < this.options.length; i++){
		var option = document.createElement('option');

		// sets value and text
		var value = null;
		var text = null;
		
		// options array element is object
		if(typeof this.options[i] == 'object') {
			value = this.options[i][this.optionValue];
			text = this.options[i][this.optionText];
		}
		// else else string,number ...
		else{
			value = this.options[i];
			text = this.options[i];
		}
		
		// sets value and text node.
		option.value = value;
		option.appendChild(document.createTextNode(text));
		
		// sets disbaled option
		if(this.optionDisabled){
			option.disabled = this.options[i][this.optionDisabled];
		}
		
		// appends
		this.select.appendChild(option);
	}
	
	// sets value
	this.select.value = this.map.get(this.name) || '';
	
	// set read only
	if(this.map.enable == false){
		this.setReadonly(true);
	}else{
		this.setReadonly(this.map.readonly[this.name]);	
	}
}
juice.ui.ComboBox.prototype.setOptions = function(options){
	this.options = options;
}
juice.ui.ComboBox.prototype.setOptionValue = function(optionValue){
	this.optionValue = optionValue;
}
juice.ui.ComboBox.prototype.setOptionText = function(optionText){
	this.optionText = optionText;
}
juice.ui.ComboBox.prototype.setReadonly = function(readonly){
	if(readonly){
		this.select.setAttribute('disabled',true);
	}else{
		this.select.removeAttribute('disabled');
	}
}

//-----------------------------------------------------------------------------
// juice.ui.CheckBox prototype
//-----------------------------------------------------------------------------
juice.ui.CheckBox = function(input) {
	juice.ui.__.call(this);
	this.input = input;
	this.input.type = 'checkbox';
	this.input.classList.add('juice-ui-checkBox');
}
juice.ui.CheckBox.prototype = Object.create(juice.ui.__.prototype);
juice.ui.CheckBox.prototype.bind = function(map,name) {
	this.map = map;
	this.name = name;
	this.map.addObserver(this);
	this.input.addEventListener('change', function() {
		map.set(name, this.checked);
	});
}
juice.ui.CheckBox.prototype.update = function() {
	if(this.map.get(this.name) == true) {
		this.input.checked = true;
	}else{
		this.input.checked = false;
	}
	this.setReadonly(this.map.readonly[this.name]);
	if(this.map.enable == false){
		this.setReadonly(true);
	}
}
juice.ui.CheckBox.prototype.setReadonly = function(readonly){
	if(readonly == true){
		this.input.disabled = true;
	}else{
		this.input.disabled = false;
	}
}

//-----------------------------------------------------------------------------
// juice.ui.Radio prototype
//-----------------------------------------------------------------------------
juice.ui.Radio = function(input) {
	juice.ui.__.call(this);
	this.input = input;
	this.input.type = 'radio';
	this.input.classList.add('juice-ui-radio');
}
juice.ui.Radio.prototype = Object.create(juice.ui.__.prototype);
juice.ui.Radio.prototype.bind = function(map,name) {
	this.map = map;
	this.name = name;
	this.map.addObserver(this);
	this.input.addEventListener('change', function() {
		map.set(name, this.value);
	});
}
juice.ui.Radio.prototype.update = function(){
	if(this.map.get(this.name) == this.input.value) {
		this.input.checked = true;
	}else{
		this.input.checked = false;
	}
}
juice.ui.Radio.prototype.setReadonly = function(readonly){
	// TODO
}

//-----------------------------------------------------------------------------
// juice.ui.TextArea prototype
//-----------------------------------------------------------------------------
juice.ui.TextArea = function(textarea) {
	juice.ui.__.call(this);
	this.textarea = textarea;
	this.textarea.classList.add('juice-ui-textArea');
}
juice.ui.TextArea.prototype = Object.create(juice.ui.__.prototype);
juice.ui.TextArea.prototype.bind = function(map,name) {
	this.map = map;
	this.name = name;
	this.map.addObserver(this);
	this.textarea.name = name;
	this.textarea.value = map.get(name);
	var $this = this;
	this.textarea.addEventListener('change',function(){
		map.set(this.name, this.value);
	});
}
juice.ui.TextArea.prototype.update = function() {
	this.textarea.value = this.map.get(this.name) || '';
	
	// sets enable and read only
	if(this.map.enable == false){
		this.setReadonly(true);
	}else{
		this.setReadonly(this.map.readonly[this.name]);	
	}
}
juice.ui.TextArea.prototype.setReadonly = function(readonly){
	if(readonly){
		this.textarea.setAttribute('readonly','readonly');
	}else{
		this.textarea.removeAttribute('readonly');
	}
}

//-----------------------------------------------------------------------------
// juice.ui.HtmlEditor prototype
//-----------------------------------------------------------------------------
juice.ui.HtmlEditor = function(div) {
	juice.ui.__.call(this);
	var $this = this;
	this.div = div;
	this.div.classList.add('juice-ui-htmlEditor');
	
	// create toolbar
	this.toolbar = this.createToolbar();
	this.toolbar.classList.add('juice-ui-htmlEditor-toolbar');
	this.div.appendChild(this.toolbar);
	
	// create content
	this.content = document.createElement('div');
	this.content.classList.add('juice-ui-htmlEditor-content');
	this.pre = document.createElement('pre');
	this.content.appendChild(this.pre);
	this.textarea = document.createElement('textarea');
	this.textarea.style.display = 'none';
	this.content.appendChild(this.textarea);
	this.div.appendChild(this.content);
	
	// pre element designMode 
	this.pre.contentEditable = 'true';
}
juice.ui.HtmlEditor.prototype = Object.create(juice.ui.__.prototype);
juice.ui.HtmlEditor.prototype.bind = function(map,name) {
	var $this = this;
	this.map = map;
	this.name = name;
	this.map.addObserver(this);
	
	// adds event listener to text area element.
	this.pre.addEventListener('DOMSubtreeModified', function(event){
		if(map.get(name) != this.innerHTML){
			map.set(name, this.innerHTML);
		}
	});
	
	// add event listener to pre element.
	this.textarea.addEventListener('change', function(){
		map.set(name, this.value);
	});
}
juice.ui.HtmlEditor.prototype.update = function() {
	if(this.pre.innerHTML != this.map.get(this.name)) {
		this.pre.innerHTML = this.map.get(this.name) || '';
	}
	if(this.textarea.value != this.map.get(this.name)){
		this.textarea.value = this.map.get(this.name) || '';
	}
}
juice.ui.HtmlEditor.prototype.createToolbar = function() {
	var editor = this;
	var toolbar = document.createElement('div');
	
	// font family
	var fontfamily = document.createElement('select');
	fontfamily.classList.add('juice-ui-htmlEditor-toolbar-fontfamily');
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
		editor.execCommand('fontName',null,this.value);
	});
	toolbar.appendChild(fontfamily);
	
	// font size
	var fontsize = document.createElement('select');
	fontsize.classList.add('juice-ui-htmlEditor-toolbar-fontsize');
	for(var i = 1; i <= 7; i++){
		var option = document.createElement('option');
		option.value = i;
		if(i == 3){
			option.selected = true;		//  default font size
		}
		option.appendChild(document.createTextNode(i));
		fontsize.appendChild(option);
	}
	fontsize.addEventListener('change',function(){
		editor.execCommand('fontSize',null,this.value);
	});
	toolbar.appendChild(fontsize);

	// bold
	var bold = document.createElement('button');
	bold.classList.add('juice-ui-htmlEditor-toolbar-bold');
	bold.addEventListener('click', function(){
		editor.execCommand('bold',null,null);
	});
	toolbar.appendChild(bold);
	
	// italic
	var italic = document.createElement('button');
	italic.classList.add('juice-ui-htmlEditor-toolbar-italic');
	italic.addEventListener('click',function(){
		editor.execCommand('italic',null,null);
	});
	toolbar.appendChild(italic);
	
	// underline
	var underline = document.createElement('button');
	underline.classList.add('juice-ui-htmlEditor-toolbar-underline');
	toolbar.appendChild(underline);
	underline.addEventListener('click',function() {
		editor.execCommand('underline',null,null);
	});

	// align left
	var alignleft = document.createElement('button');
	alignleft.classList.add('juice-ui-htmlEditor-toolbar-alignleft');
	alignleft.addEventListener('click',function() {
		editor.execCommand('justifyLeft',null,null);
	});
	toolbar.appendChild(alignleft);
	
	// align center
	var aligncenter = document.createElement('button');
	aligncenter.classList.add('juice-ui-htmlEditor-toolbar-aligncenter');
	aligncenter.addEventListener('click',function() {
		editor.execCommand('justifyCenter',null,null);
	});
	toolbar.appendChild(aligncenter);
	
	// align right
	var alignright = document.createElement('button');
	alignright.classList.add('juice-ui-htmlEditor-toolbar-alignright');
	alignright.addEventListener('click',function() {
		editor.execCommand('justifyRight',null,null);
	});
	toolbar.appendChild(alignright);
	
	// indent increase
	var indentincrease = document.createElement('button');
	indentincrease.classList.add('juice-ui-htmlEditor-toolbar-indentincrease');
	indentincrease.addEventListener('click',function() {
		editor.execCommand('indent',null,null);
	});
	toolbar.appendChild(indentincrease);
	
	// indent decrease
	var indentdecrease = document.createElement('button');
	indentdecrease.classList.add('juice-ui-htmlEditor-toolbar-indentdecrease');
	indentdecrease.addEventListener('click',function() {
		editor.execCommand('outdent',null,null);
	});
	toolbar.appendChild(indentdecrease);
	
	// list order
	var listorder = document.createElement('button');
	listorder.classList.add('juice-ui-htmlEditor-toolbar-listorder');
	listorder.addEventListener('click',function() {
		editor.execCommand('insertorderedlist',null,null);
	});
	toolbar.appendChild(listorder);
	
	// list unorder
	var listunorder = document.createElement('button');
	listunorder.classList.add('juice-ui-htmlEditor-toolbar-listunorder');
	listunorder.addEventListener('click',function() {
		editor.execCommand('insertUnorderedList',null,null);
	});
	toolbar.appendChild(listunorder);
	
	// html
	var html = document.createElement('button');
	html.classList.add('juice-ui-htmlEditor-toolbar-html');
	html.addEventListener('click', function() {
		editor.toggleHtml();
	});
	toolbar.appendChild(html);
	
	return toolbar;
}
juice.ui.HtmlEditor.prototype.execCommand = function(commandName, showDefaultUI, valueArgument) {
	document.execCommand(commandName, showDefaultUI, valueArgument);
}
juice.ui.HtmlEditor.prototype.toggleHtml = function() {
	if(this.html == true){
		this.html = false;
		this.pre.style.display = 'block';
		this.textarea.style.display = 'none';
	}else{
		this.html = true;
		this.pre.style.display = 'none';
		this.textarea.style.display = 'block';
	}
}

//-----------------------------------------------------------------------------
// juice.ui.CronExpression prototype
//-----------------------------------------------------------------------------
juice.ui.CronExpression = function(input) {
	juice.ui.__.call(this);
	this.input = input;
	
	this.second = this.createSelectSecond();
	this.minute = this.createSelectMinute();
	this.hour = this.createSelectHour();
	this.day = this.createSelectDay();
	this.month = this.createSelectMonth();
	this.week = this.createSelectWeek();
	
	this.editor = document.createElement('span');
	this.editor.classList.add('juice-ui-cronExpression-editor');
	
	// seconds
	var secondSpan = document.createElement('span');
	secondSpan.classList.add('juice-ui-cronExpression-editor-second');
	secondSpan.appendChild(this.second);
	this.editor.appendChild(secondSpan);
	
	// minute
	var minuteSpan = document.createElement('span');
	minuteSpan.classList.add('juice-ui-cronExpression-editor-minute');
	minuteSpan.appendChild(this.minute);
	this.editor.appendChild(minuteSpan);
	
	// hour
	var hourSpan = document.createElement('span');
	hourSpan.classList.add('juice-ui-cronExpression-editor-hour');
	hourSpan.appendChild(this.hour);
	this.editor.appendChild(hourSpan);
	
	// day
	var daySpan = document.createElement('span');
	daySpan.classList.add('juice-ui-cronExpression-editor-day');
	daySpan.appendChild(this.day);
	this.editor.appendChild(daySpan);
	
	// month
	var monthSpan = document.createElement('span');
	monthSpan.classList.add('juice-ui-cronExpression-editor-month');
	monthSpan.appendChild(this.month);
	this.editor.appendChild(monthSpan);
	
	// week
	var weekSpan = document.createElement('span');
	weekSpan.classList.add('juice-ui-cronExpression-editor-week');
	weekSpan.appendChild(this.week);
	this.editor.appendChild(weekSpan);
	
	// append editor span to input parent
	this.input.parentNode.appendChild(this.editor);
}
juice.ui.CronExpression.prototype = Object.create(juice.ui.__.prototype);
juice.ui.CronExpression.prototype.text = {
	EVERY:'Every',
	LAST_DAY: 'Last Day',
	LAST_WEEKDAY: 'Last Weekday',
	WEEKDAY: 'Weekday',
	WEEKEND: 'Weekend',
	MON: 'Monday',
	TUE: 'Tuesday',
	WED: 'Wednesday',
	THU: 'Thursday',
	FRI: 'Friday',
	SAT: 'Saturday',
	SUN: 'Sunday'
}
juice.ui.CronExpression.prototype.bind = function(map, name) {
	this.map = map;
	this.name = name;
	this.map.addObserver(this);
	this.input.addEventListener('change',function(){
		map.set(name, this.value);
	});
}
/* update */
juice.ui.CronExpression.prototype.update = function() {
	var $this = this;
	this.input.value = this.map.get(this.name) || '';
	this.input.classList.add('juice-ui-cronExpression');
	
	// parse cron expression
	var cronExpressionArray = this.input.value.split(' ');
	this.second.value = cronExpressionArray[0];
	this.minute.value = cronExpressionArray[1];
	this.hour.value = cronExpressionArray[2];
	this.day.value = cronExpressionArray[3];
	this.month.value = cronExpressionArray[4];
	this.week.value = cronExpressionArray[5];
}
juice.ui.CronExpression.prototype.setReadonly = function(readonly) {
	if(readonly == true) {
		this.input.setAttribute('readonly',true);
		this.second.setAttribute('disabled',true);
		this.minute.setAttribute('disabled',true);
		this.hour.setAttribute('disabled',true);
		this.day.setAttribute('disabled',true);
		this.month.setAttribute('disabled',true);
		this.week.setAttribute('disabled',true);
	}else if(readonly == false){
		this.input.removeAttribute('readonly');
		this.second.removeAttribute('disabled');
		this.minute.removeAttribute('disabled');
		this.hour.removeAttribute('disabled');
		this.day.removeAttribute('disabled');
		this.month.removeAttribute('disabled');
		this.week.removeAttribute('disabled');
	}
}
juice.ui.CronExpression.prototype.isSupprotCronExpression = function() {
	var pattern = /([\d]{1,2}) ([\d]{1,2}) ([\d|\*]{1,2}) ([\d|\*]{1,2}) ([\d|\*]{1,2}) ([\?]{1})$/gi;
	return pattern.test(this.input.value);
}
juice.ui.CronExpression.prototype.generateCronExpression = function() {
	var cronExpression = this.second.value 
					+ ' ' + this.minute.value 
					+ ' ' + this.hour.value
					+ ' ' + this.day.value 
					+ ' ' + this.month.value
					+ ' ' + this.week.value;
	this.map.set(this.name, cronExpression);
}
juice.ui.CronExpression.prototype.createSelectSecond = function() {
	var selectSecond = document.createElement('select');
	for(var i = 0; i < 59; i ++){
		var option = document.createElement('option');
		option.value = i;
		option.appendChild(document.createTextNode(i));
		selectSecond.appendChild(option);
	}
	var $this = this;
	selectSecond.onchange = function() {
		$this.generateCronExpression();
	}
	
	// copy class list
	for(var i = 0; i < this.input.classList.length; i ++){
		selectSecond.classList.add(this.input.classList[0]);
	}
	return selectSecond;
}
juice.ui.CronExpression.prototype.createSelectMinute = function() {
	var selectMinute = document.createElement('select');
	for(var i = 0; i <= 59; i ++){
		var option = document.createElement('option');
		option.value = i;
		option.appendChild(document.createTextNode(i));
		selectMinute.appendChild(option);
	}
	
	// add event listener
	var $this = this;
	selectMinute.onchange = function() {
		$this.generateCronExpression();
	}
	
	// copy class list
	for(var i = 0; i < this.input.classList.length; i ++){
		selectMinute.classList.add(this.input.classList[0]);
	}
	return selectMinute;
}
juice.ui.CronExpression.prototype.createSelectHour = function() {
	var selectHour = document.createElement('select');
	var defaultOption = document.createElement('option');
	defaultOption.value = '*';
	defaultOption.appendChild(document.createTextNode(this.text.EVERY));
	selectHour.appendChild(defaultOption);
	for(var i = 0; i <= 23; i ++){
		var option = document.createElement('option');
		option.value = i;
		option.appendChild(document.createTextNode(i));
		selectHour.appendChild(option);
	}
	
	// add event listener
	var $this = this;
	selectHour.onchange = function() {
		$this.generateCronExpression();
	}
	
	// copy class list
	for(var i = 0; i < this.input.classList.length; i ++){
		selectHour.classList.add(this.input.classList[0]);
	}
	return selectHour;
}
juice.ui.CronExpression.prototype.createSelectDay = function() {
	var selectDay = document.createElement('select');
	
	// default option
	var defaultOption = document.createElement('option');
	defaultOption.value = '?';
	defaultOption.appendChild(document.createTextNode('-'));
	selectDay.appendChild(defaultOption);		
	
	// every option
	var everyOption = document.createElement('option');
	everyOption.value = '*';
	everyOption.appendChild(document.createTextNode(this.text.EVERY));
	selectDay.appendChild(everyOption);
	
	// last day of month
	var lastDayOption = document.createElement('option');
	lastDayOption.value = 'L';
	lastDayOption.appendChild(document.createTextNode(this.text.LAST_DAY));
	selectDay.appendChild(lastDayOption);
	
	// last weekday of month
	var lastWeekdayOption = document.createElement('option');
	lastWeekdayOption.value = 'LW';
	lastWeekdayOption.appendChild(document.createTextNode(this.text.LAST_WEEKDAY));
	selectDay.appendChild(lastWeekdayOption);
	
	// specific day
	for(var i = 1; i <= 31; i ++){
		var option = document.createElement('option');
		option.value = i;
		option.appendChild(document.createTextNode(i));
		selectDay.appendChild(option);
	}
		
	// add event listener
	var $this = this;
	selectDay.onchange = function() {
		if(this.value != '?') {
			$this.week.value = '?';
		}
		$this.generateCronExpression();
	}
	// copy class list
	for(var i = 0; i < this.input.classList.length; i ++){
		selectDay.classList.add(this.input.classList[0]);
	}
	return selectDay;
}
juice.ui.CronExpression.prototype.createSelectMonth = function() {
	var selectMonth = document.createElement('select');
	var defaultOption = document.createElement('option');
	defaultOption.value = '*';
	defaultOption.appendChild(document.createTextNode(this.text.EVERY));
	selectMonth.appendChild(defaultOption);
	for(var i = 1; i <= 12; i ++){
		var option = document.createElement('option');
		option.value = i;
		option.appendChild(document.createTextNode(i));
		selectMonth.appendChild(option);
	}
	
	// add event listener
	var $this = this;
	selectMonth.onchange = function() {
		$this.generateCronExpression();
	}
	
	// copy class list
	for(var i = 0; i < this.input.classList.length; i ++){
		selectMonth.classList.add(this.input.classList[0]);
	}
	return selectMonth;
}
juice.ui.CronExpression.prototype.createSelectWeek = function() {
	var selectWeek = document.createElement('select');
	var defaultOption = document.createElement('option');
	defaultOption.value = '?';
	defaultOption.appendChild(document.createTextNode('-'));
	selectWeek.appendChild(defaultOption);
	
	// weekday
	var weekdayOption = document.createElement('option');
	weekdayOption.value = '1-5';
	weekdayOption.appendChild(document.createTextNode(this.text.WEEKDAY));
	selectWeek.appendChild(weekdayOption);
	
	// weekend
	var weekendOption = document.createElement('option');
	weekendOption.value = '6-7';
	weekendOption.appendChild(document.createTextNode(this.text.WEEKEND));
	selectWeek.appendChild(weekendOption);
	
	var dayOfWeek = [this.text.MON, this.text.TUE, this.text.WED,this.text.THU, this.text.FRI, this.text.SAT, this.text.SUN];
	for(var i = 0; i < dayOfWeek.length; i ++){
		var option = document.createElement('option');
		option.value = i+1;
		option.appendChild(document.createTextNode(dayOfWeek[i]));
		selectWeek.appendChild(option);
	}
	var $this = this;
	selectWeek.onchange = function() {
		if(this.value != '?') {
			$this.day.value = '?';
		}
		$this.generateCronExpression();
	}
	// copy class list
	for(var i = 0; i < this.input.classList.length; i ++){
		selectWeek.classList.add(this.input.classList[0]);
	}
	return selectWeek;
}

//-----------------------------------------------------------------------------
// juice.ui.Image prototype
//-----------------------------------------------------------------------------
juice.ui.Image = function(img) {
	juice.ui.__.call(this);
	this.img = img;
	this.img.classList.add('juice-ui-thumbnail');
	this.input = document.createElement('input');
	this.input.setAttribute("type", "file");
	this.input.setAttribute("accept", "image/gif, image/jpeg, image/png");
	this.blank = img.src;
	this.width = 128;
	this.height = 128;
	this.readonly = false;
}
juice.ui.Image.prototype = Object.create(juice.ui.__.prototype);
juice.ui.Image.prototype.bind = function(map, name) {
	var $this = this;
	this.map = map;
	this.name = name;
	this.map.addObserver(this);
	
	this.img.addEventListener('error', function() {
		console.log('error');
	});
	
	// add click event
	this.img.addEventListener('click', function() {
		if(!$this.readonly){
			if($this.map.isEnable() && $this.map.isReadonly(this.name) != true){
				$this.input.click();
			}
		}
	});
	
	// add change event listener
	this.input.addEventListener('change', function(e){
		var fileReader = new FileReader();
		if (this.files && this.files[0]) {
			fileReader.addEventListener("load", function(e) {
				var value = e.target.result;
				var width = $this.width;
				var height = $this.height;
			    var canvas = document.createElement("canvas");
			    var ctx = canvas.getContext("2d");
	            canvas.width = width;
	            canvas.height = height;
			    var image = document.createElement('img');
			    image.onload = function(){
					ctx.drawImage(image, 0, 0, width, height);
					value = canvas.toDataURL("image/png");
			    	$this.map.set($this.name, value);
			    };
			    image.src = value;
		    }); 
			fileReader.readAsDataURL(this.files[0]);
		}
	});
	
}
juice.ui.Image.prototype.update = function() {
	var $this = this;
	if(this.map.get(this.name)) {
		var src = this.map.get(this.name);
		this.img.src = src; 
	}else{
		this.img.src = this.blank;
	}
	
	// setting read only
	if(!this.readonly){
		if(!this.map.isEnable() || this.map.isReadonly(this.name)){
			this.img.style.cursor = '';
		}else{
			this.img.style.cursor = 'pointer';
		}
	}
}
juice.ui.Image.prototype.setWidth = function(width){
	if(width){
		this.width = width;
	}
}
juice.ui.Image.prototype.setHeight = function(height){
	if(height){
		this.height = height;
	}
}
juice.ui.Image.prototype.setReadonly = function(readonly){
	this.readonly = readonly;
}

//-----------------------------------------------------------------------------
// juice.ui.ListView prototype
//-----------------------------------------------------------------------------
juice.ui.ListView = function(ul){
	juice.ui.__.call(this);
	this.ul = ul;
	this.ul.classList.add('juice-ui-listView');
	this.li = this.ul.querySelector('li');
	this.ul.removeChild(this.li);
	this.rows = new Array();
}
juice.ui.ListView.prototype = Object.create(juice.ui.__.prototype);
// bind data
juice.ui.ListView.prototype.bind = function(list){
	this.list = list;
	this.list.addObserver(this);
}
// sets item
juice.ui.ListView.prototype.setItem = function(item){
	this.item = item;
}
// update
juice.ui.ListView.prototype.update = function(){
	
	// remove previous rows
	for(var i = 0; i < this.rows.length; i ++ ) {
		this.ul.removeChild(this.rows[i]);
	}
	this.rows.length = 0;
	
	// creates new rows
	for(var index = 0; index < this.list.getRowCount(); index ++ ) {
		var map = this.list.getRow(index);
		var li = this.createRow(index,map);
		this.ul.appendChild(li);
		this.rows.push(li);
	}
}
// creates row
juice.ui.ListView.prototype.createRow = function(index, map){
	var $this = this;
	var ul = this.ul;
	var li = this.li.cloneNode(true);
	
	// setting index
	li.dataset.juiceIndex = index;
	
	// executes expression
	var $context = {};
	$context['index'] = index;
	$context[this.item] = map;
	li = this.executeExpression(li, $context);
	
	// creates juice element.
	juice.initialize(li, $context);
	
	// returns
	return li;
}

//-----------------------------------------------------------------------------
// juice.ui.TreeView prototype
//-----------------------------------------------------------------------------
juice.ui.TreeView = function(ul){
	juice.ui.__.call(this);
	this.ul = ul;
	this.ul.classList.add('juice-ui-treeView');
	this.li = this.ul.querySelector('li');
	this.ul.removeChild(this.li);
}
juice.ui.TreeView.prototype = Object.create(juice.ui.__.prototype);
//bind data 
juice.ui.TreeView.prototype.bind = function(tree) {
	this.tree = tree;
	this.tree.addObserver(this);
}
//set item 
juice.ui.TreeView.prototype.setItem = function(item){
	this.item = item;
}
//setting editable 
juice.ui.TreeView.prototype.setEditable = function(editable) {
	this.editable = editable;
}
//update
juice.ui.TreeView.prototype.update = function() {

	// remove previous li
	while (this.ul.hasChildNodes()) {
		this.ul.removeChild(this.ul.lastChild);
	}

	// creates new li
	var rootChildNodes = this.tree.getRootNode().getChildNodes();
	for(var i = 0; i < rootChildNodes.length; i ++) {
		var rootChildNode = rootChildNodes[i];
		var index = [i];
		var li = this.createNode(index, rootChildNode);
		this.ul.appendChild(li);
	}
	
	// sets index node to unfold
	var treeIndex = JSON.stringify(this.tree.index);
	treeIndex = treeIndex.substring(1, treeIndex.length-1);
	var lis = this.ul.querySelectorAll('li');
	for(var i = 0, size = lis.length; i < size; i++ ){
		var liIndex = lis[i].dataset.juiceIndex;
		liIndex = liIndex.substring(1, liIndex.length-1);
		if(treeIndex.indexOf(liIndex) == 0 && treeIndex != liIndex){
			lis[i].classList.remove('juice-ui-treeView-fold');
			lis[i].classList.add('juice-ui-treeView-unfold');
		} 
	}
}

//creates node 
juice.ui.TreeView.prototype.createNode = function(index, node){
	var $this = this;
	var li = this.li.cloneNode(true);
	var index = JSON.parse(JSON.stringify(index)); 	// deep copy
	
	// setting index
	li.dataset.juiceIndex = JSON.stringify(index);
	
	// executes expression
	var $context = {};
	$context['index'] = JSON.stringify(index);
	$context['depth'] = index.length - 1;
	$context[this.item] = node;
	li = this.executeExpression(li, $context);
	
	// creates juice element.
	juice.initialize(li,$context);
	
	// active index item
	if(JSON.stringify(index) == JSON.stringify(this.tree.index)){
		li.classList.add('juice-ui-treeView-index');
	}
	
	// on click event
	li.addEventListener('click', function(event){
		var prevIndexLi = $this.ul.querySelector('li.juice-ui-treeView-index');
		if(prevIndexLi){
			prevIndexLi.classList.remove('juice-ui-treeView-index');
		}
		li.classList.add('juice-ui-treeView-index');
		$this.tree.index = eval(this.dataset.juiceIndex);
	});

	// child node
	var childNodes = node.getChildNodes();
	if(childNodes && childNodes.length > 0){
		
		// fold & unfold class
		li.classList.add('juice-ui-treeView-unfold');
		li.addEventListener('click', function(event){
			if(event.target == this){
				this.classList.toggle('juice-ui-treeView-fold');
				this.classList.toggle('juice-ui-treeView-unfold');
			}
		});
		
		// creates child node
		index.push(-1);
		var childUl = document.createElement('ul');
		childUl.addEventListener('click', function(event){
			event.stopPropagation();
		});
		for(var i = 0; i < childNodes.length; i ++){
			var childNode = childNodes[i];
			index[index.length-1] = i;
			var childLi = this.createNode(index, childNode);
			childUl.appendChild(childLi);
		}
		li.appendChild(childUl);
	}

	// editable
	if(this.editable){
		var $li = li;
		
		// disable drag
		if(li.dataset.juiceDraggable && eval(li.dataset.juiceDraggable) == false){
			li.setAttribute('draggable', false);
			li.classList.remove('juice-ui-treeView-draggable');
		}
		// enable drag
		else{
			li.setAttribute('draggable', true);
			li.classList.add('juice-ui-treeView-draggable');
			// setting row drag and drop
			li.addEventListener('dragstart', function(ev) {
				ev.stopPropagation();
				ev.target.id = new Date().getMilliseconds();
				ev.dataTransfer.setData("id", ev.target.id);
				this.classList.add('juice-ui-treeView-dragstart');
			});
			li.addEventListener('dragend', function(ev){
				this.classList.remove('juice-ui-treeView-dragstart');
			});
		}

		// disable drop
		if(li.dataset.juiceDroppable && eval(li.dataset.juiceDroppable) == false){
			li.addEventListener('drop', function(ev) {
			    ev.preventDefault();
			    ev.stopPropagation();
			    return false;
			});
			li.addEventListener('dragover', function(ev){
				ev.preventDefault();
				ev.stopPropagation();
				return false;
			});
		}
		// enable drop
		else{
			li.addEventListener('drop', function(ev) {
			    ev.preventDefault();
			    ev.stopPropagation();
			    var dragedLi = document.getElementById(ev.dataTransfer.getData("id"));
			    var dropedLi = ev.target;
			    while(dropedLi){
			    	if(dropedLi.tagName == 'LI'){
			    		break;
			    	}
			    	dropedLi = dropedLi.parentElement;
			    }
			    var fromIndex = eval(dragedLi.dataset.juiceIndex);
			    var toIndex = eval(dropedLi.dataset.juiceIndex);
			    if(fromIndex.toString() == toIndex.toString()) {
			    	return false;
			    }
			    
			    // moves node
			    $this.tree.moveNode(fromIndex, toIndex);
			});
			li.addEventListener('dragover', function(ev){
				ev.preventDefault();
				ev.stopPropagation();
			});
		}
	}
	
	// return li
	return li;
}

//-----------------------------------------------------------------------------
// juice.ui.Grid prototype
//-----------------------------------------------------------------------------
juice.ui.Grid = function(table) {
	juice.ui.__.call(this);
	this.table = table;
	this.table.classList.add('juice-ui-grid');
	this.tbody = table.querySelector('tbody');
	this.table.removeChild(this.tbody);
	this.rows = new Array();
}
juice.ui.Grid.prototype = Object.create(juice.ui.__.prototype);
// bind data structure 
juice.ui.Grid.prototype.bind = function(list) {
	this.list = list;
	this.list.addObserver(this);
}
// set item
juice.ui.Grid.prototype.setItem = function(item) {
	this.item = item;
}
// sets editable
juice.ui.Grid.prototype.setEditable = function(editable){
	this.editable = editable;
}
// sets filter 
juice.ui.Grid.prototype.setFilter = function(filter){
	this.filter = filter;
}
// update 
juice.ui.Grid.prototype.update = function() {
	
	// remove previous rows
	for(var i = 0; i < this.rows.length; i ++ ) {
		this.table.removeChild(this.rows[i]);
	}
	this.rows.length = 0;
	
	// creates new rows
	for(var index = 0; index < this.list.getRowCount(); index ++ ) {
		var map = this.list.getRow(index);
		var tbody = this.createRow(index,map);
		this.table.appendChild(tbody);
		this.rows.push(tbody);
	}

	// not found row
	if(this.list.getRowCount() < 1) {
		var emptyRow = this.createEmptyRow();
		this.table.appendChild(emptyRow);
		this.rows.push(emptyRow);
	}
}
// creates row 
juice.ui.Grid.prototype.createRow = function(index,map) {
	var $this = this;
	var table = this.table;
	var tbody = this.tbody.cloneNode(true);
	
	// setting index
	tbody.dataset.juiceIndex = index;
	
	// executes expression
	var $context = {};
	$context['index'] = index;
	$context[this.item] = map;
	tbody = this.executeExpression(tbody, $context);
	
	// creates juice element.
	juice.initialize(tbody,$context);
	
	// add current row index event listener
	tbody.addEventListener('mousedown', function(){
		$this.list.index = this.dataset.juiceIndex;
		var elements = table.querySelectorAll('tbody');
		for(var i = 0; i < elements.length; i ++ ) {
			elements[i].classList.remove('juice-ui-grid-index');
		}
		tbody.classList.add('juice-ui-grid-index');
		$this.list.index = index;
		$this.list.notifyObservers($this);
	});
	if(index == this.list.index){
		tbody.classList.add('juice-ui-grid-index');
	}
	
	// Editable 
	if(this.editable){
		
		// disable drag
		if(tbody.dataset.juiceDraggable && eval(tbody.dataset.juiceDraggable) == false){
			tbody.setAttribute('graggable',false);
			tbody.classList.remove('juice-ui-grid-draggable');
		}
		// enable drag
		else{
			tbody.setAttribute('draggable', true);
			tbody.classList.add('juice-ui-grid-draggable');
			
			// setting row drag and drop
			tbody.addEventListener('dragstart', function(ev) {
				ev.target.id = new Date().getMilliseconds();
				ev.dataTransfer.setData("id", ev.target.id);
			});
		}
			
		// disable drop
		if(tbody.dataset.juiceDroppable && eval(tbody.dataset.juiceDroppable) == false){
			tbody.addEventListener('drop',function(ev){
			    ev.preventDefault();
			    ev.stopPropagation();
			    return false;
			});
			tbody.addEventListener('dragover',function(ev){
				ev.preventDefault();
				ev.stopPropagation();
				return false;
			});
		}
		// enable drop 
		else {
			tbody.addEventListener('drop', function(ev) {
				ev.preventDefault();
				var dragedTbody = document.getElementById(ev.dataTransfer.getData("id"));
				var dropedTbody = ev.target;
				while(dropedTbody){
					if(dropedTbody.tagName == 'TBODY'){
						break;
					}
					dropedTbody = dropedTbody.parentElement;
				}
				$this.list.moveRow(dragedTbody.dataset.juiceIndex, dropedTbody.dataset.juiceIndex);
			});
			tbody.addEventListener('dragover', function(ev){
				ev.preventDefault();
			});
		}
	}
	
	// Adjust filter
	if(this.filter){
		if(this.filter.call($context) == false) {
			tbody.style.display = 'none';
		}
	}
	
	// return
	return tbody;
}
// creates not found row 
juice.ui.Grid.prototype.createEmptyRow = function() {
	var tbody = this.tbody.cloneNode(true);
	this.removeChildNodes(tbody);
	/*
	while (tbody.firstChild) {
		tbody.removeChild(tbody.firstChild);
	}
	*/
	
	tbody.dataset.juiceIndex = -1;
	tbody.classList.add('juice-ui-grid-empty')
	var tr = document.createElement('tr');
	var td = document.createElement('td');
	var colspan = this.tbody.querySelectorAll('tr > td').length;
	td.setAttribute('colspan',colspan);
	var emptyMessage = document.createElement('div');
	emptyMessage.classList.add('juice-ui-grid-empty-message');
	td.appendChild(emptyMessage);
	tr.appendChild(td);
	tbody.appendChild(tr);
	return tbody;
}

//-----------------------------------------------------------------------------
// juice.data.Workflow prototype
//-----------------------------------------------------------------------------
juice.ui.Workflow = function(ul){
	juice.ui.__.call(this);
	this.ul = ul;
	this.ul.classList.add('juice-ui-workflow');
	this.ul.style.listStyleType = 'none';
	this.li = this.ul.querySelector('li');
	this.ul.removeChild(this.li);
	if(this.ul.parentElement){
		this.ul.parentElement.style.position = 'relative';
	}
	
	// default option
	this.nodeId = 'nodeId';
	this.nodeX = 'nodeX';
	this.nodeY = 'nodeY';
	this.linkFrom = 'linkFrom';
	this.linkTo = 'linkTo';
	this.linkText = null;
}
juice.ui.Workflow.prototype = Object.create(juice.ui.__.prototype);
// bind data structure
juice.ui.Workflow.prototype.bind = function(nodeList,linkList) {
	this.nodeList = nodeList;
	this.linkList = linkList;
	this.nodeList.addObserver(this);
	this.linkList.addObserver(this);
}
// setting node id 
juice.ui.Workflow.prototype.setNodeId = function(value) {
	this.nodeId = value;
}
juice.ui.Workflow.prototype.setNodeX = function(value) {
	this.nodeX = value;
}
juice.ui.Workflow.prototype.setNodeY = function(value) {
	this.nodeY = value;
}
// setting link from 
juice.ui.Workflow.prototype.setLinkFrom = function(value) {
	this.linkFrom = value;
}
// setting link to 
juice.ui.Workflow.prototype.setLinkTo = function(value) {
	this.linkTo = value;
}
// setting link text
juice.ui.Workflow.prototype.setLinkText = function(value) {
	this.linkText = value;
}
// update 
juice.ui.Workflow.prototype.update = function() {
	var $this = this;
	var ul = this.ul;
	
	// remove previous node
	var elements = this.ul.querySelectorAll('.juice-ui-workflow-node');
	for(var i = 0; i < elements.length; i ++ ) {
		this.ul.removeChild(elements[i]);
	}
	
	// creates node list
	for(var index = 0; index < this.nodeList.getRowCount(); index ++ ) {
		var map = this.nodeList.getRow(index);
		var li = this.createNode(index,map);
		li.dataset.juiceNodeId = map.get(this.nodeId);
		this.ul.appendChild(li);
	}
	
	// remove previous link
	var elements = this.ul.querySelectorAll('.juice-ui-workflow-link');
	for(var i = 0; i < elements.length; i ++ ) {
		this.ul.removeChild(elements[i]);
	}
	
	// creates link list
	for(var index = 0; index < this.linkList.getRowCount(); index ++) {
		var map = this.linkList.getRow(index);
		var line = this.createLink(index, map);
		this.ul.appendChild(line);
	}
}
// create ndoe
juice.ui.Workflow.prototype.createNode = function(index, map){
	var $this = this;
	var li = this.li.cloneNode(true);
	li.classList.add('juice-ui-workflow-node');

	var $context = {};
	$context['node'] = map;
	li = this.executeExpression(li, $context);
	li.dataset.juiceIndex = index;
	li.dataset.juiceId = map.get(this.nodeId);
	
	// setting index class
	if(index == this.nodeList.index){
		li.classList.add('juice-ui-workflow-node-index');
	}
	
	// creates juice element.
	juice.initialize(li,$context);
	
	// drag
	li.style.position = 'absolute';
	li.style.zIndex = 9;
	li.style.left = map.get(this.nodeX) + 'px';
	li.style.top = map.get(this.nodeY) + 'px';
	// mouse down
	li.addEventListener('mousedown', function(ev){
		
		// setting current index
		$this.nodeList.index = index;
		var elements = $this.ul.querySelectorAll('.juice-ui-workflow-node');
		for(var i = 0; i < elements.length; i ++ ) {
			elements[i].classList.remove('juice-ui-workflow-node-index');
		}
		li.classList.add('juice-ui-workflow-node-index');

		// mouse move
		var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
		pos3 = ev.clientX;
		pos4 = ev.clientY;
		document.onmousemove = function(ev){
			pos1 = pos3 - ev.clientX;
			pos2 = pos4 - ev.clientY;
			pos3 = ev.clientX;
			pos4 = ev.clientY;
			li.style.left = (li.offsetLeft - pos1) + 'px';
			li.style.top = (li.offsetTop - pos2) + 'px';
			
			// mouse up
			document.onmouseup = function(ev){ 
				document.onmousemove = null;
				document.onmouseup = null;
				var x = Math.round(li.offsetLeft/10)*10;
				var y = Math.round(li.offsetTop/10)*10;
				map.set($this.nodeX,x);
				map.set($this.nodeY,y);
				$this.update();
				$this.nodeList.notifyObservers($this);
				$this.linkList.notifyObservers($this);
			};
		};
		
		// just mouse up
		document.onmouseup = function(ev){ 
			document.onmousemove = null;
			document.onmouseup = null;
			$this.nodeList.notifyObservers($this);
			$this.linkList.notifyObservers($this);
		};
	});
	return li;
}
// create link 
juice.ui.Workflow.prototype.createLink = function(index, map) {
	var $this = this;
	var line = document.createElement('div');
	line.style.position = 'absolute';
	line.classList.add('juice-ui-workflow-link');
	line.dataset.juiceIndex = index;
	
	// setting current index
	if(index == this.linkList.index){
		line.classList.add('juice-ui-workflow-link-index');
	}
	line.addEventListener('mousedown', function() {
		$this.linkList.index = index;
		var elements = $this.ul.querySelectorAll('.juice-ui-workflow-link');
		for(var i = 0; i < elements.length; i ++ ) {
			elements[i].classList.remove('juice-ui-workflow-link-index');
		}
		line.classList.add('juice-ui-workflow-link-index');
		$this.linkList.notifyObservers($this);
	});

	
	// defines line position
	try {
		var from = this.ul.querySelector('[data-juice-node-id="' + map.get(this.linkFrom) + '"]');
		var to = this.ul.querySelector('[data-juice-node-id="' + map.get(this.linkTo) + '"]');

		var fromTop = from.offsetTop  + from.offsetHeight/2;
		var fromLeft = from.offsetLeft + from.offsetWidth/2;
		var toTop = to.offsetTop    + to.offsetHeight/2;
		var toLeft = to.offsetLeft   + to.offsetWidth/2;

		var diffTop   = Math.abs(toTop - fromTop);
		var diffLeft   = Math.abs(toLeft - fromLeft);
		var height    = Math.sqrt(diffTop*diffTop + diffLeft*diffLeft);
		var angle  = 180 / Math.PI * Math.acos( diffTop/height );

		if(toTop > fromTop){
			var top  = (toTop-fromTop)/2 + fromTop;
		}else{
			var top  = (fromTop-toTop)/2 + toTop;
		}
		if(toLeft > fromLeft){
			var left = (toLeft-fromLeft)/2 + fromLeft;
		}else{
			var left = (fromLeft-toLeft)/2 + toLeft;
		}

		if(( fromTop < toTop && fromLeft < toLeft) || ( toTop < fromTop && toLeft < fromLeft) || (fromTop > toTop && fromLeft > toLeft) || (toTop > fromTop && toLeft > fromLeft)){
		  angle *= -1;
		}
		
		// flips angle
		if(fromTop == toTop){
			if(toLeft > fromLeft){
				angle = angle + 180;
			}
		}else if(fromTop > toTop){
			angle = angle + 180;
		}
		
		top-= height/2;
		line.style["-webkit-transform"] = 'rotate('+ angle +'deg)';
		line.style["-moz-transform"] = 'rotate('+ angle +'deg)';
		line.style["-ms-transform"] = 'rotate('+ angle +'deg)';
		line.style["-o-transform"] = 'rotate('+ angle +'deg)';
		line.style["-transform"] = 'rotate('+ angle +'deg)';
		line.style.top    = top+'px';
		line.style.left   = left+'px';
		line.style.height = height + 'px';

		// creates link text
		if(this.linkText){
			var span = document.createElement('span');
			span.classList.add('juice-ui-workflow-link-text');
			line.appendChild(span);	
			
			var text = map.get(this.linkText);
			span.appendChild(document.createTextNode(text));
			span.style.position = 'absolute';
			span.style.height = '20px';
			span.style.lineHeight = '20px';
			span.style.padding = '0px';
			span.style.textAlign = 'center';
			span.style.width = '100px';
			
			var textAngle = angle * -1;
			span.style["-webkit-transform"] = 'rotate('+ textAngle +'deg)';
			span.style["-moz-transform"] = 'rotate('+ textAngle +'deg)';
			span.style["-ms-transform"] = 'rotate('+ textAngle +'deg)';
			span.style["-o-transform"] = 'rotate('+ textAngle +'deg)';
			span.style["-transform"] = 'rotate('+ textAngle +'deg)';			
			span.style.top = (height/2)- 10 + 'px';
			span.style.left = -50 + 'px';
		}
		
	}catch(e){
		console.warn(e);
	}

	// return
	return line;
}

/**
 * juice.ui.Pagination prototype
 */
juice.ui.Pagination = function(ul){
	juice.ui.__.call(this);
	this.ul = ul;
	this.ul.classList.add('juice-ui-pagination');
	this.ul.style.listStyleType = 'none';
	this.li = this.ul.querySelector('li');
	this.ul.removeChild(this.li);
	this.pageSize = 1;
}
juice.ui.Pagination.prototype = Object.create(juice.ui.__.prototype);
// bind 
juice.ui.Pagination.prototype.bind = function(map) {
	this.map = map;
	this.map.addObserver(this);
}
// setting column name specified rows value
juice.ui.Pagination.prototype.setRows = function(value){
	this.rows = value;
}
// setting column name specified page value
juice.ui.Pagination.prototype.setPage = function(value){
	this.page = value;
}
// setting column name specified total rows value 
juice.ui.Pagination.prototype.setTotalCount = function(value){
	this.totalCount = value;
}
juice.ui.Pagination.prototype.setPageSize = function(value) {
	this.pageSize = parseInt(value);
}
// update 
juice.ui.Pagination.prototype.update = function() {

	// remove all li element
	while (this.ul.hasChildNodes()) {
		this.ul.removeChild(this.ul.lastChild);
	}
	
	// getting pagination values
	var rows = parseInt(this.map.get(this.rows));
	var page = parseInt(this.map.get(this.page));
	var	totalCount = parseInt(this.map.get(this.totalCount));

	// creates previous item
	var itemPrev = this.createItemPrev(Math.max(page-this.pageSize,1));
	
	this.ul.appendChild(itemPrev);
	if(page == 1){
		itemPrev.onclick = null;
		itemPrev.style.pointerEvents = 'none';
	}

	// create page item
	if(this.pageSize > 1) {
		// creates page item
		var totalPage = Math.max(Math.ceil(totalCount/rows),1);
		var startPage = Math.floor((page-1)/this.pageSize)*this.pageSize + 1;
		var endPage = Math.min(startPage+this.pageSize-1, totalPage);
		for(var i = startPage; i <= endPage; i ++){
			var itemPage = this.createItemPage(i);
			if(i == page){
				itemPage.classList.add('juice-ui-pagination-item-page-index');
				itemPage.onclick = null;
				itemPage.style.pointerEvents = 'none';
			}
			this.ul.appendChild(itemPage);
		}
		
		// create next item
		var itemNext = this.createItemNext(Math.min(page+this.pageSize,totalPage));
		this.ul.appendChild(itemNext);
		if(page == totalPage) {
			itemNext.onclick = null;
			itemNext.style.pointerEvents = 'none';
		}
		
	}else{
		// creates page item
		var itemPage = this.createItemPage(page);
		itemPage.classList.add('juice-ui-pagination-item-page-index');
		itemPage.onclick = null;
		itemPage.style.pointerEvents = 'none';
		this.ul.appendChild(itemPage);
		
		// create next item
		var itemNext = this.createItemNext(page+1);
		this.ul.appendChild(itemNext);
		if(totalCount < rows) {
			itemNext.onclick = null;
			itemNext.style.pointerEvents = 'none';
		}
	}
}
// create page item 
juice.ui.Pagination.prototype.createItemPage = function(page) {
	var $this = this;
	var ul = this.ul;
	var li = this.li.cloneNode(true);
	li.classList.add('juice-ui-pagination-item-page');
	
	// executes expression
	var $context = {};
	$context['page'] = page;
	li = this.executeExpression(li, $context);
	return li;
}
juice.ui.Pagination.prototype.createItemPrev = function(page) {
	var $this = this;
	var ul = this.ul;
	var li = this.li.cloneNode(true);
	li.classList.add('juice-ui-pagination-item-prev');
	
	// remove child element
	while (li.hasChildNodes()) {
		li.removeChild(li.lastChild);
	}
	// executes expression
	var $context = {};
	$context['page'] = page;
	li = this.executeExpression(li, $context);
	return li;
}
juice.ui.Pagination.prototype.createItemNext = function(page) {
	var $this = this;
	var ul = this.ul;
	var li = this.li.cloneNode(true);
	li.classList.add('juice-ui-pagination-item-next');
	
	// remove child element
	while (li.hasChildNodes()) {
		li.removeChild(li.lastChild);
	}
	// executes expression
	var $context = {};
	$context['page'] = page;
	li = this.executeExpression(li, $context);
	return li;
}

//-----------------------------------------------------------------------------
// juice.ui Dialog
//-----------------------------------------------------------------------------
juice.ui.Dialog = function(content) {
	juice.ui.__.call(this);
	var $this = this;
	
	// defines content
	if(content.parentNode){
		this.parentNode = content.parentNode;
	}
	this.content = content;
	
	// event listener
	this.listener = {};
	
	// creates div
	this.div = document.createElement('div');
	this.div.classList.add('juice-ui-dialog');
	
	// creates header
	this.header = document.createElement('div');
	this.header.classList.add('juice-ui-dialog-header');
	this.header.style.cursor = 'move';
	this.div.appendChild(this.header);
	
	// drag
	this.header.onmousedown = function(ev){
		var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	    pos3 = ev.clientX;
	    pos4 = ev.clientY;
	    $this.getWindow().document.onmouseup = function(ev){ 
	    	$this.getWindow().document.onmousemove = null;
	    	$this.getWindow().document.onmouseup = null;

	    };
	    $this.getWindow().document.onmousemove = function(ev){
		    pos1 = pos3 - ev.clientX;
		    pos2 = pos4 - ev.clientY;
		    pos3 = ev.clientX;
		    pos4 = ev.clientY;
		    $this.div.style.left = ($this.div.offsetLeft - pos1) + 'px';
		    $this.div.style.top = ($this.div.offsetTop - pos2) + 'px';
	    };
	};
	
	// create title
	this.title = document.createElement('span');
	this.title.classList.add('juice-ui-dialog-header-title');
	this.header.appendChild(this.title);
	
	// creates exit
	this.closeButton = document.createElement('span');
	this.closeButton.classList.add('juice-ui-dialog-header-close');
	this.closeButton.addEventListener('click',function(ev){
		$this.close();
	});
	this.header.appendChild(this.closeButton);

	// creates body
	this.body = document.createElement('div');
	this.body.classList.add('juice-ui-dialog-body');
	this.body.appendChild(this.content);
	this.div.appendChild(this.body);
	
	// on resize event
	this.getWindow().addEventListener('resize', function(ev) {
		$this.setPosition($this.div);
		this.div.style.top = '20vh';	// adjust top
	});
}
juice.ui.Dialog.prototype = Object.create(juice.ui.__.prototype);
// sets title 
juice.ui.Dialog.prototype.setTitle = function(title){
	this.title.appendChild(this.createHtml(title));
}
// open dialog window 
juice.ui.Dialog.prototype.open = function(){
	
	// blocker
	this.blocker = this.block(this.getWindow().document.body);
	
	// setting position
	this.div.style.position = 'fixed';
	this.div.style.zIndex = this.blocker.getZIndex() + 1;
	
	// adds into document
	this.getWindow().document.body.appendChild(this.div);

	// adjust top
	this.setPosition(this.div);
	this.div.style.top = '20vh';

	// display
	this.fadeIn(this.div);
	
	// let current active element to be blur.
	try {
		this.getWindow().document.activeElement.blur();
	}catch(ignore){
	}
}
// close dialog window 
juice.ui.Dialog.prototype.close = function() {
	var $this = this;

	// fires close listener
	if(this.listener.beforeClose){
		if(this.listener.beforeClose.call(this) == false){
			return false;
		}
	}
	
	this.fadeOut(this.div);
	this.blocker.release();
	
	this.delay(function(){
		// restore content element into parent node
		if($this.parentNode){
			$this.parentNode.appendChild($this.content);
		}
		
		// removes dialog from screen
		$this.getWindow().document.body.removeChild($this.div);

		// calls callback function
		if($this.afterClose){
			$this.afterClose.call($this);
		}

	});
}
juice.ui.Dialog.prototype.beforeClose = function(listener){
	this.listener.beforeClose = listener;
	return this;
}
juice.ui.Dialog.prototype.afterClose = function(listener){
	this.listener.afterClose = listener;
	return this;
}

/**
 * juice.ui.Alert prototype
 */
juice.ui.Alert = function(message){
	juice.ui.__.call(this);
	var $this = this;
	
	// listener
	this.listener = {};

	// contents
	this.content = document.createElement('div');
	this.content.classList.add('juice-ui-alert');
	
	// message
	this.message = document.createElement('div');
	this.message.classList.add('juice-ui-alert-message');
	this.message.appendChild(document.createTextNode(message));
	this.content.appendChild(this.message);
	
	// button
	this.button = document.createElement('div');
	this.button.classList.add('juice-ui-alert-button');
	this.content.appendChild(this.button);
	
	// confirm button
	this.buttonConfirm = document.createElement('button');
	this.buttonConfirm.classList.add('juice-ui-alert-button-confirm');
	this.buttonConfirm.addEventListener('click', function(){
		$this.confirm();
	});
	this.button.appendChild(this.buttonConfirm);

	// creates dialog
	this.dialog = new juice.ui.Dialog(this.content);
	
	// return self
	return this;
}
juice.ui.Alert.prototype = Object.create(juice.ui.__.prototype);
// setting title 
juice.ui.Alert.prototype.setTitle = function(title){
	this.dialog.setTitle(title);
	return this;
}
// opens alert message box 
juice.ui.Alert.prototype.open = function(){
	this.dialog.open();
	this.buttonConfirm.focus();
	return this;
}
// confirm 
juice.ui.Alert.prototype.confirm = function(){
	var $this = this;
	
	// calls beforeConfirm
	if(this.listener.beforeConfirm){
		if(this.listener.beforeConfirm.call(this) == false){
			return false;
		}
	}

	// closes dialog
	this.dialog.close();
	
	// calls afterConfirm events
	if(this.listener.afterConfirm){
		this.delay(function(){
			$this.listener.afterConfirm.call($this);
		});
	}
}
// defines before confirm event listener
juice.ui.Alert.prototype.beforeConfirm = function(listener){
	this.listener.beforeConfirm = listener;
	return this;
}
// defines after confirm event listener.
juice.ui.Alert.prototype.afterConfirm = function(listener){
	this.listener.afterConfirm = listener;
	return this;
}

//-----------------------------------------------------------------------------
// juice.ui.Confirm prototype
//-----------------------------------------------------------------------------
juice.ui.Confirm = function(message){
	juice.ui.__.call(this);
	var $this = this;
	
	// event property
	this.listener = {};

	// contents
	this.content = document.createElement('div');
	this.content.classList.add('juice-ui-confirm');
	
	// message
	this.message = document.createElement('div');
	this.message.classList.add('juice-ui-confirm-message');
	this.message.appendChild(document.createTextNode(message));
	this.content.appendChild(this.message);
	
	// button
	this.button = document.createElement('div');
	this.button.classList.add('juice-ui-confirm-button');
	this.content.appendChild(this.button);
	
	// confirm button
	this.buttonConfirm = document.createElement('button');
	this.buttonConfirm.classList.add('juice-ui-confirm-button-confirm');
	this.buttonConfirm.addEventListener('click', function(){
		$this.confirm();
	});
	this.button.appendChild(this.buttonConfirm);
	
	// confirm button
	this.buttonCancel = document.createElement('button');
	this.buttonCancel.classList.add('juice-ui-confirm-button-cancel');
	this.buttonCancel.addEventListener('click', function(){
		$this.cancel();
	});
	this.button.appendChild(this.buttonCancel);

	// creates dialog
	this.dialog = new juice.ui.Dialog(this.content);
	
	// return self
	return this;
}
juice.ui.Confirm.prototype = Object.create(juice.ui.__.prototype);
// setting title 
juice.ui.Confirm.prototype.setTitle = function(title){
	this.dialog.setTitle(title);
	return this;
}
// opens alert message box 
juice.ui.Confirm.prototype.open = function(){
	this.dialog.open();
	this.buttonCancel.focus();
	return this;
}
// confirm 
juice.ui.Confirm.prototype.confirm = function(){
	var $this = this;
	
	// executes beforeConfirm listener
	if(this.listener.beforeConfirm){
		if(this.listener.beforeConfirm.call(this) == false){
			return false;
		}
	}

	// closes dialog
	this.dialog.close();	
	
	// executes afterConfirm listener.
	if(this.listener.afterConfirm) {
		this.delay(function(){
			$this.listener.afterConfirm.call($this);
		});
	}
}
// cancel 
juice.ui.Confirm.prototype.cancel = function(){
	var $this = this;
	
	// executes beforeCancel
	if(this.listener.beforeCancel){
		if(this.listener.beforeCancel.call(this) == false){
			return false;
		}
	}
	
	// closes dialog
	this.dialog.close();
	
	// executes afterCancel listener.
	if(this.listener.afterCancel) {
		this.delay(function(){
			$this.listener.afterCancel.call($this);
		});
	}
}
// defines before confirm event listener
juice.ui.Confirm.prototype.beforeConfirm = function(listener){
	this.listener.beforeConfirm = listener;
	return this;
}
// defines after confirm event listener.
juice.ui.Confirm.prototype.afterConfirm = function(listener){
	this.listener.afterConfirm = listener;
	return this;
}
// defines before cancel event listener.
juice.ui.Confirm.prototype.beforeCancel = function(listener){
	this.listener.beforeCancel = listener;
	return this;
}
// defines after cancel event listener.
juice.ui.Confirm.prototype.afterCancel = function(listener){
	this.listener.afterCancel = listener;
	return this;
}

//-----------------------------------------------------------------------------
// juice.ui.Prompt prototype
//-----------------------------------------------------------------------------
juice.ui.Prompt = function(message){
	juice.ui.__.call(this);
	var $this = this;

	// event property
	this.listener = {};

	// contents
	this.content = document.createElement('div');
	this.content.classList.add('juice-ui-prompt');
	
	// message
	this.message = document.createElement('div');
	this.message.classList.add('juice-ui-prompt-message');
	this.message.appendChild(document.createTextNode(message));
	this.content.appendChild(this.message);

	// input
	this.input = document.createElement('input');
	this.input.classList.add('juice-ui-prompt-input');
	this.input.type = 'text'
	this.content.appendChild(this.input);

	// button
	this.button = document.createElement('div');
	this.button.classList.add('juice-ui-prompt-button');
	this.content.appendChild(this.button);
	
	// confirm button
	this.buttonConfirm = document.createElement('button');
	this.buttonConfirm.classList.add('juice-ui-prompt-button-confirm');
	this.buttonConfirm.addEventListener('click', function(){
		$this.confirm();
	});
	this.button.appendChild(this.buttonConfirm);
	
	// confirm button
	this.buttonCancel = document.createElement('button');
	this.buttonCancel.classList.add('juice-ui-prompt-button-cancel');
	this.buttonCancel.addEventListener('click', function(){
		$this.cancel();
	});
	this.button.appendChild(this.buttonCancel);

	// creates dialog
	this.dialog = new juice.ui.Dialog(this.content);
	
	return this;
}
juice.ui.Prompt.prototype = Object.create(juice.ui.__.prototype);
// sets title
juice.ui.Prompt.prototype.setTitle = function(title){
	this.dialog.setTitle(title);
	return this;
}
// open prompt message dialog
juice.ui.Prompt.prototype.open = function(){
	this.dialog.open();
	this.input.focus();
	return this;
}
// confirm
juice.ui.Prompt.prototype.confirm = function() {
	var $this = this;
	
	// executes before cancel
	if(this.listener.beforeConfirm){
		if(this.listener.beforeConfirm.call(this, { value: this.input.value }) == false){
			return false;
		}
	}
	
	// closes dialog
	this.dialog.close();
	
	// executes afterConfirm listener.
	if(this.listener.afterConfirm) {
		this.delay(function(){
			$this.listener.afterConfirm.call($this, { value: $this.input.value });
		});
	}
}
// cancel
juice.ui.Prompt.prototype.cancel = function() {
	var $this = this;
	
	// executes before cancel
	if(this.listener.cancel){
		if(this.listener.beforeCancel.call(this, { value: this.input.value }) == false){
			return false;
		}
	}
	
	// closes dialog
	this.dialog.close();	
	
	// executes afterCancel listener.
	if(this.listener.afterCancel) {
		this.delay(function(){
			$this.listener.afterCancel.call($this, { value: $this.input.value });
		});
	}
}
// return input value
juice.ui.Prompt.prototype.getValue = function() {
	return this.input.value;
}
// defines before confirm event listener
juice.ui.Prompt.prototype.beforeConfirm = function(listener){
	this.listener.beforeConfirm = listener;
	return this;
}
// defines after confirm event listener.
juice.ui.Prompt.prototype.afterConfirm = function(listener){
	this.listener.afterConfirm = listener;
	return this;
}
// defines before cancel event listener.
juice.ui.Prompt.prototype.beforeCancel = function(listener){
	this.listener.beforeCancel = listener;
	return this;
}
// defines after cancel event listener.
juice.ui.Prompt.prototype.afterCancel = function(listener){
	this.listener.afterCancel = listener;
	return this;
}


//-----------------------------------------------------------------------------
// Utilities structure package
//-----------------------------------------------------------------------------
juice.util = {};

//-----------------------------------------------------------------------------
// juice.util.stringUtils
//-----------------------------------------------------------------------------
juice.util.StringUtils = {
	isEmpty: function(value) {
		if(value === null || value === undefined || value.trim().length < 1){
			return true;
		}else{
			return false;
		}
	},
	isNumber: function(value){
		var pattern = /^[0-9]{1,}$/;
		return pattern.test(value);
	},
	isAlphabet: function(value){
		var pattern = /^[a-zA-Z]{1,}$/;
		return pattern.test(value);
	},
	isAlphabetNumber: function(value){
		var pattern = /^[a-zA-Z0-9]{1,}$/;
		return pattern.test(value);
	},
	isDecimal: function(value){
		var pattern = /^[0-9\,\.]{1,}$/;
		return pattern.test(value);
	},
	/**
	 * Checks value size
	 * @Param {String} value for checking
	 * @Param {Number} valid minimum length
	 * @Param {Number} valid maximum length
	 */
	isLengthBetween: function(value, min, max) {
		if(!value) {
			return false;
		}
		var length = value.length;
		if(min <= length && length <= max){
			return true;
		}else{
			return false;
		}
	},
	/**
	 * Checks generic ID (alphabet + number + -,_), but does not check length.
	 * @Param {String} value for checking.
	 */
	isGenericId: function(value){
		var pattern = /^[a-zA-Z0-9\-\_]{1,}$/;
		return pattern.test(value);
	},
	/**
	 * Checks generic password (At least 1 alphabet, 1 number, 1 special char)
	 */
	isGenericPassword: function(value){
		var pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
		return pattern.test(value);
	},
	isEmailAddress: function(value){
		var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		return pattern.test(value);
	},
	isPhoneNumber: function(value){
		var pattern =/^[0-9\-]{11,}$/; 
		return pattern.test(value);
	},
	isUrlAddress: function(value){
		var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
		return pattern.test(value);
	}
}

//-----------------------------------------------------------------------------
//juice.util.formatUtils
//-----------------------------------------------------------------------------
juice.util.FormatUtils = {
	toDateFormat: function(date, format){
		String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
		String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
		Number.prototype.zf = function(len){return this.toString().zf(len);};
		
		var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
		var d = date instanceof Date ? d : new Date(date);
	
		// check date
		if(isNaN(d.getTime())){
			return '';
		}

		var formatRex = /yyyy|yy|MM|dd|E|HH|hh|mm|ss|ap/gi;
		var dateString = format.replace(formatRex, function($1) {
			switch ($1) {
				case "yyyy": return d.getFullYear();
				case "yy": return (d.getFullYear() % 1000).zf(2);
				case "MM": return (d.getMonth() + 1).zf(2);
				case "dd": return d.getDate().zf(2);
				case "E": return weekName[d.getDay()];
				case "HH": return d.getHours().zf(2);
				case "hh": return (d.getHours() <= 12 ? d.getHours() : d.getHours()%12).zf(2);
				case "mm": return d.getMinutes().zf(2);
				case "ss": return d.getSeconds().zf(2);
				case "ap": return d.getHours() < 12 ? "오전" : "오후";
				default: return $1;
			}
		});
		return dateString;
	},
	toNumberFormat: function(number, format){
	    var reg = /(^[+-]?\d+)(\d{3})/;
	    var n = (number + '');
	    while (reg.test(n)) {
	    	n = n.replace(reg, '$1' + ',' + '$2');
	    }
	    return n;
	}
}

//-----------------------------------------------------------------------------
//juice.util.formatUtils
//-----------------------------------------------------------------------------
juice.util.RandomUtils = {
	generateUUID: function() {
		var dt = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (dt + Math.random()*16)%16 | 0;
			dt = Math.floor(dt/16);
			return (c=='x' ? r :(r&0x3|0x8)).toString(16);
		});
		return uuid;
	}
}

//-----------------------------------------------------------------------------
// juice.util.WebSocketClient prototype
//-----------------------------------------------------------------------------
juice.util.WebSocketClient = function(url) {
	this.url = url;
	this.listener = {};
	this.reconnectInterval = 3*1000;	// ms
	this.messageHandlers = [];
}
juice.util.WebSocketClient.prototype = {
	open: function() {
		this.webSocket = new WebSocket(this.url);
		var $this = this;
		this.webSocket.onopen = function(event){
			if($this.listener.onOpen){
				$this.listener.onOpen.call($this,event);
			}
		}
		this.webSocket.onmessage = function(event){
			if($this.listener.onMessage){
				$this.listener.onMessage.call($this,event);
			}
			$this.messageHandlers.forEach(function(messageHandler){
				messageHandler.call(this, event);
			});
		}
		this.webSocket.onclose = function(ev){
			if($this.listener.onClose){
				$this.listener.onClose.call($this,event);
			}
			// reconnect
			setTimeout(function(){
				$this.open($this.url);
			},$this.reconnectInterval);
		}
		this.webSocket.onerror = function(ev){
			if($this.listener.onError){
				$this.listener.onError.call($this,event);
			}
		}
	},
	send: function(message) {
		this.webSocket.send(message);
	},
	onOpen: function(listener) {
		this.listener.onOpen = listener;
	},
	onMessage: function(listener) {
		this.listener.onMessage = listener;
	},
	onClose: function(listener) {
		this.listener.onClose = listener;
	},
	onError: function(listener){
		this.listener.onError = listener;
	},
	setReconnectInterval: function(value){
		this.reconnectInterval = value;
	},
	addMessageHandler: function(handler){
		this.messageHandlers.push(handler);
	}
}

//-----------------------------------------------------------------------------
// DOMContentLoaded event process
//-----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function(event) {
	var $context = typeof global !== 'undefined' ? global : 
					typeof self !== 'undefined' ? self : 
					typeof window !== 'undefined' ? window :
					{};
	juice.initialize(document,$context);
});

