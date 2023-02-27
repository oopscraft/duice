///<reference path="../ArrayComponent.ts"/>
///<reference path="../ComponentDefinition.ts"/>
namespace duice.element {

    /**
     * Table
     */
    export class Table extends ArrayComponent {

        tBodyTemplate: HTMLTableSectionElement;

        rowElements: HTMLElement[] = [];

        /**
         * create
         * @param element
         */
        static create(element: HTMLTableElement): Table {
            return new Table(element);
        }

        /**
         * constructor
         * @param element
         */
        constructor(element: HTMLTableElement){
            super(element);
        }

        /**
         * doInitialize
         * @param array
         */
        override doInitialize(array: object[]): void {

            // tbody template
            this.tBodyTemplate = <HTMLTableSectionElement>this.element.querySelector("tbody");
            this.element.removeChild(this.tBodyTemplate);

            // update
            this.doUpdate(array, {});
        }

        /**
         * doUpdate
         * @param array
         * @param detail
         */
        override doUpdate(array: object[], detail: object): void {

            // clear
            this.rowElements.forEach(rowElement =>{
                this.element.removeChild(rowElement);
            });
            this.rowElements.length = 0;

            // creates row
            for(let index = 0, size = array.length; index < size; index ++ ){
                let object = array[index];
                let status = {
                    index: index,
                    length: array.length
                };
                let rowElement= this.createRowElement(object, status);
                let context = {};
                context[this.getVar()] = object;
                context[this.getStatus()] = status;
                initializeComponent(rowElement, context);
                this.element.appendChild(rowElement);
                this.rowElements.push(rowElement);
            }
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