namespace duice.component {

    /**
     * image element component
     */
    export class ImageElement extends ObjectElement<HTMLImageElement> {

        originSrc: string;

        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLImageElement, context: object) {
            super(element, context);
            this.originSrc = String(this.getHtmlElement().src);
        }

       /**
         * set value
         * @param value
         */
        override setValue(value: any): void {
            if(value) {
                this.getHtmlElement().src = value;
            }else{
                this.getHtmlElement().src = this.originSrc;
            }
        }

        /**
         * return value
         */
        override getValue(): any {
            return this.getHtmlElement().src;
        }

    }

}