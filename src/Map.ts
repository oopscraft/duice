namespace duice {

    /**
     * MapProxy
     */
    export class Map extends globalThis.Map<string,any> {

        readonly = {};

        disable = {};

        /**
         * constructor
         * @param object
         */
        constructor(object: object) {
            super(Object.entries(object));
            return new Proxy(this, new MapHandler(this));
        }

        /**
         * setReadonly
         * @param readonly
         */
        setReadonly(key: string, readonly: boolean): void {
            this.readonly[key] = readonly;
        }

        /**
         * isReadonly
         */
        isReadonly(key: string): boolean {
            return this.readonly[key];
        }

    }

}