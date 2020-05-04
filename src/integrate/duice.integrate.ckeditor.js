"use strict";
/// <reference path="../duice.ts" />
/// <reference path="./ckeditor/ckeditor.js" />
var duice;
(function (duice) {
    let integrate;
    (function (integrate) {
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
        integrate.CkeditorFactory = CkeditorFactory;
        /**
         * duice.plugin.Ckeditor
         */
        class Ckeditor extends duice.MapComponent {
            constructor(div, config) {
                super(div);
                this.div = div;
                this.config = config;
                this.textarea = document.createElement('textarea');
                this.div.appendChild(this.textarea);
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
        integrate.Ckeditor = Ckeditor;
        // Adds component definition
        duice.ComponentDefinitionRegistry.add(new duice.ComponentDefinition('div[is="duice-integrate-ckeditor"]', duice.integrate.CkeditorFactory));
    })(integrate = duice.integrate || (duice.integrate = {}));
})(duice || (duice = {}));
