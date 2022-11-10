///<reference path="ElementDefinition.ts"/>

namespace duice {

    export class SetElementDefinition extends ElementDefinition {

        constructor(elementConstructor: CustomElementConstructor, tagName: string, isAttribute?: string) {
            super(elementConstructor, tagName, isAttribute);
        }
    }
}