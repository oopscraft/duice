///<reference path="../ElementControlFactory.ts"/>
namespace duice {

    /**
     * GenericElementControlFactory
     */
    export class GenericElementControlFactory extends ElementControlFactory<GenericElementControl> {

        /**
         * doCreateElement
         * @param element
         * @param context
         */
        doCreateControl(element: HTMLElement, context: object): GenericElementControl {
            return new GenericElementControl(element, context);
        }

        /**
         * support
         * @param element
         */
        support(element: HTMLElement): boolean {
            return true;
        }

    }

}