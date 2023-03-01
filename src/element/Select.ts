namespace duice.element {

    export class Select extends ObjectComponent {

        element: HTMLSelectElement;

        defaultOptions: HTMLOptionElement[] = [];

        option: string;

        /**
         * create
         * @param element
         */
        static create(element: HTMLSelectElement, context: object): Select {
            return new Select(element, context);
        }

        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLSelectElement, context: object) {
            super(element, context);
            this.option = this.getAttribute(this.element, 'option');

            // stores default options
            for(let i = 0, size = this.element.options.length; i < size; i ++){
                this.defaultOptions.push(this.element.options[i])
            }

            // adds change event listener
            let _this = this;
            this.element.addEventListener('change', function(event){
                _this.notifyHandler({});
            },true);
        }

        override render(): void {

            // set options
            if(this.option){
                let optionParts = this.option.split(',');
                let options = this.findObject(optionParts[0]);
                let value = optionParts[1];
                let text = optionParts[2];
                this.setOption(options, value, text);
            }

            // set value
            let value = this.handler.getPropertyValue(this.getProperty());
            this.element.value = value;
        }

        /**
         * setOptions
         * @param options
         * @param value
         * @param text
         */
        setOption(options: object[], value: string, text: string): void {

            // removes
            this.removeChildNodes(this.element);

            // adds default options
            let _this = this;
            this.defaultOptions.forEach(option => {
                _this.element.appendChild(option);
            });

            // adds additional options
            options.forEach(option => {
                let optionElement = document.createElement('option');
                optionElement.value = option[value];
                optionElement.appendChild(document.createTextNode(option[text]));
                _this.element.appendChild(optionElement);
            });
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
            return this.element.value;
        }

    }

    // defines component
    defineComponent(Select, "select");

}