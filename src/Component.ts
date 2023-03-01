namespace duice {

    /**
     * Component
     */
    export abstract class Component<T> {

        element: HTMLElement;

        context: object;

        id: string;

        handler: Handler<T>;

        script: string;

        /**
         * constructor
         * @param element
         * @protected
         */
        protected constructor(element: HTMLElement, context: object) {
            this.element = element;
            this.context = context;
            this.id = this.generateId();
            this.setAttribute(element, "id", this.id);
            this.script = this.getAttribute(element, 'script');
        }

        /**
         * render
         */
        render(): void {

            // calls template method
            this.doRender();

            // executes script
            if(this.script){
                this.executeScript(this.script);
            }
        }

        /**
         * doRender
         */
        abstract doRender():void;

        /**
         * update
         * @param detail
         */
        update(detail: object): void {

            // calls template method
            this.doUpdate(detail);

            // executes script
            if(this.script){
                this.executeScript(this.script);
            }
        }

        /**
         * doUpdate
         * @param handler
         * @param detail
         */
        abstract doUpdate(detail: object): void;

        /**
         * notifyHandlers
         */
        notifyHandler(detail: object): void {
            this.handler.update(this, detail);
        }

        /**
         * Generates component ID
         * @return id
         */
        generateId(): string {
            let dt = new Date().getTime();
            let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                let r = (dt + Math.random()*16)%16 | 0;
                dt = Math.floor(dt/16);
                return (c=='x' ? r :(r&0x3|0x8)).toString(16);
            });
            return uuid;
        }

        /**
         * findObject
         * @param name
         */
        findObject(name: string): any {
            if(this.context[name]){
                return this.context[name];
            }
            if((<any>window).hasOwnProperty(name)){
                return (<any>window)[name];
            }
            return eval.call(this.context, name);
        }

        /**
         * hasAttribute
         * @param element
         * @param name
         */
        hasAttribute(element: Element, name: string): boolean {
            return element.hasAttribute(`${getAlias()}:${name}`)
        }

        /**
         * getAttribute
         * @param element
         * @param name
         */
        getAttribute(element: Element, name: string): string {
            return element.getAttribute(`${getAlias()}:${name}`);
        }

        /**
         * setAttribute
         * @param element
         * @param name
         * @param value
         */
        setAttribute(element: Element, name: string, value: string): void {
            element.setAttribute(`${getAlias()}:${name}`, value);
        }

        /**
         * removeChildNodes
         * @param element
         */
        removeChildNodes(element: HTMLElement): void {
            // Remove element nodes and prevent memory leaks
            let node, nodes = element.childNodes, i = 0;
            while (node = nodes[i++]) {
                if (node.nodeType === 1 ) {
                    element.removeChild(node);
                }
            }

            // Remove any remaining nodes
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }

            // If this is a select, ensure that it displays empty
            if(element instanceof HTMLSelectElement){
                (<HTMLSelectElement>element).options.length = 0;
            }
        }

        /**
         * executes script
         * @param code
         * @param context
         */
        executeScript(script: string):any {
            try {
                return Function(script).call(this.element, this.context);
            }catch(e){
                console.error(script);
                throw e;
            }
        }

    }

}
