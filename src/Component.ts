
namespace duice {

    export abstract class Component<T> {

        element: HTMLElement;

        protected constructor(element: HTMLElement) {
            this.element = element;
            this.setAttribute("id", generateUuid());
        }

        hasAttribute(name: string): boolean {
            return this.element.hasAttribute(`${getAlias()}-${name}`)
        }

        getAttribute(name: string): string {
            return this.element.getAttribute(`${getAlias()}-${name}`);
        }

        setAttribute(name: string, value: string): void {
            this.element.setAttribute(`${getAlias()}-${name}`, value);
        }

    }

}