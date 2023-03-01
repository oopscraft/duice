namespace duice.element {

    export class Textarea extends ObjectComponent {

        element: HTMLTextAreaElement;

        /**
         * create
         * @param element
         */
        static create(element:HTMLTextAreaElement, context: object): Textarea {
            return new Textarea(element, context);
        }

        /**
         * constructor
         * @param element
         */
        constructor(element: HTMLTextAreaElement, context: object) {
            super(element, context);

            // adds change event listener
            let _this = this;
            this.element.addEventListener('change', function(event){
                _this.notifyHandler({});
            },true);
        }

        /**
         * render
         */
        override doRender(): void {
            let value = this.handler.getPropertyValue(this.getProperty());
            this.element.value = value;
        }

        /**
         * update
         * @param detail
         */
        override doUpdate(detail: object): void {
            this.doRender();
        }

        /**
         * getValue
         */
        override getValue(): any {
            return this.element.value;
        }

    }

    // defines component
    defineComponent(Textarea, "textarea");


}