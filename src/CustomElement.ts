///<reference path="Observable.ts"/>
namespace duice {

    /**
     * custom element
     */
    export abstract class CustomElement<V> extends DataElement<HTMLElement, V> {

        slot: HTMLSlotElement = document.createElement('slot');

        /**
         * constructor
         * @param htmlElement
         * @param bindData
         * @param context
         */
        protected constructor(htmlElement: HTMLElement, bindData: V, context: object) {
            super(htmlElement, bindData, context);

            // replace with slot for position
            if(htmlElement.shadowRoot) {
                this.htmlElement.shadowRoot.appendChild(this.slot);
            }else{
                htmlElement.appendChild(this.slot);
            }
        }

        /**
         * render
         */
        override render(): void {

            // removes child
            this.slot.innerHTML = '';

            // add style if exists
            let styleLiteral = this.doStyle(this.getBindData());
            if(styleLiteral){
                let style = document.createElement('style');
                style.textContent = styleLiteral.trim();
                this.slot.appendChild(style);
            }

            // create template element
            let templateElement = this.doRender(this.getBindData());
            this.slot.appendChild(templateElement);

            // context
            let context = Object.assign({}, this.getContext());
            context['data'] = this.bindData;

            // check if
            runIfCode(this.htmlElement, context);

            // initialize
            initialize(this.htmlElement, context);

            // execute script
            runExecuteCode(this.htmlElement, context);
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