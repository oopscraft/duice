namespace duice {

    /**
     * ElementFactory
     */
    export class ElementSetFactory<T extends ElementSet<any>> {

        /**
         * get instance
         * @param htmlElement
         */
        static getInstance(htmlElement: HTMLElement): ElementSetFactory<ElementSet<any>> {
            return new ElementSetFactory();
        }

        /**
         * createElementSet
         * @param htmlElement
         */
        createElementSet(htmlElement: HTMLElement, context: object): ElementSet<any> {

            // creates element set
            let elementSet = new ElementSet(htmlElement, context);

            // find data set
            let dataSet = getAttribute(htmlElement, 'data-set');
            elementSet.setDataSet(dataSet);

            // loop
            let loop = getAttribute(htmlElement, 'loop');
            if(loop){
                elementSet.setLoop(loop);
            }

            // returns
            return elementSet;
        }

    }

}