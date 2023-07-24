///<reference path="../DataElementRegistry.ts"/>
namespace duice.element {

    export class ImgElementFactory extends ObjectElementFactory<HTMLImageElement> {

        override createElement(element: HTMLImageElement, bindData: object, context: object): ImgElement {
            return new ImgElement(element, bindData, context);
        }

    }

    // register factory instance
    DataElementRegistry.register('img', new ImgElementFactory());

}