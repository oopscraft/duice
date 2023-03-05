namespace duice.element {


    export class InputNumberElement extends InputElement {

        /**
         * constructor
         * @param htmlElement
         * @param context
         */
        constructor(htmlElement: HTMLInputElement, context: object) {
            super(htmlElement, context);
        }

        doRender(data: object): void {
        }

        doUpdate(data: object, detail: object): void {
        }

    }

    // export class InputNumber extends Input {
    //
    //     /**
    //      * constructor
    //      * @param element
    //      */
    //     constructor(element: HTMLInputElement, context: object) {
    //         super(element, context);
    //     }
    //
    //     /**
    //      * render
    //      */
    //     override doRender(): void {
    //         let value = this.handler.getPropertyValue(this.getProperty());
    //         this.element.value = value;
    //     }
    //
    //     /**
    //      * update
    //      * @param detail
    //      */
    //     override doUpdate(detail: object): void {
    //         this.doRender();
    //     }
    //
    //     /**
    //      * getValue
    //      */
    //     override getValue(): number {
    //         let value = super.getValue();
    //         return Number(value);
    //     }
    //
    // }

}