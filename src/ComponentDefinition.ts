namespace duice {

    /**
     * ComponentDefinition
     */
    export class ComponentDefinition {

        componentType: any;

        tagName: string;

        /**
         * constructor
         * @param tagName
         * @param componentType
         * @protected
         */
        public constructor(componentType: any, tagName: string)  {
            this.componentType = componentType;
            this.tagName = tagName;
        }

    }

}