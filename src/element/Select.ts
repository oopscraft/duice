namespace duice.element {

    export class Select extends ObjectComponent {

        element: HTMLSelectElement;

        defaultOptions: HTMLOptionElement[] = [];

        option: string;

        /**
         * create
         * @param element
         */
        static create(element: HTMLSelectElement): Select {
            return new Select(element);
        }

        /**
         * constructor
         * @param element
         */
        constructor(element: HTMLSelectElement) {
            super(element);
            let _this = this;
            this.element.addEventListener('change', function(event){
                _this.setValue(this.value);
            });

            // stores default options
            for(let i = 0, size = this.element.options.length; i < size; i ++){
                this.defaultOptions.push(this.element.options[i])
            }

            // option
            this.option = this.getAttribute('option');
       }

        /**
         * doInitialize
         * @param object
         */
        override doInitialize(object: object): void {
            // set options
            if(this.option){
                let optionParts = this.option.split(',');
                let options = findObject({}, optionParts[0]);
                let value = optionParts[1];
                let text = optionParts[2];
                this.setOption(options, value, text);
            }

            // update
            super.doInitialize(object);
        }

        /**
         * setOptions
         * @param options
         * @param value
         * @param text
         */
        setOption(options: object[], value: string, text: string): void {

            // removes
            removeChildNodes(this.element);

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
         * doUpdate
         * @param object
         * @param detail
         */
        override doUpdate(object: object, detail: object): void {
            let value = object[this.property];
            this.setValue(value);
        }


        /**
         * setValue
         * @param value
         */
        setValue(value: any): boolean {
            this.element.value = value;
            this.notifyHandlers({});
            return true;
        }

        /**
         * getValue
         */
        getValue(): any {
            return this.element.value;
        }

    }

    // defines component
    defineComponent(Select, "select", `${getAlias()}-select`);

}