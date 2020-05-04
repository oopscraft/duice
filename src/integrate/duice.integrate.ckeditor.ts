/// <reference path="../duice.ts" />
/// <reference path="./ckeditor/ckeditor.js" />


namespace duice {

    export namespace integrate {

        /**
         * duice.plugin.CkeditorFactory
         */
        export class CkeditorFactory extends duice.MapComponentFactory {
            getComponent(element:HTMLDivElement):Ckeditor {
                var config = null;
                if(element.dataset.duiceConfig){
                    config = JSON.parse(element.dataset.duiceConfig.replace(/\'/g, '"'));
                }
                var ckEditor = new Ckeditor(element, config);
                var bind = element.dataset.duiceBind.split(',');
                ckEditor.bind(this.getContextProperty(bind[0]), bind[1]);
                return ckEditor;
            }
        }

        /**
         * duice.plugin.Ckeditor
         */
        export class Ckeditor extends duice.MapComponent {
            div:HTMLDivElement;
            config:object;
            textarea:HTMLTextAreaElement;
            ckeditor:object;
            constructor(div:HTMLDivElement, config:any){
                super(div);
                this.div = div;
                this.config = config;
                this.textarea = document.createElement('textarea');
                this.div.appendChild(this.textarea);
                this.ckeditor = CKEDITOR.replace(this.textarea, this.config);
                var _this = this;
                this.ckeditor.on('blur', function(event:any){
                    if(_this.map.get(_this.getName()) !== _this.getValue()){
                        _this.setChanged();
                        _this.notifyObservers(_this);
                    }
                });
            }
            update(map:duice.Map, obj:object){
                var value = map.get(this.getName());
                this.ckeditor.setData(value);
            }
            getValue():any {
                var value = this.ckeditor.getData();
                return value;
            }
        }

        // Adds component definition
        duice.ComponentDefinitionRegistry.add(new duice.ComponentDefinition('div[is="duice-integrate-ckeditor"]', duice.integrate.CkeditorFactory));

    }

}
