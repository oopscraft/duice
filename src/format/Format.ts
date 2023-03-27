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
        encode(value: any): any;

        /**
         * Decodes formatted value to original value
         * @param value value
         * @return original value
         */
        decode(value: any): any;

    }

}

