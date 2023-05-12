declare namespace duice {
    /**
     * Observable
     */
    class Observable {
        observers: Observer[];
        notifyEnabled: boolean;
        /**
         * addObserver
         * @param observer
         */
        addObserver(observer: Observer): void;
        /**
         * removeObserver
         * @param observer
         */
        removeObserver(observer: Observer): void;
        /**
         * suspend notify
         */
        suspendNotify(): void;
        /**
         * resume notify
         */
        resumeNotify(): void;
        /**
         * notifyObservers
         * @param event
         */
        notifyObservers(event: event.Event): void;
    }
}
declare namespace duice {
    /**
     * element abstract class
     */
    abstract class DataElement<T extends HTMLElement> extends Observable implements Observer {
        htmlElement: T;
        context: object;
        data: DataProxy;
        /**
         * constructor
         * @param htmlElement
         * @param context
         * @protected
         */
        protected constructor(htmlElement: T, context: object);
        /**
         * return HTML element
         */
        getHtmlElement(): T;
        /**
         * return context
         */
        getContext(): object;
        /**
         * set data
         * @param dataName
         */
        setData(dataName: string): void;
        /**
         * return data
         */
        getData(): DataProxy;
        /**
         * execute script if exists
         * @param htmlElement
         * @param context
         */
        executeScript(htmlElement: HTMLElement, context: object): void;
        /**
         * render abstract method
         */
        abstract render(): void;
        /**
         * update abstract method
         * @param observable
         * @param event
         */
        abstract update(observable: object, event: event.Event): void;
    }
}
declare namespace duice {
    /**
     * array element class
     */
    class ArrayElement<T extends HTMLElement> extends DataElement<T> {
        slot: HTMLSlotElement;
        loop: string;
        hierarchy: string;
        editable: boolean;
        rowHtmlElements: HTMLElement[];
        /**
         * constructor
         * @param htmlElement
         * @param context
         */
        constructor(htmlElement: T, context: object);
        /**
         * set array
         * @param arrayName
         */
        setArray(arrayName: string): void;
        /**
         * set loop
         * @param loop
         */
        setLoop(loop: string): void;
        /**
         * set editable
         * @param editable
         */
        setEditable(editable: boolean): void;
        /**
         * set hierarchy
         * @param hierarchy
         */
        setHierarchy(hierarchy: string): void;
        /**
         * render
         */
        render(): void;
        /**
         * update
         * @param observable
         * @param event
         */
        update(observable: Observable, event: event.Event): void;
    }
}
declare namespace duice {
    /**
     * element factory abstract class
     */
    abstract class DataElementFactory<T extends HTMLElement> {
        /**
         * check support
         * @param element
         */
        abstract support(element: T): boolean;
        /**
         * creates element
         * @param htmlElement
         * @param context
         */
        abstract createElement(htmlElement: T, context: object): DataElement<HTMLElement>;
    }
}
declare namespace duice {
    /**
     * array element factory class
     */
    class ArrayElementFactory<T extends HTMLElement> extends DataElementFactory<HTMLElement> {
        static defaultInstance: ArrayElementFactory<HTMLElement>;
        static instances: ArrayElementFactory<HTMLElement>[];
        /**
         * adds factory instance
         * @param elementFactory
         */
        static addInstance(elementFactory: ArrayElementFactory<HTMLElement>): void;
        /**
         * return factory instance
         * @param htmlElement
         */
        static getInstance(htmlElement: HTMLElement): ArrayElementFactory<HTMLElement>;
        /**
         * check support
         * @param htmlElement
         */
        support(htmlElement: T): boolean;
        /**
         * support template method
         * @param htmlElement
         */
        doSupport(htmlElement: T): boolean;
        /**
         * creates array component
         * @param htmlElement
         * @param context
         */
        createElement(htmlElement: T, context: object): ArrayElement<any>;
    }
}
declare namespace duice {
    /**
     * Observer
     */
    interface Observer {
        /**
         * update
         * @param observable
         * @param event
         */
        update(observable: object, event: event.Event): void;
    }
}
declare namespace duice {
    /**
     * data handler class
     */
    abstract class DataHandler<T> extends Observable implements Observer {
        target: T;
        readonlyAll: boolean;
        readonly: Set<string>;
        listenerEnabled: boolean;
        /**
         * constructor
         * @protected
         */
        protected constructor();
        /**
         * set target
         * @param target
         */
        setTarget(target: T): void;
        /**
         * return target
         */
        getTarget(): T;
        /**
         * update
         * @param observable
         * @param event
         */
        abstract update(observable: object, event: event.Event): void;
        /**
         * set readonly all
         * @param readonly
         */
        setReadonlyAll(readonly: boolean): void;
        /**
         * set readonly
         * @param property
         * @param readonly
         */
        setReadonly(property: string, readonly: boolean): void;
        /**
         * return whether readonly is
         * @param property
         */
        isReadonly(property: string): boolean;
        /**
         * suspends listener
         */
        suspendListener(): void;
        /**
         * resumes listener
         */
        resumeListener(): void;
        /**
         * executes listener
         * @param listener
         * @param event
         */
        checkListener(listener: Function, event: event.Event): Promise<boolean>;
    }
}
declare namespace duice.event {
    /**
     * Event
     */
    class Event {
        source: any;
        /**
         * constructor
         * @param source
         */
        constructor(source: any);
    }
}
declare namespace duice.event {
    /**
     * RowMoveEvent
     */
    class RowMoveEvent extends Event {
        fromIndex: number;
        toIndex: number;
        /**
         * constructor
         * @param source
         * @param fromIndex
         * @param toIndex
         */
        constructor(source: any, fromIndex: number, toIndex: number);
        /**
         * getFromIndex
         */
        getFromIndex(): number;
        /**
         * getToIndex
         */
        getToIndex(): number;
    }
}
declare namespace duice {
    /**
     * array handler class
     */
    class ArrayHandler extends DataHandler<ArrayProxy> {
        propertyChangingListener: Function;
        propertyChangedListener: Function;
        rowInsertingListener: Function;
        rowInsertedListener: Function;
        rowDeletingListener: Function;
        rowDeletedListener: Function;
        /**
         * constructor
         */
        constructor();
        /**
         * get
         * @param target
         * @param property
         * @param receiver
         */
        get(target: ArrayProxy, property: string, receiver: object): any;
        /**
         * set
         * @param target
         * @param property
         * @param value
         */
        set(target: ArrayProxy, property: string, value: any): boolean;
        /**
         * update
         * @param observable
         * @param event
         */
        update(observable: Observable, event: event.Event): Promise<void>;
    }
}
declare namespace duice {
    /**
     * custom element
     */
    abstract class CustomElement extends DataElement<HTMLElement> {
        /**
         * constructor
         * @param htmlElement
         * @param context
         */
        protected constructor(htmlElement: HTMLElement, context: object);
        /**
         * set object data
         * @param objectName
         */
        setObject(objectName: string): void;
        /**
         * set array data
         * @param arrayName
         */
        setArray(arrayName: string): void;
        /**
         * render
         */
        render(): void;
        /**
         * do render template method
         * @param data
         */
        abstract doRender(data: DataProxy): HTMLElement;
        /**
         * setting style
         * @param data
         */
        doStyle(data: DataProxy): string;
        /**
         * create element
         * @param templateLiteral
         */
        createElement(templateLiteral: string): HTMLElement;
        /**
         * update
         * @param observable
         * @param event
         */
        update(observable: Observable, event: event.Event): void;
    }
}
declare namespace duice {
    /**
     * custom component factory
     */
    class CustomElementFactory extends DataElementFactory<HTMLElement> {
        static instances: CustomElementFactory[];
        tagName: string;
        elementType: Function;
        /**
         * adds factory instance
         * @param elementFactory
         */
        static addInstance(elementFactory: CustomElementFactory): void;
        /**
         * returns factory instance to be supported
         * @param htmlElement
         */
        static getInstance(htmlElement: HTMLElement): CustomElementFactory;
        /**
         * constructor
         * @param tagName
         * @param elementType
         */
        constructor(tagName: string, elementType: Function);
        /**
         * creates component
         * @param htmlElement
         * @param context
         */
        createElement(htmlElement: HTMLElement, context: object): CustomElement;
        /**
         * checks supported elements
         * @param htmlElement
         */
        support(htmlElement: HTMLElement): boolean;
    }
}
declare namespace duice.format {
    class FormatFactory {
        /**
         * return format instance
         * @param format
         */
        static getFormat(format: string): Format;
    }
}
declare namespace duice {
    /**
     * object element class
     */
    class ObjectElement<T extends HTMLElement> extends DataElement<T> {
        property: string;
        format: format.Format;
        /**
         * constructor
         * @param htmlElement
         * @param context
         */
        constructor(htmlElement: T, context: object);
        /**
         * set object
         * @param objectName
         */
        setObject(objectName: string): void;
        /**
         * set property
         * @param property
         */
        setProperty(property: string): void;
        /**
         * return property
         */
        getProperty(): string;
        /**
         * set format
         * @param format
         */
        setFormat(format: string): void;
        /**
         * return format
         */
        getFormat(): format.Format;
        /**
         * render
         */
        render(): void;
        /**
         * update event received
         * @param observable
         * @param event
         */
        update(observable: Observable, event: event.Event): void;
        /**
         * set value
         * @param value
         */
        setValue(value: any): void;
        /**
         * return value
         */
        getValue(): any;
        /**
         * set readonly
         * @param readonly
         */
        setReadonly(readonly: boolean): void;
        /**
         * return index
         */
        getIndex(): number;
        /**
         * focus
         */
        focus(): boolean;
    }
}
declare namespace duice {
    /**
     * object element factory class
     */
    class ObjectElementFactory<T extends HTMLElement> extends DataElementFactory<T> {
        static defaultInstance: ObjectElementFactory<HTMLElement>;
        static instances: ObjectElementFactory<HTMLElement>[];
        /**
         * adds factory instance to registry
         * @param elementFactory
         */
        static addInstance(elementFactory: ObjectElementFactory<HTMLElement>): void;
        /**
         * returns supported instance
         * @param htmlElement
         */
        static getInstance(htmlElement: HTMLElement): ObjectElementFactory<HTMLElement>;
        /**
         * check support
         * @param htmlElement
         */
        support(htmlElement: T): boolean;
        /**
         * support template method
         * @param htmlElement
         */
        doSupport(htmlElement: T): boolean;
        /**
         * create component
         * @param element
         * @param context
         */
        createElement(element: T, context: object): ObjectElement<T>;
        /**
         * template method to create component
         * @param htmlElement
         * @param context
         */
        doCreateElement(htmlElement: T, context: object): ObjectElement<T>;
    }
}
declare namespace duice.event {
    /**
     * PropertyChangeEvent
     */
    class PropertyChangeEvent extends Event {
        property: string;
        value: any;
        index: number;
        /**
         * constructor
         * @param source
         * @param property
         * @param value
         * @param index
         */
        constructor(source: any, property: string, value: any, index?: number);
        /**
         * getProperty
         */
        getProperty(): string;
        /**
         * getValue
         */
        getValue(): any;
        /**
         * getIndex
         */
        getIndex(): number;
    }
}
declare namespace duice {
    /**
     * object handler class
     */
    class ObjectHandler extends DataHandler<ObjectProxy> {
        propertyChangingListener: Function;
        propertyChangedListener: Function;
        /**
         * constructor
         */
        constructor();
        /**
         * get
         * @param target
         * @param property
         * @param receiver
         */
        get(target: object, property: string, receiver: object): any;
        /**
         * set
         * @param target
         * @param property
         * @param value
         */
        set(target: object, property: string, value: any): boolean;
        /**
         * update
         * @param observable
         * @param event
         */
        update(observable: Observable, event: event.Event): Promise<void>;
        /**
         * getValue
         * @param property
         */
        getValue(property: string): any;
        /**
         * setValue
         * @param property
         * @param value
         */
        setValue(property: string, value: any): void;
        /**
         * focus
         * @param property
         */
        focus(property: string): void;
    }
}
declare namespace duice {
    /**
     * sets namespace
     * @param value
     */
    function setNamespace(value: string): void;
    /**
     * returns alias of namespace
     */
    function getNamespace(): string;
    /**
     * returns query selector for element scan
     */
    function getElementQuerySelector(): string;
    /**
     * initializes
     * @param container
     * @param context
     */
    function initialize(container: any, context: object): void;
    /**
     * markInitialized
     * @param container
     */
    function markInitialized(container: any): void;
    /**
     * finds variable by name
     * @param context
     * @param name
     */
    function findVariable(context: object, name: string): any;
    /**
     * generates component ID
     */
    function generateId(): string;
    /**
     * checks has component attribute
     * @param htmlElement
     * @param name
     */
    function hasElementAttribute(htmlElement: HTMLElement, name: string): boolean;
    /**
     * returns element attribute
     * @param htmlElement
     * @param name
     */
    function getElementAttribute(htmlElement: HTMLElement, name: string): string;
    /**
     * set component attribute
     * @param htmlElement
     * @param name
     * @param value
     */
    function setElementAttribute(htmlElement: HTMLElement, name: string, value: string): void;
    /**
     * execute script
     * @param script
     * @param thisArg
     * @param context
     */
    function executeScript(script: string, thisArg: any, context: object): any;
    /**
     * assert
     * @param condition
     * @param message
     */
    function assert(condition: any, message?: string): void;
    /**
     * alert
     * @param message
     */
    function alert(message: string): Promise<void>;
    /**
     * confirm
     * @param message
     */
    function confirm(message: string): Promise<boolean>;
    /**
     * prompt
     * @param message
     */
    function prompt(message: string): Promise<string>;
    /**
     * open dialog
     * @param dialogElement
     */
    function openDialog(dialogElement: HTMLDialogElement): Promise<void>;
    /**
     * tab folder
     * @param tabItems
     */
    function tabFolder(...tabItems: duice.tab.TabItem[]): duice.tab.TabFolder;
    /**
     * tab item
     * @param button
     * @param content
     * @param listener
     */
    function tabItem(button: HTMLElement, content: HTMLElement, listener: Function): duice.tab.TabItem;
    /**
     * defines custom element
     * @param tagName
     * @param elementType
     */
    function defineElement(tagName: string, elementType: Function): void;
}
declare namespace duice.dialog {
    /**
     * Dialog
     */
    class Dialog {
        protected dialogElement: HTMLDialogElement;
        protected header: HTMLSpanElement;
        protected closeButton: HTMLImageElement;
        protected closeButtonImg: string;
        protected promise: Promise<any>;
        protected promiseResolve: Function;
        protected promiseReject: Function;
        /**
         * constructor
         * @param dialogElement
         */
        constructor(dialogElement: HTMLDialogElement);
        /**
         * moveToCenterPosition
         */
        moveToCenterPosition(): void;
        /**
         * getDialogElement
         */
        protected getDialogElement(): HTMLDialogElement;
        /**
         * Shows modal
         */
        protected show(): void;
        /**
         * Hides modal
         */
        protected hide(): void;
        /**
         * open
         */
        open(): Promise<any>;
        /**
         * close
         */
        protected close(...args: any[]): void;
        /**
         * resolve
         * @param args
         */
        resolve(...args: any[]): void;
        /**
         * reject
         * @param args
         */
        reject(...args: any[]): void;
    }
}
declare namespace duice.dialog {
    /**
     * AlertDialog
     */
    class AlertDialog extends Dialog {
        messagePre: HTMLPreElement;
        confirmButton: HTMLButtonElement;
        /**
         * constructor
         * @param message
         */
        constructor(message: string);
        /**
         * open
         */
        open(): Promise<any>;
        /**
         * confirm
         */
        confirm(): void;
        /**
         * close
         */
        close(): void;
    }
}
declare namespace duice.dialog {
    /**
     * Confirm
     */
    class ConfirmDialog extends Dialog {
        messagePre: HTMLPreElement;
        confirmButton: HTMLButtonElement;
        cancelButton: HTMLButtonElement;
        /**
         * constructor
         * @param message
         */
        constructor(message: string);
        /**
         * open
         */
        open(): Promise<any>;
        /**
         * close
         */
        close(...args: any[]): void;
        /**
         * confirm
         */
        confirm(): void;
        /**
         * cancel
         */
        cancel(): void;
    }
}
declare namespace duice.dialog {
    /**
     * PromptDialog
     */
    class PromptDialog extends Dialog {
        messagePre: HTMLPreElement;
        promptInput: HTMLInputElement;
        confirmButton: HTMLButtonElement;
        cancelButton: HTMLButtonElement;
        /**
         * constructor
         * @param message
         */
        constructor(message: string);
        /**
         * open
         */
        open(): Promise<any>;
        /**
         * close
         */
        close(...args: any[]): void;
        /**
         * confirm
         */
        confirm(value: string): void;
        /**
         * cancel
         */
        cancel(): void;
    }
}
declare namespace duice.component {
    /**
     * image element factory class
     */
    class ImgElementFactory extends ObjectElementFactory<HTMLImageElement> {
        /**
         * creates component
         * @param element
         * @param context
         */
        doCreateElement(element: HTMLImageElement, context: object): ImgElement;
        /**
         * returns supported
         * @param element
         */
        doSupport(element: HTMLElement): boolean;
    }
}
declare namespace duice.component {
    /**
     * input element component
     */
    class InputElement extends ObjectElement<HTMLInputElement> {
        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLInputElement, context: object);
        /**
         * set value
         * @param value
         */
        setValue(value: any): void;
        /**
         * return value
         */
        getValue(): any;
        /**
         * set readonly
         * @param readonly
         */
        setReadonly(readonly: boolean): void;
        /**
         * focus
         */
        focus(): boolean;
    }
}
declare namespace duice.component {
    /**
     * InputCheckboxElement
     */
    class InputCheckboxElement extends InputElement {
        trueValue: any;
        falseValue: any;
        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLInputElement, context: object);
        /**
         * set value
         * @param value
         */
        setValue(value: any): void;
        /**
         * get value
         */
        getValue(): any;
        /**
         * set readonly
         * @param readonly
         */
        setReadonly(readonly: boolean): void;
    }
}
declare namespace duice.component {
    /**
     * input element factory class
     */
    class InputElementFactory extends ObjectElementFactory<HTMLInputElement> {
        /**
         * creates component
         * @param element
         * @param context
         */
        doCreateElement(element: HTMLInputElement, context: object): InputElement;
        /**
         * check supported
         * @param element
         */
        doSupport(element: HTMLElement): boolean;
    }
}
declare namespace duice.format {
    /**
     * NumberFormat
     * @param scale number
     */
    class NumberFormat implements Format {
        scale: number;
        /**
         * Constructor
         * @param scale
         */
        constructor(scale?: number);
        /**
         * Encodes number as format
         * @param number
         */
        format(number: number): string;
        /**
         * Decodes formatted value as original value
         * @param string
         */
        parse(string: string): number;
    }
}
declare namespace duice.component {
    /**
     * input number element component
     */
    class InputNumberElement extends InputElement {
        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLInputElement, context: object);
        /**
         * return value
         */
        getValue(): any;
    }
}
declare namespace duice.component {
    /**
     * input radio element component
     */
    class InputRadioElement extends InputElement {
        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLInputElement, context: object);
        /**
         * set value
         * @param value
         */
        setValue(value: any): void;
        /**
         * return value
         */
        getValue(): any;
        /**
         * set readonly
         * @param readonly
         */
        setReadonly(readonly: boolean): void;
    }
}
declare namespace duice.component {
    class Pagination extends duice.CustomElement {
        doRender(object: ObjectProxy): HTMLElement;
        doStyle(object: ObjectProxy): string;
    }
}
declare namespace duice.component {
    /**
     * select element component
     */
    class SelectElement extends ObjectElement<HTMLSelectElement> {
        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLSelectElement, context: object);
        /**
         * set value
         * @param value
         */
        setValue(value: any): void;
        /**
         * return value
         */
        getValue(): any;
        /**
         * set readonly
         * @param readonly
         */
        setReadonly(readonly: boolean): void;
    }
}
declare namespace duice.component {
    /**
     * select element factory class
     */
    class SelectElementFactory extends ObjectElementFactory<HTMLSelectElement> {
        /**
         * create component
         * @param element
         * @param context
         */
        doCreateElement(element: HTMLSelectElement, context: object): SelectElement;
        /**
         * return supported
         * @param element
         */
        doSupport(element: HTMLElement): boolean;
    }
}
declare namespace duice.component {
    /**
     * textarea element component
     */
    class TextareaElement extends ObjectElement<HTMLTextAreaElement> {
        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLTextAreaElement, context: object);
        /**
         * set value
         * @param value
         */
        setValue(value: any): void;
        /**
         * return value
         */
        getValue(): any;
        /**
         * set readonly
         * @param readonly
         */
        setReadonly(readonly: boolean): void;
    }
}
declare namespace duice.component {
    /**
     * textarea element factory class
     */
    class TextareaElementFactory extends ObjectElementFactory<HTMLTextAreaElement> {
        /**
         * creates component
         * @param element
         * @param context
         */
        doCreateElement(element: HTMLTextAreaElement, context: object): TextareaElement;
        /**
         * returns supported
         * @param element
         */
        doSupport(element: HTMLElement): boolean;
    }
}
declare namespace duice.event {
    /**
     * RowInsertEvent
     */
    class RowInsertEvent extends Event {
        index: number;
        rows: object[];
        /**
         * constructor
         * @param source
         * @param index
         */
        constructor(source: any, index: number, rows: object[]);
        /**
         * return index
         */
        getIndex(): number;
        /**
         * getRows
         */
        getRows(): object[];
    }
}
declare namespace duice.event {
    /**
     * RowDeleteEvent
     */
    class RowDeleteEvent extends Event {
        index: number;
        rows: object[];
        /**
         * constructor
         * @param source
         * @param index
         */
        constructor(source: any, index: number, rows: object[]);
        /**
         * return index
         */
        getIndex(): number;
        /**
         * getRows
         */
        getRows(): object[];
    }
}
declare namespace duice.format {
    /**
     * date format
     */
    class DateFormat implements Format {
        pattern: string;
        patternRex: RegExp;
        /**
         * Constructor
         * @param pattern
         */
        constructor(pattern: string);
        /**
         * Encodes date string
         * @param string
         */
        format(string: string): string;
        /**
         * Decodes formatted date string to ISO date string.
         * @param string
         */
        parse(string: string): string;
    }
}
declare namespace duice.format {
    /**
     * format interface
     */
    interface Format {
        /**
         * Encodes original value as formatted value
         * @param value value
         * @return formatted value
         */
        format(value: any): any;
        /**
         * Decodes formatted value to original value
         * @param value value
         * @return original value
         */
        parse(value: any): any;
    }
}
declare namespace duice.format {
    /**
     * StringFormat
     * @param string format
     */
    class StringFormat implements Format {
        pattern: string;
        /**
         * Constructor
         * @param pattern
         */
        constructor(pattern: string);
        /**
         * encode string as format
         * @param value
         */
        format(value: string): string;
        /**
         * decodes string as format
         * @param value
         */
        parse(value: string): string;
    }
}
declare namespace duice.tab {
    class TabItem {
        button: HTMLElement;
        content: HTMLElement;
        listener: Function;
        tabFolder: TabFolder;
        tabIndex: number;
        /**
         * constructor
         * @param button
         * @param content
         * @param listener
         */
        constructor(button: HTMLElement, content: HTMLElement, listener: Function);
        /**
         * set tab folder
         * @param tabFolder
         */
        setTabFolder(tabFolder: TabFolder): void;
        /**
         * set tab index
         * @param tabIndex
         */
        setTabIndex(tabIndex: number): void;
        /**
         * set active
         * @param active
         */
        setActive(active: boolean): void;
    }
}
declare namespace duice.tab {
    class TabFolder {
        items: TabItem[];
        addItem(item: TabItem): void;
        setActive(index: number): void;
    }
}
declare namespace duice {
    /**
     * object proxy class
     */
    class ObjectProxy extends globalThis.Object implements DataProxy {
        /**
         * constructor
         */
        constructor(object: globalThis.Object);
        /**
         * clear
         * @param objectProxy
         */
        static clear(objectProxy: ObjectProxy): void;
        /**
         * assign
         * @param objectProxy
         * @param object
         */
        static assign(objectProxy: ObjectProxy, object: object): void;
        /**
         * setTarget
         * @param objectProxy
         * @param target
         */
        static setTarget(objectProxy: ObjectProxy, target: object): void;
        /**
         * getTarget
         * @param objectProxy
         */
        static getTarget(objectProxy: ObjectProxy): any;
        /**
         * setHandler
         * @param objectProxy
         * @param objectHandler
         */
        static setHandler(objectProxy: ObjectProxy, objectHandler: ObjectHandler): void;
        /**
         * getHandler
         * @param objectProxy
         */
        static getHandler(objectProxy: ObjectProxy): ObjectHandler;
        /**
         * save
         * @param objectProxy
         */
        static save(objectProxy: ObjectProxy): void;
        /**
         * reset
         * @param objectProxy
         */
        static reset(objectProxy: ObjectProxy): void;
        /**
         * onPropertyChanging
         * @param objectProxy
         * @param listener
         */
        static onPropertyChanging(objectProxy: ObjectProxy, listener: Function): void;
        /**
         * onPropertyChanged
         * @param objectProxy
         * @param listener
         */
        static onPropertyChanged(objectProxy: ObjectProxy, listener: Function): void;
        /**
         * setReadonly
         * @param objectProxy
         * @param property
         * @param readonly
         */
        static setReadonly(objectProxy: ObjectProxy, property: string, readonly: boolean): void;
        /**
         * isReadonly
         * @param objectProxy
         * @param property
         */
        static isReadonly(objectProxy: ObjectProxy, property: string): boolean;
        /**
         * setReadonlyAll
         * @param objectProxy
         * @param readonly
         */
        static setReadonlyAll(objectProxy: ObjectProxy, readonly: boolean): void;
        /**
         * focus
         * @param objectProxy
         * @param property
         */
        static focus(objectProxy: ObjectProxy, property: string): void;
    }
}
declare namespace duice {
    /**
     * array proxy class
     */
    class ArrayProxy extends globalThis.Array implements DataProxy {
        /**
         * constructor
         */
        constructor(array?: object[]);
        /**
         * clear
         * @param arrayProxy
         */
        static clear(arrayProxy: ArrayProxy): void;
        /**
         * assign
         * @param arrayProxy
         * @param array
         */
        static assign(arrayProxy: ArrayProxy, array: object[]): void;
        /**
         * setTarget
         * @param arrayProxy
         * @param target
         */
        static setTarget(arrayProxy: ArrayProxy, target: object): void;
        /**
         * getTarget
         * @param arrayProxy
         */
        static getTarget(arrayProxy: ArrayProxy): any;
        /**
         * setHandler
         * @param arrayProxy
         * @param arrayHandler
         */
        static setHandler(arrayProxy: ArrayProxy, arrayHandler: ArrayHandler): void;
        /**
         * getHandler
         * @param arrayProxy
         */
        static getHandler(arrayProxy: ArrayProxy): ArrayHandler;
        /**
         * save
         * @param arrayProxy
         */
        static save(arrayProxy: ArrayProxy): void;
        /**
         * reset
         * @param arrayProxy
         */
        static reset(arrayProxy: ArrayProxy): void;
        /**
         * onPropertyChanging
         * @param arrayProxy
         * @param listener
         */
        static onPropertyChanging(arrayProxy: ArrayProxy, listener: Function): void;
        /**
         * onPropertyChanged
         * @param arrayProxy
         * @param listener
         */
        static onPropertyChanged(arrayProxy: ArrayProxy, listener: Function): void;
        /**
         * onRowInserting
         * @param arrayProxy
         * @param listener
         */
        static onRowInserting(arrayProxy: ArrayProxy, listener: Function): void;
        /**
         * onRowInserted
         * @param arrayProxy
         * @param listener
         */
        static onRowInserted(arrayProxy: ArrayProxy, listener: Function): void;
        /**
         * onRowDeleting
         * @param arrayProxy
         * @param listener
         */
        static onRowDeleting(arrayProxy: ArrayProxy, listener: Function): void;
        /**
         * onRowDeleted
         * @param arrayProxy
         * @param listener
         */
        static onRowDeleted(arrayProxy: ArrayProxy, listener: Function): void;
        /**
         * setReadonly
         * @param arrayProxy
         * @param property
         * @param readonly
         */
        static setReadonly(arrayProxy: ArrayProxy, property: string, readonly: boolean): void;
        /**
         * isReadonly
         * @param arrayProxy
         * @param property
         */
        static isReadonly(arrayProxy: ArrayProxy, property: string): boolean;
        /**
         * setReadonlyAll
         * @param arrayProxy
         * @param readonly
         */
        static setReadonlyAll(arrayProxy: ArrayProxy, readonly: boolean): void;
        /**
         * insertRow
         * @param index
         * @param rows
         */
        insertRow(index: number, ...rows: object[]): Promise<void>;
        /**
         * deleteRow
         * @param index
         * @param size
         */
        deleteRow(index: number, size?: number): Promise<void>;
        /**
         * appendRow
         * @param rows
         */
        appendRow(...rows: object[]): Promise<void>;
    }
}
declare namespace duice {
    /**
     * data interface (object,array)
     */
    interface DataProxy {
    }
}
declare namespace duice.component {
    /**
     * image element component
     */
    class ImgElement extends ObjectElement<HTMLImageElement> {
        originSrc: string;
        editable: boolean;
        width: number;
        height: number;
        clearButton: HTMLImageElement;
        closeButtonImg: string;
        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLImageElement, context: object);
        /**
         * show clear image button
         */
        showClearImageButton(): void;
        /**
         * hide clear image button
         */
        hideClearImageButton(): void;
        /**
         * clear image
         */
        clearImage(): void;
        /**
         * open image
         */
        changeImage(): void;
        /**
         * convert image
         * @param dataUrl
         * @param width
         * @param height
         */
        convertImage(dataUrl: any, width?: number, height?: number): Promise<unknown>;
        /**
         * set value
         * @param value
         */
        setValue(value: any): void;
        /**
         * return value
         */
        getValue(): any;
        /**
         * set readonly
         * @param readonly
         */
        setReadonly(readonly: boolean): void;
    }
}
declare namespace duice.component {
    /**
     * input datetime-local element component
     */
    class InputDatetimeLocalElement extends InputElement {
        dateFormat: duice.format.DateFormat;
        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLInputElement, context: object);
        /**
         * set value
         * @param value
         */
        setValue(value: string): void;
        /**
         * return value
         */
        getValue(): any;
    }
}
