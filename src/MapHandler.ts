/// <reference path="MapComponent.ts" />

namespace duice {

    export class MapHandler extends Handler<Map> {

        constructor(target: Map) {
            super(target);
        }

        update(mapComponent: MapComponent): void {
            let key = mapComponent.getKey();
            let value = mapComponent.getValue();
            console.log(this, mapComponent, key, value);
            //Reflect.set(this.target, key, value);
            this.target.set(key, value);
        }


        get(target, name/*, receiver*/) {
            let ret = Reflect.get(target, name);
            console.log(`get(${name}=${ret})`);
            if (typeof ret === "function") {    // ***
                ret = ret.bind(target);           // ***
                this.notifyObservers();
            }                                   // ***
            return ret;
        }

        set(target, name, value/*, receiver*/) {
            console.log(`set(${name}=${value})`);
            alert('test');
            return Reflect.set(target, name, value);
        }

        // /**
        //  * get
        //  * @param target
        //  * @param key
        //  */
        // get(target: Map, key: string): any {
        //     console.debug("MapProxyHandler.get", target, key);
        //     let value = Reflect.get(target, key);
        //     if(typeof value === 'function'){
        //         value = value.bind(target);
        //     }
        //     return value;
        // }
        //
        // /**
        //  * set
        //  * @param target
        //  * @param key
        //  * @param value
        //  */
        // set(target: Map, key: string, value: any): boolean {
        //     console.debug("MapProxyHandler.set", target, key, value);
        //     alert('fda');
        //     Reflect.set(target, key, value);
        //     this.notifyObservers();
        //     return false;
        // }

    }

}
