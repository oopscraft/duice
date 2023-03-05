namespace duice {

    /**
     * ArrayElement
     */
    export class ElementSet extends Observable implements Observer {

        id: string;

        htmlElement: HTMLElement;

        context: object;

        dataSetHandler: DataSetHandler;

        slotElement: HTMLSlotElement;

        loop: string;

        /**
         * constructor
         * @param htmlElement
         */
        constructor(htmlElement: HTMLElement, context: object) {
            super();
            this.htmlElement = htmlElement;
            this.context = context;
            this.id = generateUuid();
            setAttribute(this.htmlElement, 'id', this.id);

            // replace with slot element
            this.slotElement = document.createElement('slot');
            this.htmlElement.replaceWith(this.slotElement);
        }

        /**
         * setDataSet
         * @param dataSet
         */
        setDataSet(dataSet: string): void {
            let dataSetObject = findObject(this.context, dataSet);
            this.dataSetHandler = Object.getOwnPropertyDescriptor(dataSetObject, '_handler_').value;
            console.assert(this.dataSetHandler);
            this.addObserver(this.dataSetHandler);
            this.dataSetHandler.addObserver(this);
        }

        /**
         * setLoop
         * @param loop
         */
        setLoop(loop: string): void {
            this.loop = loop;
        }

        /**
         * render
         */
        render(): void {
            let dataSet = this.dataSetHandler.getDataSet();
            if(this.loop){
                let loopArgs = this.loop.split(',');
                let itemName = loopArgs[0].trim();
                let statusName = loopArgs[1]?.trim();
                for(let index = 0; index < dataSet.length; index ++){
                    let data = dataSet[index];
                    let context = {};
                    context[itemName] = data;
                    context[statusName] = {
                        index: index
                    };
                    let rowHtmlElement = this.htmlElement.cloneNode(true) as HTMLElement;
                    initialize(rowHtmlElement, context);
                    this.slotElement.appendChild(rowHtmlElement);
                }
            }
        }

        /**
         * update
         * @param observable
         * @param detail
         */
        update(observable: object, detail: any): void {
            throw new Error("Method not implemented.");
        }

    }
}