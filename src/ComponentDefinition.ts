namespace duice {

    export class ComponentDefinition {

        componentType: any;

        tagName: string;

        isAttribute: string;

        elementConstructor: CustomElementConstructor;

        constructor(componentType: any, tagName: string, isAttribute: string, elementConstructor: CustomElementConstructor)  {
            this.componentType = componentType;
            this.tagName = tagName;
            this.isAttribute = isAttribute;
            this.elementConstructor = elementConstructor;
        }

        getSelector(): string {
            return `${this.tagName}` + (this.isAttribute ? `[is="${this.isAttribute}"]` : '');
        }

    }

}