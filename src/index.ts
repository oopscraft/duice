/* =============================================================================
 * DUICE (Data-oriented UI Component Engine)
 * - Anyone can use it freely.
 * - Modify the source or allow re-creation. However, you must state that you have the original creator.
 * - However, we can not grant patents or licenses for  re-productive. (Modifications or reproductions must be shared with the public.)
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
     * setColorScheme
     * @param name
     */
    export function setColorScheme(name: string): void {
        document.documentElement.className = name;
    }

    /**
     * returns query selector expression
     */
    export function getQuerySelectorExpression(){
        return [
            `*[${getAlias()}\\:array]:not([${getAlias()}\\:id])`,
            `*[${getAlias()}\\:object]:not([${getAlias()}\\:id])`
        ].join(',');
    }

    /**
     * initializes
     * @param container
     * @param context
     */
    export function initialize(container: any, context: object): void {
        container.querySelectorAll(getQuerySelectorExpression()).forEach(htmlElement => {
            if(!hasAttribute(htmlElement, 'id')) {
                try {
                    if (hasAttribute(htmlElement, 'array')) {
                        let elementSetFactory = ElementSetFactory.getInstance(htmlElement);
                        let elementSet = elementSetFactory.createElementSet(htmlElement, context);
                        elementSet.render();
                    } else if (hasAttribute(htmlElement, 'object')) {
                        let elementFactory = ElementFactory.getInstance(htmlElement);
                        let element = elementFactory.createElement(htmlElement, context);
                        element.render();
                    }
                }catch(e){
                    console.error(e.message, htmlElement, container, JSON.stringify(context));
                }
            }
        });
    }

    /**
     * markInitialized
     * @param container
     */
    export function markInitialized(container: any): void {
        setAttribute(container, 'id', generateId());
        container.querySelectorAll(getQuerySelectorExpression()).forEach(htmlElement => {
            setAttribute(htmlElement, 'id', generateId());
        });
    }

    /**
     * findObject
     * @param context
     * @param name
     */
    export function findObject(context: object, name: string): any {

        // find in context
        try {
            let object = new Function(`return this.${name};`).call(context);
            if(object) {
                return object;
            }
        }catch(ignore){}

        // find in global
        try {
            let object = new Function(`return ${name};`).call(null);
            if(object){
                return object;
            }
        }catch(ignore){}

        // throw error
        console.warn(`Object[${name}] is not found`);
        return undefined;
    }

    /**
     * Generates component ID
     */
    export function generateId(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * assert
     * @param condition
     * @param message
     */
    export function assert(condition: any, message?: string): void {
        console.assert(condition, message);
        if(!condition){
            throw new Error(message||'Assertion Failed');
        }
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
     * removeChildNodes
     * @param element
     */
    export function removeChildNodes(element: HTMLElement): void {
        // Remove element nodes and prevent memory leaks
        let node, nodes = element.childNodes, i = 0;
        while (node = nodes[i++]) {
            if (node.nodeType === 1 ) {
                element.removeChild(node);
            }
        }

        // Remove any remaining nodes
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }

        // If this is a select, ensure that it displays empty
        if(element instanceof HTMLSelectElement){
            (<HTMLSelectElement>element).options.length = 0;
        }
    }

    /**
     * execute script
     * @param script
     * @param thisArg
     * @param context
     */
    export function executeScript(script:string, thisArg: any, context: object): any {
        try {
            let args = [];
            let values = [];
            for(let property in context){
                args.push(property);
                values.push(context[property]);
            }
            return Function(...args, script).call(thisArg, ...values);
        }catch(e){
            console.error(script, e);
            throw e;
        }
    }

    /**
     * alert
     * @param message
     */
    export async function alert(message: string): Promise<void> {
        await new duice.AlertDialog(message).open();
    }

    /**
     * confirm
     * @param message
     */
    export async function confirm(message: string): Promise<boolean> {
        return await new duice.ConfirmDialog(message).open();
    }

    /**
     * prompt
     * @param message
     */
    export async function prompt(message: string): Promise<string> {
        return await new duice.PromptDialog(message).open();
    }

    /**
     * dialog
     * @param dialogElement
     */
    export async function dialog(dialogElement: HTMLDialogElement): Promise<void> {
        return await new duice.Dialog(dialogElement).open();
    }

    /**
     * Gets cookie value
     * @param name
     */
    export function getCookie(name:string):string {
        let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return value? value[2] : null;
    };

    /**
     * Sets cookie value
     * @param name
     * @param value
     * @param day
     */
    export function setCookie(name:string, value:string, day:number):void {
        let date = new Date();
        date.setTime(date.getTime() + day * 60 * 60 * 24 * 1000);
        document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
    };

    /**
     * Deletes cookie
     * @param name
     */
    export function deleteCookie(name:string):void {
        let date = new Date();
        document.cookie = name + "= " + "; expires=" + date.toUTCString() + "; path=/";
    }

    /**
     * listens DOMContentLoaded event
     */
    if(globalThis.document) {

        // set color scheme
        // try {
        //     if(window.matchMedia) {
        //         let isColorSchemeDark = window.matchMedia('(prefers-color-scheme: dark)')?.matches;
        //         if(isColorSchemeDark){
        //             setColorScheme('dark');
        //         }
        //     }
        // }catch(ignore){
        //     console.warn(ignore.message, ignore);
        // }

        // initialize elements
        document.addEventListener("DOMContentLoaded", event => {
            initialize(document.documentElement, {});
        });
    }

}
