///<reference path="CustomElementFactory.ts"/>
namespace duice {

    let namespace = 'duice';

    /**
     * sets namespace
     * @param value
     */
    export function setNamespace(value:string): void {
        globalThis[value] = value;
        namespace = value;
    }

    /**
     * returns alias of namespace
     */
    export function getNamespace(): string {
        return namespace;
    }

    /**
     * returns query selector for element scan
     */
    export function getElementQuerySelector(): string {
        return `*[data-${getNamespace()}-bind]:not([data-${getNamespace()}-id])`;
    }

    /**
     * initializes
     * @param container
     * @param context
     */
    export function initialize(container: any, context: object): void {
        // scan DOM tree
        container.querySelectorAll(getElementQuerySelector()).forEach(htmlElement => {
            if(!hasElementAttribute(htmlElement, 'id')) {
                try {
                    let bindName = getElementAttribute(htmlElement, 'bind');
                    let bindData = findVariable(context, bindName);
                    DataElementRegistry.getFactory(htmlElement, bindData)
                        ?.createElement(htmlElement, bindData, context)
                        ?.render();
                }catch(e){
                    console.error(e, htmlElement, container, JSON.stringify(context));
                }
            }
        });
    }

    /**
     * markInitialized
     * @param container
     */
    export function markInitialized(container: any): void {
        container.querySelectorAll(getElementQuerySelector()).forEach(element => {
            setElementAttribute(element, 'id', '_');
        });
    }

    /**
     * finds variable by name
     * @param context
     * @param name
     */
    export function findVariable(context: object, name: string): any {

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
     * executes script
     * @param code
     * @param htmlElement
     * @param context
     */
    export function runCode(code: string, htmlElement: HTMLElement, context: object): boolean {
        try {
            let args = [];
            let values = [];
            for(let property in context){
                args.push(property);
                values.push(context[property]);
            }
            return Function(...args, code).call(htmlElement, ...values);
        }catch(e){
            console.error(code, e);
            throw e;
        }
    }

    /**
     * run if code
     */
    export function runIfCode(htmlElement: HTMLElement, context: object): void {
        let ifClause = getElementAttribute(htmlElement, 'if');
        if(ifClause) {
            let result = runCode(ifClause, htmlElement, context);
            if(!result) {
                htmlElement.hidden = true;
            }else{
                htmlElement.hidden = false;
            }
        }
    }

    /**
     * run execute code
     */
    export function runExecuteCode(htmlElement: HTMLElement, context: object): void {
        let script = getElementAttribute(htmlElement,'execute');
        if(script) {
            runCode(script, htmlElement, context);
        }
    }

    /**
     * checks has component attribute
     * @param htmlElement
     * @param name
     */
    export function hasElementAttribute(htmlElement: HTMLElement, name: string): boolean {
        return htmlElement.hasAttribute(`data-${getNamespace()}-${name}`)
    }

    /**
     * returns element attribute
     * @param htmlElement
     * @param name
     */
    export function getElementAttribute(htmlElement: HTMLElement, name: string): string {
        return htmlElement.getAttribute(`data-${getNamespace()}-${name}`);
    }

    /**
     * set component attribute
     * @param htmlElement
     * @param name
     * @param value
     */
    export function setElementAttribute(htmlElement: HTMLElement, name: string, value: string): void {
        htmlElement.setAttribute(`data-${getNamespace()}-${name}`, value);
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
     * alert
     * @param message
     */
    export async function alert(message: string): Promise<void> {
        await new duice.dialog.AlertDialog(message).open();
    }

    /**
     * confirm
     * @param message
     */
    export async function confirm(message: string): Promise<boolean> {
        return await new duice.dialog.ConfirmDialog(message).open();
    }

    /**
     * prompt
     * @param message
     * @param type
     */
    export async function prompt(message: string, type?: string): Promise<string> {
        return await new duice.dialog.PromptDialog(message, type).open();
    }

    /**
     * open dialog
     * @param dialogElement
     */
    export async function openDialog(dialogElement: HTMLDialogElement): Promise<void> {
        return await new duice.dialog.Dialog(dialogElement).open();
    }

    /**
     * tab folder
     * @param tabItems
     */
    export function tabFolder(...tabItems: duice.tab.TabItem[]): duice.tab.TabFolder {
        let tab = new duice.tab.TabFolder();
        if(tabItems) {
            tabItems.forEach(tabItem => {
                tab.addItem(tabItem);
            });
        }
        return tab;
    }

    /**
     * tab item
     * @param button
     * @param content
     * @param listener
     */
    export function tabItem(button: HTMLElement, content: HTMLElement, listener: Function): duice.tab.TabItem {
        return new duice.tab.TabItem(button, content, listener);
    }

    /**
     * defines custom element
     * @param tagName
     * @param elementType
     */
    export function defineCustomElement(tagName: string, elementType: Function): void {
        DataElementRegistry.register(tagName, new CustomElementFactory(elementType));
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
