///<reference path="Observable.ts"/>
///<reference path="./format/FormatFactory.ts"/>
///<reference path="DataElement.ts"/>
namespace duice {

    export class ObjectElement<T extends HTMLElement> extends DataElement<T, object> {

        property: string;

        format: format.Format;

        constructor(htmlElement: T, bindData: object, context: object) {
            super(htmlElement, bindData, context);
        }

        setProperty(property: string): void {
            this.property = property;
        }

        getProperty(): string {
            return this.property;
        }

        setFormat(format: string): void {
            this.format = duice.format.FormatFactory.getFormat(format);
        }

        getFormat(): format.Format {
            return this.format;
        }

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

        checkIf(): void {
            let context = Object.assign({}, this.getContext());
            context[this.getBindName()] = this.getBindData();
            runIfCode(this.htmlElement, context);
        }

        executeScript(): void {
            let context = Object.assign({}, this.getContext());
            context[this.getBindName()] = this.getBindData();
            runExecuteCode(this.htmlElement, context);
        }

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

        setValue(value: any): void {
            if(value !== undefined && value !== null) {
                value = this.getFormat() ? this.getFormat().format(value) : value;
                this.htmlElement.innerText = value;
            }else{
                this.htmlElement.innerText = '';
            }
        }

        getValue(): any {
            let value = this.htmlElement.innerText;
            if(value && value.trim().length > 0) {
                value = this.getFormat() ? this.getFormat().parse(value) : value;
            }else{
                value = null;
            }
            return value;
        }

        setReadonly(readonly: boolean): void {
            // no-op
        }

        setDisable(disable: boolean): void {
            // no-op
        }

        getIndex(): number {
            let index = getElementAttribute(this.htmlElement, 'index');
            if(index){
                return Number(index);
            }
        }

        focus(): boolean {
            // no-ops
            return false;
        }

    }

}