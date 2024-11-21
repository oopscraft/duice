import {
    findVariable,
    getElementAttribute,
    getElementQuerySelector,
    hasElementAttribute,
    setElementAttribute
} from "./common";
import {DataElementRegistry} from "./DataElementRegistry";

export class Initializer {

    static initialize(container: HTMLElement, context: object, index?: number): void {
        // scan DOM tree
        container.querySelectorAll(getElementQuerySelector()).forEach(element => {
            // if (element instanceof HTMLElement) {
                const htmlElement = element as HTMLElement;
                if(!hasElementAttribute(htmlElement, 'id')) {
                    try {
                        let bindName = getElementAttribute(htmlElement, 'bind');
                        let bindData = findVariable(context, bindName);
                        DataElementRegistry.getFactory(htmlElement, bindData, context)
                            ?.createElement(htmlElement, bindData, context)
                            ?.render();
                        // index
                        if(index !== undefined) {
                            setElementAttribute(htmlElement, "index", index.toString());
                        }
                    }catch(e){
                        console.error(e, htmlElement, container, JSON.stringify(context));
                    }
                }
            // }
        });
    }

}