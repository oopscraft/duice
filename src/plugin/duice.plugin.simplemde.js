"use strict";
/// <reference path="../duice.ts" />
/// <reference path="./simplemde/simplemde.min.js" />
/// <reference path="./marked/marked.min.js"/>
/// <reference path="./prism/prism.js" />
var duice;
(function (duice) {
    let plugin;
    (function (plugin) {
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
                var simplemde = new Simplemde(element, config);
                var bind = element.dataset.duiceBind.split(',');
                simplemde.bind(this.getContextProperty(bind[0]), bind[1]);
                return simplemde;
            }
        }
        plugin.SimplemdeFactory = SimplemdeFactory;
        /**
         * duice.plugin.Ckeditor
         */
        class Simplemde extends duice.MapComponent {
            constructor(div, config) {
                super(div);
                this.div = div;
                this.div.classList.add('duice-plugin-simplemde');
                this.textarea = document.createElement('textarea');
                this.div.appendChild(this.textarea);
                // setting default config
                this.config = {
                    element: this.textarea,
                    autoDownloadFontAwesome: false,
                    previewRender: function (plainText) {
                        return marked(plainText); // Returns HTML from a custom parser
                    },
                    previewRender: function (plainText, preview) {
                        preview.innerHTML = marked(plainText);
                        preview.querySelectorAll('[class^=language-]').forEach(function (pre) {
                            console.debug(pre);
                            pre.classList.add('line-numbers');
                        });
                        // highlight
                        Prism.highlightAll();
                        return preview.innerHTML;
                    },
                    tabSize: 4,
                    renderingConfig: {
                        insertTexts: {
                            horizontalRule: ["", "\n\n-----\n\n"],
                            image: ["![](http://", ")"],
                            link: ["[", "](http://)"],
                            table: ["", "\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text      | Text     |\n\n"],
                        },
                    }
                };
                // in case of custm config is exists.
                if (config) {
                    for (var property in config) {
                        this.config[property] = config[property];
                    }
                }
                // creates simpleMDE
                this.simpleMDE = new window.SimpleMDE(this.config);
                var _this = this;
                this.simpleMDE.codemirror.on("blur", function () {
                    console.debug(_this.simpleMDE.value());
                    _this.setChanged();
                    _this.notifyObservers(_this);
                });
            }
            update(map, obj) {
                var value = map.get(this.getName());
                // check value is empty
                if (!value) {
                    value = '';
                }
                // checks value is changed
                if (value !== this.simpleMDE.value()) {
                    // sets value
                    this.simpleMDE.value(value);
                    // Fixes CodeMirror bug (#344) - refresh not working after value changed.
                    var codemirror = this.simpleMDE.codemirror;
                    setTimeout(function () {
                        codemirror.refresh();
                    }.bind(codemirror), 0);
                }
                // handles readonly and disable
                this.setDisable(map.isDisable(this.getName()));
                this.setReadonly(map.isReadonly(this.getName()));
            }
            getValue() {
                var value = this.simpleMDE.value();
                return value;
            }
            setDisable(disable) {
                if (disable) {
                    this.simpleMDE.codemirror.options.readOnly = true;
                }
                else {
                    this.simpleMDE.codemirror.options.readOnly = false;
                }
            }
            setReadonly(readonly) {
                this.simpleMDE.codemirror.options.readOnly = readonly;
            }
        }
        plugin.Simplemde = Simplemde;
        // Adds component definition
        duice.ComponentDefinitionRegistry.add(new duice.ComponentDefinition('div[is="duice-plugin-simplemde"]', duice.plugin.SimplemdeFactory));
    })(plugin = duice.plugin || (duice.plugin = {}));
})(duice || (duice = {}));
