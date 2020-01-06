namespace duice {
    
    export namespace integrate {
        
        export class SunEditorFactory extends duice.MapUIComponentFactory {
            getInstance(element:HTMLTextAreaElement):SunEditor {
                var sunEditor = new duice.integrate.SunEditor(element);
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
        ComponentDefinitionRegistry.add(new ComponentDefinition('textarea','duice-integrate-suneditor', duice.integrate.SunEditorFactory));
    }
}

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