///<reference path="Observable.ts"/>
namespace duice {

    /**
     * ObjectElement
     */
    export class ObjectElement extends Element<object> {

        property: string;

        childNode: Node;

        constructor(htmlElement: HTMLElement) {
            super(htmlElement);
        }

        /**
         * sets property
         * @param property
         */
        setProperty(property: string): void {
            this.property = property;
        }

        /**
         * gets property
         */
        getProperty(): string {
            return this.property;
        }

        /**
         * doRender
         * @param object
         */
        doRender(object: object): void {
            console.log("ObjectElement.doRender", object);
            let value = object[this.getProperty()];

            // sets value by html element type
            if(this.htmlElement instanceof HTMLInputElement){
                this.htmlElement.value = value;
            }
            // select
            else if(this.htmlElement instanceof HTMLSelectElement){
                this.htmlElement.value = value;
            }
            // else
            else{
                if(this.childNode){
                    this.htmlElement.removeChild(this.childNode);
                }
                this.childNode = document.createTextNode(value);
                this.htmlElement.insertBefore(this.childNode, this.htmlElement.firstChild);
            }
        }

        /**
         * update
         * @param object
         * @param detail
         */
        doUpdate(object: object, detail: object): void {
            console.log("ObjectElement.doUpdate", object, detail);
            this.doRender(object);
        }

    }
}