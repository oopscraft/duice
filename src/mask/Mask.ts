namespace duice {

    /**
     * duice.Mask interface
     */
    export interface Mask<T> {

        /**
         * Encodes original value as formatted value
         * @param value value
         * @return formatted value
         */
        encode(value: T): string;

        /**
         * Decodes formatted value to original value
         * @param value value
         * @return original value
         */
        decode(value: string): T;
    }

}

