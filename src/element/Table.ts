///<reference path="../SetElement.ts"/>
///<reference path="../SetElementDefinition.ts"/>

namespace duice.element {

    export class Table extends HTMLTableElement implements SetElement {

        set: Set;

        item: string;

        tBodyTemplate: HTMLTableSectionElement;

        /**
         * constructor
         */
        constructor() {
            super();
        }

        initialize(context: object): void {
            this.set = findObject(context, this.dataset.set);
            console.log("== this.set:", this.set);
            this.item = this.dataset.item;
            this.set.addElement(this);
            this.tBodyTemplate = this.removeChild(this.querySelector("tbody"));

            // update
            this.update();
        }

        update(): void {
            this.set.forEach(map => {
                console.log("==> map", map);
                let tBody: HTMLTableSectionElement = <HTMLTableSectionElement>this.tBodyTemplate.cloneNode(true);
                let context = {};
                context[this.item] = map;
                initializeElement(tBody, context);
                console.log("tBody", tBody);
                this.appendChild(tBody);
            });
        }
    }

    defineElement(new SetElementDefinition(Table, "table", "duice-table"));

}