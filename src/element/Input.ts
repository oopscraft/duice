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
        static create(element: HTMLInputElement): Input {
            let type = element.getAttribute('type');
            switch(type) {
                case 'number':
                    return new InputNumber(element);
                case 'checkbox':
                    return new InputCheckbox(element);
                default:
                    return new Input(element);
            }
        }

        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLInputElement) {
            super(element);
            if(this.hasAttribute('mask')){
                let pattern = this.getAttribute('mask');
                this.mask = new mask.StringMask(pattern);
            }
        }

        /**
         * doInitialize
         * @param object
         */
        override doInitialize(object: object): void {

            // adds change event listener
            let _this = this;
            this.element.addEventListener('change', function(event){
                _this.notifyHandlers({});
            },true);

            // update
            this.doUpdate(object, {});
        }

        /**
         * doUpdate
         * @param object
         * @param detail
         */
        override doUpdate(object: object, detail: object): void {
            let value = object[this.property];
            this.element.value = this.mask ? this.mask.encode(value) : value;
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
    defineComponent(Input, "input", `${getAlias()}-input`);

}

