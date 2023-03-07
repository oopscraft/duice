namespace duice.element {


    export class InputElement extends Element<HTMLInputElement> {

        /**
         * constructor
         * @param htmlElement
         * @param context
         */
        constructor(htmlElement: HTMLInputElement, context: object) {
            super(htmlElement, context);

            // adds change event listener
            let _this = this;
            this.getHtmlElement().addEventListener('change', function(event){
                _this.notifyObservers({});
            },true);
        }

        /**
         * doRender
         * @param data
         */
        doRender(data: object): void {
            let value = getPropertyValue(data, this.getProperty());
            value = this.getMask() ? this.getMask().encode(value): value;
            this.htmlElement.value = value;
        }

        /**
         * doUpdate
         * @param data
         * @param detail
         */
        doUpdate(data: object, detail: object): void {
            this.doRender(data);
        }

        /**
         * getValue
         */
        getValue(): any {
            let value = this.htmlElement.value;
            return this.getMask() ? this.getMask().decode(value) : value;
        }

        /**
         * setReadonly
         * @param readonly
         */
        setReadonly(readonly: boolean): void {
            this.getHtmlElement().readOnly = readonly;
        }

    }

}

