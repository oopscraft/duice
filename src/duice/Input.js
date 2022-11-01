class Input extends HTMLInputElement {
    constructor() {
        super();
        console.log("== create");
        let _this = this;
        this.addEventListener('change', function (event) {
            console.log("== _this.value:" + _this.value);
        }, true);
    }
    update(value) {
        console.log("== update");
    }
}
customElements.define('duice-input', Input, { extends: 'input' });
export {};
