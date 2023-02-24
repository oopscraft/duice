///<reference path="../MapComponent.ts"/>
namespace duice.element {

    export class Input extends MapComponent {

        element: HTMLInputElement;

        constructor(element: HTMLInputElement) {
            super(element);
        }

        override doInitialize(context: object): void {
            let _this = this;
            this.element.addEventListener('change', function(event){
                let mapEvent = new MapEvent(MapEventType.SetValue,{
                    key: _this.key,
                    value: this.value
                });
                _this.notifyObservers(mapEvent);
            },true);
        }

        setValue(value: any): void {
            throw new Error("Method not implemented.");
        }

        setReadonly(readonly: boolean): void {
            throw new Error("Method not implemented.");
        }

    }

    // defines component
    defineComponent(Input, "input", `${getAlias()}-input`);

}

