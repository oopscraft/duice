/// <reference path="Component.ts"/>

namespace duice {

    export interface MapComponent extends Component {

        onChange(map:Map): void;

        onReadonly(): void;

        onDisable(): void;

    }

}
