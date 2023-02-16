///<reference path="ComponentDefinition.ts"/>

namespace duice {

    /**
     * ArrayComponentDefinition
     */
    export class ArrayComponentDefinition extends ComponentDefinition {

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