/// <reference path="MapComponent.ts" />

namespace duice {

    export class Map extends window.Map {

        components:Array<MapComponent> = new Array<MapComponent>();

        constructor() {
            super();
        }

        addComponent(component: MapComponent): void {
            this.components.push(component);
        }

        notifyChange(): void {
            this.components.forEach(component =>{
                component.update(this);
            });
        }

        // @ts-ignore
        set(key: string, value: any):void {
           super.set(key, value);
           this.notifyChange();
        }

        internalSet(key: string, value: any): void {
            super.set(key, value);
        }

    }
}
