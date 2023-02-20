namespace duice {
    export class Event {
        source: object;
        constructor(source: object, data: object) {
            this.source = source;
        }
        getSource(): object {
            return this.source;
        }
    }
}