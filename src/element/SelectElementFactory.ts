import {ObjectElementFactory} from "../ObjectElementFactory";
import {SelectElement} from "./SelectElement";
import {DataElementRegistry} from "../DataElementRegistry";

export class SelectElementFactory extends ObjectElementFactory<HTMLSelectElement> {

    static {
        // register factory instance
        DataElementRegistry.register('select', new SelectElementFactory());
    }

    override createElement(element: HTMLSelectElement, bindData: object, context: object): SelectElement {
        return new SelectElement(element, bindData, context);
    }

}
