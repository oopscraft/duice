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
         * getValue
         */
        override getValue(): number {
            let value = super.getValue();
            return Number(value);
        }

    }

}