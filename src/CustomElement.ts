///<reference path="Observable.ts"/>
namespace duice {

    export abstract class CustomElement<V> extends DataElement<HTMLElement, V> {

        slot: HTMLSlotElement = document.createElement('slot');

        protected constructor(htmlElement: HTMLElement, bindData: V, context: object) {
            super(htmlElement, bindData, context);

            // replace with slot for position
            if(htmlElement.shadowRoot) {
                this.htmlElement.shadowRoot.appendChild(this.slot);
            }else{
                htmlElement.appendChild(this.slot);
            }
        }

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

        abstract doRender(data: V): HTMLElement;

        override update(observable: Observable, event: event.Event): void {
            if(observable instanceof DataHandler) {
                this.doUpdate(observable as V);
            }
        }

        abstract doUpdate(data: V): void;

        doStyle(data: V): string {
            return null;
        }

        createElement(templateLiteral: string): HTMLElement {
            let templateElement = document.createElement('template');
            templateElement.innerHTML = templateLiteral;
            return templateElement.content.firstElementChild.cloneNode(true) as HTMLElement;
        }

    }

}