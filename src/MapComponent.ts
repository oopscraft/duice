
namespace duice {

    export interface MapComponent extends HTMLElement {

        initialize(context: object): void;

        update(map:Map): void;

    }

}
