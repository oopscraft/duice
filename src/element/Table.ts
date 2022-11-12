///<reference path="../SetElement.ts"/>
///<reference path="../SetComponent.ts"/>
///<reference path="../ComponentDefinition.ts"/>

namespace duice.element {

    export class Table extends HTMLTableElement implements SetElement {

        tBodyTemplate: HTMLTableSectionElement;

        constructor() {
            super();
        }

        initialize(): void {
            this.tBodyTemplate = this.querySelector("tbody");
            console.log("##", this.tBodyTemplate);
        }

        update(set: Set): void {
            console.log("Table.update", set);
        }
    }

    //defineComponent(new ComponentDefinition(SetComponent, Table, "table", `${getAlias()}-table`));

    //     set: Set;
    //
    //     item: string;
    //
    //     tBodyTemplate: HTMLTableSectionElement;
    //
    //     /**
    //      * constructor
    //      */
    //     constructor() {
    //         super();
    //     }
    //
    //     initialize(context: object): void {
    //         this.set = findObject(context, this.dataset.set);
    //         console.log("== this.set:", this.set);
    //         this.item = this.dataset.item;
    //         //this.set.addElement(this);
    //         this.tBodyTemplate = this.removeChild(this.querySelector("tbody"));
    //
    //         // update
    //         this.update();
    //     }
    //
    //     update(): void {
    //         this.set.forEach(map => {
    //             console.log("==> map", map);
    //             let tBody: HTMLTableSectionElement = <HTMLTableSectionElement>this.tBodyTemplate.cloneNode(true);
    //             let context = {};
    //             context[this.item] = map;
    //             initializeComponent(tBody, context);
    //             console.log("tBody", tBody);
    //             this.appendChild(tBody);
    //         });
    //     }
    // }


}