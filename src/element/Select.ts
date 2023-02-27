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
            this.option = this.getAttribute('option');
       }

        /**
         * doInitialize
         * @param object
         */
        override doInitialize(object: object): void {

            // stores default options
            for(let i = 0, size = this.element.options.length; i < size; i ++){
                this.defaultOptions.push(this.element.options[i])
            }

            // set options
            if(this.option){
                let optionParts = this.option.split(',');
                let options = findObject({}, optionParts[0]);
                let value = optionParts[1];
                let text = optionParts[2];
                this.setOption(options, value, text);
            }

            // adds change event listener
            let _this = this;
            this.element.addEventListener('change', function(event){
                _this.notifyHandlers({});
            },true);

            // updates
            this.doUpdate(object, {});
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
            this.element.value = value;
        }

        /**
         * getValue
         */
        override getValue(): any {
            return this.element.value;
        }

    }

    // defines component
    defineComponent(Select, "select", `${getAlias()}-select`);

}