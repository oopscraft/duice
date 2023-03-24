/**
 * DuicePagination
 */
namespace duice {

    export class PaginationComponent extends duice.Component {

        public constructor() {
            super();
        }

        doRender(data: any): string {
            return `
                <div>TEST</div>
                `;
        }

    }

    // defines component
    duice.defineComponent(`${duice.getNamespace()}-pagination`, PaginationComponent);

}
