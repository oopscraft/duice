namespace duice {

    /**
     * array element factory registry class
     */
    export class ArrayElementFactoryRegistry {

        static defaultInstance = new ArrayElementFactory<HTMLElement>();

        static instances: ArrayElementFactory<HTMLElement>[] = [];

        /**
         * adds factory instance
         * @param elementFactory
         */
        static addInstance(elementFactory: ArrayElementFactory<HTMLElement>): void {
            this.instances.push(elementFactory);
        }

        /**
         * return factory instance
         * @param htmlElement
         */
        static getInstance(htmlElement: HTMLElement): ArrayElementFactory<HTMLElement> {
            for (let componentFactory of this.instances) {
                if (componentFactory.support(htmlElement)) {
                    return componentFactory;
                }
            }
            if (this.defaultInstance.support(htmlElement)) {
                return this.defaultInstance;
            }
            return null;
        }
    }
}