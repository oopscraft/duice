namespace duice {

    /**
     * Component
     */
    export abstract class Component extends HTMLElement {

        htmlElement: HTMLElement;

        /**
         * constructor
         * @param htmlElement
         * @param context
         * @protected
         */
        protected constructor() {
            super();
            this.attachShadow({mode: 'open'});

            let templateElement = document.createElement('template');
            templateElement.innerHTML = this.template();
            this.htmlElement = templateElement.content.firstChild as HTMLElement;
            this.shadowRoot.appendChild(this.htmlElement);

        }


        abstract template(): string;

        render(): void {

            let context = {};
            initialize(this.shadowRoot, {});


            this.doRender();
        }

        abstract doRender(): void;

        /**
         * update
         * @param observable
         * @param event
         */
        update(observable: object, event: duice.Event): void {
            this.doUpdate(observable, event);
        }

        abstract doUpdate(observable: object, event: duice.Event): void;

    }


}