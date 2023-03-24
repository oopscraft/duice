namespace duice {

    /**
     * ComponentControl
     */
    export class ComponentControl extends Observable implements Observer {

        element: Component;

        context: object;

        data: any;

        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: Component, context: object) {
            super();
            this.element = element;
            this.context = context;
        }

        /**
         * setData
         * @param objectName
         */
        setObject(objectName: string): void {
            this.data = findObject(this.context, objectName);
            if(!this.data){
                console.warn(`ObjectProxy[${objectName}] is not found.`, this.data);
                this.data = new ObjectProxy({});
            }
            let objectHandler = ObjectProxy.getHandler(this.data);
            this.addObserver(objectHandler);
            objectHandler.addObserver(this);
        }

        /**
         * setArray
         * @param arrayName
         */
        setArray(arrayName: string): void {
            this.data = findObject(this.context, arrayName);
            if(!this.data){
                console.warn(`ArrayProxy[${arrayName}] is not found.`, this.data);
                this.data = new ArrayProxy([]);
            }
            let arrayHandler = ArrayProxy.getHandler(this.data);
            this.addObserver(arrayHandler);
            arrayHandler.addObserver(this);
        }

        /**
         * check shadow DOM
         */
        isShadowDom(): boolean {
            return (!!this.element.shadowRoot);
        }

        /**
         * render
         */
        render(): void {
            this.doRender(this.data);
            this.executeScript();
        }

        /**
         * doRender
         * @param data
         */
        doRender(data: any): void {

            // removes child
            if(this.isShadowDom()){
                removeChildNodes(this.element.shadowRoot);
            }else{
                removeChildNodes(this.element);
            }

            // create template element
            let templateLiteral = this.element.doRender(data).trim();
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
                object: this.data,
                array: this.data
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
            if(observable instanceof ProxyHandler) {
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