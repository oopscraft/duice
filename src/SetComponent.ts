
namespace duice {

    export interface SetComponent extends HTMLElement {

        initialize(context: object): void;

        update(set:Set): void;

    }

}
