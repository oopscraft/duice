namespace duice.element {

    export class InputCheckboxElement extends InputElement {

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


    // export class InputCheckbox extends Input {
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
    //         if(value === true){
    //             this.element.checked = true;
    //         }else{
    //             this.element.checked = false;
    //         }
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
    //     override getValue(): any {
    //         return this.element.checked;
    //     }
    //
    // }

}