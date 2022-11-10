/// <reference path="../index.ts"/>
/// <reference path="../Map.ts"/>
/// <reference path="../MapElement.ts"/>
/// <reference path="../MapElementDefinition.ts"/>

namespace duice.element {

    export class Input extends HTMLInputElement implements MapElement {

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

        initialize(context: object): void {
            this.map = findObject(context, this.dataset.map);
            this.key = this.dataset.key;
            this.map.addElement(this);

            // adds listener
            let _this = this;
            this.addEventListener('change', function (event: any) {
                _this.map.internalSet(_this.key, _this.value);
            }, true);

            // update
            this.update();
        }

        update(): void {
            this.value = this.map.get(this.key);
        }

        setEnable(enable: boolean): void {
        }

        setFocus(focus: boolean): void {
        }

        setReadonly(readonly: boolean): void {
        }

    }

    defineElement(new MapElementDefinition(Input, "input", "duice-input"));

}

