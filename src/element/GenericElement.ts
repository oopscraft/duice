namespace duice {

    /**
     * GenericElement
     */
    export class GenericElement extends Element<HTMLElement> {

        textNode: Node;

        /**
         * constructor
         * @param htmlElement
         */
        constructor(htmlElement: HTMLElement, context: object){
            super(htmlElement, context);

            // appends text node
            this.textNode = document.createTextNode('');
            this.getHtmlElement().insertBefore(this.textNode, this.getHtmlElement().firstChild);
        }

        /**
         * setValue
         * @param value
         */
        setValue(value: any): void {
            value = this.getMask() ? this.getMask().encode(value) : value;
            this.textNode.textContent = value;
        }

        /**
         * getValue
         */
        getValue(): any {
            let value = this.textNode.textContent;
            value = this.getMask() ? this.getMask().decode(value) : value;
            return value;
        }

        /**
         * setReadonly
         * @param readonly
         */
        setReadonly(readonly: boolean): void {
            // no-op
        }

    }

}