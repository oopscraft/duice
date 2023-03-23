namespace duice {

    /**
     * Component
     */
    export abstract class Component extends HTMLElement {


        htmlElement: HTMLElement;

        context: object;

        objectProxy: ObjectProxy;

        observable: Observable = new duice.Observable();


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
            this.htmlElement = templateElement.content.firstChild.cloneNode(true) as HTMLElement;

            //setAttribute(this.htmlElement, 'id', 'testfdfdfd');

            initialize(this.htmlElement, {});
            //markInitialized(this.htmlElement);
            this.shadowRoot.appendChild(this.htmlElement);
            //initialize(this.shadowRoot, {});
            console.log("========== tagName:", this.tagName);

        }

        // setContext(context: object): void {
        //     this.context = context;
        // }
        //
        // setObject(objectName: string): void {
        //     this.objectProxy = findObject(this.context, objectName);
        //     if(!this.objectProxy){
        //         console.warn(`ObjectProxy[${objectName}] is not found.`, this.objectProxy);
        //         this.objectProxy = new ObjectProxy({});
        //     }
        //     let objectHandler = ObjectProxy.getHandler(this.objectProxy);
        //     this.observable.addObserver(objectHandler);
        //     // objectHandler.addObserver(this);
        // }
        //
        // setArray(arrayName: string): void {
        //
        // }

        template(): string {
            return this.doTemplate();
        }


        // setObject(objectName: string, context: object): void {
        //     this.context = context;
        //     this.objectProxy = findObject(this.context, objectName);
        //     if(!this.objectProxy){
        //         console.warn(`ObjectProxy[${objectName}] is not found.`, this.objectProxy);
        //         this.objectProxy = new ObjectProxy({});
        //     }
        //     // let objectHandler = ObjectProxy.getHandler(this.objectProxy);
        //     // addObserver(objectHandler);
        //     // objectHandler.addObserver(this);
        // }

        abstract doTemplate(): string;

        render(): void {
            console.log("================ render", this.htmlElement);
            initialize(this.htmlElement, this.context);
            this.doRender();
            markInitialized(this.htmlElement);
        }

        abstract doRender(): void;

        // /**
        //  * update
        //  * @param observable
        //  * @param event
        //  */
        // update(observable: object, event: duice.Event): void {
        //     this.doUpdate(observable, event);
        // }
        //
        // abstract doUpdate(observable: object, event: duice.Event): void;

    }


}