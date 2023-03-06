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
            this.doRender(dataSet);

            // executes script
            this.executeScript();
        }

        /**
         * doRender
         * @param dataSet
         */
        doRender(dataSet: DataSet): void {
            removeChildNodes(this.slotElement);
            if(this.loop){
                let loopArgs = this.loop.split(',');
                let itemName = loopArgs[0].trim();
                let statusName = loopArgs[1]?.trim();
                for(let index = 0; index < dataSet.length; index ++){
                    let data = dataSet[index];
                    let context = {};
                    context[itemName] = data;
                    context[statusName] = duice.Data.create({
                        index: index,
                        count: index+1,
                        size: dataSet.length,
                        first: (index === 0),
                        last: (dataSet.length == index+1)
                    });
                    let rowHtmlElement = this.htmlElement.cloneNode(true) as HTMLElement;
                    initialize(rowHtmlElement, context);
                    this.slotElement.appendChild(rowHtmlElement);
                }
            }else{
                this.slotElement.appendChild(this.htmlElement);
            }
        }

        /**
         * update
         * @param observable
         * @param detail
         */
        update(dataSetHandler: DataSetHandler, detail: any): void {
            let dataSet = dataSetHandler.getDataSet();
            this.doUpdate(dataSet);

            // executes script
            this.executeScript();
        }

        /**
         * doUpdate
         * @param dataSet
         */
        doUpdate(dataSet: DataSet): void {
            this.doRender(dataSet);
        }


        /**
         * executes script
         */
        executeScript(): void {
            let script = getAttribute(this.htmlElement, 'script');
            if(script) {
                executeScript(script, this.htmlElement, this.context);
            }
        }


    }
}