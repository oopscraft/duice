namespace duice {

    /**
     * SetComponentDefinition
     */
    export class SetComponentDefinition extends ComponentDefinition {

        /**
         * constructor
         * @param componentType
         * @param tagName
         * @param isAttribute
         */
        constructor(componentType: any, tagName: string, isAttribute?: string)  {
            super(componentType, tagName, isAttribute);
        }

    }

}