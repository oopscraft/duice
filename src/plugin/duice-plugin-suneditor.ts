namespace duice {
    
    export namespace plugin {
        
        export class SunEditorFactory extends duice.MapUIComponentFactory {
            getInstance(element:HTMLTextAreaElement):SunEditor {
                var sunEditor = new SunEditor(element);
                var bind = element.dataset.duiceBind.split(',');
                sunEditor.bind(this.getContextProperty(bind[0]), bind[1]);
                return sunEditor;
            }
        }

        export class SunEditor extends duice.MapUIComponent {
            textarea:HTMLTextAreaElement;
            suneditor:object;
            constructor(textarea:HTMLTextAreaElement){
                super(textarea);
                this.textarea = textarea;
                this.suneditor = SUNEDITOR.create(this.textarea);
                var $this = this;
                console.log(this.suneditor);
                this.suneditor.onChange = function(content:string){
                    $this.setChanged();
                    $this.notifyObservers($this);
                }
            }
            update(map:duice.data.Map, obj:object){
                var value = map.get(this.getName());
                this.suneditor.setContents(value);
            }
            getValue():any {
                var value = this.suneditor.getContents(true);
                return value;
            }
        }
        
        // Adds component definition
        ComponentDefinitionRegistry.add(new ComponentDefinition('textarea','duice-integrate-suneditor', duice.plugin.SunEditorFactory));
    }
}
