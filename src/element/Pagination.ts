namespace duice.component {

    export class Pagination extends duice.CustomElement {

        override doRender(object: ObjectProxy): HTMLElement {

            // attribute
            let pageProperty = getElementAttribute(this.getHtmlElement(), 'page-property');
            let sizeProperty = getElementAttribute(this.getHtmlElement(), 'size-property');
            let countProperty = getElementAttribute(this.getHtmlElement(), 'count-property');
            let onclick = getElementAttribute(this.getHtmlElement(), 'onclick');

            // optional
            let prevText = getElementAttribute(this.getHtmlElement(), 'prev-text')||'<︎';
            let nextText = getElementAttribute(this.getHtmlElement(), 'next-text')||'>︎';

            // page,size,count
            let page = Number(object[pageProperty]);
            let size = Number(object[sizeProperty]);
            let count = Number(object[countProperty]);

            // calculate page
            let totalPage = Math.floor(count/size);
            let startPage = Math.floor(page/10)*10;
            let endPage = Math.min(startPage + 10 - 1, totalPage);
            console.debug('totalPage', totalPage);
            console.debug('startPage', startPage);
            console.debug('endPage', endPage);

            // template
            let pagination = document.createElement('ul');
            pagination.classList.add(`${getNamespace()}-pagination`);

            // prev
            let prev = document.createElement('li');
            prev.appendChild(document.createTextNode(prevText));
            prev.classList.add(`${getNamespace()}-pagination__item`);
            prev.dataset.page = String(Math.max(startPage - 10, 0));
            prev.addEventListener('click', function() {
                Function(onclick).call(prev);
            })
            if(page < 10) {
                prev.classList.add(`${getNamespace()}-pagination__item--disable`);
            }
            pagination.appendChild(prev);

            // pages
            for(let index = startPage; index <= endPage; index ++) {
                let item = document.createElement('li');
                item.appendChild(document.createTextNode(String(index + 1)));
                item.dataset.page = String(index);
                item.classList.add(`${getNamespace()}-pagination__item`);
                if(index === page) {
                    item.classList.add(`${getNamespace()}-pagination__item--active`);
                }
                item.addEventListener('click', function() {
                    Function(onclick).call(item);
                });
                pagination.appendChild(item);
            }

            // next
            let next = document.createElement('li');
            next.appendChild(document.createTextNode(nextText));
            next.classList.add(`${getNamespace()}-pagination__item`);
            next.dataset.page = String(Math.min(endPage + 1, totalPage));
            next.addEventListener('click', function() {
                Function(onclick).call(next);
            });
            if(endPage >= totalPage) {
                next.classList.add(`${getNamespace()}-pagination__item--disable`);
            }
            pagination.appendChild(next);

            // returns
            return pagination;
            // return pagination.outerHTML;
        }

        override doStyle(object: ObjectProxy): string {
           return `
               .${getNamespace()}-pagination {
                   list-style: none;
                   display: flex;
                   padding-left: 0;
                   margin: 0;
               }
               .${getNamespace()}-pagination__item {
                   cursor: pointer;
                   padding: 0 0.5rem;
               }
               .${getNamespace()}-pagination__item--active {
                   font-weight: bold;
                   text-decoration: underline;
                   pointer-events: none;
               }
               .${getNamespace()}-pagination__item--disable {
                   pointer-events: none;
               }
           `;
        }

    }

    // register
    let customElementFactory = new CustomElementFactory(`${duice.getNamespace()}-pagination`, Pagination);
    CustomElementFactory.addInstance(customElementFactory);

}
