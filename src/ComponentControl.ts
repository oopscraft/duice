namespace duice {

    export class ComponentControl<T extends Component> extends Observable implements Observer {

        element: T;

        context: object;

        objectProxy: ObjectProxy;

        arrayProxy: ArrayProxy;

        constructor(element: T, context: object) {
            super();
            this.element = element;
            this.context = context;
        }

        setObject(objectName: string): void {
            this.objectProxy = findObject(this.context, objectName);
            if(!this.objectProxy){
                console.warn(`ObjectProxy[${objectName}] is not found.`, this.objectProxy);
                this.objectProxy = new ObjectProxy({});
            }
            let objectHandler = ObjectProxy.getHandler(this.objectProxy);
            this.addObserver(objectHandler);
            objectHandler.addObserver(this);
        }

        setArray(arrayName: string): void {

        }


        update(observable: object, event: duice.Event): void {

        }

    }

}