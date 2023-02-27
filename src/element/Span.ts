namespace duice.element {

    export class Span extends ObjectComponent {

        element: HTMLSpanElement;

        /**
         * create
         * @param element
         */
        static create(element: HTMLSpanElement): Span {
            return new Span(element);
        }

        /**
         * constructor
         * @param element
         */
        constructor(element: HTMLSpanElement) {
            super(element);
        }

        /**
         * doInitialize
         * @param object
         */
        override doInitialize(object: object): void {
            this.doUpdate(object, {});
        }

        /**
         * doUpdate
         * @param object
         * @param detail
         */
        override doUpdate(object: object, detail: object): void {

            // removes child nodes
            removeChildNodes(this.element);

            // set value
            let value = object[this.getProperty()];
            let textNode = document.createTextNode(value);
            this.element.appendChild(textNode);
        }

        /**
         * getValue
         */
        getValue(): any {
            let value = this.element.innerHTML;
            return value;
        }

    }

    // defines component
    defineComponent(Span, "span", `${getAlias()}-span`);


}