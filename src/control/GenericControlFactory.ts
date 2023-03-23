///<reference path="../ControlFactory.ts"/>
namespace duice {

    /**
     * GenericElementFactory
     */
    export class GenericControlFactory extends ControlFactory<GenericControl> {

        /**
         * doCreateElement
         * @param element
         * @param context
         */
        doCreateControl(element: HTMLElement, context: object): GenericControl {
            return new GenericControl(element, context);
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