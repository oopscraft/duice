///<reference path="DataElement.ts"/>
namespace duice {

    /**
     * array element class
     */
    export class ArrayElement<T extends HTMLElement> extends DataElement<T, object[]> {

        slot: HTMLSlotElement = document.createElement('slot');

        loop: string;

        hierarchy: string;

        editable: boolean = false;

        toggleClass: string;

        rowHtmlElements: HTMLElement[] = [];

        /**
         * constructor
         * @param htmlElement
         * @param bindData
         * @param context
         */
        constructor(htmlElement: T, bindData: object[], context: object) {
            super(htmlElement.cloneNode(true) as T, bindData, context);

            // replace with slot for position
            htmlElement.replaceWith(this.slot);

            // mark initialized (not using after clone as templates)
            markInitialized(htmlElement);
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
         * set toggle class
         * @param toggleClass
         */
        setToggleClass(toggleClass: string): void {
            this.toggleClass = toggleClass;
        }

        /**
         * set hierarchy
         * @param hierarchy
         */
        setHierarchy(hierarchy: string): void {
            this.hierarchy = hierarchy;
        }

        /**
         * render
         */
        override render(): void {
            let arrayProxy = this.getBindData() as Array<object>;

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

                // hierarchy loop
                if(this.hierarchy) {
                    let hierarchyArray = this.hierarchy.split(',');
                    let idName = hierarchyArray[0];
                    let parentIdName = hierarchyArray[1];
                    let index = -1;
                    const _this = this;
                    // visit function
                    let visit = function(array: object[], parentId: object, depth: number) {
                        for(const object of array) {
                            if(object[parentIdName] === parentId) {

                                // context
                                index ++;
                                let context = Object.assign({}, _this.getContext());
                                context[itemName] = object;
                                context[statusName] = new ObjectProxy({
                                    index: index,
                                    count: index + 1,
                                    size: arrayProxy.length,
                                    first: (index === 0),
                                    last: (arrayProxy.length == index + 1),
                                    depth: depth
                                });

                                // create row element
                                _this.createRowHtmlElement(index, object, context);

                                // visit child elements
                                let id = object[idName];
                                visit(array, id, depth + 1);
                            }
                        }
                    }
                    // start visit
                    visit(arrayProxy, null, 0);
                }

                // default loop
                else{
                    // normal
                    for (let index = 0; index < arrayProxy.length; index++) {

                        // element data
                        let object = arrayProxy[index];

                        // context
                        let context = Object.assign({}, this.getContext());
                        context[itemName] = object;
                        context[statusName] = new ObjectProxy({
                            index: index,
                            count: index + 1,
                            size: arrayProxy.length,
                            first: (index === 0),
                            last: (arrayProxy.length == index + 1)
                        });

                        // create row element
                        this.createRowHtmlElement(index, object, context);
                    }
                }
            }

            // not loop
            else {
                // initialize
                let rowHtmlElement = this.getHtmlElement().cloneNode(true) as HTMLElement;
                let context = Object.assign({}, this.getContext());
                initialize(rowHtmlElement, this.getContext());
                this.rowHtmlElements.push(rowHtmlElement);

                // append to slot
                this.slot.appendChild(rowHtmlElement);

                // execute script
                this.executeScript(rowHtmlElement, context);
            }
        }

        /**
         * create row html element
         * @param index
         * @param object
         * @param context
         */
        createRowHtmlElement(index: number, object: object, context: object): void {

            // clones row elements
            let rowHtmlElement = this.getHtmlElement().cloneNode(true) as HTMLElement;

            // adds embedded attribute
            setElementAttribute(rowHtmlElement, 'index', index.toString());

            // editable
            let _this = this;
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

            // insert into slot
            this.slot.appendChild(rowHtmlElement);

            // execute script
            this.executeScript(rowHtmlElement, context);

            // selectable
            if(this.toggleClass) {
                rowHtmlElement.addEventListener('click', e => {
                    this.rowHtmlElements.forEach(element => {
                        element.classList.remove(this.toggleClass);
                    });
                    (e.currentTarget as HTMLElement).classList.add(this.toggleClass);
                    e.stopPropagation();
                });
            }
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