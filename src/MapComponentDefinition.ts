///<reference path="ComponentDefinition.ts"/>

namespace duice {

    export class MapComponentDefinition extends ComponentDefinition {

        constructor(componentConstructor: CustomElementConstructor, tagName: string, isAttribute?: string){
            super(componentConstructor, tagName, isAttribute);
        }

    }

}