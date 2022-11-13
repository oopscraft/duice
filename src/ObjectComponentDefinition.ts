namespace duice {

    /**
     * ObjectComponentDefinition
     */
    export class ObjectComponentDefinition extends ComponentDefinition {

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