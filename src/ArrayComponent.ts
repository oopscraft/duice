///<reference path="Component.ts"/>
namespace duice {

    /**
     * array component class
     */
    export class ArrayComponent<T extends HTMLElement> extends Component<T> {

        slot: HTMLSlotElement = document.createElement('slot');

        loop: string;

        editable: boolean = false;

        rowElements: HTMLElement[] = [];

        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: T, context: object) {
            super(element.cloneNode(true) as T, context);

            // replace with slot for position
            element.replaceWith(this.slot);

            // mark initialized (not using after clone as templates)
            markInitialized(element);
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
            this.rowElements.forEach(rowElement => {
                rowElement.parentNode.removeChild(rowElement);
            });
            this.rowElements.length = 0;

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
                    let rowElement = this.getElement().cloneNode(true) as HTMLElement;
                    setComponentAttribute(rowElement, 'index', index.toString());

                    // editable
                    if(this.editable){
                        rowElement.setAttribute('draggable', 'true');
                        rowElement.addEventListener('dragstart', function(event){
                            let fromIndex = getComponentAttribute(this, 'index');
                            event.dataTransfer.setData("text", fromIndex);
                        });
                        rowElement.addEventListener('dragover', function(event){
                            event.preventDefault();
                            event.stopPropagation();
                        });
                        rowElement.addEventListener('drop', async function(event){
                            event.preventDefault();
                            event.stopPropagation();
                            let fromIndex = parseInt(event.dataTransfer.getData('text'));
                            let toIndex = parseInt(getComponentAttribute(this, 'index'));
                            let rowIndexChangeEvent = new RowMoveEvent(_this, fromIndex, toIndex);
                            _this.notifyObservers(rowIndexChangeEvent);
                        });
                    }

                    // initializes row element
                    initialize(rowElement, context);
                    this.rowElements.push(rowElement);

                    // insert before slot
                    this.slot.parentNode.insertBefore(rowElement, this.slot);
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
        update(observable: Observable, event: Event): void {
            console.debug('ArrayComponent.update', observable, event);
            if(observable instanceof ArrayHandler){
                this.render();
            }
        }

    }
}