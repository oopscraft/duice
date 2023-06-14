///<reference path="Observable.ts"/>
namespace duice {

    /**
     * custom element
     */
    export abstract class CustomElement<V> extends DataElement<HTMLElement, V> {

        /**
         * constructor
         * @param htmlElement
         * @param bindData
         * @param context
         */
        protected constructor(htmlElement: HTMLElement, bindData: V, context: object) {
            super(htmlElement, bindData, context);
        }

        /**
         * render
         */
        override render(): void {

            // removes child
            this.htmlElement.innerHTML = '';

            // create template element
            let templateElement = this.doRender(this.getBindData());
            if(this.htmlElement.shadowRoot){
                this.htmlElement.shadowRoot.appendChild(templateElement);
            }else{
                this.htmlElement.appendChild(templateElement);
            }

            // add style if exists
            let styleLiteral = this.doStyle(this.getBindData());
            if(styleLiteral){
                let style = document.createElement('style');
                style.textContent = styleLiteral.trim();
                this.htmlElement.appendChild(style);
            }

            // context
            let context = Object.assign({}, this.getContext());
            context['data'] = this.bindData;

            // check if
            checkIf(this.htmlElement, context);

            // initialize
            initialize(this.htmlElement, context);

            // execute script
            executeScript(this.htmlElement, context);
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