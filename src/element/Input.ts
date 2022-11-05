import { Observer } from "src/main/ts/core/Observer";

class Input extends HTMLInputElement implements Observer {
    bindMap:Map<string,any> = null;
    bindKey:string = null;
    constructor() {
        super();
        let _this = this;
        console.log("== create");
        let bindMapName = this.getAttribute("duice-bind-map");
        this.bindMap = new Proxy(eval.call(window, bindMapName),{
            set(target:any, prop:string, value:any):any {
                if(prop === _this.bindKey){
                    _this.update(value);
                }
                //target.set(prop, value);
                //Reflect.set(target, prop, value);
                return true;
            }
        });
        console.log(`== bindMap: ${this.bindMap}`);



        this.bindKey = this.getAttribute("duice-bind-key");
        console.log(`== bindKey: ${this.bindKey}`);


        this.addEventListener('change', function(event:any) {
            console.log("== this.value:" + this.value);
            console.log(_this.bindMap);
            Reflect.set(_this.bindMap, _this.bindKey, this.value);
            //_this.bindMap.set(_this.bindKey, this.value);
        }, true);
    }

    update(value:any) {
        console.log("== update---1-122");
    }


    // connectedCallback() {
    //     console.log("== connectedCallback");
    //     this.value = "test";
    // }
    //
    // static get observedAttributes() {
    //     return ['value']
    // }
    //
    // attributeChangedCallback(name:any, oldValue:any, newValue:any) {
    //     console.log('Custom square element attributes changed.');
    // }

}

customElements.define('duice-input', Input, { extends: 'input' });
//customElements.define('duice-input', Input);