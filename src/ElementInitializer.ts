namespace duice {

    export class ElementInitializer {

        static initializeElement(container: HTMLElement, context: object): void {
            container.querySelectorAll(`*[${getAlias()}\\:bind]:not([${getAlias()}\\:id])`).forEach(htmlElement => {
                if (!htmlElement.hasAttribute(`${getAlias()}:id`)) {
                    let element = ElementFactory.createElement(htmlElement as HTMLElement, context);
                    element.render();
                }
            });
        }

    }
}