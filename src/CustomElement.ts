///<reference path="Observable.ts"/>
namespace duice {

    /**
     * custom element
     */
    export abstract class CustomElement extends Element<HTMLElement> {

        /**
         * constructor
         * @param htmlElement
         * @param context
         */
        protected constructor(htmlElement: HTMLElement, context: object) {
            super(htmlElement, context);
        }

        /**
         * set object data
         * @param objectName
         */
        setObject(objectName: string): void {
            this.setData(objectName);
        }

        /**
         * set array data
         * @param arrayName
         */
        setArray(arrayName: string): void {
            this.setData(arrayName);
        }

        /**
         * render
         */
        override render(): void {

            // removes child
            this.htmlElement.innerHTML = '';

            // create template element
            let templateLiteral = this.doRender(this.getData()).trim();
            let templateElement = document.createElement('template');
            templateElement.innerHTML = templateLiteral;
            let htmlElement = templateElement.content.firstChild.cloneNode(true) as HTMLElement;
            if(this.htmlElement.shadowRoot){
                this.htmlElement.shadowRoot.appendChild(htmlElement);
            }else{
                this.htmlElement.appendChild(htmlElement);
            }

            // add style if exists
            let styleLiteral = this.doStyle(this.getData());
            if(styleLiteral){
                let style = document.createElement('style');
                style.textContent = styleLiteral.trim();
                this.htmlElement.appendChild(style);
            }

            // initializes
            let context = {};
            Object.assign(context, this.context);
            context['object'] = this.data;
            context['array'] = this.data;
            initialize(this.htmlElement, context);

            // execute script
            this.executeScript();
        }

        /**
         * do render template method
         * @param data
         */
        abstract doRender(data: Data): string;

        /**
         * setting style
         * @param data
         */
        doStyle(data: Data): string {
            return null;
        }

        /**
         * update
         * @param observable
         * @param event
         */
        override update(observable: Observable, event: event.Event): void {
            if(observable instanceof DataHandler) {
                this.render();
            }
        }

    }

}