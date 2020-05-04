"use strict";
/// <reference path="../duice.ts" />
/// <reference path="./simplemde/simplemde.min.js" />
var duice;
(function (duice) {
    let integrate;
    (function (integrate) {
        /**
         * duice.integrate.SimplemdeFactory
         */
        class SimplemdeFactory extends duice.MapComponentFactory {
            getComponent(element) {
                var config = null;
                if (element.dataset.duiceConfig) {
                    config = JSON.parse(element.dataset.duiceConfig.replace(/\'/g, '"'));
                }
                console.log(element);
                var simplemde = new duice.integrate.Simplemde(element, config);
                var bind = element.dataset.duiceBind.split(',');
                simplemde.bind(this.getContextProperty(bind[0]), bind[1]);
                return simplemde;
            }
        }
        integrate.SimplemdeFactory = SimplemdeFactory;
        /**
         * duice.plugin.Ckeditor
         */
        class Simplemde extends duice.MapComponent {
            constructor(div, config) {
                super(div);
                this.div = div;
                this.textarea = document.createElement('textarea');
                this.div.appendChild(this.textarea);
                this.config = config;
                if (!this.config) {
                    this.config = new Object();
                }
                this.config.element = this.textarea;
                this.simpleMDE = new window.SimpleMDE(this.config);
                var _this = this;
                this.simpleMDE.codemirror.on("blur", function () {
                    console.log(_this.simpleMDE.value());
                    _this.setChanged();
                    _this.notifyObservers(_this);
                });
            }
            update(map, obj) {
                var value = map.get(this.getName());
                this.simpleMDE.value(value);
            }
            getValue() {
                var value = this.simpleMDE.value();
                return value;
            }
            renderMarkdown(value) {
                return window.SimpleMDE.prototype.markdown(value);
            }
        }
        integrate.Simplemde = Simplemde;
        // Adds component definition
        duice.ComponentDefinitionRegistry.add(new duice.ComponentDefinition('div[is="duice-integrate-simplemde"]', duice.integrate.SimplemdeFactory));
    })(integrate = duice.integrate || (duice.integrate = {}));
})(duice || (duice = {}));
