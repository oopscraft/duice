///<reference path="../ObjectElementFactoryRegistry.ts"/>
namespace duice.component {

    /**
     * image element factory class
     */
    export class ImgElementFactory extends ObjectElementFactory<HTMLImageElement> {

        /**
         * creates component
         * @param element
         * @param context
         */
        override doCreateElement(element: HTMLImageElement, context: object): ImgElement {
            return new ImgElement(element, context);
        }

        /**
         * returns supported
         * @param element
         */
        override doSupport(element: HTMLElement): boolean {
            return (element.tagName.toLowerCase() === 'img');
        }

    }

    // register factory instance
    ObjectElementFactoryRegistry.addInstance(new ImgElementFactory());

}