///<reference path="ElementDefinition.ts"/>

namespace duice {

    export class MapElementDefinition extends ElementDefinition {

        constructor(elementConstructor: CustomElementConstructor, tagName: string, isAttribute?: string){
            super(elementConstructor, tagName, isAttribute);
        }

    }

}