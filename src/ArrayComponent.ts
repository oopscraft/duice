///<reference path="Component.ts"/>
namespace duice {

    /**
     * ArrayComponent
     */
    export class ArrayComponent extends Component<object[]> {

        slotElement: HTMLSlotElement;

        /**
         * create
         * @param element
         * @param context
         */
        static create(element: HTMLElement, context: object): ArrayComponent {
            return new ArrayComponent(element, context);
        }

        /**
         * constructor
         * @param element
         * @param context
         * @protected
         */
        constructor(element: HTMLElement, context: object) {
            console.debug("ArrayComponent.constructor", element, context);
            super(element, context);

            // array handler
            let arrayName = this.getAttribute(this.element, 'array');
            let array = this.findObject(arrayName);
            this.handler = array._handler_;
            this.handler.addComponent(this);
        }

       /**
         * render
         * @param detail
         */
        override doRender(): void {
            console.log("ArrayComponent.render");

            // defines
            let array = this.handler.getTarget();
            let loopAttribute = this.getAttribute(this.element,'loop');

            // loop
            if(loopAttribute) {
                let loopArgs = loopAttribute.split(',');
                let objectName = loopArgs[0];
                let statusName = loopArgs[1];
                for (let index = 0; index < array.length; index++) {
                    let object = array[index];
                    let rowElement = this.element.cloneNode(true) as HTMLElement;
                    let context = {};
                    context[objectName] = object;
                    context[statusName] = Object.create({
                        index: index,
                        number: index + 1,
                        count: array.length,
                        first: (index === 0),
                        last: (index + 1 === array.length)
                    });
                    initializeComponent(rowElement, context);
                    this.appendToStage(rowElement);
                }
            }else{
                initializeComponent(this.element, this.context);
                this.appendToStage(this.element);
            }
        }

        /**
         * update
         * @param detail
         */
        doUpdate(detail: object): void {
            console.log("ArrayComponent.update", detail);
            this.render();
        }

    }

}