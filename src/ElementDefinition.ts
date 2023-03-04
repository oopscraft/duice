namespace duice {

    export class ElementDefinition {

        tagName: string;

        elementType: any;

        constructor(tagName: string, elementType: any) {
            this.tagName = tagName;
            this.elementType = elementType;
        }

        getTagName(): string {
            return this.tagName;
        }

        getElementType(): any {
            return this.elementType;
        }

    }

}