namespace duice.event {

    export class PropertyChangeEvent extends Event {

        property: string;

        value: any;

        index: number;

        constructor(source: any, property: string, value: any, index?: number){
            super(source);
            this.property = property;
            this.value = value;
            this.index = index;
        }

        getProperty(): string {
            return this.property;
        }

        getValue(): any {
            return this.value;
        }

        getIndex(): number {
            return this.index;
        }

    }

}