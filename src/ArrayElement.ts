///<reference path="DataElement.ts"/>
namespace duice {

    /**
     * array element class
     */
    export class ArrayElement<T extends HTMLElement> extends DataElement<T> {

        slot: HTMLSlotElement = document.createElement('slot');

        loop: string;

        editable: boolean = false;

        rowHtmlElements: HTMLElement[] = [];

        /**
         * constructor
         * @param htmlElement
         * @param context
         */
        constructor(htmlElement: T, context: object) {
            super(htmlElement.cloneNode(true) as T, context);

            // replace with slot for position
            htmlElement.replaceWith(this.slot);

            // mark initialized (not using after clone as templates)
            markInitialized(htmlElement);
        }

        /**
         * set array
         * @param arrayName
         */
        setArray(arrayName: string): void {
            this.setData(arrayName);
        }

        /**
         * set loop
         * @param loop
         */
        setLoop(loop: string): void {
            this.loop = loop;
        }

        /**
         * set editable
         * @param editable
         */
        setEditable(editable: boolean): void {
            this.editable = editable;
        }

        /**
         * render
         */
        override render(): void {
            let _this = this;
            let arrayProxy = this.getData() as ArrayProxy;

            // reset row elements
            this.rowHtmlElements.forEach(rowElement => {
                rowElement.parentNode.removeChild(rowElement);
            });
            this.rowHtmlElements.length = 0;

            // loop
            if(this.loop){
                let loopArgs = this.loop.split(',');
                let itemName = loopArgs[0].trim();
                let statusName = loopArgs[1]?.trim();
                for(let index = 0; index < arrayProxy.length; index ++){

                    // context
                    let context = globalThis.Object.assign({}, this.context);
                    context[itemName] = arrayProxy[index];
                    context[statusName] = new ObjectProxy({
                        index: index,
                        count: index+1,
                        size: arrayProxy.length,
                        first: (index === 0),
                        last: (arrayProxy.length == index + 1)
                    });

                    // clones row elements
                    let rowHtmlElement = this.getHtmlElement().cloneNode(true) as HTMLElement;
                    setElementAttribute(rowHtmlElement, 'index', index.toString());

                    // editable
                    if(this.editable){
                        rowHtmlElement.setAttribute('draggable', 'true');
                        rowHtmlElement.addEventListener('dragstart', function(e){
                            let fromIndex = getElementAttribute(this, 'index');
                            e.dataTransfer.setData("text", fromIndex);
                        });
                        rowHtmlElement.addEventListener('dragover', function(e){
                            e.preventDefault();
                            e.stopPropagation();
                        });
                        rowHtmlElement.addEventListener('drop', async function(e){
                            e.preventDefault();
                            e.stopPropagation();
                            let fromIndex = parseInt(e.dataTransfer.getData('text'));
                            let toIndex = parseInt(getElementAttribute(this, 'index'));
                            let rowIndexChangeEvent = new event.RowMoveEvent(_this, fromIndex, toIndex);
                            _this.notifyObservers(rowIndexChangeEvent);
                        });
                    }

                    // initializes row element
                    initialize(rowHtmlElement, context);
                    this.rowHtmlElements.push(rowHtmlElement);

                    // insert before slot
                    this.slot.parentNode.insertBefore(rowHtmlElement, this.slot);
                }
            }

            // execute script
            this.executeScript();
        }

        /**
         * update
         * @param observable
         * @param event
         */
        update(observable: Observable, event: event.Event): void {
            console.debug('ArrayElement.update', observable, event);
            if(observable instanceof ArrayHandler){
                this.render();
            }
        }

    }
}