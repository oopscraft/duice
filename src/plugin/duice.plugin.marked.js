"use strict";
/// <reference path="../duice.ts" />
/// <reference path="./marked/marked.min.js"/>
/// <reference path="./prism/prism.js" />
var duice;
(function (duice) {
    let plugin;
    (function (plugin) {
        /**
         * duice.integrate.MarkedFactory
         */
        class MarkedFactory extends duice.MapComponentFactory {
            getComponent(element) {
                var marked = new Marked(element);
                var bind = element.dataset.duiceBind.split(',');
                marked.bind(this.getContextProperty(bind[0]), bind[1]);
                return marked;
            }
        }
        plugin.MarkedFactory = MarkedFactory;
        /**
         * duice.plugin.Ckeditor
         */
        class Marked extends duice.MapComponent {
            constructor(div) {
                super(div);
                this.div = div;
                this.div.classList.add('duice-plugin-marked');
            }
            update(map, obj) {
                this.value = map.get(this.getName());
                this.div.innerHTML = marked(duice.defaultIfEmpty(this.value, ''));
                this.div.querySelectorAll('[class^=language-]').forEach(function (pre) {
                    pre.classList.add('line-numbers');
                });
                // highlight
                Prism.highlightAll();
            }
            getValue() {
                return this.value;
            }
        }
        plugin.Marked = Marked;
        // Adds component definition
        duice.ComponentDefinitionRegistry.add(new duice.ComponentDefinition('div[is="duice-plugin-marked"]', duice.plugin.MarkedFactory));
    })(plugin = duice.plugin || (duice.plugin = {}));
})(duice || (duice = {}));
