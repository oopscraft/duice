namespace duice {

    export class MaskFactory {

        /**
         * getMask
         * @param mask
         */
        static getMask(mask: string): Mask {
            if(mask.startsWith('string')){
                mask = mask.replace('string', 'StringMask');
            }
            if(mask.startsWith('number')){
                mask = mask.replace('number', 'NumberMask');
            }
            if(mask.startsWith('date')){
                mask = mask.replace('date', 'DateMask');
            }
            return Function(`return new duice.${mask};`).call(null);
        }

    }

}