var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { initializeComponent } from "../core/initializeComponent";
var Input = /** @class */ (function (_super) {
    __extends(Input, _super);
    function Input() {
        var _this_1 = _super.call(this) || this;
        console.log("- Input.construct");
        return _this_1;
    }
    Input.prototype.initialize = function () {
        console.log('Custom square element added to page.');
        this.map = eval.call(window, this.dataset.map);
        this.key = this.dataset.key;
        this.map.addListener(this);
        var _this = this;
        this.addEventListener('change', function (event) {
            console.log("== this.value:" + this.value);
            console.log(_this.map);
            _this.map.internalSet(_this.key, this.value);
        }, true);
    };
    Input.prototype.change = function (dataMap) {
        this.value = dataMap.get(this.key);
    };
    return Input;
}(HTMLInputElement));
export { Input };
customElements.define('duice-input', Input, { extends: 'input' });
//customElements.define('duice-input', Input);
// document.addEventListener("DOMContentLoaded", function(event) {
//     duice.initializeComponent(document, {});
// });
initializeComponent();
