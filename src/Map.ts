/// <reference path="MapElement.ts" />

namespace duice {

    export class Map extends window.Map<string,any> {

        elements:Array<MapElement> = new Array<MapElement>();

        constructor(iterator?: any){
            super(iterator);
        }

        addElement(element: MapElement): void {
            this.elements.push(element);
        }

        notifyChange(): void {
            console.log("==this", this);
            console.log("this.elements", this.elements);
            this.elements.forEach(element =>{
                element.update();
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
