///<reference path="../ArrayComponent.ts"/>
///<reference path="../ComponentDefinition.ts"/>
namespace duice.element {

    /**
     * Table
     */
    export class Table extends ArrayComponent {

        /**
         * create
         * @param element
         */
        static create(element: HTMLTableElement, context: object): Table {
            return new Table(element, context);
        }

        /**
         * constructor
         * @param element
         */
        constructor(element: HTMLTableElement, context: object){
            super(element, context);
        }

        /**
         * render
         */
        override render(): void {
            super.render();
        }

        /**
         * update
         * @param detail
         */
        override update(detail: object): void {
            this.render();
        }

    }

    // defines component
    defineComponent(Table, "table");

}