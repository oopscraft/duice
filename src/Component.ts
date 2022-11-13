
namespace duice {

    /**
     * Component
     */
    export abstract class Component<T> {

        element: HTMLElement;

        /**
         * constructor
         * @param element
         * @protected
         */
        protected constructor(element: HTMLElement) {
            this.element = element;
            this.setAttribute("id", generateUuid());
        }

        /**
         * hasAttribute
         * @param name
         */
        hasAttribute(name: string): boolean {
            return this.element.hasAttribute(`${getAlias()}:${name}`)
        }

        /**
         * getAttribute
         * @param name
         */
        getAttribute(name: string): string {
            return this.element.getAttribute(`${getAlias()}:${name}`);
        }

        /**
         * setAttribute
         * @param name
         * @param value
         */
        setAttribute(name: string, value: string): void {
            this.element.setAttribute(`${getAlias()}:${name}`, value);
        }

    }

}