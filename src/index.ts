import {Initializer} from "./Initializer";
import {AlertDialog} from "./dialog/AlertDialog";
import {ConfirmDialog} from "./dialog/ConfirmDialog";
import {PromptDialog} from "./dialog/PromptDialog";
import {Dialog} from "./dialog/Dialog";
import {TabFolder} from "./tab/TabFolder";
import {TabItem} from "./tab/TabItem";

// export class
export * from "./common"
export * from "./Configuration";
export * from "./Initializer";
export * from "./ArrayProxy";
export * from "./ObjectProxy";
export * from "./DataElementRegistry"
export * from "./ObjectElement";
export * from "./ObjectElementFactory";
export * from "./ArrayElement";
export * from "./ArrayElementFactory";
export * from "./CustomElement";
export * from "./CustomElementFactory"
export * from "./element/ImgElementFactory"
export * from "./element/InputElementFactory"
export * from "./element/SelectElementFactory"
export * from "./element/TextareaElementFactory"
export * from "./dialog/Dialog";
export * from "./dialog/AlertDialog";
export * from "./dialog/ConfirmDialog";
export * from "./dialog/PromptDialog";
export * from "./tab/TabFolder";
export * from "./tab/TabItem";

//  listens DOMContentLoaded event
if(globalThis.document) {
    // initialize elements
    document.addEventListener("DOMContentLoaded", event => {
        Initializer.initialize(document.documentElement, {});
    });
}
