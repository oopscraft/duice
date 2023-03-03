///<reference path="../ObjectComponent.ts"/>
///<reference path="../mask/StringMask.ts"/>
namespace duice.element {

    /**
     * Input
     */
    export class Input extends ObjectComponent {

        element: HTMLInputElement;

        mask: mask.StringMask;

        /**
         * create
         * @param element
         */
        static create(element: HTMLInputElement, context: object): Input {
            let type = element.getAttribute('type');
            switch(type) {
                case 'number':
                    return new InputNumber(element, context);
                case 'checkbox':
                    return new InputCheckbox(element, context);
                default:
                    return new Input(element, context);
            }
        }

        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLInputElement, context: object) {
            super(element, context);

            // adds change event listener
            let _this = this;
            this.element.addEventListener('change', function(event){
                _this.notifyHandler({});
            },true);
        }


        /**
         * render
         * @param detail
         */
        override doRender(): void {
            let property = this.getProperty();
            let value = this.handler.getPropertyValue(property);
            value = this.mask ? this.mask.encode(value) : value;
            this.element.value = value;
            console.warn("==value:", value);

            // append to stage
            this.appendToStage(this.element);
        }

        /**
         * update
         * @param detail
         */
        override doUpdate(detail: object): void {
            this.render();
        }

        /**
         * getValue
         */
        override getValue(): any {
            let value = this.element.value;
            return this.mask ? this.mask.decode(value) : value;
        }

    }

    // defines component
    defineComponent(Input, "input");

}

