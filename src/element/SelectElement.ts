import {ObjectElement} from "../ObjectElement";
import {findVariable, getElementAttribute} from "../common";
import {Observable} from "../Observable";
import {DataEvent} from "../event/DataEvent";
import {PropertyChangeEvent} from "../event/PropertyChangeEvent";
import {ArrayProxy} from "../ArrayProxy";

export class SelectElement extends ObjectElement<HTMLSelectElement> {

    option: object[];

    optionValueProperty: string;

    optionTextProperty: string;

    defaultOptions: HTMLOptionElement[] = [];

    constructor(element: HTMLSelectElement, bindData: object, context: object){
        super(element, bindData, context);

        // adds event listener
        this.getHtmlElement().addEventListener('change', () => {
            let event = new PropertyChangeEvent(this, this.getProperty(), this.getValue(), this.getIndex());
            this.notifyObservers(event);
        }, true);

        // stores default option
        for(let i = 0; i < this.getHtmlElement().options.length; i ++){
            this.defaultOptions.push(this.getHtmlElement().options[i])
        }

        // option property
        let optionName = getElementAttribute(this.getHtmlElement(),'option');
        if(optionName) {
            this.option = findVariable(this.getContext(), optionName);
            this.optionValueProperty = getElementAttribute(this.getHtmlElement(), 'option-value-property');
            this.optionTextProperty = getElementAttribute(this.getHtmlElement(), 'option-text-property');
            ArrayProxy.getHandler(this.option).addObserver(this);
            this.updateOptions();
        }
    }

    updateOptions(): void {
        let value = this.getHtmlElement().value;
        this.getHtmlElement().innerHTML = '';
        this.defaultOptions.forEach(defaultOption => {
            this.getHtmlElement().appendChild(defaultOption);
        });
        this.option.forEach(data => {
            let option = document.createElement('option');
            option.value = data[this.optionValueProperty];
            option.appendChild(document.createTextNode(data[this.optionTextProperty]));
            this.getHtmlElement().appendChild(option);
        });
        this.getHtmlElement().value = value;
    }

    override update(observable: Observable, dataEvent: DataEvent): void {
        super.update(observable, dataEvent);
        if(this.option) {
            this.updateOptions();
        }
    }

    override setValue(value: any): void {
        this.getHtmlElement().value = value;

        // force select option
        if(!value) {
            for(let i = 0; i < this.getHtmlElement().options.length; i++){
                let option = this.getHtmlElement().options[i];
                if(!option.nodeValue){
                    option.selected = true;
                    break;
                }
            }
        }
    }

    override getValue(): any {
        let value = this.getHtmlElement().value;
        if(!value || value.trim().length < 1) {
            value = null;
        }
        return value;
    }

    override setReadonly(readonly: boolean): void {
        if(readonly){
            console.warn("==ok");
            this.getHtmlElement().style.pointerEvents = 'none';
        }else{
            this.getHtmlElement().style.pointerEvents = '';
        }
    }

    override setDisable(disable: boolean): void {
        if(disable) {
            this.getHtmlElement().setAttribute('disabled', 'disabled');
        }else{
            this.getHtmlElement().removeAttribute('disabled');
        }
    }

}
