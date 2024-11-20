import {DataElement} from "./DataElement";
import {runExecuteCode, runIfCode} from "./commons";
import {Initializer} from "./Initializer";
import {Observable} from "./Observable";
import {DataHandler} from "./DataHandler";
import {DataEvent} from "./event/DataEvent";

export abstract class CustomElement<V> extends DataElement<HTMLElement, V> {

    protected constructor(htmlElement: HTMLElement, bindData: V, context: object) {
        super(htmlElement, bindData, context);
    }

    override render(): void {

        // do render
        this.doRender(this.getBindData());

        // check if
        runIfCode(this.getHtmlElement(), this.getContext());

        // initialize
        Initializer.initialize(this.getHtmlElement(), this.getContext());

        // execute script
        runExecuteCode(this.getHtmlElement(), this.getContext());
    }

    abstract doRender(data: V): void;

    override update(observable: Observable, event: DataEvent): void {
        if(observable instanceof DataHandler) {
            this.doUpdate(observable.getTarget() as V);
        }
    }

    abstract doUpdate(data: V): void;

}
