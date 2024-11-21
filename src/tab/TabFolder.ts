import {TabItem} from "./TabItem";

export class TabFolder {

    items: TabItem[] = [];

    addItem(item: TabItem): void {
        item.setTabFolder(this);
        item.setTabIndex(this.items.length);
        this.items.push(item);
    }

    setActive(index: number): void {
        for(let i = 0; i < this.items.length; i ++ ) {
            this.items[i].setActive(i === index);
        }
    }

}