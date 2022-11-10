/// <reference path="MapElement.ts" />
var duice;
(function (duice) {
    class Map extends window.Map {
        constructor() {
            super();
            this.elements = new Array();
        }
        addElement(element) {
            this.elements.push(element);
        }
        notifyChange() {
            this.elements.forEach(element => {
                element.update();
            });
        }
        // @ts-ignore
        set(key, value) {
            super.set(key, value);
            this.notifyChange();
        }
        internalSet(key, value) {
            super.set(key, value);
        }
    }
    duice.Map = Map;
})(duice || (duice = {}));
