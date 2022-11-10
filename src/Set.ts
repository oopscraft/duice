/// <reference path="SetElement.ts"/>

namespace duice {

    export class Set extends window.Set {

        elements:Array<SetElement> = new Array<SetElement>();

        addElement(element: SetElement): void {
            this.elements.push(element);
        }

        notifyChange(): void {
            this.elements.forEach(element => {
               element.update();
            });
        }

        // @ts-ignore
        add(map:Map): void {
            super.add(map);
            this.notifyChange();
        }

    }
}