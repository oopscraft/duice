/// <reference path="SetComponent.ts"/>

namespace duice {

    export class Set extends window.Set {

        components:Array<SetComponent> = new Array<SetComponent>();

        constructor() {
            super();
        }

        addComponent(component: SetComponent): void {
            this.components.push(component);
        }

        notifyChange(): void {
            this.components.forEach(component => {
               component.update(this);
            });
        }

        // @ts-ignore
        add(map:Map): void {
            super.add(map);
            this.notifyChange();
        }

    }
}