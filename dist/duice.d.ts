declare namespace duice {
    class Observable {
        observers: Observer[];
        notifyEnabled: boolean;
        addObserver(observer: Observer): void;
        removeObserver(observer: Observer): void;
        suspendNotify(): void;
        resumeNotify(): void;
        notifyObservers(event: event.Event): void;
    }
}
declare namespace duice {
    abstract class DataElement<T extends HTMLElement, V> extends Observable implements Observer {
        htmlElement: T;
        bindData: V;
        context: object;
        protected constructor(htmlElement: T, bindData: V, context: object);
        generateId(): string;
        getHtmlElement(): T;
        getContext(): object;
        getBindData(): V;
        abstract render(): void;
        abstract update(observable: object, event: event.Event): void;
    }
}
declare namespace duice {
    class ArrayElement<T extends HTMLElement> extends DataElement<T, object[]> {
        loop: string;
        hierarchy: string;
        editable: boolean;
        selectedItemClass: string;
        slot: HTMLSlotElement;
        itemHtmlElements: HTMLElement[];
        constructor(htmlElement: T, bindData: object[], context: object);
        render(): void;
        createItemHtmlElement(index: number, object: object, context: object): void;
        update(observable: Observable, event: event.Event): void;
    }
}
declare namespace duice {
    abstract class DataElementFactory<T extends HTMLElement, V> {
        abstract createElement(htmlElement: T, bindData: V, context: object): DataElement<HTMLElement, V>;
    }
}
declare namespace duice {
    class ArrayElementFactory<T extends HTMLElement> extends DataElementFactory<HTMLElement, object[]> {
        createElement(htmlElement: T, bindData: object[], context: object): ArrayElement<T>;
    }
}
declare namespace duice {
    interface Observer {
        update(observable: object, event: event.Event): void;
    }
}
declare namespace duice {
    abstract class DataHandler<T> extends Observable implements Observer {
        target: T;
        readonlyAll: boolean;
        readonly: Set<string>;
        disableAll: boolean;
        disable: Set<string>;
        listenerEnabled: boolean;
        protected constructor();
        setTarget(target: T): void;
        getTarget(): T;
        abstract update(observable: object, event: event.Event): void;
        setReadonlyAll(readonly: boolean): void;
        isReadonlyAll(): boolean;
        setReadonly(property: string, readonly: boolean): void;
        isReadonly(property: string): boolean;
        setDisableAll(disable: boolean): void;
        isDisableAll(): boolean;
        setDisable(property: string, disable: boolean): void;
        isDisable(property: string): boolean;
        suspendListener(): void;
        resumeListener(): void;
        checkListener(listener: Function, event: event.Event): Promise<boolean>;
    }
}
declare namespace duice.event {
    class Event {
        source: any;
        constructor(source: any);
    }
}
declare namespace duice.event {
    class ItemMoveEvent extends Event {
        fromIndex: number;
        toIndex: number;
        constructor(source: any, fromIndex: number, toIndex: number);
        getFromIndex(): number;
        getToIndex(): number;
    }
}
declare namespace duice {
    class ArrayHandler extends DataHandler<object[]> {
        propertyChangingListener: Function;
        propertyChangedListener: Function;
        rowInsertingListener: Function;
        rowInsertedListener: Function;
        rowDeletingListener: Function;
        rowDeletedListener: Function;
        selectedItemIndex: number;
        constructor();
        get(target: object[], property: string, receiver: object): any;
        set(target: ArrayProxy, property: string, value: any): boolean;
        update(observable: Observable, event: event.Event): Promise<void>;
        insertItem(arrayProxy: object[], index: number, ...rows: object[]): Promise<void>;
        deleteItem(arrayProxy: object[], index: number, size?: number): Promise<void>;
        appendItem(arrayProxy: object[], ...rows: object[]): Promise<void>;
        selectItem(index: number): void;
        getSelectedItemIndex(): number;
    }
}
declare namespace duice {
    class ArrayProxy extends globalThis.Array {
        constructor(array: object[]);
        static clear(arrayProxy: object[]): void;
        static assign(arrayProxy: object[], array: object[]): void;
        static isProxy(array: object[]): boolean;
        static setTarget(arrayProxy: object[], target: object[]): void;
        static getTarget(arrayProxy: object[]): any;
        static setHandler(arrayProxy: object[], arrayHandler: ArrayHandler): void;
        static getHandler(arrayProxy: object[]): ArrayHandler;
        static save(arrayProxy: object[]): void;
        static reset(arrayProxy: object[]): void;
        static onPropertyChanging(arrayProxy: object[], listener: Function): void;
        static onPropertyChanged(arrayProxy: object[], listener: Function): void;
        static onRowInserting(arrayProxy: object[], listener: Function): void;
        static onRowInserted(arrayProxy: object[], listener: Function): void;
        static onRowDeleting(arrayProxy: object[], listener: Function): void;
        static onRowDeleted(arrayProxy: object[], listener: Function): void;
        static setReadonly(arrayProxy: object[], property: string, readonly: boolean): void;
        static isReadonly(arrayProxy: object[], property: string): boolean;
        static setReadonlyAll(arrayProxy: object[], readonly: boolean): void;
        static isReadonlyAll(arrayProxy: object[]): boolean;
        static setDisable(arrayProxy: object[], property: string, disable: boolean): void;
        static isDisable(arrayProxy: object[], property: any): boolean;
        static setDisableAll(arrayProxy: object[], disable: boolean): void;
        static isDisableAll(arrayProxy: object[]): boolean;
        static selectItem(arrayProxy: object[], index: number): void;
        static getSelectedItemIndex(arrayProxy: object[]): number;
    }
}
declare namespace duice {
    abstract class CustomElement<V> extends DataElement<HTMLElement, V> {
        protected constructor(htmlElement: HTMLElement, bindData: V, context: object);
        render(): void;
        abstract doRender(data: V): void;
        update(observable: Observable, event: event.Event): void;
        abstract doUpdate(data: V): void;
    }
}
declare namespace duice {
    abstract class CustomElementFactory<V> extends DataElementFactory<HTMLElement, V> {
        createElement(htmlElement: HTMLElement, bindData: V, context: object): CustomElement<V>;
        abstract doCreateElement(htmlElement: HTMLElement, bindData: V, context: object): CustomElement<V>;
    }
}
declare namespace duice {
    class ObjectElementFactory<T extends HTMLElement> extends DataElementFactory<T, object> {
        createElement(htmlElement: T, bindData: object, context: object): ObjectElement<T>;
    }
}
declare namespace duice {
    class DataElementRegistry {
        static defaultObjectElementFactory: ObjectElementFactory<HTMLElement>;
        static defaultArrayElementFactory: ArrayElementFactory<HTMLElement>;
        static objectElementFactories: Map<string, ObjectElementFactory<HTMLElement>>;
        static arrayElementFactories: Map<string, ArrayElementFactory<HTMLElement>>;
        static customElementFactories: Map<string, CustomElementFactory<any>>;
        static register(tagName: string, dataElementFactory: DataElementFactory<HTMLElement, any>): void;
        static getFactory(htmlElement: HTMLElement, bindData: any, context: object): DataElementFactory<HTMLElement, any>;
    }
}
declare namespace duice.format {
    class FormatFactory {
        static getFormat(format: string): Format;
    }
}
declare namespace duice {
    class ObjectElement<T extends HTMLElement> extends DataElement<T, object> {
        property: string;
        format: format.Format;
        constructor(htmlElement: T, bindData: object, context: object);
        getProperty(): string;
        getFormat(): format.Format;
        render(): void;
        checkIf(): void;
        executeScript(): void;
        update(observable: Observable, event: event.Event): void;
        setValue(value: any): void;
        getValue(): any;
        setReadonly(readonly: boolean): void;
        setDisable(disable: boolean): void;
        getIndex(): number;
        focus(): boolean;
    }
}
declare namespace duice.event {
    class PropertyChangeEvent extends Event {
        property: string;
        value: any;
        index: number;
        constructor(source: any, property: string, value: any, index?: number);
        getProperty(): string;
        getValue(): any;
        getIndex(): number;
    }
}
declare namespace duice {
    class ObjectHandler extends DataHandler<object> {
        propertyChangingListener: Function;
        propertyChangedListener: Function;
        constructor();
        get(target: object, property: string, receiver: object): any;
        set(target: object, property: string, value: any): boolean;
        update(observable: Observable, event: event.Event): Promise<void>;
        getValue(property: string): any;
        setValue(property: string, value: any): void;
        focus(property: string): void;
    }
}
declare namespace duice {
    class ObjectProxy extends globalThis.Object {
        constructor(object: object);
        static clear(objectProxy: object): void;
        static assign(objectProxy: object, object: object): void;
        static isProxy(object: object): boolean;
        static setTarget(objectProxy: object, target: object): void;
        static getTarget(objectProxy: object): any;
        static setHandler(objectProxy: object, objectHandler: ObjectHandler): void;
        static getHandler(objectProxy: object): ObjectHandler;
        static save(objectProxy: object): void;
        static reset(objectProxy: object): void;
        static onPropertyChanging(objectProxy: object, listener: Function): void;
        static onPropertyChanged(objectProxy: object, listener: Function): void;
        static setReadonly(objectProxy: object, property: string, readonly: boolean): void;
        static isReadonly(objectProxy: object, property: string): boolean;
        static setReadonlyAll(objectProxy: object, readonly: boolean): void;
        static isReadonlyAll(objectProxy: object): boolean;
        static setDisable(objectProxy: object, property: string, disable: boolean): void;
        static isDisable(objectProxy: object, property: string): boolean;
        static setDisableAll(objectProxy: object, disable: boolean): void;
        static isDisableAll(objectProxy: object): boolean;
        static focus(objectProxy: object, property: string): void;
    }
}
declare namespace duice {
    function setNamespace(value: string): void;
    function getNamespace(): string;
    function getElementQuerySelector(): string;
    function initialize(container: any, context: object, index?: number): void;
    function markInitialized(container: any): void;
    function findVariable(context: object, name: string): any;
    function runCode(code: string, htmlElement: HTMLElement, context: object): boolean;
    function runIfCode(htmlElement: HTMLElement, context: object): void;
    function runExecuteCode(htmlElement: HTMLElement, context: object): void;
    function hasElementAttribute(htmlElement: HTMLElement, name: string): boolean;
    function getElementAttribute(htmlElement: HTMLElement, name: string): string;
    function setElementAttribute(htmlElement: HTMLElement, name: string, value: string): void;
    function assert(condition: any, message?: string): void;
    function alert(message: string): Promise<void>;
    function confirm(message: string): Promise<boolean>;
    function prompt(message: string, type?: string): Promise<string>;
    function openDialog(dialogElement: HTMLDialogElement): Promise<void>;
    function tabFolder(...tabItems: duice.tab.TabItem[]): duice.tab.TabFolder;
    function tabItem(button: HTMLElement, content: HTMLElement, listener: Function): duice.tab.TabItem;
}
declare namespace duice.dialog {
    class Dialog {
        protected dialogElement: HTMLDialogElement;
        protected header: HTMLSpanElement;
        protected closeButton: HTMLSpanElement;
        protected promise: Promise<any>;
        protected promiseResolve: Function;
        protected promiseReject: Function;
        constructor(dialogElement: HTMLDialogElement);
        moveToCenterPosition(): void;
        protected getDialogElement(): HTMLDialogElement;
        protected show(): void;
        protected hide(): void;
        open(): Promise<any>;
        protected close(...args: any[]): void;
        resolve(...args: any[]): void;
        reject(...args: any[]): void;
    }
}
declare namespace duice.dialog {
    class AlertDialog extends Dialog {
        messagePre: HTMLPreElement;
        confirmButton: HTMLButtonElement;
        constructor(message: string);
        open(): Promise<any>;
        confirm(): void;
        close(): void;
    }
}
declare namespace duice.dialog {
    class ConfirmDialog extends Dialog {
        messagePre: HTMLPreElement;
        confirmButton: HTMLButtonElement;
        cancelButton: HTMLButtonElement;
        constructor(message: string);
        open(): Promise<any>;
        close(...args: any[]): void;
        confirm(): void;
        cancel(): void;
    }
}
declare namespace duice.dialog {
    class PromptDialog extends Dialog {
        messagePre: HTMLPreElement;
        promptInput: HTMLInputElement;
        confirmButton: HTMLButtonElement;
        cancelButton: HTMLButtonElement;
        constructor(message: string, type?: string);
        open(): Promise<any>;
        close(...args: any[]): void;
        confirm(value: string): void;
        cancel(): void;
    }
}
declare namespace duice.element {
    class ImgElement extends ObjectElement<HTMLImageElement> {
        originSrc: string;
        editable: boolean;
        width: number;
        height: number;
        clearButton: HTMLImageElement;
        closeButtonImg: string;
        constructor(element: HTMLImageElement, bindData: object, context: object);
        showClearImageButton(): void;
        hideClearImageButton(): void;
        clearImage(): void;
        changeImage(): void;
        convertImage(dataUrl: any, width?: number, height?: number): Promise<unknown>;
        setValue(value: any): void;
        getValue(): any;
        setReadonly(readonly: boolean): void;
        setDisable(disable: boolean): void;
    }
}
declare namespace duice.element {
    class ImgElementFactory extends ObjectElementFactory<HTMLImageElement> {
        createElement(element: HTMLImageElement, bindData: object, context: object): ImgElement;
    }
}
declare namespace duice.element {
    class InputElement extends ObjectElement<HTMLInputElement> {
        constructor(element: HTMLInputElement, bindData: object, context: object);
        setValue(value: any): void;
        getValue(): any;
        setReadonly(readonly: boolean): void;
        setDisable(disable: boolean): void;
        focus(): boolean;
    }
}
declare namespace duice.element {
    class InputCheckboxElement extends InputElement {
        trueValue: any;
        falseValue: any;
        constructor(element: HTMLInputElement, bindData: object, context: object);
        setValue(value: any): void;
        getValue(): any;
        setReadonly(readonly: boolean): void;
    }
}
declare namespace duice.format {
    class NumberFormat implements Format {
        scale: number;
        constructor(scale?: number);
        format(number: number): string;
        parse(string: string): number;
    }
}
declare namespace duice.element {
    class InputDatetimeLocalElement extends InputElement {
        dateFormat: duice.format.DateFormat;
        constructor(element: HTMLInputElement, bindData: object, context: object);
        setValue(value: string): void;
        getValue(): any;
    }
}
declare namespace duice.element {
    class InputElementFactory extends ObjectElementFactory<HTMLInputElement> {
        createElement(element: HTMLInputElement, bindData: object, context: object): InputElement;
    }
}
declare namespace duice.element {
    class InputNumberElement extends InputElement {
        constructor(element: HTMLInputElement, bindData: object, context: object);
        getValue(): any;
    }
}
declare namespace duice.element {
    class InputRadioElement extends InputElement {
        constructor(element: HTMLInputElement, bindData: object, context: object);
        setValue(value: any): void;
        getValue(): any;
        setReadonly(readonly: boolean): void;
    }
}
declare namespace duice.element {
    class SelectElement extends ObjectElement<HTMLSelectElement> {
        option: object[];
        optionValueProperty: string;
        optionTextProperty: string;
        defaultOptions: HTMLOptionElement[];
        constructor(element: HTMLSelectElement, bindData: object, context: object);
        updateOptions(): void;
        update(observable: Observable, event: event.Event): void;
        setValue(value: any): void;
        getValue(): any;
        setReadonly(readonly: boolean): void;
        setDisable(disable: boolean): void;
    }
}
declare namespace duice.element {
    class SelectElementFactory extends ObjectElementFactory<HTMLSelectElement> {
        createElement(element: HTMLSelectElement, bindData: object, context: object): SelectElement;
    }
}
declare namespace duice.element {
    class TextareaElement extends ObjectElement<HTMLTextAreaElement> {
        constructor(element: HTMLTextAreaElement, bindData: object, context: object);
        setValue(value: any): void;
        getValue(): any;
        setReadonly(readonly: boolean): void;
        setDisable(disable: boolean): void;
    }
}
declare namespace duice.element {
    class TextareaElementFactory extends ObjectElementFactory<HTMLTextAreaElement> {
        createElement(element: HTMLTextAreaElement, bindData: object, context: object): TextareaElement;
    }
}
declare namespace duice.event {
    class ItemInsertEvent extends Event {
        index: number;
        items: object[];
        constructor(source: any, index: number, items: object[]);
        getIndex(): number;
        getItems(): object[];
    }
}
declare namespace duice.event {
    class ItemDeleteEvent extends Event {
        index: number;
        items: object[];
        constructor(source: any, index: number, items: object[]);
        getIndex(): number;
        getItems(): object[];
    }
}
declare namespace duice.event {
    class ItemSelectEvent extends Event {
        index: number;
        constructor(source: any, index: number);
        getIndex(): number;
    }
}
declare namespace duice.format {
    class DateFormat implements Format {
        pattern: string;
        patternRex: RegExp;
        constructor(pattern: string);
        format(string: string): string;
        parse(string: string): string;
    }
}
declare namespace duice.format {
    interface Format {
        format(value: any): any;
        parse(value: any): any;
    }
}
declare namespace duice.format {
    class StringFormat implements Format {
        pattern: string;
        constructor(pattern: string);
        format(value: string): string;
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
        constructor(button: HTMLElement, content: HTMLElement, listener: Function);
        setTabFolder(tabFolder: TabFolder): void;
        setTabIndex(tabIndex: number): void;
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
