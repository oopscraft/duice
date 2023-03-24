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
         * check shadow DOM
         */
        isShadowDom(): boolean {
            if(this.element.shadowRoot){
                return true;
            }else{
                return false;
            }
        }

        /**
         * render
         */
        render(): void {
            this.doRender(this.dataProxy);
            this.executeScript();
        }

        /**
         * doRender
         * @param data
         */
        doRender(data: DataProxy): void {

            // removes child
            if(this.isShadowDom()){
                removeChildNodes(this.element.shadowRoot);
            }else{
                removeChildNodes(this.element);
            }

            // create template element
            let templateLiteral = this.element.doTemplate(data).trim();
            let templateElement = document.createElement('template');
            templateElement.innerHTML = templateLiteral;
            let htmlElement = templateElement.content.firstChild.cloneNode(true) as HTMLElement;
            if(this.element.shadowRoot){
                this.element.shadowRoot.appendChild(htmlElement);
            }else{
                this.element.appendChild(htmlElement);
            }

            // add style if exists
            let styleLiteral = this.element.doStyle(data);
            if(styleLiteral){
                let style = document.createElement('style');
                style.textContent = styleLiteral.trim();
                if(this.isShadowDom()){
                    this.element.shadowRoot.appendChild(style);
                }else{
                    this.element.appendChild(style);
                }
            }

            // initializes shadow root
            let context = {
                data: data
            };
            if(this.isShadowDom()){
                initialize(this.element.shadowRoot, context);
            }else{
                initialize(this.element, context);
            }
        }

        /**
         * update
         * @param observable
         * @param event
         */
        update(observable: Observable, event: duice.Event): void {
            console.log("ComponentControl.update", observable, event);
            if(observable instanceof DataHandler) {
                this.doRender(observable.getTarget());
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