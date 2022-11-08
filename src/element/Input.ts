/// <reference path="../Map.ts"/>
/// <reference path="../MapComponent.ts"/>

namespace duice.element {

    export class Input extends HTMLInputElement implements MapComponent {

        map:Map;

        key:string;

        /**
         * constructor
         */
        constructor() {
            super();
            console.log(this);
            this.style.background = "red";
            this.classList.add("duice-input");
        }

        initialize(context: object) {
            this.map = findMap(context, this.dataset.map);
            this.key = this.dataset.key;
            this.map.addComponent(this);

            // adds listener
            let _this = this;
            this.addEventListener('change', function (event: any) {
                _this.map.internalSet(_this.key, _this.value);
            }, true);

            // update
            this.update(this.map);
        }

        update(map:Map): void {
            this.value = map.get(this.key);
        }
    }

    defineMapComponent("duice-input", Input, {extends:"input"});

}

