// namespace duice.component {
//
//     export class Pagination extends duice.CustomElement {
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
//     ObjectComponentFactory.addInstance(new CustomComponentFactory("duice-name"));
//
//     // defines component
//     duice.defineComponent(`${duice.getNamespace()}-pagination`, Pagination);
//
// }
