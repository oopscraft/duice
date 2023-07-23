namespace duice {

    export abstract class DataElementFactory<T extends HTMLElement, V> {

        abstract createElement(htmlElement: T, bindData: V, context: object): DataElement<HTMLElement, V>;

    }

}