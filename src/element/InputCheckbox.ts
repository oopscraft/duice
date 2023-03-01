namespace duice.element {

    export class InputCheckbox extends Input {

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
            if(value === true){
                this.element.checked = true;
            }else{
                this.element.checked = false;
            }
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
        override getValue(): any {
            return this.element.checked;
        }

    }

}