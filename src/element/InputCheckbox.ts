namespace duice.element {

    export class InputCheckbox extends Input {

        /**
         * constructor
         * @param element
         */
        constructor(element: HTMLInputElement) {
            super(element);

            // stop click event propagation
            this.element.addEventListener('click', function(event){
                event.stopPropagation();
            },true);
        }

        /**
         * getValue
         */
        override getValue(): any {
            return this.element.checked;
        }

    }

}