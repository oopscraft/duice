///<reference path="../DataElementRegistry.ts"/>
namespace duice.component {

    /**
     * image element factory class
     */
    export class ImgElementFactory extends ObjectElementFactory<HTMLImageElement> {

        /**
         * creates component
         * @param element
         * @param bindData
         * @param context
         */
        override doCreateElement(element: HTMLImageElement, bindData: object, context: object): ImgElement {
            return new ImgElement(element, bindData, context);
        }

    }

    // register factory instance
    DataElementRegistry.register('img', new ImgElementFactory());

}