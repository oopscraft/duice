namespace duice {

    export class ComponentFactory {

        static componentFactoryRegistry: ComponentFactory[] = [];

        static registerComponentFactory(componentFactory: ComponentFactory): void {
            this.componentFactoryRegistry.push(componentFactory);
        }

    }

}