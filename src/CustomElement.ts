///<reference path="Observable.ts"/>
namespace duice {

    /**
     * custom element
     */
    export abstract class CustomElement extends DataElement<HTMLElement> {

        /**
         * constructor
         * @param htmlElement
         * @param context
         */
        protected constructor(htmlElement: HTMLElement, context: object) {
            super(htmlElement, context);
        }

        /**
         * set object data
         * @param objectName
         */
        setObject(objectName: string): void {
            this.setData(objectName);
        }

        /**
         * set array data
         * @param arrayName
         */
        setArray(arrayName: string): void {
            this.setData(arrayName);
        }

        /**
         * render
         */
        override render(): void {

            // removes child
            this.htmlElement.innerHTML = '';

            // create template element
            let templateElement = this.doRender(this.getData());
            if(this.htmlElement.shadowRoot){
                this.htmlElement.shadowRoot.appendChild(templateElement);
            }else{
                this.htmlElement.appendChild(templateElement);
            }

            // add style if exists
            let styleLiteral = this.doStyle(this.getData());
            if(styleLiteral){
                let style = document.createElement('style');
                style.textContent = styleLiteral.trim();
                this.htmlElement.appendChild(style);
            }

            // initializes
            let context = {};
            globalThis.Object.assign(context, this.context);
            context['object'] = this.data;
            context['array'] = this.data;
            initialize(this.htmlElement, context);

            // execute script
            this.executeScript(this.htmlElement, context);
        }

        /**
         * do render template method
         * @param data
         */
        abstract doRender(data: DataProxy): HTMLElement;

        /**
         * setting style
         * @param data
         */
        doStyle(data: DataProxy): string {
            return null;
        }

        /**
         * create element
         * @param templateLiteral
         */
        createElement(templateLiteral: string): HTMLElement {
            let templateElement = document.createElement('template');
            templateElement.innerHTML = templateLiteral;
            return templateElement.content.firstElementChild.cloneNode(true) as HTMLElement;
        }

        /**
         * update
         * @param observable
         * @param event
         */
        override update(observable: Observable, event: event.Event): void {
            if(observable instanceof DataHandler) {
                this.render();
            }
        }

    }

}