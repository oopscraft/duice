///<reference path="../ArrayComponent.ts"/>
///<reference path="../ComponentDefinition.ts"/>
namespace duice.element {

    /**
     * Table
     */
    export class Table extends ArrayComponent {

        tBodyTemplate: HTMLTableSectionElement;

        constructor(element: HTMLTableElement){
            super(element);
            this.tBodyTemplate = <HTMLTableSectionElement>this.element.querySelector("tbody");
            this.element.removeChild(this.tBodyTemplate);
        }

        createRowElement(object: object, status: object): HTMLElement {
            throw new Error("Method not implemented.");
        }

        // /**
        //  * constructor
        //  * @param element
        //  * @param context
        //  */
        // constructor(element: HTMLTableElement) {
        //     console.debug("Table.constructor", element);
        //     super(element);
        //     console.log(this.element);
        //     alert(this.element);
        //     this.tBodyTemplate = <HTMLTableSectionElement>this.element.querySelector("tbody");
        //     this.element.removeChild(this.tBodyTemplate);
        // }
        //
        // setArray(array: object[]): void {
        //     console.debug("Table.setArray", array);
        //     let length = array.length;
        //     let index = -1;
        //     array.forEach(object => {
        //         index ++;
        //         let tBody: HTMLTableSectionElement = <HTMLTableSectionElement>this.tBodyTemplate.cloneNode(true);
        //         let context = {};
        //         context[this.getItem()] = object;
        //         context[this.getStatus()] = {'index':index,'length':length};
        //         initializeComponent(tBody, context);
        //         this.element.appendChild(tBody);
        //     });
        // }
    }

    // defines component
    defineComponent(Table, "table", `${getAlias()}-table`);

}