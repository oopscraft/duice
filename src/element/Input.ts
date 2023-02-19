///<reference path="../index.ts"/>
///<reference path="../MapComponent.ts"/>
///<reference path="../ComponentDefinition.ts"/>
///<reference path="../MapComponentDefinition.ts"/>

namespace duice.element {

    export class Input extends MapComponent {

        element: HTMLInputElement;

        constructor(element: HTMLInputElement, context: object) {
            super(element, context);
            let _this = this;
            this.element.addEventListener('change', function(event){
                _this.notifyObservers();
            },true);
        }

        setValue(value: any): void {
            this.element.value = value;
        }

        /**
         * getValue
         */
        getValue() {
            return this.element.value;
        }

        /**
         * setReadonly
         * @param readonly
         */
        setReadonly(readonly: boolean) {
            if(readonly) {
                this.element.readOnly = readonly;
            }
        }


    }

    defineComponent(new MapComponentDefinition(Input, "input", `${getAlias()}-input`));

}

