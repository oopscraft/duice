namespace duice {

    /**
     * ArrayElement
     */
    export class ElementSet<T extends HTMLElement> extends Observable implements Observer {

        id: string;

        htmlElement: T;

        context: object;

        arrayHandler: ArrayHandler;

        slotElement: HTMLSlotElement;

        loop: string;

        editable: boolean = false;

        /**
         * constructor
         * @param htmlElement
         */
        constructor(htmlElement: T, context: object) {
            super();
            this.htmlElement = htmlElement;
            this.context = context;
            this.id = generateUuid();
            setAttribute(this.htmlElement, 'id', this.id);

            // replace with slot element
            this.slotElement = document.createElement('slot');
            this.htmlElement.replaceWith(this.slotElement);

            // editable
            let editable = getAttribute(this.htmlElement, 'editable');
            if(editable){
                this.editable = (editable.toLowerCase() === 'true');
            }
        }

        /**
         * setDataSet
         * @param arrayName
         */
        setArray(arrayName: string): void {
            let array = findObject(this.context, arrayName);
            assert(array, `ArrayProxy[${arrayName}] is not found.`);
            this.arrayHandler = ArrayProxy.getHandler(array);
            assert(this.arrayHandler, `[${arrayName}] is not ArrayProxy.`);
            this.addObserver(this.arrayHandler);
            this.arrayHandler.addObserver(this);
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
            let dataSet = this.arrayHandler.getArrayProxy();
            this.doRender(dataSet);

            // executes script
            this.executeScript();
        }

        /**
         * doRender
         * @param array
         */
        doRender(array: object[]): void {
            let _this = this;
            removeChildNodes(this.slotElement);
            if(this.loop){
                let loopArgs = this.loop.split(',');
                let itemName = loopArgs[0].trim();
                let statusName = loopArgs[1]?.trim();
                for(let index = 0; index < array.length; index ++){
                    let data = array[index];
                    let context = {};
                    context[itemName] = data;
                    context[statusName] = new ObjectProxy({
                        index: index,
                        count: index+1,
                        size: array.length,
                        first: (index === 0),
                        last: (array.length == index+1)
                    });
                    let rowHtmlElement = this.htmlElement.cloneNode(true) as HTMLElement;
                    setAttribute(rowHtmlElement, 'index', index.toString());

                    // editable
                    if(this.editable){
                        rowHtmlElement.setAttribute('draggable', 'true');
                        rowHtmlElement.addEventListener('dragstart', function(event){
                            let fromIndex = getAttribute(this, 'index');
                            event.dataTransfer.setData("text", fromIndex);
                        });
                        rowHtmlElement.addEventListener('dragover', function(event){
                            event.preventDefault();
                            event.stopPropagation();
                        });
                        rowHtmlElement.addEventListener('drop', async function(event){
                            event.preventDefault();
                            event.stopPropagation();
                            let fromIndex = parseInt(event.dataTransfer.getData('text'));
                            let toIndex = parseInt(getAttribute(this, 'index'));
                            let detail = {
                                name: 'changeIndex',
                                fromIndex: fromIndex,
                                toIndex: toIndex
                            };
                            //await dataSet.moveRow(fromIndex, toIndex);
                            _this.notifyObservers(detail);
                        });
                    }

                    // initializes row element
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
        update(arrayHandler: ArrayHandler, detail: any): void {
            let array = arrayHandler.getArrayProxy();
            this.doUpdate(array);

            // executes script
            this.executeScript();
        }

        /**
         * doUpdate
         * @param array
         */
        doUpdate(array: object[]): void {
            this.doRender(array);
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