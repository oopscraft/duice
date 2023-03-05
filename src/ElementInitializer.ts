namespace duice {

    export class ElementInitializer {

        /**
         * initializes elements
         * @param container
         * @param context
         */
        static initializeElement(container: HTMLElement, context: object): void {
            container.querySelectorAll(`*[${getAlias()}\\:bind]:not([${getAlias()}\\:id])`).forEach(htmlElement => {
                if (!htmlElement.hasAttribute(`${getAlias()}:id`)) {
                    let elementFactory = ElementFactory.getInstance(htmlElement as HTMLElement, context);
                    let element = elementFactory.createElement(htmlElement as HTMLElement, context);
                    element.render();
                }
            });
        }

    }
}