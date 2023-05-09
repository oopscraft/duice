namespace duice.format {

    /**
     * format interface
     */
    export interface Format {

        /**
         * Encodes original value as formatted value
         * @param value value
         * @return formatted value
         */
        format(value: any): any;

        /**
         * Decodes formatted value to original value
         * @param value value
         * @return original value
         */
        parse(value: any): any;

    }

}

