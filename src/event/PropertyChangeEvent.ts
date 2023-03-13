namespace duice {

    /**
     * PropertyChangeEvent
     */
    export class PropertyChangeEvent extends Event {

        property: string;

        value: any;

        index: number;

        /**
         * constructor
         * @param source
         * @param property
         * @param value
         */
        constructor(source: any, property: string, value: any, index?: number){
            super(source);
            this.property = property;
            this.value = value;
            this.index = index;
        }

        /**
         * getProperty
         */
        getProperty(): string {
            return this.property;
        }

        /**
         * getValue
         */
        getValue(): any {
            return this.value;
        }

        /**
         * getIndex
         */
        getIndex(): number {
            return this.index;
        }

    }

}