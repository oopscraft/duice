///<reference path="../Control.ts"/>
namespace duice {

    /**
     * GenericElement
     */
    export class GenericControl extends Control<HTMLElement> {

        textNode: Node;

        /**
         * constructor
         * @param element
         */
        constructor(element: HTMLElement, context: object){
            super(element, context);

            // appends text node
            this.textNode = document.createTextNode('');
            this.getElement().insertBefore(this.textNode, this.getElement().firstChild);
        }

        /**
         * setValue
         * @param value
         */
        setValue(value: any): void {
            value = this.getMask() ? this.getMask().encode(value) : value;
            this.textNode.textContent = value;
        }

        /**
         * getValue
         */
        getValue(): any {
            let value = this.textNode.textContent;
            value = this.getMask() ? this.getMask().decode(value) : value;
            return value;
        }

        /**
         * setReadonly
         * @param readonly
         */
        setReadonly(readonly: boolean): void {
            // no-op
        }

    }

}