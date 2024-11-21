import {TabFolder} from "./TabFolder";

export class TabItem {

    button: HTMLElement;

    content: HTMLElement;

    listener: Function;

    tabFolder: TabFolder;

    tabIndex: number;

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

    setTabFolder(tabFolder: TabFolder): void {
        this.tabFolder = tabFolder;
    }

    setTabIndex(tabIndex: number): void {
        this.tabIndex = tabIndex;
    }

    setActive(active: boolean): void {
        if(active) {
            this.button.style.opacity = 'unset';
            this.content.removeAttribute('hidden');
            this.listener.call(this);
        }else{
            this.button.style.opacity = '0.5';
            this.content.setAttribute('hidden', String(true));
        }
    }

}