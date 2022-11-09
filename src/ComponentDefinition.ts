
namespace duice {

    export abstract class ComponentDefinition {

        componentConstructor: CustomElementConstructor;

        tagName: string;

        isAttribute: string;

        constructor(componentConstructor: CustomElementConstructor, tagName: string, isAttribute?: string){
            this.componentConstructor = componentConstructor;
            this.tagName = tagName;
            this.isAttribute = isAttribute;
        }

        getSelector(): string {
            return `${this.tagName}`
                + (this.isAttribute ? `[is="${this.isAttribute}"]` : '');
        }

    }

}