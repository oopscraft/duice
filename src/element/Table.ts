///<reference path="../ArrayComponent.ts"/>
///<reference path="../ComponentDefinition.ts"/>
namespace duice.element {

    /**
     * Table
     */
    export class Table extends ArrayComponent {

        tBodyTemplate: HTMLTableSectionElement;

        /**
         * constructor
         * @param element
         */
        constructor(element: HTMLTableElement){
            super(element);
            this.tBodyTemplate = <HTMLTableSectionElement>this.element.querySelector("tbody");
            this.element.removeChild(this.tBodyTemplate);
        }

        /**
         * createRowElement
         * @param object
         * @param status
         */
        createRowElement(object: object, status: object): HTMLElement {
            let tBody: HTMLTableSectionElement = <HTMLTableSectionElement>this.tBodyTemplate.cloneNode(true);
            return tBody;
        }

    }

    // defines component
    defineComponent(Table, "table", `${getAlias()}-table`);

}