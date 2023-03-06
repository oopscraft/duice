namespace duice {

    /**
     * GenericElement
     */
    export class GenericElement extends Element {

        textNode: Node;

        /**
         * constructor
         * @param htmlElement
         */
        constructor(htmlElement: HTMLElement, context: object){
            super(htmlElement, context);
        }

        /**
         * doRender
         * @param data
         */
        doRender(data: object): void {

            // if element has property
            if(this.getProperty()) {
                let value = data[this.getProperty()];
                value = this.getMask() ? this.getMask().encode(value) : value;

                // clears text node
                if (this.textNode) {
                    this.getHtmlElement().removeChild(this.textNode);
                }

                // appends text node
                this.textNode = document.createTextNode(value);
                this.getHtmlElement().insertBefore(this.textNode, this.getHtmlElement().firstChild);
            }
        }

        /**
         * doUpdate
         * @param data
         * @param detail
         */
        doUpdate(data: object, detail: object): void {
            this.doRender(data);
        }

        /**
         * getValue
         */
        getValue(): any {
            return this.textNode.textContent;
        }

    }

}