namespace duice {

    /**
     * ComponentControl
     */
    export class ComponentControl<T extends Component> extends Observable implements Observer {

        element: T;

        context: object;

        dataProxy: DataProxy;

        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: T, context: object) {
            super();
            this.element = element;
            this.context = context;
        }

        /**
         * setData
         * @param dataName
         */
        setData(dataName: string): void {
            this.dataProxy = findObject(this.context, dataName);
            if(!this.dataProxy){
                console.warn(`ObjectProxy[${dataName}] is not found.`, this.dataProxy);
                this.dataProxy = new ObjectProxy({});
            }
            let objectHandler = ObjectProxy.getHandler(this.dataProxy);
            this.addObserver(objectHandler);
            objectHandler.addObserver(this);
        }

        /**
         * template
          */
        template(): HTMLElement {
            let templateElement = document.createElement('template');
            templateElement.innerHTML = this.element.doTemplate();
            return templateElement.content.firstChild.cloneNode(true) as HTMLElement;
        }

        /**
         * render
         */
        render(): void {

            let templateElement = this.template();
            initialize(templateElement, this.context);
            this.element.shadowRoot.appendChild(templateElement);

            // calls template method
            this.element.doRender();

            // executes script
            this.executeScript();
        }

        /**
         * update
         * @param observable
         * @param event
         */
        update(observable: Observable, event: duice.Event): void {
            console.log("ComponentControl.update", observable, event);
            if(observable instanceof DataHandler) {
                this.element.doUpdate(observable.getTarget(), event);
                this.executeScript();
            }
        }

        /**
         * executes script
         */
        executeScript(): void {
            let script = getAttribute(this.element, 'script');
            if(script) {
                executeScript(script, this.element, this.context);
            }
        }

    }

}