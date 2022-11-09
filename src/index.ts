namespace duice {

    export const componentDefinitions: Array<ComponentDefinition> = new Array<ComponentDefinition>();

    export function defineComponent(componentDefinition: ComponentDefinition) {
        componentDefinitions.push(componentDefinition);
        if(componentDefinition.isAttribute) {
            customElements.define(componentDefinition.isAttribute, componentDefinition.componentConstructor, {extends: componentDefinition.tagName});
        }else{
            customElements.define(componentDefinition.tagName, componentDefinition.componentConstructor);
        }
    }

    export function initializeComponent(container: any, context: object): void {
        [SetComponentDefinition, MapComponentDefinition].forEach(componentType => {
            componentDefinitions.forEach(componentDefinition => {
                if(componentDefinition instanceof componentType) {
                    let selector = componentDefinition.getSelector();
                    let elements = container.querySelectorAll(selector);
                    elements.forEach(element => {
                         element.initialize(context);
                    });
                }
            });
        });
    }

    export function findMap(context: object, name: string): Map {
       return eval.call(context, name);
    }

    export function findSet(context: object, name: string): Set {
        return eval.call(context, name);
    }

    document.addEventListener("DOMContentLoaded", event => {
        initializeComponent(document, {});
    });

}
