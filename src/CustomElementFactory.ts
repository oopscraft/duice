///<reference path="DataElementFactory.ts"/>
namespace duice {

    export class CustomElementFactory<V> extends DataElementFactory<HTMLElement, V> {

        elementType: Function;

        constructor(elementType: Function) {
            super();
            this.elementType = elementType;
        }

        override createElement(htmlElement: HTMLElement, bindData: V, context: object): DataElement<any, any> {
            return  Reflect.construct(this.elementType, [htmlElement, bindData, context]);
        }

    }

}