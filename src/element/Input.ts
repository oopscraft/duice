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

            // set mask
            if(this.hasAttribute(this.element, 'mask')){
                let pattern = this.getAttribute(this.element, 'mask');
                this.mask = new mask.StringMask(pattern);
            }

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
        override render(): void {
            let value = this.handler.getPropertyValue(this.property);
            this.element.value = this.mask ? this.mask.encode(value) : value;
        }

        /**
         * update
         * @param detail
         */
        override update(detail: object): void {
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

