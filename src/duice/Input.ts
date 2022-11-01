class Input extends HTMLInputElement {
    constructor() {
        super();
        console.log("== create");
        // let shadow = this.attachShadow({ mode: 'open' });
        // let input = document.createElement("input");
        // shadow.appendChild(input);
        // this.setAttribute("value", "testfdasfdasfds");
        // input.addEventListener("change", function() {
        //     console.log("========= input.value:" + this.value);
        // });
        let _this = this;
        this.addEventListener('change', function(event:any) {
            console.log("== _this.value:" + _this.value);
        }, true);
    }

    connectedCallback() {
        console.log("== connectedCallback");
        this.value = "test";
    }

    static get observedAttributes() {
        return ['value']
    }

    attributeChangedCallback(name:any, oldValue:any, newValue:any) {
        console.log('Custom square element attributes changed.');
    }

}

customElements.define('duice-input', Input, { extends: 'input' });