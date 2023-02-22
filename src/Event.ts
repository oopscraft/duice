namespace duice {

    /**
     * Event
     */
    export class Event {

        type: symbol;

        detail: object;

        /**
         * constructor
         */
        constructor(type: symbol, detail: object) {
            this.type = type;
            this.detail = detail;
        }

        /**
         * getType
         */
        getType(): symbol {
            return this.type;
        }

        /**
         * getDetail
         */
        getDetail(name: string): any {
            return this.detail[name];
        }
    }

}