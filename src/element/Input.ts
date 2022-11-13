///<reference path="../index.ts"/>
///<reference path="../ObjectComponent.ts"/>
///<reference path="../ComponentDefinition.ts"/>
///<reference path="../ObjectComponentDefinition.ts"/>

namespace duice.element {

    export class Input extends ObjectComponent {

        element: HTMLInputElement;

        constructor(element: HTMLInputElement, context: object) {
            console.log("Input", element, context);
            super(element, context);
            let _this = this;
            this.element.addEventListener('change', function(event){
                _this.notifyObservers();
            },true);
        }

        setValue(value: any): void {
            this.element.value = value;
        }

        getValue() {
            return this.element.value;
        }

    }

    defineComponent(new ObjectComponentDefinition(Input, "input", `${getAlias()}-input`));

}

