///<reference path="Observable.ts"/>
namespace duice {

    /**
     * custom element
     */
    export abstract class CustomElement<V> extends DataElement<HTMLElement, V> {

        /**
         * constructor
         * @param htmlElement
         * @param data
         */
        protected constructor(htmlElement: HTMLElement, data: V) {
            super(htmlElement, data);
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
            context['data'] = this.data;
            initialize(this.htmlElement, context);

            // execute script
            this.executeScript(this.htmlElement, context);
        }

        /**
         * do render template method
         * @param data
         */
        abstract doRender(data: V): HTMLElement;

        /**
         * update
         * @param observable
         * @param event
         */
        override update(observable: Observable, event: event.Event): void {
            if(observable instanceof DataHandler) {
                this.doUpdate(observable as V);
            }
        }

        /**
         * do update template method
         * @param data
         */
        abstract doUpdate(data: V): void;

        /**
         * setting style
         * @param data
         */
        doStyle(data: V): string {
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

    }

}