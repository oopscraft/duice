namespace duice {

    /**
     * MapElement
     */
    export interface MapElement extends Element {

        /**
         * setEnable
         * @param enable
         */
        setEnable(enable: boolean): void;

        /**
         * setReadonly
         * @param readonly
         */
        setReadonly(readonly: boolean): void;

        /**
         * setFocus
         * @param focus
         */
        setFocus(focus: boolean): void;

    }

}
