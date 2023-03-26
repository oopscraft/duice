///<reference path="Observable.ts"/>
namespace duice {

    /**
     * custom component
     */
    export class CustomComponent<T> extends Component<CustomElement> {

        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: CustomElement, context: object) {
            super(element, context);
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
         * check element is shadow DOM
         */
        isShadowDom(): boolean {
            return (!!this.element.shadowRoot);
        }

        /**
         * render
         */
        override render(): void {

            // removes child
            if(this.isShadowDom()){
                this.element.shadowRoot.innerHTML = '';
            }else{
                this.element.innerHTML = '';
            }

            // create template element
            let templateLiteral = this.element.doRender(this.getData()).trim();
            let templateElement = document.createElement('template');
            templateElement.innerHTML = templateLiteral;
            let htmlElement = templateElement.content.firstChild.cloneNode(true) as HTMLElement;
            if(this.element.shadowRoot){
                this.element.shadowRoot.appendChild(htmlElement);
            }else{
                this.element.appendChild(htmlElement);
            }

            // add style if exists
            let styleLiteral = this.element.doStyle(this.getData());
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
            let context = {};
            Object.assign(context, this.context);
            context['object'] = this.data;
            context['array'] = this.data;

            // globalThis.alert("start init");
            if(this.isShadowDom()){
                initialize(this.element.shadowRoot, context);
            }else{
                initialize(this.element, context);
            }
            // globalThis.alert('end');
            // execute script
            this.executeScript();
        }

        /**
         * update
         * @param observable
         * @param event
         */
        override update(observable: Observable, event: duice.Event): void {
            if(observable instanceof DataHandler) {
                this.render();
            }
        }

    }

}