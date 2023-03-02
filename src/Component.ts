namespace duice {

    /**
     * Component
     */
    export abstract class Component<T> {

        id: string;

        element: HTMLElement;

        context: object;

        handler: Handler<T>;

        slotElement: HTMLSlotElement;

        stageElements: HTMLElement[] = [];

        /**
         * constructor
         * @param element
         * @protected
         */
        protected constructor(element: HTMLElement, context: object) {
            this.id = this.generateId();
            this.setAttribute(element, "id", this.id);
            this.element = element;
            this.context = context;

            // create slot element
            this.slotElement = document.createElement('slot');
            this.element.replaceWith(this.slotElement);
        }

        /**
         * render
         */
        render(): void {

            // clear
            this.clearStage();

            // executes condition
            if(!this.checkIf()) {
                return;
            }

            // calls template method
            this.doRender();

            // executes script
            this.executeScript();
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

            // clear
            this.clearStage();

            // check condition
            if(!this.checkIf()){
                return;
            }

            // calls template method
            this.doUpdate(detail);

            // executes script
            this.executeScript();
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
         * clears stage
         */
        clearStage(): void {
            for(let i = this.stageElements.length - 1; i >= 0; i --) {
                this.slotElement.parentElement.removeChild(this.stageElements.pop());
            }
        }

        /**
         * appends to stage
         * @param element
         */
        appendToStage(element: HTMLElement): void {
            this.stageElements.push(element);
            this.slotElement.parentNode.insertBefore(element, this.slotElement);
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
         * checkIf
         */
        checkIf(): boolean {
            let ifAttribute = this.getAttribute(this.element, 'if');
            if(ifAttribute){
                let args = [];
                let values = [];
                for(let property in this.context){
                    args.push(property);
                    values.push(this.context[property])
                }
                let ifFunction = `return ${ifAttribute};`;
                let result = Function(...args, ifFunction).call(this.element, ...values);
                if(result === true){
                    return true;
                }else{
                    return false;
                }
            }else{
                return true;
            }
        }

        /**
         * executes script
         */
        executeScript(): any {
            let scriptAttribute = this.getAttribute(this.element, 'script');
            let args = [];
            let values = [];
            for(let property in this.context){
                args.push(property);
                values.push(this.context[property]);
            }
            return Function(...args, scriptAttribute).call(this.element, ...values);
        }

    }

}
