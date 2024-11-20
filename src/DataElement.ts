import {assert, setElementAttribute} from "./commons";
import {Observable} from "./Observable";
import {Observer} from "./Observer";
import {DataEvent} from "./event/DataEvent";

export abstract class DataElement<T extends HTMLElement, V> extends Observable implements Observer {

    htmlElement: T;

    bindData: V;

    context: object;

    protected constructor(htmlElement: T, bindData: V, context: object) {
        super();
        this.htmlElement = htmlElement;
        this.bindData = bindData;
        this.context = context;
        setElementAttribute(this.htmlElement, 'id', this.generateId());

        // bind data
        let dataHandler = globalThis.Object.getOwnPropertyDescriptor(this.bindData, '_handler_')?.value;
        assert(dataHandler, 'DataHandler is not found');
        this.addObserver(dataHandler);
        dataHandler.addObserver(this);
    }

    generateId(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    getHtmlElement(): T {
        return this.htmlElement;
    }

    getContext(): object {
        return this.context;
    }

    getBindData(): V {
        return this.bindData;
    }

    abstract render(): void;

    abstract update(observable: object, event: DataEvent): void;

}