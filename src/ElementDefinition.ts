namespace duice {

    /**
     * ElementDefinition
     */
    export abstract class ElementDefinition {

        elementConstructor: CustomElementConstructor;

        tagName: string;

        isAttribute: string;

        /**
         * constructor
         * @param elementConstructor
         * @param tagName
         * @param isAttribute
         * @protected
         */
        protected constructor(elementConstructor: CustomElementConstructor, tagName: string, isAttribute?: string){
            this.elementConstructor = elementConstructor;
            this.tagName = tagName;
            this.isAttribute = isAttribute;
        }

        /**
         * returns selector to query
         */
        getSelector(): string {
            return `${this.tagName}`
                + (this.isAttribute ? `[is="${this.isAttribute}"]` : '');
        }

    }

}