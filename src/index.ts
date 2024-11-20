import {Initializer} from "./Initializer";
import {AlertDialog} from "./dialog/AlertDialog";
import {ConfirmDialog} from "./dialog/ConfirmDialog";
import {PromptDialog} from "./dialog/PromptDialog";
import {Dialog} from "./dialog/Dialog";
import {TabFolder} from "./tab/TabFolder";
import {TabItem} from "./tab/TabItem";

// export class
export {Configuration} from "./Configuration";
export {ArrayProxy} from "./ArrayProxy";
export {ObjectProxy} from "./ObjectProxy";
export {DataElementRegistry} from "./DataElementRegistry"
export {ObjectElement} from "./ObjectElement";
export {ObjectElementFactory} from "./ObjectElementFactory";
export {ArrayElement} from "./ArrayElement";
export {ArrayElementFactory} from "./ArrayElementFactory";
export {CustomElement} from "./CustomElement";
export {CustomElementFactory} from "./CustomElementFactory"
export * from "./commons"

export function alert(message: string): AlertDialog {
    return new AlertDialog(message);
}

export function confirm(message: string): ConfirmDialog {
    return new ConfirmDialog(message);
}

export function prompt(message: string, type?: string): PromptDialog {
    return new PromptDialog(message, type);
}

export function openDialog(dialogElement: HTMLDialogElement): Dialog {
    return new Dialog(dialogElement);
}

export function tabFolder(...tabItems: TabItem[]): TabFolder {
    let tab = new TabFolder();
    if(tabItems) {
        tabItems.forEach(tabItem => {
            tab.addItem(tabItem);
        });
    }
    return tab;
}

export function tabItem(button: HTMLElement, content: HTMLElement, listener: Function): TabItem {
    return new TabItem(button, content, listener);
}

//  listens DOMContentLoaded event
if(globalThis.document) {
    // initialize elements
    document.addEventListener("DOMContentLoaded", event => {
        Initializer.initialize(document.documentElement, {});
    });
}
