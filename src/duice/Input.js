"use strict";
class Input extends HTMLInputElement {
    constructor() {
        super();
        console.log("== create");
        let _this = this;
        this.addEventListener('change', function (event) {
            console.log("== _this.value:" + _this.value);
        }, true);
    }
    connectedCallback() {
        console.log("== connectedCallback");
        this.value = "test";
    }
    static get observedAttributes() {
        return ['value'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        console.log('Custom square element attributes changed.');
    }
}
customElements.define('duice-input', Input, { extends: 'input' });
