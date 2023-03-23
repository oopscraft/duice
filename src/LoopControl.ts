namespace duice {

    /**
     * LoopControl
     */
    export class LoopControl<T extends HTMLElement> extends Observable implements Observer {

        slot: HTMLSlotElement = document.createElement('slot');

        element: T;

        context: object;

        arrayProxy: ArrayProxy;

        loop: string;

        editable: boolean = false;

        /**
         * constructor
         * @param element
         */
        constructor(element: T, context: object) {
            super();

            // clone html element template
            this.element = element.cloneNode(true) as T;
            setAttribute(this.element, 'id', generateId());
            markInitialized(element);

            // replace slot element
            element.replaceWith(this.slot);

            // set context
            this.context = context;
        }

        /**
         * setArray
         * @param arrayName
         */
        setArray(arrayName: string): void {
            this.arrayProxy = findObject(this.context, arrayName);
            if(!this.arrayProxy){
                console.warn(`ArrayProxy[${arrayName}] is not found.`, this.arrayProxy);
                this.arrayProxy = new ArrayProxy([]);
            }
            let arrayHandler = ArrayProxy.getHandler(this.arrayProxy);
            this.addObserver(arrayHandler);
            arrayHandler.addObserver(this);
        }

        /**
         * setLoop
         * @param loop
         */
        setLoop(loop: string): void {
            this.loop = loop;
        }

        /**
         * setEditable
         * @param editable
         */
        setEditable(editable: boolean): void {
            this.editable = editable;
        }

        /**
         * render
         */
        render(): void {
            this.doRender(this.arrayProxy);

            // executes script
            this.executeScript();
        }

        /**
         * doRender
         * @param arrayProxy
         */
        doRender(arrayProxy: ArrayProxy): void {
            let _this = this;

            // removes elements
            removeChildNodes(this.slot);

            // loop
            if(this.loop){
                let loopArgs = this.loop.split(',');
                let itemName = loopArgs[0].trim();
                let statusName = loopArgs[1]?.trim();
                for(let index = 0; index < arrayProxy.length; index ++){

                    // context
                    let context = Object.assign({}, this.context);
                    context[itemName] = arrayProxy[index];
                    context[statusName] = new ObjectProxy({
                        index: index,
                        count: index+1,
                        size: arrayProxy.length,
                        first: (index === 0),
                        last: (arrayProxy.length == index + 1)
                    });

                    // clones row elements
                    let rowHtmlElement = this.element.cloneNode(true) as HTMLElement;
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
                            let rowIndexChangeEvent = new RowMoveEvent(_this, fromIndex, toIndex);
                            _this.notifyObservers(rowIndexChangeEvent);
                        });
                    }

                    // initializes row element
                    initialize(rowHtmlElement, context);
                    this.slot.appendChild(rowHtmlElement);
                }

            }else{
                this.slot.appendChild(this.element);
            }
        }

        /**
         * update
         * @param observable
         * @param event
         */
        update(observable: Observable, event: Event): void {
            console.log('ElementSet.update', observable, event);

            // ArrayHandler
            if(observable instanceof ArrayHandler){
                let array = observable.getTarget();
                this.doRender(array);

                // executes script
                this.executeScript();
            }
        }

        /**
         * executes script
         */
        executeScript(): void {
            let script = getAttribute(this.element, 'script');
            if(script) {
                executeScript(script, this.element, this.context);
            }
        }

    }
}