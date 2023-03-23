namespace duice {

    /**
     * ElementFactory
     */
    export class LoopControlFactory<T extends LoopControl<any>> {

        /**
         * get instance
         * @param element
         */
        static getInstance(element: HTMLElement): LoopControlFactory<LoopControl<any>> {
            return new LoopControlFactory();
        }

        /**
         * creates loop control
         * @param element
         */
        createLoopControl(element: HTMLElement, context: object): LoopControl<any> {

            // creates element set
            let loopControl = new LoopControl(element, context);

            // find data set
            let array = getAttribute(element, 'array');
            loopControl.setArray(array);

            // loop
            let loop = getAttribute(element, 'loop');
            if(loop){
                loopControl.setLoop(loop);
            }

            // editable
            let editable = getAttribute(element, 'editable');
            if(editable){
                loopControl.setEditable(editable.toLowerCase() === 'true');
            }

            // returns
            return loopControl;
        }

    }

}