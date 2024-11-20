import {DataElementFactory} from "./DataElementFactory";
import {ObjectElement} from "./ObjectElement";

export class ObjectElementFactory<T extends HTMLElement> extends DataElementFactory<T, object> {

    override createElement(htmlElement: T, bindData: object, context: object): ObjectElement<T> {
        return new ObjectElement(htmlElement, bindData, context);
    }

}