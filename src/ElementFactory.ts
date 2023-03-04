namespace duice {

    export class ElementFactory {

        static elementDefinitions: ElementDefinition[] = [];

        /**
         * adds element definition
         * @param tagName
         * @param elementType
         */
        static addElementDefinition(tagName: string, elementType: any): void {
            let elementDefinition = new ElementDefinition(tagName, elementType);
            this.elementDefinitions.push(elementDefinition);
        }

        /**
         * creates element
         * @param htmlElement
         * @param context
         */
        static createElement(htmlElement: HTMLElement, context: object): Element<any> {

            // creates element instance
            let tagName = htmlElement.tagName;
            let element = null;
            this.elementDefinitions.forEach(elementDefinition => {
                if(tagName === elementDefinition.getTagName()){
                    let elementType = elementDefinition.getElementType();
                    element = Reflect.construct(elementType,[htmlElement]);
                }
            });
            if(element === null) {
                element = new duice.Element(htmlElement);
            }

            // bind
            let bindAttribute = htmlElement.getAttribute(`${getAlias()}:bind`);
            let bindObject = this.findObject(context, bindAttribute);
            console.assert(bindObject, `bind object[${bindAttribute}] is not found`);
            element.bind(bindObject);

            // property
            let propertyAttribute = htmlElement.getAttribute(`${getAlias()}:property`);
            element.setProperty(propertyAttribute);

            // returns
            return element;
        }

        /**
         * findObject
         * @param context
         * @param name
         */
        static findObject(context: object, name: string): any {
            if(context[name]){
                return context[name];
            }
            if((<any>window).hasOwnProperty(name)){
                return (<any>window)[name];
            }
            return eval.call(context, name);
        }



    }
}