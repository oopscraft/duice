///<reference path="Component.ts"/>
namespace duice {

    /**
     * ArrayComponent
     */
    export abstract class ArrayComponent extends Component<object[]> {

        var: string;

        status: string;

        /**
         * constructor
         * @param element
         * @param context
         * @protected
         */
        protected constructor(element: HTMLElement) {
            console.debug("ArrayComponent.constructor", element);
            super(element);
            this.var = this.getAttribute("var");
            this.status = this.getAttribute("status");
        }

        /**
         * getVar
         */
        getVar(): string {
            return this.var;
        }

        /**
         * getStatus
         */
        getStatus(): string {
            return this.status;
        }

        /**
         * update
         * @param array
         */
        update(arrayHandler: ArrayHandler, detail: object): void {
            let array = arrayHandler.getTarget();
            for(let index = 0, size = array.length; index < size; index ++ ){
                let object = array[index];
                let status = {
                    index: index,
                    length: array.length
                };
                let rowElement= this.createRowElement(object, status);
                this.element.appendChild(rowElement);
            }
        }

        /**
         * createRow
         * @param object
         */
        abstract createRowElement(object: object, status: object): HTMLElement;


    }

}