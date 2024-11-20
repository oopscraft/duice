import {ObjectElementFactory} from "../ObjectElementFactory";
import {DataElementRegistry} from "../DataElementRegistry";
import {ImgElement} from "./ImgElement";

export class ImgElementFactory extends ObjectElementFactory<HTMLImageElement> {

    static {
        // register factory instance
        DataElementRegistry.register('img', new ImgElementFactory());
    }

    override createElement(element: HTMLImageElement, bindData: object, context: object): ImgElement {
        return new ImgElement(element, bindData, context);
    }

}
