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

    const componentDefinitions: Array<ComponentDefinition> = new Array<ComponentDefinition>();

    export function setAlias(value:string): void {
        alias = value;
    }

    export function getAlias(): string {
        return alias;
    }

    export function defineComponent(componentDefinition: ComponentDefinition) {
        componentDefinitions.push(componentDefinition);
    }

    /**
     * initializeComponent
     * @param container
     * @param context
     */
    export function initializeComponent(container: any, context: object): void {
        [ArrayComponentDefinition, ObjectComponentDefinition].forEach(componentDefinitionType => {
            componentDefinitions.forEach(componentDefinition => {
                if(componentDefinition instanceof componentDefinitionType) {
                    let selector = componentDefinition.getSelector();
                    let elements = container.querySelectorAll(selector);
                    elements.forEach(element => {
                        console.log("initializeComponent", element);
                        Reflect.construct(componentDefinition.componentType, [element, context]);
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
     * getProxyHandler
     * @param obj
     */
    export function getProxyHandler(obj: object) {
        return Object.getOwnPropertyDescriptor(obj, '[[handler]]').value;
    }

    /**
     * converts value to left-padded value
     * @param value value
     * @param length to pad
     * @param padChar character
     * @return left-padded value
     */
    export function padLeft(value:string, length:number, padChar:string) {
        for(let i = 0, size = (length-value.length); i < size; i ++ ) {
            value = padChar + value;
        }
        return value;
    }

    /**
     * converts value to right-padded value
     * @param value value
     * @param length to pad
     * @param padChar character
     * @return right-padded string
     */
    export function padRight(value:string, length:number, padChar:string) {
        for(let i = 0, size = (length-value.length); i < size; i ++ ) {
            value = value + padChar;
        }
        return value;
    }

    /**
     * listens DOMContentLoaded event
     */
    document.addEventListener("DOMContentLoaded", event => {
        initializeComponent(document, {});
    });

}
