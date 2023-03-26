///<reference path="Observable.ts"/>
///<reference path="./mask/MaskFactory.ts"/>
///<reference path="Component.ts"/>
namespace duice {

    /**
     * object component class
     */
    export class ObjectComponent<T extends HTMLElement> extends Component<T> {

        property: string;

        mask: Mask;

        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: T, context: object) {
            super(element, context);
        }

        /**
         * set object
         * @param objectName
         */
        setObject(objectName: string): void {
            this.setData(objectName);
        }

        /**
         * set property
         * @param property
         */
        setProperty(property: string): void {
            this.property = property;
        }

        /**
         * return property
         */
        getProperty(): string {
            return this.property;
        }

        /**
         * set mask
         * @param mask
         */
        setMask(mask: string): void {
            this.mask = MaskFactory.getMask(mask);
        }

        /**
         * return mask
         */
        getMask(): Mask {
            return this.mask;
        }

        /**
         * render
         */
        override render(): void {
            if(this.property){
                let objectHandler = ObjectProxy.getHandler(this.getData());

                // set value
                let value = objectHandler.getValue(this.property);
                this.setValue(value);

                // set readonly
                let readonly = objectHandler.isReadonly(this.property);
                this.setReadonly(readonly);
            }

            // executes script
            this.executeScript();
        }

        /**
         * update event received
         * @param observable
         * @param event
         */
        override update(observable: Observable, event: Event): void {
            console.log('Element.update', observable, event);

            // ObjectHandler
            if(observable instanceof ObjectHandler) {
                if(this.property){

                    // set value
                    this.setValue(observable.getValue(this.property));

                    // set readonly
                    this.setReadonly(observable.isReadonly(this.property));
                }

                // executes script
                this.executeScript();
            }
        }

        /**
         * set value
         * @param value
         */
        setValue(value: any): void {
            value = this.getMask() ? this.getMask().encode(value) : value;
            this.element.innerText = value;
        }

        /**
         * return value
         */
        getValue(): any {
            let value = this.element.innerText;
            value = this.getMask() ? this.getMask().decode(value) : value;
            return value;
        }

        /**
         * set readonly
         * @param readonly
         */
        setReadonly(readonly: boolean): void {
            // no-op
        }

        /**
         * return index
         */
        getIndex(): number {
            let index = getComponentAttribute(this.element, 'index');
            if(index){
                return Number(index);
            }
        }

    }

}