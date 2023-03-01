namespace duice.mask {

    export class MaskFactory {

        /**
         * getMask
         * @param mask
         */
        static getMask(mask: string): mask.Mask<any> {
            if(mask.startsWith('string')){
                mask = mask.replace('string', 'StringMask');
            }
            if(mask.startsWith('number')){
                mask = mask.replace('number', 'NumberMask');
            }
            if(mask.startsWith('date')){
                mask = mask.replace('date', 'DateMask');
            }
            return Function(`return new duice.mask.${mask};`).call(null);
        }

    }

}