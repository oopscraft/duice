var duice;
(function (duice) {
    /**
     * Component
     */
    class Component {
        /**
         * constructor
         * @param element
         * @protected
         */
        constructor(element) {
            this.element = element;
            this.setAttribute("id", generateUuid());
        }
        /**
         * hasAttribute
         * @param name
         */
        hasAttribute(name) {
            return this.element.hasAttribute(`${getAlias()}-${name}`);
        }
        /**
         * getAttribute
         * @param name
         */
        getAttribute(name) {
            return this.element.getAttribute(`${getAlias()}-${name}`);
        }
        /**
         * setAttribute
         * @param name
         * @param value
         */
        setAttribute(name, value) {
            this.element.setAttribute(`${getAlias()}-${name}`, value);
        }
    }
    duice.Component = Component;
})(duice || (duice = {}));
