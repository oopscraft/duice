///<reference path="Observable.ts"/>
///<reference path="./format/FormatFactory.ts"/>
///<reference path="DataElement.ts"/>
namespace duice {

    /**
     * object element class
     */
    export class ObjectElement<T extends HTMLElement> extends DataElement<T, object> {

        property: string;

        format: format.Format;

        /**
         * constructor
         * @param htmlElement
         * @param bindData
         * @param context
         */
        constructor(htmlElement: T, bindData: object, context: object) {
            super(htmlElement, bindData, context);
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
         * set format
         * @param format
         */
        setFormat(format: string): void {
            this.format = duice.format.FormatFactory.getFormat(format);
        }

        /**
         * return format
         */
        getFormat(): format.Format {
            return this.format;
        }

        /**
         * render
         */
        override render(): void {

            // check if
            this.checkIf();

            if(this.property){
                let objectHandler = ObjectProxy.getHandler(this.getBindData());

                // set value
                let value = objectHandler.getValue(this.property);
                this.setValue(value);

                // set readonly
                let readonly = objectHandler.isReadonly(this.property);
                this.setReadonly(readonly);

                // set disable
                let disable = objectHandler.isDisable(this.property);
                this.setDisable(disable);
            }

            // executes script
            this.executeScript();
        }

        /**
         * check if
         */
        checkIf(): void {
            let context = Object.assign({}, this.getContext());
            context[this.getBindName()] = this.getBindData();
            checkIf(this.htmlElement, context);
        }

        /**
         * execute script
         */
        executeScript(): void {
            let context = Object.assign({}, this.getContext());
            context[this.getBindName()] = this.getBindData();
            executeScript(this.htmlElement, context);
        }

        /**
         * update event received
         * @param observable
         * @param event
         */
        override update(observable: Observable, event: event.Event): void {
            console.debug('ObjectElement.update', observable, event);

            // ObjectHandler
            if(observable instanceof ObjectHandler) {

                // check if
                this.checkIf();

                if(this.property){

                    // set value
                    this.setValue(observable.getValue(this.property));

                    // set readonly
                    this.setReadonly(observable.isReadonly(this.property));

                    // set disable
                    this.setDisable(observable.isDisable(this.property));
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
            if(value) {
                value = this.getFormat() ? this.getFormat().format(value) : value;
                this.htmlElement.innerText = value;
            }else{
                this.htmlElement.innerText = '';
            }
        }

        /**
         * return value
         */
        getValue(): any {
            let value = this.htmlElement.innerText;
            if(value && value.trim().length > 0) {
                value = this.getFormat() ? this.getFormat().parse(value) : value;
            }else{
                value = null;
            }
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
         * set disable
         * @param disable
         */
        setDisable(disable: boolean): void {
            // no-op
        }

        /**
         * return index
         */
        getIndex(): number {
            let index = getElementAttribute(this.htmlElement, 'index');
            if(index){
                return Number(index);
            }
        }

        /**
         * focus
         */
        focus(): boolean {
            // no-ops
            return false;
        }

    }

}