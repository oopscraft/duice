
namespace duice {

    export class ComponentDefinition {

        name: string;

        type: CustomElementConstructor;

        tag: string;

        constructor(name: string, type: CustomElementConstructor, tag?: string) {
            this.name = name;
            this.type = type;
            this.tag = tag;
        }

        getSelector(): string {
            return `${this.tag}[is="${this.name}"]`;
        }

    }

}