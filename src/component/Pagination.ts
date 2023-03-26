// /**
//  * DuicePagination
//  */
// namespace duice {
//
//     export class PaginationComponent extends duice.ComponentElement {
//
//         public constructor() {
//             super();
//         }
//
//         doRender(object: any): string {
//
//             // prev
//             let template = `<div><span>Prev</span>`;
//
//             // pages
//             for(let index = 0; index < 10; index ++) {
//                 template += `<span>${index}</span>`;
//             }
//
//             // next
//             template += `<span>Next</span></div>`;
//
//             // returns
//             console.warn("=========", template);
//             return template;
//         }
//
//     }
//
//     // defines component
//     duice.defineComponent(`${duice.getNamespace()}-pagination`, PaginationComponent);
//
// }
