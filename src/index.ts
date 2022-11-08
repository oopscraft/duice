/// <reference path="MapComponent.ts"/>
/// <reference path="SetComponent.ts"/>

namespace duice {

    const mapComponentDefinitions: Array<ComponentDefinition> = new Array<ComponentDefinition>();

    const setComponentDefinitions: Array<ComponentDefinition> = new Array<ComponentDefinition>();

    export function defineMapComponent(name: string, constructor: CustomElementConstructor, options?: ElementDefinitionOptions) {
        customElements.define(name, constructor, options);
        mapComponentDefinitions.push(new ComponentDefinition(name, constructor, options.extends));
    }

    export function defineSetComponent(name: string, constructor: CustomElementConstructor, options?: ElementDefinitionOptions) {
        customElements.define(name, constructor, options);
        setComponentDefinitions.push(new ComponentDefinition(name, constructor, options.extends));
    }

    export function initializeComponent(container: any, context: object): void {
        setComponentDefinitions.forEach(setComponentDefinition => {
            let setComponents = container.querySelectorAll(setComponentDefinition.getSelector());
            setComponents.forEach(setComponent => {
                (setComponent as SetComponent).initialize(context);
            });
        });
        mapComponentDefinitions.forEach(mapComponentDefinitions => {
            let mapComponents = container.querySelectorAll(mapComponentDefinitions.getSelector());
            mapComponents.forEach(mapComponent => {
                (mapComponent as MapComponent).initialize(context);
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




    // export function initializeComponent(container:any, $context:any) {
    //     [ListComponentFactory, MapComponentFactory].forEach(function(factoryType){
    //         componentFactories.forEach(function(componentFactory:ComponentFactory){
    //             let elements = container.querySelectorAll(componentFactory.getSelector()+`[data-${getAlias()}-bind]:not([data-${getAlias()}-id])`);
    //             for(let i = 0, size = elements.length; i < size; i ++ ){
    //                 let element = elements[i];
    //                 if(componentFactory instanceof factoryType){
    //                     componentFactory.setContext($context);
    //                     componentFactory.getComponent(element);
    //                 }
    //             }
    //         });
    //     });
    // }
}


// namespace duice {
//     export function initializeComponent() {
//         console.log("initializeComponent");
//         document.addEventListener("DOMContentLoaded", function(event) {
//             let elements = window.document.querySelectorAll("input[is=\"duice-input\"]");
//             elements.forEach(element => {
//                 console.log("initialize ", element);
//                 //(element as unknown as Component).initialize();
//
//             });
//         });
//     }
// }
