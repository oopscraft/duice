///<reference path="Component.ts"/>
namespace duice {

    /**
     * ArrayComponent
     */
    export abstract class ArrayComponent extends Component<object[]> {

        var: string;

        status: string;

        rowElements: HTMLElement[] = [];

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
         * doInitialize
         * @param array
         */
        override doInitialize(array: object[]): void {
            this.doUpdate(array, {});
        }

        /**
         * doUpdate
         * @param array
         * @param detail
         */
        override doUpdate(array: object[], detail: object): void {

            // clear
            this.rowElements.forEach(rowElement =>{
                this.element.removeChild(rowElement);
            });
            this.rowElements.length = 0;

            // creates row
            for(let index = 0, size = array.length; index < size; index ++ ){
                let object = new duice.Object(array[index]);
                let status = {
                    index: index,
                    length: array.length
                };
                let rowElement= this.createRowElement(object, status);
                let context = {};
                context[this.getVar()] = object;
                context[this.getStatus()] = status;
                initializeComponent(rowElement, context);
                this.element.appendChild(rowElement);
                this.rowElements.push(rowElement);
            }
        }

        /**
         * createRow
         * @param object
         */
        abstract createRowElement(object: object, status: object): HTMLElement;

    }

}