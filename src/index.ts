namespace duice {

    export const elementDefinitions: Array<ElementDefinition> = new Array<ElementDefinition>();

    export function defineElement(elementDefinition: ElementDefinition) {
        elementDefinitions.push(elementDefinition);
        if(elementDefinition.isAttribute) {
            customElements.define(elementDefinition.isAttribute, elementDefinition.elementConstructor, {extends: elementDefinition.tagName});
        }else{
            customElements.define(elementDefinition.tagName, elementDefinition.elementConstructor);
        }
    }

    export function initializeElement(container: any, context: object): void {
        [SetElementDefinition, MapElementDefinition].forEach(elementDefinitionType => {
            elementDefinitions.forEach(elementDefinition => {
                if(elementDefinition instanceof elementDefinitionType) {
                    let selector = elementDefinition.getSelector();
                    let elements = container.querySelectorAll(selector);
                    elements.forEach(element => {
                        if(!element.getAttribute("duice-id")){
                            console.log("== element.initialize", element);
                            element.initialize(context);
                            element.setAttribute("duice-id", generateUuid());
                        }
                    });
                }
            });
        });
    }

    /**
     * Generates random UUID value
     * @return  UUID string
     */
    export function generateUuid():string {
        let dt = new Date().getTime();
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = (dt + Math.random()*16)%16 | 0;
            dt = Math.floor(dt/16);
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return uuid;
    }

    export function findObject(context: object, name: string): any {
        if(context[name]){
            return context[name];
        }
        if((<any>window).hasOwnProperty(name)){
            return (<any>window)[name];
        }
        return eval.call(context, name);
    }

    document.addEventListener("DOMContentLoaded", event => {
        initializeElement(document, {});
    });

}
