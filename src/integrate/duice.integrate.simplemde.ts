/// <reference path="../duice.ts" />
/// <reference path="./simplemde/simplemde.min.js" />

namespace duice {

    export namespace integrate {

        /**
         * duice.integrate.SimplemdeFactory
         */
        export class SimplemdeFactory extends duice.MapComponentFactory {
            getComponent(element:HTMLDivElement):Simplemde {
                var config = null;
                if(element.dataset.duiceConfig){
                    config = JSON.parse(element.dataset.duiceConfig.replace(/\'/g, '"'));
                }
                console.log(element);
                var simplemde = new duice.integrate.Simplemde(element, config);
                var bind = element.dataset.duiceBind.split(',');
                simplemde.bind(this.getContextProperty(bind[0]), bind[1]);
                return simplemde;
            }
        }

        /**
         * duice.plugin.Ckeditor
         */
        export class Simplemde extends duice.MapComponent {
            div:HTMLDivElement;
            config:any;
            textarea:HTMLTextAreaElement;
            simpleMDE:object;
            constructor(div:HTMLDivElement, config:any){
                super(div);
                this.div = div;
                this.textarea = document.createElement('textarea');
                this.div.appendChild(this.textarea);
                this.config = config;
                if(!this.config){
                    this.config = new Object();
                }
                this.config.element = this.textarea;
                this.simpleMDE = new window.SimpleMDE(this.config);
                var _this = this;
                this.simpleMDE.codemirror.on("blur", function(){
                    console.log(_this.simpleMDE.value());
                    _this.setChanged();
                    _this.notifyObservers(_this);
                });
            }
            update(map:duice.Map, obj:object){
                var value = map.get(this.getName());
                this.simpleMDE.value(value);
            }
            getValue():any {
                var value = this.simpleMDE.value();
                return value;
            }
            renderMarkdown(value:string):string {
                return window.SimpleMDE.prototype.markdown(value);
            }
        }

        // Adds component definition
        duice.ComponentDefinitionRegistry.add(new duice.ComponentDefinition('div[is="duice-integrate-simplemde"]', duice.integrate.SimplemdeFactory));

    }

}
