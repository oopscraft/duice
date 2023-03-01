namespace duice.element {

    export class InputNumber extends Input {

        /**
         * constructor
         * @param element
         */
        constructor(element: HTMLInputElement, context: object) {
            super(element, context);
        }

        /**
         * render
         */
        override render(): void {
            let value = this.handler.getPropertyValue(this.getProperty());
            this.element.value = value;
        }

        /**
         * update
         * @param detail
         */
        override update(detail: object): void {
            this.render();
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