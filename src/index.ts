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
        if(componentDefinition.isAttribute) {
            customElements.define(componentDefinition.isAttribute, componentDefinition.elementConstructor, {extends: componentDefinition.tagName});
        }else{
            customElements.define(componentDefinition.tagName, componentDefinition.elementConstructor);
        }
    }

    /**
     * initializeComponent
     * @param container
     * @param context
     */
    export function initializeComponent(container: any, context: object): void {
        [SetComponent, MapComponent].forEach(componentType => {
            console.log("== initializeComponent-componentType", componentType);
            componentDefinitions.forEach(componentDefinition => {
                console.log("###", componentDefinition.componentType, componentType);
                console.log(componentDefinition.componentType.toString() === componentType.toString());
                //if(componentDefinition.componentType === componentType) {
                    let selector = componentDefinition.getSelector();
                    console.log("== initializeComponent.selector", selector);
                    let elements = container.querySelectorAll(selector);
                    elements.forEach(element => {
                        console.log("== initializeComponent.element", element);
                        //if(!element.hasAttribute(`${getAlias()}-id`)) {
                            //Object.create(componentDefinition.componentType, element);
                            Reflect.construct(componentDefinition.componentType, [element, {}]);

                        //}
                    });
                //}
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
        initializeComponent(document, {});
    });

}
