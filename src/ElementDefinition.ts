
namespace duice {

    export abstract class ElementDefinition {

        elementConstructor: CustomElementConstructor;

        tagName: string;

        isAttribute: string;

        protected constructor(elementConstructor: CustomElementConstructor, tagName: string, isAttribute?: string){
            this.elementConstructor = elementConstructor;
            this.tagName = tagName;
            this.isAttribute = isAttribute;
        }

        getSelector(): string {
            return `${this.tagName}`
                + (this.isAttribute ? `[is="${this.isAttribute}"]` : '');
        }

    }

}