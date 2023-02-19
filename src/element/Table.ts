///<reference path="../ArrayComponent.ts"/>
///<reference path="../ComponentDefinition.ts"/>
///<reference path="../ArrayComponentDefinition.ts"/>

namespace duice.element {

    /**
     * Table
     */
    export class Table extends ArrayComponent {

        tBodyTemplate: HTMLTableSectionElement;

        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLInputElement, context: object) {
            super(element, context);
            this.tBodyTemplate = this.element.querySelector("tbody");
            this.element.removeChild(this.tBodyTemplate);
        }

        setArray(array: object[]): void {
            let length = array.length;
            let index = -1;
            array.forEach(object => {
                index ++;
                let tBody: HTMLTableSectionElement = <HTMLTableSectionElement>this.tBodyTemplate.cloneNode(true);
                let context = {};
                context[this.getItem()] = object;
                context[this.getStatus()] = {'index':index,'length':length};
                initializeComponent(tBody, context);
                this.element.appendChild(tBody);
            });
        }
    }

    // defines component
    defineComponent(Table, "table", `${getAlias()}-table`);

}