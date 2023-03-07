namespace duice {

    export class DataSetMeta {

        readonlyAll: boolean = false;

        readonly: Set<string> = new Set<string>();

        /**
         * setReadonlyAll
         * @param readonly
         */
        setReadonlyAll(readonly: boolean): void {
            this.readonlyAll = readonly;
        }

        /**
         * setReadonly
         * @param property
         * @param readonly
         */
        setReadonly(property: string, readonly: boolean): void {
            if(readonly){
                this.readonly.add(property);
            }else{
                this.readonly.delete(property);
            }
        }

        /**
         * isReadonly
         * @param property
         */
        isReadonly(property: string): boolean {
            if(this.readonlyAll || this.readonly.has(property)){
                return true;
            }else{
                return false;
            }
        }

    }

}