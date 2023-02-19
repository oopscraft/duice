///<reference path="Event.ts"/>

namespace duice.event {

    export class ReadOnlyEvent implements Event {

        key: string;

        readonly: boolean;

        /**
         * constructor
         * @param source
         */
        public constructor(key: string, readonly: boolean) {
            this.key = key;
            this.readonly = readonly;
        }

        public isReadOnly(): any {
            return this.readonly;
        }
    }

}