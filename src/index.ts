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
     * initializes
     * @param container
     * @param context
     */
    export function initialize(container: any, context: object): void {

        // initializes element set
        container.querySelectorAll(`*[${getAlias()}\\:data-set]:not([${getAlias()}\\:id])`).forEach(htmlElement => {
            let elementSetFactory = ElementSetFactory.getInstance(htmlElement);
            let elementSet = elementSetFactory.createElementSet(htmlElement, context);
            elementSet.render();
        });

        // initializes element
        container.querySelectorAll(`*[${getAlias()}\\:data]:not([${getAlias()}\\:id])`).forEach(htmlElement => {
            let elementFactory = ElementFactory.getInstance(htmlElement);
            let element = elementFactory.createElement(htmlElement, context);
            element.render();
        });
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
     * Generates component ID
     */
    export function generateUuid(): string {
        let dt = new Date().getTime();
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = (dt + Math.random()*16)%16 | 0;
            dt = Math.floor(dt/16);
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return uuid;
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
     * getCurrentWindow
     * @private
     */
    export function getCurrentWindow() {
        if (window.frameElement) {
            return window.parent;
        }
        else {
            return window;
        }
    }

    /**
     * moveToCenterPosition
     */
    export function moveToCenterPosition(htmlElement: HTMLElement) {
        let currentWindow = getCurrentWindow();
        let computedStyle = currentWindow.getComputedStyle(this.dialog);
        let computedWidth = parseInt(computedStyle.getPropertyValue('width').replace(/px/gi, ''));
        let computedHeight = parseInt(computedStyle.getPropertyValue('height').replace(/px/gi, ''));
        htmlElement.style.left = Math.max(0, currentWindow.innerWidth / 2 - computedWidth / 2) + 'px';
        htmlElement.style.top = Math.max(0, currentWindow.innerHeight / 2 - computedHeight / 2) + 'px';
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
        let args = [];
        let values = [];
        for(let property in context){
            args.push(property);
            values.push(context[property]);
        }
        return Function(...args, script).call(thisArg, ...values);
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
     * listens DOMContentLoaded event
     */
    if(globalThis.document) {
        document.addEventListener("DOMContentLoaded", event => {
            initialize(document.documentElement, {});
        });
    }

}
