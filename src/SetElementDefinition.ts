///<reference path="ElementDefinition.ts"/>
namespace duice {

    /**
     * SetElementDefinition
     */
    export class SetElementDefinition extends ElementDefinition {

        /**
         * constructor
         * @param elementConstructor
         * @param tagName
         * @param isAttribute
         */
        constructor(elementConstructor: CustomElementConstructor, tagName: string, isAttribute?: string) {
            super(elementConstructor, tagName, isAttribute);
        }
    }
}