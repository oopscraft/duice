import {DataElementFactory} from "./DataElementFactory";
import {CustomElement} from "./CustomElement";

export abstract class CustomElementFactory<V> extends DataElementFactory<HTMLElement, V> {

    override createElement(htmlElement: HTMLElement, bindData: V, context: object): CustomElement<V> {
        return this.doCreateElement(htmlElement, bindData, context);
    }

    abstract doCreateElement(htmlElement: HTMLElement, bindData: V, context: object): CustomElement<V>;

}
