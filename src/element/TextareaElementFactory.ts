import {ObjectElementFactory} from "../ObjectElementFactory";
import {TextareaElement} from "./TextareaElement";
import {DataElementRegistry} from "../DataElementRegistry";

export class TextareaElementFactory extends ObjectElementFactory<HTMLTextAreaElement> {

    static {
        // register
        DataElementRegistry.register('textarea', new TextareaElementFactory());
    }

    override createElement(element: HTMLTextAreaElement, bindData: object, context: object): TextareaElement {
        return new TextareaElement(element, bindData, context);
    }

}
