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
         * doSetValue
         * @param value
         */
        doSetValue(value: any): void {
            this.textNode.textContent = value;
        }

        /**
         * getValue
         */
        doGetValue(): any {
            return this.textNode.textContent;
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