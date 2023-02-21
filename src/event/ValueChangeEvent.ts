namespace duice {

    export namespace event {

        export class ValueChangeEvent extends Event {

            name: string;

            value: any;

            /**
             * constructor
             * @param type
             * @param data
             */
            constructor(name: string, value: any) {
                super();
                this.name = name;
                this.value = value;
            }

            getName(): string {
                return this.name;
            }

            getValue(): any {
                return this.value;
            }
        }

    }

}