import {ObjectElementFactory} from "../ObjectElementFactory";
import {InputElement} from "./InputElement";
import {InputNumberElement} from "./InputNumberElement";
import {InputCheckboxElement} from "./InputCheckboxElement";
import {InputDatetimeLocalElement} from "./InputDatetimeLocalElement";
import {DataElementRegistry} from "../DataElementRegistry";
import {InputRadioElement} from "./InputRadioElement";

export class InputElementFactory extends ObjectElementFactory<HTMLInputElement> {

    static {
        // register factory instance
        DataElementRegistry.register('input', new InputElementFactory());
    }

    override createElement(element: HTMLInputElement, bindData: object, context: object): InputElement {
        let type = element.getAttribute('type');
        switch(type) {
            case 'number':
                return new InputNumberElement(element, bindData, context);
            case 'checkbox':
                return new InputCheckboxElement(element, bindData, context);
            case 'radio':
                return new InputRadioElement(element, bindData, context);
            case 'datetime-local':
                return new InputDatetimeLocalElement(element, bindData, context);
            default:
                return new InputElement(element, bindData, context);
        }
    }

}

