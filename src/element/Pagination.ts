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
            let totalPage = Math.ceil(count/size);
            let startPageIndex = Math.floor(page/10)*10;
            let endPageIndex = Math.min(startPageIndex + 9, totalPage - 1);
            console.debug('page', page);
            console.debug('totalPage', totalPage);
            console.debug('startPage', startPageIndex);
            console.debug('endPage', endPageIndex);

            // template
            let pagination = document.createElement('ul');
            pagination.classList.add(`${getNamespace()}-pagination`);

            // prev
            let prev = document.createElement('li');
            prev.appendChild(document.createTextNode(prevText));
            prev.classList.add(`${getNamespace()}-pagination__item-prev`);
            prev.dataset.page = String(Math.max(startPageIndex - 10, 0));
            prev.addEventListener('click', function() {
                Function(onclick).call(prev);
            })
            if(page < 10) {
                prev.classList.add(`${getNamespace()}-pagination__item--disable`);
            }
            pagination.appendChild(prev);

            // pages
            for(let index = startPageIndex; index <= endPageIndex; index ++) {
                let item = document.createElement('li');
                item.appendChild(document.createTextNode(String(index + 1)));
                item.dataset.page = String(index);
                item.classList.add(`${getNamespace()}-pagination__item-page`);
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
            next.classList.add(`${getNamespace()}-pagination__item-next`);
            next.dataset.page = String(Math.min(endPageIndex + 1, totalPage));
            next.addEventListener('click', function() {
                Function(onclick).call(next);
            });
            if(endPageIndex >= (totalPage - 1)) {
                next.classList.add(`${getNamespace()}-pagination__item--disable`);
            }
            pagination.appendChild(next);

            // returns
            return pagination;
        }

        override doStyle(object: ObjectProxy): string {
           return `
                .${getNamespace()}-pagination {
                    list-style: none;
                    display: flex;
                    padding-left: 0;
                    margin: 0;
                }
                .${getNamespace()}-pagination__item-page {
                    cursor: pointer;
                    padding: 0 0.5rem;
                }
                .${getNamespace()}-pagination__item-prev {
                    cursor: pointer;
                    padding: 0 0.5rem;
                    font-size: smaller;    
                }
                .${getNamespace()}-pagination__item-next {
                    cursor: pointer;
                    padding: 0 0.5rem;
                    font-size: smaller;
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
