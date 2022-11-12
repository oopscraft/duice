namespace duice {

    /**
     * ComponentDefinition
     */
    export abstract class ComponentDefinition {

        componentType: any;

        tagName: string;

        isAttribute: string;

        /**
         * constructor
         * @param componentType
         * @param tagName
         * @param isAttribute
         * @protected
         */
        protected constructor(componentType: any, tagName: string, isAttribute?: string)  {
            this.componentType = componentType;
            this.tagName = tagName;
            this.isAttribute = isAttribute;
        }

        /**
         * getSelector
         */
        getSelector(): string {
            return `${this.tagName}`
                + (this.isAttribute ? `[is="${this.isAttribute}"]` : '')
                + `:not([${getAlias()}-id])`;
        }

    }

}