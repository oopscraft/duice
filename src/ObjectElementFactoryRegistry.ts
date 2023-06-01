namespace duice {

    /**
     * object element factory class
     */
    export class ObjectElementFactoryRegistry {

        static defaultInstance = new ObjectElementFactory();

        static instances: ObjectElementFactory<HTMLElement>[] = [];

        /**
         * adds factory instance to registry
         * @param elementFactory
         */
        static addInstance(elementFactory: ObjectElementFactory<HTMLElement>): void {
            this.instances.push(elementFactory);
        }

        /**
         * returns supported instance
         * @param htmlElement
         */
        static getInstance(htmlElement: HTMLElement): ObjectElementFactory<HTMLElement> {
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
