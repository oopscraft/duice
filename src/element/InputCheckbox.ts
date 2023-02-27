namespace duice.element {

    export class InputCheckbox extends Input {

        /**
         * constructor
         * @param element
         */
        constructor(element: HTMLInputElement) {
            super(element);
        }

        /**
         * doUpdate
         * @param object
         * @param detail
         */
        override doUpdate(object: object, detail: object): void {
            let value = object[this.property];
            if(value === true){
                this.element.checked = true;
            }else{
                this.element.checked = false;
            }
        }

        /**
         * getValue
         */
        override getValue(): any {
            return this.element.checked;
        }

    }

}