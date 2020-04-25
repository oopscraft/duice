/// <reference path="../duice.ts" />
/// <reference path="./ckeditor/ckeditor.js" />


namespace duice {

    /**
     * duice.plugin.CkeditorFactory
     */
    export class CkeditorFactory extends duice.MapComponentFactory {
        getComponent(element:HTMLTextAreaElement):Ckeditor {
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
        textarea:HTMLTextAreaElement;
        config:object;
        ckeditor:object;
        constructor(textarea:HTMLTextAreaElement, config:object){
            super(textarea);
            this.textarea = textarea;
            this.config = config;
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
    duice.ComponentDefinitionRegistry.add(new duice.ComponentDefinition('textarea[is="duice-ckeditor"]', CkeditorFactory));

}
