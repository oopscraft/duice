///<reference path="ComponentControlFactory.ts"/>
namespace duice {

    let namespace = 'duice';

    /**
     * sets namespace
     * @param value
     */
    export function setNamespace(value:string): void {
        namespace = value;
    }

    /**
     * returns alias of namespace
     */
    export function getNamespace(): string {
        return namespace;
    }

    /**
     * returns query selector expression
     */
    export function getQuerySelectorExpression(){
        return [
            `*[${getNamespace()}\\:array]:not([${getNamespace()}\\:id])`,
            `*[${getNamespace()}\\:object]:not([${getNamespace()}\\:id])`
        ].join(',');
    }

    /**
     * initializes
     * @param container
     * @param context
     */
    export function initialize(container: any, context: object): void {

        // initialize elementSet, element (order is important)
        container.querySelectorAll(getQuerySelectorExpression()).forEach(element => {
            if(!hasAttribute(element, 'id')) {
                try {
                    if(ComponentControlFactory.getInstance(element)){
                        let componentControlFactory = ComponentControlFactory.getInstance(element);
                        let componentControl = componentControlFactory.createComponentControl(element, context);
                        componentControl.render();
                    }else if (hasAttribute(element, 'array')) {
                        let loopControlFactory = LoopControlFactory.getInstance(element);
                        let loopControl = loopControlFactory.createLoopControl(element, context);
                        loopControl.render();
                    } else if (hasAttribute(element, 'object')) {
                        let controlFactory = ControlFactory.getInstance(element);
                        let control = controlFactory.createControl(element, context);
                        control.render();
                    }
                }catch(e){
                    console.error(e, element, container, JSON.stringify(context));
                }
            }
        });
    }

    /**
     * markInitialized
     * @param container
     */
    export function markInitialized(container: any): void {
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
     * @param element
     * @param name
     */
    export function hasAttribute(element: HTMLElement, name: string): boolean {
        return element.hasAttribute(`${getNamespace()}:${name}`)
    }

    /**
     * getAttribute
     * @param element
     * @param name
     */
    export function getAttribute(element: HTMLElement, name: string): string {
        return element.getAttribute(`${getNamespace()}:${name}`);
    }

    /**
     * setAttribute
     * @param element
     * @param name
     * @param value
     */
    export function setAttribute(element: HTMLElement, name: string, value: string): void {
        element.setAttribute(`${getNamespace()}:${name}`, value);
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
    }

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
    }

    /**
     * Deletes cookie
     * @param name
     */
    export function deleteCookie(name:string):void {
        setCookie(name, '', -1);
    }

    /**
     * fetch
     * @param url
     * @param options
     * @param _bypass
     */
    export function fetch(url: URL, options: any, _bypass: boolean) {
        if(!options){
            options = {};
        }
        if(!options.headers){
            options.headers = {};
        }
        // csrf token
        ['XSRF-TOKEN', 'CSRF-TOKEN'].forEach(tokenName => {
            let tokenValue = getCookie(tokenName);
            if(tokenValue){
                options.headers[`X-${tokenName}`] = tokenValue;
            }
        });
        options.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        options.headers['Pragma'] = 'no-cache';
        options.headers['Expires'] = '0';
        return globalThis.fetch(url, options)
            .then(async function(response){
                console.debug(response);

                // bypass
                if(_bypass){
                    return response;
                }

                // checks response
                if(response.ok) {
                    return response;
                }else{
                    let responseJson = await response.json();
                    console.warn(responseJson);
                    let message = responseJson.message;
                    alert(message).then();
                    throw Error(message);
                }
            })
            .catch((error)=>{
                throw Error(error);
            });
    }

    /**
     * defineComponent
     * @param tagName
     * @param constructor
     */
    export function defineComponent(tagName: string, constructor: CustomElementConstructor): void {
        customElements.define(tagName, constructor);
        ComponentControlFactory.registerComponentFactory(new duice.ComponentControlFactory(tagName));
    }

    /**
     * listens DOMContentLoaded event
     */
    if(globalThis.document) {

        // initialize elements
        document.addEventListener("DOMContentLoaded", event => {
            initialize(document.documentElement, {});
        });
    }

}
