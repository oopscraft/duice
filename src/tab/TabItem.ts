///<reference path="TabFolder.ts"/>
namespace duice.tab {

    export class TabItem {

        button: HTMLElement;

        content: HTMLElement;

        listener: Function;

        tabFolder: TabFolder;

        tabIndex: number;

        /**
         * constructor
         * @param button
         * @param content
         * @param listener
         */
        constructor(button: HTMLElement, content: HTMLElement, listener: Function) {
            this.button = button;
            this.content = content;
            this.listener = listener;

            // default style
            button.style.cursor = 'pointer';

            // add listener
            let _this = this;
            button.addEventListener('click', () => {
                _this.tabFolder.setActive(_this.tabIndex);
            });

            // set de-active
            this.setActive(false);
        }

        /**
         * set tab folder
         * @param tabFolder
         */
        setTabFolder(tabFolder: TabFolder): void {
            this.tabFolder = tabFolder;
        }

        /**
         * set tab index
         * @param tabIndex
         */
        setTabIndex(tabIndex: number): void {
            this.tabIndex = tabIndex;
        }

        /**
         * set active
         * @param active
         */
        setActive(active: boolean): void {
            if(active === true) {
                this.button.style.opacity = 'unset';
                this.content.style.display = null;
                this.listener.call(this);
            }else{
                this.button.style.opacity = '0.5';
                this.content.style.display = 'none';
            }
        }

    }

}