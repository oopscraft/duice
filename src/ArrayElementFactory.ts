import {DataElementFactory} from "./DataElementFactory";
import {ArrayElement} from "./ArrayElement";

export class ArrayElementFactory<T extends HTMLElement> extends DataElementFactory<HTMLElement, object[]> {

    override createElement(htmlElement: T, bindData: object[], context: object): ArrayElement<T> {
        return new ArrayElement(htmlElement, bindData, context);
    }

}
