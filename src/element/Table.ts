/// <reference path="../SetComponent.ts"/>

namespace duice.element {

    export class Table extends HTMLTableElement implements SetComponent {

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
            this.set = findSet(context, this.dataset.set);
            this.item = this.dataset.item;
            this.set.addComponent(this);
            this.tBodyTemplate = this.removeChild(this.querySelector("tbody"));

            // update
            this.update(this.set);
        }

        update(set: Set): void {
            this.set.forEach(map => {
                console.log("map", map);
                let tBody: HTMLTableSectionElement = <HTMLTableSectionElement>this.tBodyTemplate.cloneNode(true);
                let context = {};
                context[this.item] = map;
                //initializeComponent(context);
                console.log("tBody", tBody);
                this.appendChild(tBody);
                //initializeComponent()
                //this.createTBody()
                //this.appendChild(tBody);
            });
        }




    }

    customElements.define('duice-table', Table, { extends: 'table' });


}