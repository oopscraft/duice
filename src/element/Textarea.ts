namespace duice.element {

    export class Textarea extends ObjectComponent {

        element: HTMLTextAreaElement;

        /**
         * create
         * @param element
         */
        static create(element:HTMLTextAreaElement): Textarea {
            return new Textarea(element);
        }

        /**
         * constructor
         * @param element
         */
        constructor(element: HTMLTextAreaElement) {
            super(element);
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
    defineComponent(Textarea, "textarea", `${getAlias()}-textarea`);


}