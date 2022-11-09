///<reference path="ComponentDefinition.ts"/>

namespace duice {

    export class SetComponentDefinition extends ComponentDefinition {

        constructor(componentConstructor: CustomElementConstructor, tagName: string, isAttribute?: string) {
            super(componentConstructor, tagName, isAttribute);
        }
    }
}