namespace duice.element {

    export class InputNumber extends Input {

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
            this.element.value = value;
        }

        /**
         * getValue
         */
        override getValue(): number {
            let value = super.getValue();
            return Number(value);
        }

    }

}