"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var duice;
(function (duice) {
    var integrate;
    (function (integrate) {
        var SunEditorFactory = (function (_super) {
            __extends(SunEditorFactory, _super);
            function SunEditorFactory() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SunEditorFactory.prototype.getInstance = function (element) {
                var sunEditor = new duice.integrate.SunEditor(element);
                var bind = element.dataset.duiceBind.split(',');
                sunEditor.bind(this.getContextProperty(bind[0]), bind[1]);
                return sunEditor;
            };
            return SunEditorFactory;
        }(duice.MapUIComponentFactory));
        integrate.SunEditorFactory = SunEditorFactory;
        var SunEditor = (function (_super) {
            __extends(SunEditor, _super);
            function SunEditor(textarea) {
                var _this = _super.call(this, textarea) || this;
                _this.textarea = textarea;
                _this.suneditor = SUNEDITOR.create(_this.textarea);
                var $this = _this;
                console.log(_this.suneditor);
                _this.suneditor.onChange = function (content) {
                    $this.setChanged();
                    $this.notifyObservers($this);
                };
                return _this;
            }
            SunEditor.prototype.update = function (map, obj) {
                var value = map.get(this.getName());
                this.suneditor.setContents(value);
            };
            SunEditor.prototype.getValue = function () {
                var value = this.suneditor.getContents(true);
                return value;
            };
            return SunEditor;
        }(duice.MapUIComponent));
        integrate.SunEditor = SunEditor;
        // Adds component definition
        duice.ComponentDefinitionRegistry.add(new duice.ComponentDefinition('textarea', 'duice-integrate-suneditor', duice.integrate.SunEditorFactory));
    })(integrate = duice.integrate || (duice.integrate = {}));
})(duice || (duice = {}));
//duice.addComponent('textarea', 'duice-integrate-suneditor', duice.integrate.SunEditor);
//
//uiElementTags.
//duice.initialize() {
//    
//}
/**
 * DOMContentLoaded event process
 */
//document.addEventListener("DOMContentLoaded", function(event) {
//    var $context:any = typeof self !== 'undefined' ? self : 
//                        typeof window !== 'undefined' ? window :
//                        {};
//    // elements
//    var elements = document.querySelectorAll('textarea[is="duice-integrate-suneditor"][data-duice-bind]:not([data-duice-id])');
//    for(var i = 0; i < elements.length; i++ ) {
//        try {
//            var element:any = elements[i];
//            
//            var instance = new duice.integrate.SunEditor(element);
//            var bind = element.dataset.duiceBind.split(',');
//            instance.bind(this.getObject($context, bind[0]), bind[1]);
//            
//        }catch(e){
//            console.error(e,element);
//            throw e;
//        }
//    }
//}); 
