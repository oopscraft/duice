declare namespace duice {
    /**
     * ArrayProxy
     */
    class ArrayProxy extends globalThis.Array {
        /**
         * constructor
         */
        constructor(array?: object[]);
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
        static setHandler(arrayProxy: ArrayProxy, arrayHandler: ArrayProxyHandler): void;
        /**
         * getHandler
         * @param arrayProxy
         */
        static getHandler(arrayProxy: ArrayProxy): ArrayProxyHandler;
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
     * ObjectProxy
     */
    class ObjectProxy extends globalThis.Object {
        /**
         * constructor
         */
        constructor(object: object);
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
        static setHandler(objectProxy: ObjectProxy, objectHandler: ObjectProxyHandler): void;
        /**
         * getHandler
         * @param objectProxy
         */
        static getHandler(objectProxy: ObjectProxy): ObjectProxyHandler;
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
    }
}
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
         * @param enable
         */
        resumeNotify(): void;
        /**
         * notifyObservers
         * @param event
         */
        notifyObservers(event: Event): void;
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
        update(observable: object, event: Event): void;
    }
}
declare namespace duice {
    class ComponentControlFactory {
        static componentControlFactoryRegistry: ComponentControlFactory[];
        tagName: string;
        /**
         * register component factory
         * @param componentControlFactory
         */
        static registerComponentFactory(componentControlFactory: ComponentControlFactory): void;
        /**
         * getQuerySelectors
         */
        static getQuerySelectors(): string[];
        /**
         * return instance
         * @param htmlElement
         */
        static getInstance(htmlElement: HTMLElement): ComponentControlFactory;
        /**
         * constructor
         * @param tagName
         */
        constructor(tagName: string);
        /**
         * getTagName
         */
        getTagName(): string;
        /**
         * creates element
         * @param element
         * @param context
         */
        createComponentControl(element: Component, context: object): ComponentControl;
        /**
         * support
         * @param element
         */
        support(element: HTMLElement): boolean;
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
     * returns query selector expression
     */
    function getQuerySelectors(): string;
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
     * findObject
     * @param context
     * @param name
     */
    function findObject(context: object, name: string): any;
    /**
     * Generates component ID
     */
    function generateId(): string;
    /**
     * assert
     * @param condition
     * @param message
     */
    function assert(condition: any, message?: string): void;
    /**
     * hasAttribute
     * @param element
     * @param name
     */
    function hasAttribute(element: HTMLElement, name: string): boolean;
    /**
     * getAttribute
     * @param element
     * @param name
     */
    function getAttribute(element: HTMLElement, name: string): string;
    /**
     * setAttribute
     * @param element
     * @param name
     * @param value
     */
    function setAttribute(element: HTMLElement, name: string, value: string): void;
    /**
     * removeChildNodes
     * @param node
     */
    function removeChildNodes(node: Node): void;
    /**
     * execute script
     * @param script
     * @param thisArg
     * @param context
     */
    function executeScript(script: string, thisArg: any, context: object): any;
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
     * dialog
     * @param dialogElement
     */
    function dialog(dialogElement: HTMLDialogElement): Promise<void>;
    /**
     * Gets cookie value
     * @param name
     */
    function getCookie(name: string): string;
    /**
     * Sets cookie value
     * @param name
     * @param value
     * @param day
     */
    function setCookie(name: string, value: string, day: number): void;
    /**
     * Deletes cookie
     * @param name
     */
    function deleteCookie(name: string): void;
    /**
     * fetch
     * @param url
     * @param options
     * @param _bypass
     */
    function fetch(url: URL, options: any, _bypass: boolean): Promise<Response>;
    /**
     * defineComponent
     * @param tagName
     * @param constructor
     */
    function defineComponent(tagName: string, constructor: CustomElementConstructor): void;
}
declare namespace duice {
    /**
     * Dialog
     */
    class Dialog {
        protected dialogElement: HTMLDialogElement;
        protected header: HTMLSpanElement;
        protected closeButton: HTMLSpanElement;
        protected promise: Promise<any>;
        protected promiseResolve: Function;
        protected promiseReject: Function;
        /**
         * constructor
         * @param contentDiv
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
        close(): void;
        /**
         * confirm
         * @param args
         */
        resolve(...args: any[]): void;
        /**
         * close
         * @param args
         */
        reject(...args: any[]): void;
    }
}
declare namespace duice {
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
declare namespace duice {
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
         * confirm
         */
        confirm(): void;
        /**
         * cancel
         */
        cancel(): void;
        /**
         * close
         */
        close(): void;
    }
}
declare namespace duice {
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
    }
}
declare namespace duice {
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
declare namespace duice {
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
declare namespace duice {
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
declare namespace duice {
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
     * DateFormat
     */
    class DateMask implements Mask {
        pattern: string;
        patternRex: RegExp;
        /**
         * Constructor
         * @param pattern
         */
        constructor(pattern?: string);
        /**
         * Encodes date string
         * @param string
         */
        encode(string: string): string;
        /**
         * Decodes formatted date string to ISO date string.
         * @param string
         */
        decode(string: string): string;
    }
}
declare namespace duice {
    /**
     * Mask interface
     */
    interface Mask {
        /**
         * Encodes original value as formatted value
         * @param value value
         * @return formatted value
         */
        encode(value: any): any;
        /**
         * Decodes formatted value to original value
         * @param value value
         * @return original value
         */
        decode(value: any): any;
    }
}
declare namespace duice {
    class MaskFactory {
        /**
         * getMask
         * @param mask
         */
        static getMask(mask: string): Mask;
    }
}
declare namespace duice {
    /**
     * NumberFormat
     * @param scale number
     */
    class NumberMask implements Mask {
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
        encode(number: number): string;
        /**
         * Decodes formatted value as original value
         * @param string
         */
        decode(string: string): number;
    }
}
declare namespace duice {
    /**
     * StringFormat
     * @param string format
     */
    class StringMask implements Mask {
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
        encode(value: string): string;
        /**
         * decodes string as format
         * @param value
         */
        decode(value: string): string;
    }
}
declare namespace duice {
    /**
     * Component
     */
    abstract class Component extends HTMLElement {
        /**
         * constructor
         * @protected
         */
        protected constructor();
        /**
         * returns html template literal
         * @param data
         */
        abstract doRender(data: any): string;
        /**
         * return style literal
         * @param data
         */
        doStyle(data: any): string;
    }
}
declare namespace duice {
    /**
     * ComponentControl
     */
    class ComponentControl extends Observable implements Observer {
        element: Component;
        context: object;
        data: any;
        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: Component, context: object);
        /**
         * setData
         * @param objectName
         */
        setObject(objectName: string): void;
        /**
         * setArray
         * @param arrayName
         */
        setArray(arrayName: string): void;
        /**
         * check shadow DOM
         */
        isShadowDom(): boolean;
        /**
         * render
         */
        render(): void;
        /**
         * doRender
         * @param data
         */
        doRender(data: any): void;
        /**
         * update
         * @param observable
         * @param event
         */
        update(observable: Observable, event: duice.Event): void;
        /**
         * executes script
         */
        executeScript(): void;
    }
}
declare namespace duice {
    /**
     * LoopControl
     */
    class LoopControl<T extends HTMLElement> extends Observable implements Observer {
        slot: HTMLSlotElement;
        element: T;
        context: object;
        arrayProxy: ArrayProxy;
        loop: string;
        editable: boolean;
        rowElements: HTMLElement[];
        /**
         * constructor
         * @param element
         */
        constructor(element: T, context: object);
        /**
         * setArray
         * @param arrayName
         */
        setArray(arrayName: string): void;
        /**
         * setLoop
         * @param loop
         */
        setLoop(loop: string): void;
        /**
         * setEditable
         * @param editable
         */
        setEditable(editable: boolean): void;
        /**
         * render
         */
        render(): void;
        /**
         * doRender
         * @param arrayProxy
         */
        doRender(arrayProxy: ArrayProxy): void;
        /**
         * update
         * @param observable
         * @param event
         */
        update(observable: Observable, event: Event): void;
        /**
         * executes script
         */
        executeScript(): void;
    }
}
declare namespace duice {
    /**
     * ElementFactory
     */
    class LoopControlFactory<T extends LoopControl<any>> {
        /**
         * getSelectors
         */
        static getQuerySelectors(): string[];
        /**
         * get instance
         * @param element
         */
        static getInstance(element: HTMLElement): LoopControlFactory<LoopControl<any>>;
        /**
         * creates loop control
         * @param element
         */
        createLoopControl(element: HTMLElement, context: object): LoopControl<any>;
    }
}
/**
 * DuicePagination
 */
declare namespace duice {
    class PaginationComponent extends duice.Component {
        constructor();
        doRender(data: any): string;
    }
}
declare namespace duice {
    /**
     * ElementControl
     */
    abstract class ElementControl<T extends HTMLElement> extends Observable implements Observer {
        slot: HTMLSlotElement;
        element: T;
        context: object;
        objectProxy: ObjectProxy;
        property: string;
        mask: Mask;
        /**
         * constructor
         * @param element
         * @protected
         */
        protected constructor(element: T, context: object);
        /**
         * set object
         * @param objectName
         */
        setObject(objectName: string): void;
        /**
         * returns element
         */
        getElement(): T;
        /**
         * set property
         * @param property
         */
        setProperty(property: string): void;
        /**
         * get property
         */
        getProperty(): string;
        /**
         * set mask
         * @param mask string from html mask attribute
         */
        setMask(mask: string): void;
        /**
         * returns mask
         */
        getMask(): Mask;
        /**
         * render
         */
        render(): void;
        /**
         * update
         * @param observable
         * @param event
         */
        update(observable: Observable, event: Event): void;
        /**
         * setValue
         * @param value
         */
        abstract setValue(value: any): void;
        /**
         * getValue
         */
        abstract getValue(): any;
        /**
         * executes script
         */
        executeScript(): void;
        /**
         * getIndex
         */
        getIndex(): number;
        /**
         * setReadonly
         * @param readonly
         */
        abstract setReadonly(readonly: boolean): void;
    }
}
declare namespace duice {
    /**
     * ElementControlFactory
     */
    abstract class ElementControlFactory<T extends ElementControl<any>> {
        static controlFactoryRegistry: ElementControlFactory<ElementControl<any>>[];
        /**
         * register control factory
         * @param controlFactory
         */
        static registerControlFactory(controlFactory: ElementControlFactory<ElementControl<any>>): void;
        /**
         * getSelectors
         */
        static getQuerySelectors(): string[];
        /**
         * get instance
         * @param element
         */
        static getInstance(element: HTMLElement): ElementControlFactory<ElementControl<any>>;
        /**
         * creates element control
         * @param element
         * @param context
         */
        createElementControl(element: HTMLElement, context: object): ElementControl<any>;
        /**
         * support
         * @param element
         */
        abstract support(element: HTMLElement): boolean;
        /**
         * doCreateControl
         * @param element
         * @param context
         */
        abstract doCreateControl(element: HTMLElement, context: object): ElementControl<any>;
    }
}
declare namespace duice {
    /**
     * GenericElementControl
     */
    class GenericElementControl extends ElementControl<HTMLElement> {
        textNode: Node;
        /**
         * constructor
         * @param element
         */
        constructor(element: HTMLElement, context: object);
        /**
         * setValue
         * @param value
         */
        setValue(value: any): void;
        /**
         * getValue
         */
        getValue(): any;
        /**
         * setReadonly
         * @param readonly
         */
        setReadonly(readonly: boolean): void;
    }
}
declare namespace duice {
    /**
     * GenericElementControlFactory
     */
    class GenericElementControlFactory extends ElementControlFactory<GenericElementControl> {
        /**
         * doCreateElement
         * @param element
         * @param context
         */
        doCreateControl(element: HTMLElement, context: object): GenericElementControl;
        /**
         * support
         * @param element
         */
        support(element: HTMLElement): boolean;
    }
}
declare namespace duice {
    /**
     * InputElementControl
     */
    class InputElementControl extends ElementControl<HTMLInputElement> {
        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLInputElement, context: object);
        /**
         * setValue
         * @param value
         */
        setValue(value: any): void;
        /**
         * getValue
         */
        getValue(): any;
        /**
         * setReadonly
         * @param readonly
         */
        setReadonly(readonly: boolean): void;
    }
}
declare namespace duice {
    /**
     * InputNumberElementControl
     */
    class InputNumberElementControl extends InputElementControl {
        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLInputElement, context: object);
        /**
         * getValue
         */
        getValue(): any;
    }
}
declare namespace duice {
    /**
     * InputCheckboxElementControl
     */
    class InputCheckboxElementControl extends InputElementControl {
        trueValue: any;
        falseValue: any;
        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLInputElement, context: object);
        /**
         * setValue
         * @param value
         */
        setValue(value: any): void;
        /**
         * getValue
         */
        getValue(): any;
        /**
         * setReadonly
         * @param readonly
         */
        setReadonly(readonly: boolean): void;
    }
}
declare namespace duice {
    /**
     * InputRadioElementControl
     */
    class InputRadioElementControl extends InputElementControl {
        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLInputElement, context: object);
        /**
         * setValue
         * @param value
         */
        setValue(value: any): void;
        /**
         * getValue
         */
        getValue(): any;
        /**
         * setReadonly
         * @param readonly
         */
        setReadonly(readonly: boolean): void;
    }
}
declare namespace duice {
    /**
     * SelectElementControl
     */
    class SelectElementControl extends ElementControl<HTMLSelectElement> {
        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLSelectElement, context: object);
        /**
         * setValue
         * @param value
         */
        setValue(value: any): void;
        /**
         * getValue
         */
        getValue(): any;
        /**
         * setReadonly
         * @param readonly
         */
        setReadonly(readonly: boolean): void;
    }
}
declare namespace duice {
    /**
     * TextareaElementControl
     */
    class TextareaElementControl extends ElementControl<HTMLTextAreaElement> {
        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLTextAreaElement, context: object);
        /**
         * setValue
         * @param value
         */
        setValue(value: any): void;
        /**
         * getValue
         */
        getValue(): any;
        /**
         * setReadonly
         * @param readonly
         */
        setReadonly(readonly: boolean): void;
    }
}
declare namespace duice {
    /**
     * TextareaElementControlFactory
     */
    class TextareaElementControlFactory extends ElementControlFactory<TextareaElementControl> {
        /**
         * doCreateElement
         * @param element
         * @param context
         */
        doCreateControl(element: HTMLTextAreaElement, context: object): TextareaElementControl;
        /**
         * support
         * @param element
         */
        support(element: HTMLElement): boolean;
    }
}
declare namespace duice {
    /**
     * InputElementControlFactory
     */
    class InputElementControlFactory extends ElementControlFactory<InputElementControl> {
        /**
         * doCreateElement
         * @param element
         * @param context
         */
        doCreateControl(element: HTMLInputElement, context: object): InputElementControl;
        /**
         * support
         * @param element
         */
        support(element: HTMLElement): boolean;
    }
}
declare namespace duice {
    /**
     * SelectElementControlFactory
     */
    class SelectElementControlFactory extends ElementControlFactory<SelectElementControl> {
        /**
         * doCreateElement
         * @param element
         * @param context
         */
        doCreateControl(element: HTMLSelectElement, context: object): SelectElementControl;
        /**
         * support
         * @param element
         */
        support(element: HTMLElement): boolean;
    }
}
declare namespace duice {
    abstract class ProxyHandler<T> extends Observable implements Observer {
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
         * setTarget
         * @param target
         */
        setTarget(target: T): void;
        /**
         * getTarget
         */
        getTarget(): T;
        /**
         * update
         * @param observable
         * @param event
         */
        abstract update(observable: object, event: Event): void;
        /**
         * setReadonlyAll
         * @param readonly
         */
        setReadonlyAll(readonly: boolean): void;
        /**
         * setReadonly
         * @param property
         * @param readonly
         */
        setReadonly(property: string, readonly: boolean): void;
        /**
         * isReadonly
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
         * checkListener
         * @param listener
         * @param event
         */
        checkListener(listener: Function, event: Event): Promise<boolean>;
    }
}
declare namespace duice {
    /**
     * ObjectHandler
     */
    class ObjectProxyHandler extends ProxyHandler<ObjectProxy> {
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
        update(observable: Observable, event: Event): Promise<void>;
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
    }
}
declare namespace duice {
    /**
     * ArrayHandler
     */
    class ArrayProxyHandler extends ProxyHandler<ArrayProxy> {
        propertyChangingListener: Function;
        propertyChangedListener: Function;
        rowInsertingListener: Function;
        rowInsertedListener: Function;
        rowDeletingListener: Function;
        rowDeletedListener: Function;
        /**
         * constructor
         * @param arrayProxy
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
         * @param elementSet
         * @param event
         */
        update(observable: Observable, event: Event): Promise<void>;
    }
}
