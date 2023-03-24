namespace duice {

    /**
     * Component
     */
    export abstract class Component extends HTMLElement {

        /**
         * constructor
         * @param htmlElement
         * @param context
         * @protected
         */
        protected constructor() {
            super();
            this.attachShadow({mode: 'open'});

            // let templateElement = document.createElement('template');
            // templateElement.innerHTML = this.template();
            // this.htmlElement = templateElement.content.firstChild.cloneNode(true) as HTMLElement;
            //
            // //setAttribute(this.htmlElement, 'id', 'testfdfdfd');
            //
            // initialize(this.htmlElement, {});
            // //markInitialized(this.htmlElement);
            // this.shadowRoot.appendChild(this.htmlElement);
            // //initialize(this.shadowRoot, {});
            // console.log("========== tagName:", this.tagName);

        }

        abstract doTemplate(data?: DataProxy): string;

        abstract doStyle(data?: DataProxy): string;

        abstract doRender(data?: DataProxy): void;

        abstract doUpdate(data: DataProxy, event: duice.Event): void;

    }


}