namespace duice {

    /**
     * ArrayElement
     */
    export class ArrayElement extends Element<object[]> {

        loop: string;

        /**
         * constructor
         * @param htmlElement
         */
        constructor(htmlElement: HTMLElement) {
            super(htmlElement);
        }

        /**
         * set loop
         * @param loop
         */
        setLoop(loop: string): void {
            this.loop = loop;
        }

        /**
         * get loop
         */
        getLoop(): string {
            return this.loop;
        }

        /**
         * doRender
         * @param array
         */
        doRender(array: object[]): void {
            console.log('ArrayElement.doRender', array);
        }

        /**
         * update
         * @param array
         * @param detail
         */
        doUpdate(array: object[], detail: object): void {
            console.log('ArrayElement.doUpdate', array, detail);
        }

    }
}