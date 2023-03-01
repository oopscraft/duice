/* =============================================================================
 * DUICE (Data-oriented UI Component Engine)
 * - Anyone can use it freely.
 * - Modify the source or allow re-creation. However, you must state that you have the original creator.
 * - However, we can not grant patents or licenses for re-productives. (Modifications or reproductions must be shared with the public.)
 * Licence: LGPL(GNU Lesser General Public License version 3)
 * Copyright (C) 2016 chomookun@gmail.com
 * ============================================================================= */
namespace duice {

    let alias = 'duice';

    const componentDefinitions: ComponentDefinition[] = [];

    export function setAlias(value:string): void {
        alias = value;
    }

    export function getAlias(): string {
        return alias;
    }

    /**
     * defineComponent
     * @param componentType
     * @param tagName
     * @param isAttribute
     */
    export function defineComponent(componentType: any, tagName: string) {
        console.debug("defineComponent", componentType, tagName);
        let componentDefinition = new ComponentDefinition(componentType, tagName);
        componentDefinitions.push(componentDefinition);
    }

    /**
     * createComponent
     * @param componentType
     * @param element
     * @param context
     */
    export function createComponent(componentType: any, element: HTMLElement, context: object): Component<any> {
        componentDefinitions.forEach(componentDefinition => {
            if(componentDefinition.tagName === element.tagName){
                return componentDefinition.componentType.create(element, context);
            }
        });
        if(componentType === ArrayComponent) {
            return ArrayComponent.create(element, context);
        }
        if(componentType === ObjectComponent) {
            return ObjectComponent.create(element, context);
        }
        throw new Error('Invalid element');
    }

    // /**
    //  * initializeComponent
    //  * @param context
    //  */
    // export function initializeComponentOld(container: any, context: object): void {
    //     [ArrayComponent, ObjectComponent].forEach(componentType => {
    //         componentDefinitions.forEach(componentDefinition => {
    //             if(componentDefinition.componentType.prototype instanceof componentType) {
    //                 let selector = componentDefinition.getSelector();
    //                 let elements = container.querySelectorAll(selector);
    //                 elements.forEach(element => {
    //                     console.debug("initializeComponent", element);
    //                     let component = Reflect.apply(componentDefinition.componentType.create, undefined, [element, context]);
    //                     component.initialize();
    //                 });
    //             }
    //         });
    //     });
    // }

    export function initializeComponent(container: any, context: object): void {
        container.querySelectorAll(`*[${getAlias()}\\:array]:not([${getAlias()}\\:id])`).forEach(arrayElement => {
            let arrayComponent = createComponent(ArrayComponent, arrayElement, context);
            arrayComponent.render();
        });
        container.querySelectorAll(`*[${getAlias()}\\:object]:not([${getAlias()}\\:id])`).forEach(objectElement => {
            let objectComponent = createComponent(ObjectComponent, objectElement, context);
            objectComponent.render();
        });
    }

    /**
     * listens DOMContentLoaded event
     */
    if(globalThis.document) {
        document.addEventListener("DOMContentLoaded", event => {
            initializeComponent(document, {});
        });
    }

}
