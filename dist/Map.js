/// <reference path="MapListener.ts" />
var duice;
(function (duice) {
    class Map extends window.Map {
        constructor() {
            super(...arguments);
            this.listeners = new Array();
        }
        addListener(listener) {
            this.listeners.push(listener);
        }
        notifyListeners() {
            this.listeners.forEach(observer => {
                observer.change(this);
            });
        }
        internalSet(key, value) {
            super.set(key, value);
        }
    }
    duice.Map = Map;
})(duice || (duice = {}));
