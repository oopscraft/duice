/* =============================================================================
 * DUICE (Data-oriented UI Component Engine)
 * - Anyone can use it freely.
 * - Modify the source or allow re-creation. However, you must state that you have the original creator.
 * - However, we can not grant patents or licenses for reproductives. (Modifications or reproductions must be shared with the public.)
 * Licence: LGPL(GNU Lesser General Public License version 3)
 * Copyright (C) 2016 chomookun@gmail.com
 * ============================================================================= */
namespace duice {

    let alias = 'duice';

    export const elementDefinitions: Array<ElementDefinition> = new Array<ElementDefinition>();

    /**
     * sets alias
     * @param value
     */
    export function setAlias(value:string): void {
        alias = value;
    }

    /**
     * gets alias
     */
    export function getAlias(): string {
        return alias;
    }

    /**
     * defineElement
     * @param elementDefinition
     */
    export function defineElement(elementDefinition: ElementDefinition) {
        elementDefinitions.push(elementDefinition);
        if(elementDefinition.isAttribute) {
            customElements.define(elementDefinition.isAttribute, elementDefinition.elementConstructor, {extends: elementDefinition.tagName});
        }else{
            customElements.define(elementDefinition.tagName, elementDefinition.elementConstructor);
        }
    }

    /**
     * initializeElement
     * @param container
     * @param context
     */
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

    /**
     * find object in context
     * @param context
     * @param name
     */
    export function findObject(context: object, name: string): any {
        if(context[name]){
            return context[name];
        }
        if((<any>window).hasOwnProperty(name)){
            return (<any>window)[name];
        }
        return eval.call(context, name);
    }

    /**
     * listens DOMContentLoaded event
     */
    document.addEventListener("DOMContentLoaded", event => {
        initializeElement(document, {});
    });

}
