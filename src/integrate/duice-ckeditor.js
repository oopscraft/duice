"use strict";
/// <reference path="../duice.ts" />
/// <reference path="./ckeditor/ckeditor.js" />
var duice;
(function (duice) {
    /**
     * duice.plugin.CkeditorFactory
     */
    class CkeditorFactory extends duice.MapComponentFactory {
        getComponent(element) {
            var config = null;
            if (element.dataset.duiceConfig) {
                config = JSON.parse(element.dataset.duiceConfig.replace(/\'/g, '"'));
            }
            var ckEditor = new Ckeditor(element, config);
            var bind = element.dataset.duiceBind.split(',');
            ckEditor.bind(this.getContextProperty(bind[0]), bind[1]);
            return ckEditor;
        }
    }
    duice.CkeditorFactory = CkeditorFactory;
    /**
     * duice.plugin.Ckeditor
     */
    class Ckeditor extends duice.MapComponent {
        constructor(textarea, config) {
            super(textarea);
            this.textarea = textarea;
            this.config = config;
            this.ckeditor = CKEDITOR.replace(this.textarea, this.config);
            var _this = this;
            this.ckeditor.on('blur', function (event) {
                if (_this.map.get(_this.getName()) !== _this.getValue()) {
                    _this.setChanged();
                    _this.notifyObservers(_this);
                }
            });
        }
        update(map, obj) {
            var value = map.get(this.getName());
            this.ckeditor.setData(value);
        }
        getValue() {
            var value = this.ckeditor.getData();
            return value;
        }
    }
    duice.Ckeditor = Ckeditor;
    // Adds component definition
    duice.ComponentDefinitionRegistry.add(new duice.ComponentDefinition('textarea[is="duice-ckeditor"]', CkeditorFactory));
})(duice || (duice = {}));
