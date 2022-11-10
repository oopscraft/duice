/// <reference path="MapElement.ts" />
namespace duice {

    /**
     * Map data structure
     */
    export class Map extends window.Map<string,any> {

        elements:Array<MapElement> = new Array<MapElement>();

        /**
         * constructor
         * @param iterator
         */
        constructor(iterator?: any){
            super(iterator);
        }

        /**
         * adds element to bind
         * @param element
         */
        addElement(element: MapElement): void {
            this.elements.push(element);
        }

        /**
         * notifyElements
         */
        notifyElements(): void {
            console.log("==this", this);
            console.log("this.elements", this.elements);
            this.elements.forEach(element =>{
                element.update();
            });
        }

        /**
         * setter
         * @param key
         * @param value
         */
        // @ts-ignore
        set(key: string, value: any):void {
           super.set(key, value);
           this.notifyElements();
        }

        /**
         * getter
         * @param key
         * @param value
         */
        internalSet(key: string, value: any): void {
            super.set(key, value);
        }

    }
}
