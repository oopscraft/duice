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

    /**
     * sets alias of namespace
     * @param value
     */
    export function setAlias(value:string): void {
        alias = value;
    }

    /**
     * returns alias of namespace
     */
    export function getAlias(): string {
        return alias;
    }

    /**
     * findObject
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
     * hasAttribute
     * @param htmlElement
     * @param name
     */
    export function hasAttribute(htmlElement: HTMLElement, name: string): boolean {
        return htmlElement.hasAttribute(`${getAlias()}:${name}`)
    }

    /**
     * getAttribute
     * @param htmlElement
     * @param name
     */
    export function getAttribute(htmlElement: HTMLElement, name: string): string {
        return htmlElement.getAttribute(`${getAlias()}:${name}`);
    }

    /**
     * setAttribute
     * @param htmlElement
     * @param name
     * @param value
     */
    export function setAttribute(htmlElement: HTMLElement, name: string, value: string): void {
        htmlElement.setAttribute(`${getAlias()}:${name}`, value);
    }

    /**
     * listens DOMContentLoaded event
     */
    if(globalThis.document) {
        document.addEventListener("DOMContentLoaded", event => {
            duice.ElementInitializer.initializeElement(document.documentElement, {});
        });
    }

}
