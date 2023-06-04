namespace duice.component {

    export class SideNavigation extends duice.CustomElement<object[]> {

        idProperty: string;

        parentIdProperty: string;

        iconProperty: string;

        textProperty: string;

        onclick: string;

        uls: HTMLUListElement[] = [];

        /**
         * doReader
         * @param array
         */
        override doRender(array: object[]): HTMLElement {

            // get attribute
            this.idProperty = getElementAttribute(this.getHtmlElement(),'id-property');
            this.parentIdProperty = getElementAttribute(this.getHtmlElement(), 'parent-id-property');
            this.iconProperty = getElementAttribute(this.getHtmlElement(), 'icon-property');
            this.textProperty = getElementAttribute(this.getHtmlElement(), 'text-property');
            this.onclick = getElementAttribute(this.getHtmlElement(), 'onclick');

            // create tree element
            let ulElement = this.arrayToTreeUl(array, null, 0);
            ulElement.classList.add(`${getNamespace()}-side-navigation`);

            // return
            return ulElement;
        }

        /**
         * array to tree ul
         * @param array
         * @param parentId
         * @param depth
         */
        arrayToTreeUl(array, parentId, depth) {
            const ulElement = document.createElement('ul');

            for (const object of array) {
                if (object[this.parentIdProperty] === parentId) {
                    const liElement = document.createElement('li');
                    liElement.style.listStyle = 'none';

                    // create a element
                    let aElement = document.createElement('a');

                    // onclick
                    if(this.onclick) {
                        liElement.addEventListener('click', event => {
                            Function(this.onclick).call(object);
                        });
                    }

                    // icon
                    if(this.iconProperty) {
                        let iconElement = document.createElement('img');
                        iconElement.src = object[this.iconProperty];
                        aElement.appendChild(iconElement);
                    }

                    // text content
                    let textElement = document.createElement('span');
                    textElement.appendChild(document.createTextNode(object[this.textProperty]));
                    aElement.appendChild(textElement);

                    // adds to ul
                    liElement.append(aElement);
                    ulElement.appendChild(liElement);

                    // recursively child ul element
                    let childUlElement =this.arrayToTreeUl(array, object[this.idProperty], depth + 1);
                    if(childUlElement.childElementCount > 0) {
                        liElement.appendChild(childUlElement);
                        liElement.classList.add('__fold__');
                    }

                    // indent
                    if(depth > 0) {
                        liElement.classList.add('__indent__');
                    }
                    if(depth <= 1) {
                        ulElement.style.paddingLeft = '0';
                    }else{
                        ulElement.style.paddingLeft = '1em';
                    }

                    // toggle fold,unfold
                    liElement.addEventListener('click', event => {
                        if(liElement.querySelector('ul')) {
                            if(liElement.classList.contains('__fold__')) {
                                liElement.classList.remove('__fold__');
                                liElement.classList.add('__unfold__');
                            }else{
                                liElement.classList.add('__fold__');
                                liElement.classList.remove('__unfold__');
                            }
                        }
                        event.stopPropagation();
                    });
                }
            }

            // returns
            return ulElement;
        }

        override doUpdate(data: object[]): void {
            this.render();
        }

        /**
         * doStyle
         * @param array
         */
        override doStyle(array: object[]): string {
            return `
                .${getNamespace()}-side-navigation li {
                    line-height: inherit;
                }
                .${getNamespace()}-side-navigation li.__indent__::before {
                    content: '';
                    display: inline-block;
                    width: 1em;
                    height: 1em;
                    vertical-align: middle;
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAJklEQVR42mNgGAXUBA0NDf9HfTDqg1EfQHxALD0KRsEoGAWDBQAAM5IY9y7mNu0AAAAASUVORK5CYII=);
                    background-position-x: center;
                    background-position-y: center;
                    cursor: pointer;
                }
                .${getNamespace()}-side-navigation li.__fold__::before {
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAOUlEQVR42mNgGEygoaHhP8OQBqM+GBgXE8I0DRJaWPB/yFrwHwuGy+OiR1YQ0S4V0TQfjIJRMEIAAEXLZ9KMlg2EAAAAAElFTkSuQmCC);
                }
                .${getNamespace()}-side-navigation li.__fold__ > ul {
                    display: none;
                }
                .${getNamespace()}-side-navigation li.__unfold__::before {
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAANklEQVR42mNgGEygoaHhP8OQBqM+GBgXE8I0DZJRC5AN+I8Fw+Vx0aNxQB0LaJoPRsEoGCEAAGOiY9YrvpoQAAAAAElFTkSuQmCC);
                }
                .${getNamespace()}-side-navigation li.__unfold__ > ul {
                    display: '';
                }
                .${getNamespace()}-side-navigation li > a {
                    display: inline-block;
                    color: inherit;
                    text-decoration: none;
                    cursor: pointer;
                }
                .${getNamespace()}-side-navigation li > a > img {
                    width: 1em;
                    height: 1em;
                    vertical-align: middle;
                }
                .${getNamespace()}-side-navigation li > a > span {
                    margin-left: 0.2em;
                }
            `;
        }

    }

    // register
    DataElementRegistry.register(`${duice.getNamespace()}-side-navigation`, new CustomElementFactory(SideNavigation));

}