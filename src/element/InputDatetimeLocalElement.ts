import {InputElement} from "./InputElement";
import {DateFormat} from "../format/DateFormat";

export class InputDatetimeLocalElement extends InputElement {

    dateFormat: DateFormat = new DateFormat('yyyy-MM-ddTHH:mm');

    constructor(element: HTMLInputElement, bindData: object, context: object) {
        super(element, bindData, context);
    }

    override setValue(value: string): void {
        if(value) {
            this.getHtmlElement().value = this.dateFormat.format(value);
        }else{
            this.getHtmlElement().value = '';
        }
    }

    override getValue(): any {
        let value = this.getHtmlElement().value;
        if(value) {
            return new Date(value).toISOString();
        }else{
            return null;
        }
    }

}
